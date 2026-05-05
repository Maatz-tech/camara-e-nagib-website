import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname, relative } from 'path';

const distDir = './dist';

async function getHtmlFiles(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await getHtmlFiles(fullPath, files);
    } else if (entry.name.endsWith('.html')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function fixPaths() {
  const htmlFiles = await getHtmlFiles(distDir);

  for (const file of htmlFiles) {
    let content = await readFile(file, 'utf-8');

    // Calculate relative path from this file to dist root
    const fileDir = dirname(file);
    const relativeToRoot = relative(fileDir, distDir) || '.';

    // Replace absolute paths with relative paths
    // /assets/ -> ./assets/ or ../assets/
    content = content.replace(/href="\/assets\//g, `href="${relativeToRoot}/assets/`);
    content = content.replace(/src="\/assets\//g, `src="${relativeToRoot}/assets/`);

    // Replace other absolute paths for images
    content = content.replace(/src="\//g, `src="${relativeToRoot}/`);
    content = content.replace(/href="\/(?!\/)/g, `href="${relativeToRoot}/`);

    // Replace url() in inline styles
    content = content.replace(/url\('\//g, `url('${relativeToRoot}/`);
    content = content.replace(/url\("\//g, `url("${relativeToRoot}/`);

    // Fix double dots issue (./. -> .)
    content = content.replace(/="\.\/\./g, '=".');

    await writeFile(file, content, 'utf-8');
    console.log(`Fixed: ${file}`);
  }

  console.log('All paths fixed!');
}

fixPaths().catch(console.error);
