// Simple PDF generation script using html-pdf
// Install dependencies: npm install html-pdf

const pdf = require('html-pdf');
const fs = require('fs');
const path = require('path');

// Read the HTML file
const htmlContent = fs.readFileSync(path.join(__dirname, 'kayron_resume_pdf.html'), 'utf8');

// PDF options
const options = {
  format: 'Letter',
  border: '0.5cm',
  renderDelay: 1000, // Delay to allow fonts to load
  header: { height: '0mm' },
  footer: { height: '0mm' }
};

// Generate PDF
pdf.create(htmlContent, options).toFile(path.join(__dirname, 'KayronCalloway_Resume_Simple.pdf'), (err, res) => {
  if (err) {
    console.error('Error generating PDF:', err);
    return;
  }
  
  console.log('PDF generated successfully:', res.filename);
});