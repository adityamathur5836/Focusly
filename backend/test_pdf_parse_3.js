const { PDFParse } = require('pdf-parse');
const fs = require('fs');
const path = require('path');

async function test() {
    try {
        // Create a dummy PDF file
        const pdfContent = '%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]/Parent 2 0 R/Resources<<>>>>endobj xref 0 4 0000000000 65535 f 0000000010 00000 n 0000000060 00000 n 0000000117 00000 n trailer<</Size 4/Root 1 0 R>>startxref 223 %%EOF';
        const filePath = path.join(__dirname, 'test.pdf');
        fs.writeFileSync(filePath, pdfContent);

        const buffer = fs.readFileSync(filePath);

        const parser = new PDFParse({});

        console.log('--- Test 1: load(filePath) ---');
        try {
            const res = await parser.load(filePath);
            console.log('Success 1');
        } catch (e) { console.log('Fail 1:', e.message); }

        console.log('--- Test 2: load(Uint8Array) ---');
        try {
            const res = await parser.load(new Uint8Array(buffer));
            console.log('Success 2');
        } catch (e) { console.log('Fail 2:', e.message); }

        console.log('--- Test 3: load({ data: Uint8Array }) ---');
        try {
            const res = await parser.load({ data: new Uint8Array(buffer) });
            console.log('Success 3');
        } catch (e) { console.log('Fail 3:', e.message); }

        console.log('--- Test 4: load({ url: filePath }) ---');
        try {
            // PDF.js usually supports file:// urls in node?
            const res = await parser.load({ url: filePath });
            console.log('Success 4');
        } catch (e) { console.log('Fail 4:', e.message); }

    } catch (e) {
        console.error('Error:', e);
    }
}

test();
