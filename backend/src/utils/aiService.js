const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

const generateDetailedNotes = async (text) => {
  try {
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
    throw new Error(`Failed to generate detailed notes: ${error.message}`);
  }
};

const generateQuickNotes = async (text) => {
  try {
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
    throw new Error(`Failed to generate quick notes: ${error.message}`);
  }
};

const generateFlashcards = async (text) => {
  try {
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

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();

    const jsonMatch = responseText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    throw new Error('Failed to parse flashcards');
  } catch (error) {
    console.error('Error generating flashcards:', error);
    throw new Error(`Failed to generate flashcards: ${error.message}`);
  }
};

module.exports = {
  generateDetailedNotes,
  generateQuickNotes,
  generateFlashcards,
};
