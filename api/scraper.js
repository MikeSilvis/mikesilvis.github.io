const OpenAI = require('openai');

let client;

/**
 * Use an LLM with web search to extract structured data from the web.
 *
 * @param {object} options
 * @param {string} options.systemPrompt - Instructions for the LLM including desired JSON schema
 * @param {string} options.userPrompt - The specific query to search for
 * @param {string} [options.model] - OpenAI model to use (default: gpt-4o)
 * @returns {object} Parsed JSON response from the LLM
 */
async function searchAndExtract({ systemPrompt, userPrompt, model = 'gpt-4o' }) {
  if (!client) client = new OpenAI();
  const response = await client.responses.create({
    model,
    tools: [{ type: 'web_search_preview' }],
    input: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
  });

  const text = response.output_text.trim();
  const jsonStr = text.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
  return JSON.parse(jsonStr);
}

module.exports = { searchAndExtract };
