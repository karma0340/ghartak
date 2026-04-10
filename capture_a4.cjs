const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🚀 Generating PERFECTED A4 Responsive PDF Presentation...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    const pdfOptions = {
        printBackground: true,
        format: 'A4',
        margin: { top: '0', bottom: '0', left: '0', right: '0' }
    };

    const pages = [
        { name: '1_Home', url: 'http://localhost:5173/' },
        { name: '2_Food', url: 'http://localhost:5173/food' },
        { name: '3_Grocery', url: 'http://localhost:5173/grocery' },
        { name: '4_Ride', url: 'http://localhost:5173/ride' },
        { name: '5_Cart', url: 'http://localhost:5173/cart' },
        { name: '6_Login', url: 'http://localhost:5173/login' }
    ];

    for (const p of pages) {
        console.log(`📸 Capturing: ${p.name}...`);
        try {
            await page.goto(p.url, { waitUntil: 'networkidle', timeout: 90000 });

            // Extended wait for all assets
            await page.waitForTimeout(4000);

            // FORCE visibility, fixed colors, and transparency for PRINT
            await page.addStyleTag({
                content: `
          /* Reset animations and force visibility */
          * { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important; 
            transition: none !important; 
            animation: none !important; 
            opacity: 1 !important; 
            visibility: visible !important;
          }
          
          /* CRITICAL: Force transparency for background decorative elements */
          /* Target the specific classes used in TrustStats */
          .bg-white\\/10 { background-color: rgba(255, 255, 255, 0.1) !important; }
          .bg-white\\/5 { background-color: rgba(255, 255, 255, 0.05) !important; }
          
          /* Explicitly target the TrustStats decorative circles */
          section div.absolute.bg-white\\/10 { 
             background-color: rgba(255, 255, 255, 0.1) !important; 
             z-index: 0 !important;
          }
          
          /* Force content to be on top */
          .relative.z-20 { z-index: 20 !important; position: relative !important; }

          /* Header Fixes for PDF */
          header { position: absolute !important; width: 100% !important; z-index: 999 !important; background: white !important; }
          header span { color: #111827 !important; }
          #home header { background: transparent !important; }
          #home header span { color: white !important; }

          /* Final CTA fixes */
          .bg-\\[\\#0a0f1a\\] { background-color: #0a0f1a !important; }
          .bg-\\[\\#1a1f2e\\] { background-color: #1a1f2e !important; }

          ::-webkit-scrollbar { display: none !important; }
        `
            });

            await page.evaluate(async () => {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                const totalHeight = document.body.scrollHeight;
                const viewportHeight = window.innerHeight;
                for (let y = 0; y < totalHeight; y += viewportHeight / 2) {
                    window.scrollTo(0, y);
                    await delay(200);
                }
                window.scrollTo(0, 0);
                await delay(2000);
            });

            await page.pdf({
                ...pdfOptions,
                path: path.join(process.cwd(), `a4_${p.name}.pdf`),
                fullPage: true
            });
        } catch (err) {
            console.error(`❌ Failed ${p.name}:`, err.message);
        }
    }

    await browser.close();
    console.log('✨ All Pages Captured Successfully.');
})();
