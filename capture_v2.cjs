const { chromium } = require('playwright');
const path = require('path');

(async () => {
    console.log('🚀 Regenerating "Perfect Visibility" PDF with upgraded UI...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
        viewport: { width: 1600, height: 900 },
        deviceScaleFactor: 2,
    });

    const page = await context.newPage();

    const pdfOptions = {
        printBackground: true,
        landscape: true,
        format: 'A2',
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
            await page.goto(p.url, { waitUntil: 'networkidle', timeout: 60000 });
            await page.evaluate(async () => {
                const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
                for (let i = 0; i < document.body.scrollHeight; i += 500) {
                    window.scrollTo(0, i);
                    await delay(100);
                }
                window.scrollTo(0, 0);
                await delay(1500); // EXTRA WAIT FOR UPGRADED STAGGERED ANIMATIONS
            });
            await page.pdf({ ...pdfOptions, path: path.join(process.cwd(), `v2_perfect_${p.name}.pdf`), fullPage: true });
        } catch (err) {
            console.error(`❌ Failed ${p.name}:`, err.message);
        }
    }

    await browser.close();
    console.log('✨ All new pages captured.');
})();
