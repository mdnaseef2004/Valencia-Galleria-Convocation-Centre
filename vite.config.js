import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

function copyImageDirsPlugin() {
  return {
    name: 'copy-image-dirs',
    closeBundle() {
      const dirsToCopy = [
        'Extertior',
        'Operation Director',
        'Ayadi-Convocation-Event',
        'rahull ghandhi',
        'Alhambra',
        'Andalisia',
        'Build-X-Event',
        'CONFERENCES',
        'Cordoba-Granada',
        'Interior',
        'Raihan-Madrasa-Event',
        'Spark-Connect-Event',
        'The First Impression',
        'Zeely-Convocation-Event',
        'logo'
      ];

      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) {
        fs.mkdirSync(distDir, { recursive: true });
      }

      // Create .nojekyll in dist so GitHub Pages serves all files
      fs.writeFileSync(path.join(distDir, '.nojekyll'), '');

      dirsToCopy.forEach(dir => {
        const srcDir = path.resolve(__dirname, dir);
        const destDir = path.join(distDir, dir);
        if (fs.existsSync(srcDir)) {
          fs.cpSync(srcDir, destDir, { recursive: true });
        }
      });
    }
  };
}

export default defineConfig({
  base: './',
  plugins: [copyImageDirsPlugin()],
});
