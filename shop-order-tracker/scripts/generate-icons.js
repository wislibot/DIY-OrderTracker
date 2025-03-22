// This script can be used to generate PNG icons from the SVG icon
// You'll need to install sharp: npm install sharp
// Then run: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const svgPath = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read the SVG file
const svgBuffer = fs.readFileSync(svgPath);

// Generate PNG icons for each size
async function generateIcons() {
  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);
    
    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`Generated ${outputPath}`);
    } catch (error) {
      console.error(`Error generating ${outputPath}:`, error);
    }
  }
}

generateIcons().catch(console.error);