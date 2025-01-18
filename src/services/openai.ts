import OpenAI from 'openai';

// Get the API key from environment variables
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

let openai: OpenAI | null = null;

try {
  if (apiKey) {
    openai = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true // Note: In production, API calls should go through a backend
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI API key is not configured. Please add your API key to the .env file.');
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are a professional translator. Translate the following text to ${targetLanguage}. Only respond with the translation, no additional text.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3, // Lower temperature for more consistent translations
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Translation error:', error);
    throw new Error(`Translation failed for ${targetLanguage}`);
  }
}