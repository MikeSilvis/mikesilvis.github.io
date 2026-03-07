const cheerio = require('cheerio');

const TW_BASE = 'https://www.trackwrestling.com/BracketViewer/pt';

const TW_BRACKET_IDS = {
  125: '452855140', 133: '452857140', 141: '452859140', 149: '452860140',
  157: '452862140', 165: '452864140', 174: '452866140', 184: '452868140',
  197: '452870140', 285: '452872140'
};

const WEIGHTS = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285];

async function fetchAllWeights(tournamentId) {
  const results = {};
  const fetches = WEIGHTS.map(async (wt) => {
    try {
      results[wt] = await fetchWeight(tournamentId, wt);
    } catch (err) {
      console.error(`Failed to fetch ${wt}:`, err.message);
      results[wt] = { qf: [], sf: [], finals: [], placement: {} };
    }
  });
  await Promise.allSettled(fetches);
  return results;
}

async function fetchWeight(tournamentId, wt) {
  const bracketId = TW_BRACKET_IDS[wt];
  if (!bracketId) return { qf: [], sf: [], finals: [], placement: {} };

  const url = `${TW_BASE}/${tournamentId}?bracketId=${bracketId}`;
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`TW returned ${resp.status} for ${wt}`);
  const html = await resp.text();
  return parseBracketHtml(html);
}

function parseBracketHtml(html) {
  const $ = cheerio.load(html);

  const cellData = [];
  $('center > table').each((_, tbl) => {
    const texts = [];
    $(tbl).find('td').each((_, td) => {
      const t = $(td).text().trim();
      if (t && t !== '\u00a0') texts.push(t);
    });
    if (texts.length) cellData.push(texts);
  });

  const schoolCommaPattern = /^,\s*([A-Z]{2,5})\s*\((\d+)\)$/;
  const schoolPlainPattern = /^([A-Z]{2,5})\s*\((\d+)\)$/;
  const resultPattern = /^(Dec|MD|TF|Fall|SV|TB|MF|Inj|FF|DQ|UTB|RTF|Forf)/i;
  const placementPattern = /^(1ST|2ND|3RD|4TH|5TH|6TH|7TH|8TH)$/;

  const placements = {};
  const winsByWrestler = {};

  for (const texts of cellData) {
    let name = null, school = null, seed = null, result = null, placement = null;

    for (const t of texts) {
      if (placementPattern.test(t)) { placement = t; continue; }
      const cm = t.match(schoolCommaPattern);
      if (cm) { school = cm[1]; seed = parseInt(cm[2]); continue; }
      const pm = t.match(schoolPlainPattern);
      if (pm) { school = pm[1]; seed = parseInt(pm[2]); continue; }
      if (resultPattern.test(t)) { result = t; continue; }
      if (/^\d+$/.test(t) || t === '_' || t === 'Bye' || t.startsWith('Loser of') || t.startsWith('Winner of')) continue;
      if (t.length >= 2 && t.length <= 25 && /^[A-Za-z]/.test(t)) {
        if (!t.includes('{') && !t.includes('function') && !t.includes('window')) {
          name = t;
        }
      }
    }

    if (name && school && seed) {
      const lastName = name.split(' ').pop();
      const key = lastName + '-' + school;
      if (placement) {
        placements[placement] = { name: lastName, school, seed };
      }
      if (result) {
        if (!winsByWrestler[key]) winsByWrestler[key] = [];
        winsByWrestler[key].push({ result, seed });
      }
    }
  }

  function getKey(p) { return p ? (p.name.split(' ').pop() + '-' + p.school) : null; }
  function getWins(p) { return p ? (winsByWrestler[getKey(p)] || []) : []; }
  function bestResult(wins, index) { return wins.length > index ? wins[index].result : ''; }

  const p1 = placements['1ST'];
  const p2 = placements['2ND'];
  const p3 = placements['3RD'];
  const p4 = placements['4TH'];
  const p5 = placements['5TH'];
  const p7 = placements['7TH'];

  // Build Finals
  let finals = [];
  if (p1 && p2) {
    const wins1 = getWins(p1);
    finals = [{
      winner: { name: p1.name, school: p1.school, seed: p1.seed },
      loser: { name: p2.name, school: p2.school, seed: p2.seed },
      method: bestResult(wins1, wins1.length - 1)
    }];
  } else if (p1) {
    finals = [{
      winner: { name: p1.name, school: p1.school, seed: p1.seed },
      loser: { name: 'TBD', school: '', seed: 0 },
      method: ''
    }];
  }

  // Build Semifinals
  let sf = [];
  if (p1 && p3) {
    const wins1 = getWins(p1);
    const wins2 = p2 ? getWins(p2) : [];
    const sf1Loser = p3;
    const sf2Loser = p4 || p5 || { name: 'TBD', school: '', seed: 0 };

    sf = [
      {
        winner: { name: p1.name, school: p1.school, seed: p1.seed },
        loser: { name: sf1Loser.name, school: sf1Loser.school, seed: sf1Loser.seed },
        method: wins1.length > 1 ? wins1[wins1.length - 2].result : (wins1.length > 0 ? wins1[0].result : '')
      },
      {
        winner: p2 ? { name: p2.name, school: p2.school, seed: p2.seed } : { name: 'TBD', school: '', seed: 0 },
        loser: { name: sf2Loser.name, school: sf2Loser.school, seed: sf2Loser.seed },
        method: wins2.length > 1 ? wins2[wins2.length - 2].result : (wins2.length > 0 ? wins2[0].result : '')
      }
    ];
  }

  // Build QF
  const sfParticipants = [p1, p3, p2, p4].filter(Boolean);
  const qfLosers = [p5, placements['6TH'], p7, placements['8TH']].filter(Boolean);

  const qf = [];
  for (let k = 0; k < sfParticipants.length; k++) {
    const winner = sfParticipants[k];
    const loser = qfLosers[k] || { name: 'TBD', school: '', seed: 0 };
    const wins = getWins(winner);
    qf.push({
      winner: { name: winner.name, school: winner.school, seed: winner.seed },
      loser: { name: loser.name, school: loser.school, seed: loser.seed },
      method: wins.length > 0 ? wins[0].result : ''
    });
  }

  return { placement: placements, qf, sf, finals };
}

module.exports = { fetchAllWeights, fetchWeight, WEIGHTS };
