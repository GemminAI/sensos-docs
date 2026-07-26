#!/usr/bin/env node
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, extname } from 'node:path';

const DIST = new URL('../dist/', import.meta.url);
const ROOT = DIST.pathname;

async function walk(dir, files = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else if (extname(entry.name) === '.html') files.push(path);
  }
  return files;
}

function extractHrefs(html) {
  const out = [];
  const re = /href=["']([^"']+)["']/g;
  let match;
  while ((match = re.exec(html))) out.push(match[1]);
  return out;
}

function resolveLocal(fromFile, href) {
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) {
    return null;
  }
  const clean = href.split('#')[0].split('?')[0];
  if (!clean.startsWith('/')) return null;
  let path = join(ROOT, clean.replace(/^\//, ''));
  return path;
}

async function exists(path) {
  try {
    const s = await stat(path);
    if (s.isDirectory()) {
      try {
        await stat(join(path, 'index.html'));
        return true;
      } catch {
        return false;
      }
    }
    return true;
  } catch {
    // try as directory index when trailing file missing
    try {
      await stat(path + '.html');
      return true;
    } catch {
      try {
        await stat(join(path, 'index.html'));
        return true;
      } catch {
        return false;
      }
    }
  }
}

const htmlFiles = await walk(ROOT);
const broken = [];
let checked = 0;

for (const file of htmlFiles) {
  const html = await readFile(file, 'utf8');
  for (const href of extractHrefs(html)) {
    const target = resolveLocal(file, href);
    if (!target) continue;
    checked += 1;
    if (!(await exists(target))) {
      broken.push({ file: file.replace(ROOT, '/'), href });
    }
  }
}

const navExpected = [
  '/',
  '/rfc',
  '/architecture',
  '/products',
  '/developer',
  '/governance',
  '/graph',
  '/compliance',
];

const missingRoutes = [];
for (const route of navExpected) {
  const path = route === '/' ? join(ROOT, 'index.html') : join(ROOT, route.slice(1), 'index.html');
  if (!(await exists(path))) missingRoutes.push(route);
}

console.log(`Audited ${htmlFiles.length} HTML files, ${checked} internal hrefs`);
if (missingRoutes.length) {
  console.error('Missing nav routes:', missingRoutes);
  process.exitCode = 1;
}
if (broken.length) {
  console.error(`Broken internal links: ${broken.length}`);
  for (const item of broken.slice(0, 40)) {
    console.error(` - ${item.file} → ${item.href}`);
  }
  if (broken.length > 40) console.error(` … and ${broken.length - 40} more`);
  process.exitCode = 1;
} else {
  console.log('No broken internal links detected.');
}
