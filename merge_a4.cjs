const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function mergeA4Pdfs() {
    const mergedPdf = await PDFDocument.create();
    const pdfFiles = [
        'a4_1_Home.pdf',
        'a4_2_Food.pdf',
        'a4_3_Grocery.pdf',
        'a4_4_Ride.pdf',
        'a4_5_Cart.pdf',
        'a4_6_Login.pdf'
    ];

    for (const filename of pdfFiles) {
        const filePath = path.join(process.cwd(), filename);
        if (fs.existsSync(filePath)) {
            const pdfBytes = fs.readFileSync(filePath);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
            console.log(`+ Merged ${filename}`);
        }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const finalName = 'GharTk_A4_Presentation.pdf';
    fs.writeFileSync(path.join(process.cwd(), finalName), mergedPdfBytes);
    console.log(`🏆 FINAL A4 PDF CREATED: ${finalName}`);
}

mergeA4Pdfs().catch(console.error);
