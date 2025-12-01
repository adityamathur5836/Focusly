const Tesseract = require('tesseract.js');
const { fromPath } = require('pdf2pic');
const fs = require('fs');
const path = require('path');

/**
 * Convert PDF to images using pdf2pic
 * @param {string} pdfPath - Path to the PDF file
 * @param {number} maxPages - Maximum number of pages to convert (default: 10)
 * @returns {Promise<string[]>} Array of image paths
 */
const convertPdfToImages = async (pdfPath, maxPages = 10) => {
    try {
        const options = {
            density: 200,           // DPI for image quality
            saveFilename: `page`,
            savePath: path.dirname(pdfPath),
            format: 'png',
            width: 2000,
            height: 2000,
        };

        const convert = fromPath(pdfPath, options);
        const imagePaths = [];

        // Convert pages (limit to maxPages to avoid excessive processing)
        for (let page = 1; page <= maxPages; page++) {
            try {
                const result = await convert(page, { responseType: 'image' });
                if (result && result.path) {
                    imagePaths.push(result.path);
                } else {
                    // No more pages
                    break;
                }
            } catch (pageError) {
                // Page doesn't exist, we've reached the end
                console.log(`Converted ${page - 1} pages from PDF`);
                break;
            }
        }

        return imagePaths;
    } catch (error) {
        console.error('PDF to image conversion error:', error);
        throw new Error(`Failed to convert PDF to images: ${error.message}`);
    }
};

/**
 * Perform OCR on an image using Tesseract.js
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<{text: string, confidence: number}>} Extracted text and confidence score
 */
const performOCR = async (imagePath) => {
    try {
        const { data } = await Tesseract.recognize(
            imagePath,
            'eng',
            {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
                    }
                }
            }
        );

        return {
            text: data.text,
            confidence: data.confidence
        };
    } catch (error) {
        console.error('OCR error:', error);
        throw new Error(`OCR failed: ${error.message}`);
    }
};

/**
 * Extract text from PDF using OCR
 * @param {string} pdfPath - Path to the PDF file
 * @param {number} maxPages - Maximum number of pages to process
 * @returns {Promise<{text: string, confidence: number, pagesProcessed: number}>}
 */
const extractTextWithOCR = async (pdfPath, maxPages = 10) => {
    let imagePaths = [];

    try {
        console.log('Starting OCR extraction...');

        // Convert PDF to images
        imagePaths = await convertPdfToImages(pdfPath, maxPages);

        if (imagePaths.length === 0) {
            throw new Error('Failed to convert PDF to images');
        }

        console.log(`Processing ${imagePaths.length} pages with OCR...`);

        // Perform OCR on each image
        let combinedText = '';
        let totalConfidence = 0;
        let successfulPages = 0;

        for (let i = 0; i < imagePaths.length; i++) {
            try {
                console.log(`Processing page ${i + 1}/${imagePaths.length}...`);
                const result = await performOCR(imagePaths[i]);

                if (result.text && result.text.trim().length > 0) {
                    combinedText += `\n\n--- Page ${i + 1} ---\n\n${result.text}`;
                    totalConfidence += result.confidence;
                    successfulPages++;
                }
            } catch (pageError) {
                console.error(`Error processing page ${i + 1}:`, pageError);
                // Continue with other pages
            }
        }

        const averageConfidence = successfulPages > 0 ? totalConfidence / successfulPages : 0;

        console.log(`OCR completed: ${successfulPages} pages processed, avg confidence: ${averageConfidence.toFixed(2)}%`);

        return {
            text: combinedText.trim(),
            confidence: averageConfidence,
            pagesProcessed: successfulPages
        };
    } catch (error) {
        console.error('OCR extraction error:', error);
        throw error;
    } finally {
        // Clean up temporary image files
        for (const imagePath of imagePaths) {
            try {
                if (fs.existsSync(imagePath)) {
                    fs.unlinkSync(imagePath);
                }
            } catch (cleanupError) {
                console.error('Error cleaning up image:', cleanupError);
            }
        }
    }
};

module.exports = {
    extractTextWithOCR,
    convertPdfToImages,
    performOCR
};
