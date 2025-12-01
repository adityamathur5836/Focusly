const { PDFParse } = require('pdf-parse');
const fs = require('fs');

async function test() {
    try {
        const parser = new PDFParse({});
        // Create a dummy PDF buffer or load a real one if available. 
        // Since I don't have a real PDF handy in this dir, I'll assume the API usage.
        // But wait, I need to know if 'load' takes the buffer.

        console.log('Parser created.');

        // Let's try to see if we can find a PDF file to test with, or just infer from method names.
        // 'load' usually takes the document.
        // 'getText' might return the text.

        // Let's assume the flow is:
        // const parser = new PDFParse({});
        // const pdf = await parser.load(buffer);
        // const text = await parser.getText();

        // Or maybe:
        // const text = await parser.getText(buffer);

        console.log('Methods available:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));

    } catch (e) {
        console.error(e);
    }
}

test();
