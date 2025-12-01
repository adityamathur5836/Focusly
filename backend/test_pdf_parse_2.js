const { PDFParse } = require('pdf-parse');

async function test() {
    try {
        const pdfContent = '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000060 00000 n 0000000117 00000 n trailer<</Size 4/Root 1 0 R>>startxref 223 %%EOF';
        const dataBuffer = Buffer.from(pdfContent);

        const parser = new PDFParse({});

        console.log('Testing load with object { url: ... } (dummy)');
        // It seems it might be wrapping PDF.js. PDF.js usually takes { data: ... } or { url: ... }

        try {
            const result = await parser.load({ data: dataBuffer });
            console.log('Success with { data: buffer }');
            console.log('Result keys:', Object.keys(result));
        } catch (e) {
            console.log('Failed with { data: buffer }:', e.message);
        }

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
