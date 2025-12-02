const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI with validation
let genAI;
try {
  if (!process.env.GEMINI_API) {
    console.error('⚠ GEMINI_API environment variable is not set');
  } else if (process.env.GEMINI_API.trim() === '') {
    console.error('⚠ GEMINI_API environment variable is empty');
  } else {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API.trim());
    console.log('✓ Gemini AI initialized successfully');
  }
} catch (error) {
  console.error('✗ Failed to initialize Gemini AI:', error.message);
}

const generateDetailedNotes = async (text) => {
  try {
    // Validate API key before proceeding
    if (!genAI) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API environment variable.');
    }

    if (!process.env.GEMINI_API || process.env.GEMINI_API.trim() === '') {
      throw new Error('Gemini API key is empty. Please set GEMINI_API environment variable.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert educational assistant. Analyze the following content and create comprehensive, well-structured notes suitable for research and deep learning.

Content:
${text}

Please provide:
1. A clear title
2. Key concepts and definitions
3. Detailed explanations
4. Important points and examples
5. Summary

Format the response as markdown with proper headings, bullet points, and emphasis where appropriate.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating detailed notes:', error);
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API environment variable.');
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      throw new Error('Gemini API authentication failed. Please verify your API key is correct.');
    } else {
      throw new Error(`Failed to generate detailed notes: ${error.message}`);
    }
  }
};

const generateQuickNotes = async (text) => {
  try {
    // Validate API key before proceeding
    if (!genAI) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API environment variable.');
    }

    if (!process.env.GEMINI_API || process.env.GEMINI_API.trim() === '') {
      throw new Error('Gemini API key is empty. Please set GEMINI_API environment variable.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert educational assistant. Analyze the following content and create concise, exam-focused notes that highlight the most important information.

Content:
${text}

Please provide:
1. A brief title
2. Key points (bullet points)
3. Important definitions
4. Critical facts to remember
5. Quick summary

Keep it concise and focused on what's essential for exams. Format as markdown.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating quick notes:', error);
    
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API environment variable.');
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      throw new Error('Gemini API authentication failed. Please verify your API key is correct.');
    } else {
      throw new Error(`Failed to generate quick notes: ${error.message}`);
    }
  }
};

const generateFlashcards = async (text) => {
  try {
    // Validate API key before proceeding
    if (!genAI) {
      throw new Error('Gemini API key is not configured. Please set GEMINI_API environment variable.');
    }

    if (!process.env.GEMINI_API || process.env.GEMINI_API.trim() === '') {
      throw new Error('Gemini API key is empty. Please set GEMINI_API environment variable.');
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `You are an expert educational assistant. Analyze the following content and create flashcards for effective studying.

Content:
${text}

Create 10-15 flashcards with:
- Front: A clear question or prompt
- Back: A concise answer

Format your response EXACTLY as a JSON array like this:
[
  {"front": "Question 1?", "back": "Answer 1"},
  {"front": "Question 2?", "back": "Answer 2"}
]

Only return the JSON array, no additional text.`;

    console.log('Generating flashcards with Gemini AI...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    console.log('Flashcard generation response received, length:', responseText.length);

    // Try to extract JSON from response
    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      try {
        const cards = JSON.parse(jsonMatch[0]);
        if (Array.isArray(cards) && cards.length > 0) {
          console.log(`✓ Successfully generated ${cards.length} flashcards`);
          return cards;
        } else {
          throw new Error('Generated flashcards array is empty');
        }
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response text:', responseText.substring(0, 500));
        throw new Error(`Failed to parse flashcards JSON: ${parseError.message}`);
      }
    }

    console.error('No JSON array found in response');
    console.error('Response preview:', responseText.substring(0, 500));
    throw new Error('AI response did not contain valid flashcard JSON format');
  } catch (error) {
    console.error('Error generating flashcards:', error);
    
    // Provide more specific error messages
    if (error.message.includes('API key')) {
      throw new Error('Invalid or missing Gemini API key. Please check your GEMINI_API environment variable.');
    } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
      throw new Error('Gemini API quota exceeded. Please check your API usage limits.');
    } else if (error.message.includes('permission') || error.message.includes('unauthorized')) {
      throw new Error('Gemini API authentication failed. Please verify your API key is correct.');
    } else {
      throw new Error(`Failed to generate flashcards: ${error.message}`);
    }
  }
};

module.exports = {
  generateDetailedNotes,
  generateQuickNotes,
  generateFlashcards,
};
