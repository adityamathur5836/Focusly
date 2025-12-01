const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        const filePath = path.join(__dirname, 'test.pdf');
        // Ensure file exists (created in previous step)
        if (!fs.existsSync(filePath)) {
            const pdfContent = '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000060 00000 n 0000000117 00000 n trailer<</Size 4/Root 1 0 R>>startxref 223 %%EOF';
            fs.writeFileSync(filePath, pdfContent);
        }

        const buffer = fs.readFileSync(filePath);
        const parser = new PDFParse({});

        console.log('--- Test 5: getText(buffer) ---');
        try {
            // Maybe getText takes the buffer?
            const res = await parser.getText(buffer);
            console.log('Success 5:', res);
        } catch (e) { console.log('Fail 5:', e.message); }

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
