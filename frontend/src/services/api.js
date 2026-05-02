import axios from 'axios';

const API_BASE_URL = '/api';

export const chatWithAI = async (message, context = '') => {
  try {
    const response = await axios.post(`${API_BASE_URL}/chat`, { message, context });
    return response.data;
  } catch (error) {
    console.error('Chat API Error:', error);
    return { content: 'Sorry, I am having trouble connecting to the AI engine.' };
  }
};

export const analyzePost = async (url) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/analyze-post`, { url });
    return response.data;
  } catch (error) {
    console.error('Analysis API Error:', error);
    throw error;
  }
};

export const searchOSINT = async (query, type) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/osint/search`, {
      query,
      search_type: type,
      limit: 10
    });
    return response.data;
  } catch (error) {
    console.error('OSINT API Error:', error);
    return [];
  }
};
