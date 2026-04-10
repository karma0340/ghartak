const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function mergeV2Pdfs() {
    const mergedPdf = await PDFDocument.create();
    const pdfFiles = [
        'v2_perfect_1_Home.pdf',
        'v2_perfect_2_Food.pdf',
        'v2_perfect_3_Grocery.pdf',
        'v2_perfect_4_Ride.pdf',
        'v2_perfect_5_Cart.pdf',
        'v2_perfect_6_Login.pdf'
    ];

    for (const filename of pdfFiles) {
        const filePath = path.join(process.cwd(), filename);
        if (fs.existsSync(filePath)) {
            const pdfBytes = fs.readFileSync(filePath);
            const pdf = await PDFDocument.load(pdfBytes);
            const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
            copiedPages.forEach((page) => mergedPdf.addPage(page));
        }
    }

    const mergedPdfBytes = await mergedPdf.save();
    const finalName = 'GharTk_UPGRADED_Presentation.pdf';
    fs.writeFileSync(path.join(process.cwd(), finalName), mergedPdfBytes);
    console.log(`🏆 UPGRADED FINAL PDF CREATED: ${finalName}`);
}

mergeV2Pdfs().catch(console.error);
