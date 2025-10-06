import { getUserApiKey } from './userApiKey';

// Removed hardcoded API key for security
// Users now provide their own API key via settings

const getApiKey = (): string | null => {
  // First check if user has provided their own API key
  const userApiKey = getUserApiKey();
  if (userApiKey) {
    return userApiKey;
  }

  // Fallback to environment variable (for development only)
  const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (envApiKey) {
    console.warn('⚠️ Using API key from .env file. For production, users should provide their own API key.');
    return envApiKey;
  }

  return null;
};

export const generateContent = async (prompt: string): Promise<string> => {
  const API_KEY = getApiKey();

  if (!API_KEY) {
    throw new Error('Please add your Gemini API key in Settings → API Configuration');
  }

  try {
    console.log('Checking available models for your API key...');

    // First, let's list available models
    try {
      const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
      const listResponse = await fetch(listUrl);
      if (listResponse.ok) {
        const modelsData = await listResponse.json();
        console.log('📋 Available models:', modelsData);
        if (modelsData.models && modelsData.models.length > 0) {
          console.log('✅ Found models:', modelsData.models.map((m: any) => m.name).join(', '));
        } else {
          console.warn('⚠️ No models available for this API key!');
        }
      }
    } catch (err) {
      console.warn('Could not list models:', err);
    }

    console.log('Attempting to generate content...');

    // Use the REST API directly to bypass SDK issues
    // Try the best/most efficient free models first
    const apiVersions = ['v1beta', 'v1'];
    const models = [
      'gemini-2.5-flash',      // Latest fast model (free tier)
      'gemini-2.0-flash',      // Stable fast model (free tier)
      'gemini-flash-latest',   // Alias for latest flash
      'gemini-2.5-pro',        // Latest pro model
      'gemini-pro-latest',     // Alias for latest pro
      'gemini-2.0-pro-exp'     // Experimental pro model
    ];

    for (const version of apiVersions) {
      for (const model of models) {
        try {
          const url = `https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${API_KEY}`;

          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              contents: [{
                parts: [{
                  text: prompt
                }]
              }],
              generationConfig: {
                temperature: 0.9,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 1024,
              }
            })
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ ${version}/${model} failed with status ${response.status}:`, errorText);
            continue;
          }

          const data = await response.json();

          if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            console.log(`✅ Success with ${version}/${model}`);
            return data.candidates[0].content.parts[0].text;
          }

          console.warn(`${version}/${model} returned unexpected format:`, data);
        } catch (err) {
          console.warn(`${version}/${model} error:`, err);
          continue;
        }
      }
    }

    throw new Error('All API attempts failed. Please verify your API key.');

  } catch (error) {
    console.error('Error generating content:', error);

    // Provide more helpful error message
    if (error instanceof Error) {
      if (error.message.includes('API key') || error.message.includes('API_KEY_INVALID')) {
        throw new Error('Invalid API key. Please verify your VITE_GEMINI_API_KEY in the .env file.');
      }
      if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
        throw new Error('API quota exceeded. Please try again later or check your quota at https://aistudio.google.com/apikey');
      }
      throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error('Failed to generate content. Please check your API key and try again.');
  }
};

export const isConfigured = (): boolean => {
  return !!getApiKey();
};
