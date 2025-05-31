// Clean PDF generation script
const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

// Read the simple HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'kayron_resume_simple.html'), 'utf8');

// PDF options optimized for resume
const options = {
  format: 'Letter',
  border: {
    top: '0.5in',
    right: '0.5in',
    bottom: '0.5in',
    left: '0.5in'
  },
  renderDelay: 500,
  header: { height: '0mm' },
  footer: { height: '0mm' },
  quality: '75',
  dpi: 300
};

// Generate clean PDF
pdf.create(htmlContent, options).toFile(path.join(__dirname, 'KayronCalloway_Resume_Clean.pdf'), (err, res) => {
  if (err) {
    console.error('Error generating PDF:', err);
    return;
  }
  
  console.log('Clean PDF generated successfully:', res.filename);
});