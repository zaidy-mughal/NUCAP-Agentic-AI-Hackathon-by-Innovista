import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

async function createFavicon() {
  try {
    const inputPath = path.join(__dirname, '..', 'public', 'icons', 'app-icon.png');
    const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');
    
    // Check if input file exists
    if (!fs.existsSync(inputPath)) {
      console.error('Input file not found:', inputPath);
      process.exit(1);
    }
    
    // Create favicon.ico with multiple sizes
    await sharp(inputPath)
      .resize(32, 32)
      .toFile(outputPath);
      
    console.log('Favicon created successfully at:', outputPath);
  } catch (error) {
    console.error('Error creating favicon:', error);
    process.exit(1);
  }
}

createFavicon();