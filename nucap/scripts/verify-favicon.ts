import fs from 'fs';
import path from 'path';

function verifyFavicon() {
  try {
    // Check if favicon.ico exists
    const faviconPath = path.join(__dirname, '..', 'public', 'favicon.ico');
    const iconExists = fs.existsSync(faviconPath);
    
    if (iconExists) {
      console.log('✅ Favicon exists at:', faviconPath);
      const stats = fs.statSync(faviconPath);
      console.log('📁 File size:', stats.size, 'bytes');
    } else {
      console.log('❌ Favicon not found at:', faviconPath);
    }
    
    // Check if app icon exists
    const appIconPath = path.join(__dirname, '..', 'public', 'icons', 'app-icon.png');
    const appIconExists = fs.existsSync(appIconPath);
    
    if (appIconExists) {
      console.log('✅ App icon exists at:', appIconPath);
      const stats = fs.statSync(appIconPath);
      console.log('📁 File size:', stats.size, 'bytes');
    } else {
      console.log('❌ App icon not found at:', appIconPath);
    }
    
  } catch (error) {
    console.error('Error verifying favicon:', error);
  }
}

verifyFavicon();