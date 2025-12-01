const { PDFParse } = require('pdf-parse');

async function test() {
    try {
        // Minimal PDF content
        const pdfContent = '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000060 00000 n 0000000117 00000 n trailer<</Size 4/Root 1 0 R>>startxref 223 %%EOF';
        const dataBuffer = Buffer.from(pdfContent);

        const parser = new PDFParse({});
        console.log('Parser created');

        const result = await parser.load(dataBuffer);
        console.log('Load result type:', typeof result);
        console.log('Load result keys:', result ? Object.keys(result) : 'null');

        if (result && result.text) {
            console.log('Has text property');
        }

        // Check if we need to call getText
        if (parser.getText) {
            const text = await parser.getText();
            console.log('getText result:', text);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
