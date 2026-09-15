const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-3.5-turbo';
const OPENAI_MAX_TOKENS = parseInt(process.env.OPENAI_MAX_TOKENS || '2000');

if (!OPENAI_API_KEY) {
  console.warn('⚠️  OPENAI_API_KEY not set in environment variables');
}

const openaiClient = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Authorization': `Bearer ${OPENAI_API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// Simple chat completion function
const getChatCompletion = async (messages) => {
  try {
    const response = await openaiClient.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: messages,
      max_tokens: OPENAI_MAX_TOKENS,
      temperature: 0.7
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    throw new Error('Failed to get AI response: ' + (error.response?.data?.error?.message || error.message));
  }
};

// Stream chat completion
const streamChatCompletion = async (messages) => {
  try {
    const response = await openaiClient.post('/chat/completions', {
      model: OPENAI_MODEL,
      messages: messages,
      max_tokens: OPENAI_MAX_TOKENS,
      temperature: 0.7,
      stream: true
    }, {
      responseType: 'stream'
    });

    return response.data;
  } catch (error) {
    console.error('OpenAI streaming error:', error.message);
    throw new Error('Failed to stream AI response');
  }
};

module.exports = {
  openaiClient,
  getChatCompletion,
  streamChatCompletion,
  OPENAI_MODEL,
  OPENAI_MAX_TOKENS
};
