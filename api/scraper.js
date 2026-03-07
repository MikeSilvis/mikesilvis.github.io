const OpenAI = require('openai');

const WEIGHTS = [125, 133, 141, 149, 157, 165, 174, 184, 197, 285];

const client = new OpenAI();

async function fetchAllWeights(tournamentId) {
  try {
    const response = await client.responses.create({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' }],
      input: [
        { role: 'system', content: `You are a wrestling data extraction assistant. Search the web for the latest 2026 Big Ten Wrestling Championships results across ALL weight classes (125, 133, 141, 149, 157, 165, 174, 184, 197, 285). Check trackwrestling.com, flowrestling.org, intermatwrestle.com, and any other sources.

Return ONLY valid JSON with this exact structure (no markdown fences, no explanation):
{
  "125": {
    "placement": {},
    "qf": [
      { "winner": { "name": "LastName", "school": "ABBR", "seed": 1 }, "loser": { "name": "LastName", "school": "ABBR", "seed": 8 }, "method": "Dec 5-2" }
    ],
    "sf": [],
    "finals": []
  },
  "133": { "placement": {}, "qf": [], "sf": [], "finals": [] }
}

Placement format (only if final placements are known):
"placement": { "1ST": { "name": "LastName", "school": "ABBR", "seed": 1 }, "2ND": { ... } }

School abbreviations: PSU=Penn State, IOWA=Iowa, OSU=Ohio State, MICH=Michigan, MINN=Minnesota, NEB=Nebraska, WIS=Wisconsin, ILL=Illinois, RUT=Rutgers, PUR=Purdue, NW=Northwestern, MSU=Michigan State, MD=Maryland, IU=Indiana, OR=Oregon, UCLA=UCLA, USC=USC, WASH=Washington

Rules:
- Last names only for wrestler names
- Include ALL matches you can find — first round, quarterfinals, semifinals, finals
- First round matches go in the "qf" array
- Only include matches that actually happened — never fabricate
- Method format: "Dec 5-2", "MD 12-3", "TF 18-2", "Fall 3:45", "SV-1 5-3"
- Every weight class must be present in the output even if empty
- If seeds are unknown, use 0` },
        { role: 'user', content: `Find all available results from the 2026 Big Ten Wrestling Championships (today, March 7-8, 2026). The tournament is being held at the Bryce Jordan Center. Search for results across all 10 weight classes.` }
      ]
    });

    const text = response.output_text.trim();
    const jsonStr = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    console.log('[fetchAll] Response length:', text.length, 'chars');

    const data = JSON.parse(jsonStr);

    // Ensure all weights are present
    const results = {};
    for (const wt of WEIGHTS) {
      const wtData = data[wt] || data[String(wt)] || {};
      results[wt] = {
        placement: wtData.placement || {},
        qf: wtData.qf || [],
        sf: wtData.sf || [],
        finals: wtData.finals || []
      };
    }

    const totalMatches = Object.values(results).reduce((sum, wt) =>
      sum + wt.qf.length + wt.sf.length + wt.finals.length, 0);
    console.log(`[fetchAll] Total matches found: ${totalMatches}`);

    return results;
  } catch (err) {
    console.error('[fetchAll] Error:', err.message);
    // Return empty structure
    const results = {};
    for (const wt of WEIGHTS) {
      results[wt] = { placement: {}, qf: [], sf: [], finals: [] };
    }
    return results;
  }
}

async function fetchWeight(tournamentId, wt) {
  try {
    const response = await client.responses.create({
      model: 'gpt-4o',
      tools: [{ type: 'web_search_preview' }],
      input: [
        { role: 'system', content: `You are a wrestling data extraction assistant. Return ONLY valid JSON (no markdown, no explanation).

Output format:
{
  "placement": {},
  "qf": [
    { "winner": { "name": "LastName", "school": "ABBR", "seed": 1 }, "loser": { "name": "LastName", "school": "ABBR", "seed": 8 }, "method": "Dec 5-2" }
  ],
  "sf": [],
  "finals": []
}

School abbreviations: PSU=Penn State, IOWA=Iowa, OSU=Ohio State, MICH=Michigan, MINN=Minnesota, NEB=Nebraska, WIS=Wisconsin, ILL=Illinois, RUT=Rutgers, PUR=Purdue, NW=Northwestern, MSU=Michigan State, MD=Maryland, IU=Indiana, OR=Oregon, UCLA=UCLA, USC=USC, WASH=Washington

Rules:
- Last names only
- Include all rounds: first round, quarterfinals, semifinals, finals
- First round and quarterfinal matches go in "qf"
- Only real results, never fabricate
- Method: "Dec 5-2", "MD 12-3", "TF 18-2", "Fall 3:45", "SV-1 5-3"
- If seeds unknown, use 0
- If no results available, return empty arrays` },
        { role: 'user', content: `Find all available match results for the ${wt} pound weight class at the 2026 Big Ten Wrestling Championships (March 7-8, 2026, Bryce Jordan Center). Check flowrestling.org, trackwrestling.com, intermatwrestle.com.` }
      ]
    });

    const text = response.output_text.trim();
    const jsonStr = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
    console.log(`[${wt}lb] Response length: ${text.length} chars`);

    const data = JSON.parse(jsonStr);
    console.log(`[${wt}lb] Parsed: ${(data.qf || []).length} QF, ${(data.sf || []).length} SF, ${(data.finals || []).length} Finals`);

    return {
      placement: data.placement || {},
      qf: data.qf || [],
      sf: data.sf || [],
      finals: data.finals || []
    };
  } catch (err) {
    console.error(`[${wt}lb] Error:`, err.message);
    return { placement: {}, qf: [], sf: [], finals: [] };
  }
}

module.exports = { fetchAllWeights, fetchWeight, WEIGHTS };
