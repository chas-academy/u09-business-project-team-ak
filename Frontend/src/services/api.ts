import axios from 'axios';

const spoonApiKey = import.meta.env.VITE_SPOONACULAR_API_KEY;
const backendUrl = import.meta.env.VITE_API_BASE_URL;

export const spoonacular = axios.create({
  baseURL: 'https://api.spoonacular.com',
  params: {
    apiKey: spoonApiKey
  }
});

export const backend = axios.create({
  baseURL: backendUrl
});
