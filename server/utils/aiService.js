const { getChatCompletion, streamChatCompletion } = require('../config/openai');

class AIService {
  constructor() {
    this.systemPrompt = `You are a helpful, intelligent AI chatbot assistant. 
    You provide clear, accurate, and thoughtful responses.
    You are helpful, harmless, and honest.
    If you don't know something, you say so.
    You support markdown formatting in responses.`;
  }

  async getResponse(userMessage, conversationHistory = []) {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const response = await getChatCompletion(messages);
      return response;
    } catch (error) {
      console.error('AI Service error:', error);
      throw error;
    }
  }

  async getStreamResponse(userMessage, conversationHistory = []) {
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...conversationHistory,
      { role: 'user', content: userMessage }
    ];

    try {
      const stream = await streamChatCompletion(messages);
      return stream;
    } catch (error) {
      console.error('AI Stream Service error:', error);
      throw error;
    }
  }

  formatConversationHistory(messages) {
    return messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));
  }
}

module.exports = new AIService();
