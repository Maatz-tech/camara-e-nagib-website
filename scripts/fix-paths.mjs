import { readdir, readFile, writeFile } from 'fs/promises';
import { join, dirname, relative } from 'path';

const distDir = './dist';

async function getFilesByExt(dir, exts, files = []) {
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      await getFilesByExt(fullPath, exts, files);
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      files.push(fullPath);
    }
  }

  return files;
}

function rewriteHtml(content, relativeToRoot) {
  // href / src attributes (single + double quotes), skip protocol-relative `//`
  content = content.replace(/href="\/(?!\/)/g, `href="${relativeToRoot}/`);
  content = content.replace(/src="\/(?!\/)/g, `src="${relativeToRoot}/`);
  content = content.replace(/href='\/(?!\/)/g, `href='${relativeToRoot}/`);
  content = content.replace(/src='\/(?!\/)/g, `src='${relativeToRoot}/`);

  // url() in any inline style (quoted or unquoted), skip protocol-relative `//`
  content = content.replace(/url\("\/(?!\/)/g, `url("${relativeToRoot}/`);
  content = content.replace(/url\('\/(?!\/)/g, `url('${relativeToRoot}/`);
  content = content.replace(/url\(\/(?!\/)/g, `url(${relativeToRoot}/`);

  return content;
}

function rewriteCss(content, relativeToRoot) {
  // Only url() refs — CSS files have nothing else to rewrite. Skip `//` and `data:`.
  content = content.replace(/url\("\/(?!\/)/g, `url("${relativeToRoot}/`);
  content = content.replace(/url\('\/(?!\/)/g, `url('${relativeToRoot}/`);
  content = content.replace(/url\(\/(?!\/)/g, `url(${relativeToRoot}/`);
  return content;
}

async function fixPaths() {
  const files = await getFilesByExt(distDir, ['.html', '.css']);

  for (const file of files) {
    let content = await readFile(file, 'utf-8');

    const fileDir = dirname(file);
    const relativeToRoot = relative(fileDir, distDir) || '.';

    content = file.endsWith('.css')
      ? rewriteCss(content, relativeToRoot)
      : rewriteHtml(content, relativeToRoot);

    await writeFile(file, content, 'utf-8');
    console.log(`Fixed: ${file}`);
  }

  console.log('Done!');
}

fixPaths();
