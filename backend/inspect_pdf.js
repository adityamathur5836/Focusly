const { PDFParse } = require('pdf-parse');

try {
    console.log('Attempting to instantiate PDFParse...');
    const parser = new PDFParse(); // Try without args first
    console.log('Success without args');
} catch (e) {
    console.log('Failed without args:', e.message);
}

try {
    console.log('Attempting to instantiate PDFParse with empty object...');
    const parser = new PDFParse({});
    console.log('Success with empty object');
    console.log('Methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(parser)));
} catch (e) {
    console.log('Failed with empty object:', e.message);
}
