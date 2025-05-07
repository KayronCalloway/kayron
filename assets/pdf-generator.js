// PDF Generation script using puppeteer
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  
  // Set viewport to letter size paper dimensions
  await page.setViewport({
    width: 816, // 8.5 inches at 96 DPI
    height: 1056, // 11 inches at 96 DPI
    deviceScaleFactor: 2
  });
  
  // Enable printing background graphics
  await page.evaluateOnNewDocument(() => {
    // Override user agent to ensure background printing
    Object.defineProperty(navigator, 'userAgent', {
      get: function() { return 'Mozilla/5.0 Chrome/96.0.4664.45'; }
    });
  });
  
  // Navigate to resume URL
  await page.goto('file://' + path.resolve(__dirname, '../temp/kayron_resume_pdf.html'), {
    waitUntil: 'networkidle2'
  });
  
  // Wait for fonts to load
  await page.evaluate(() => {
    return document.fonts.ready;
  });
  
  // Additional wait time to ensure everything is rendered
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Generate PDF
  const pdfBuffer = await page.pdf({
    format: 'Letter',
    printBackground: true,
    margin: {
      top: '0.5cm',
      right: '0.5cm',
      bottom: '0.5cm',
      left: '0.5cm'
    },
    displayHeaderFooter: false
  });
  
  // Save PDF
  fs.writeFileSync(path.resolve(__dirname, '../temp/KayronCalloway_Resume.pdf'), pdfBuffer);
  
  console.log('PDF generated successfully');
  
  await browser.close();
})();
EOF < /dev/null