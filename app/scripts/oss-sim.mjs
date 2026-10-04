#!/usr/bin/env node
// Tiny static server that imitates Aliyun OSS Static Pages as configured for
// this site (Default 404 Page = index.html, error status 200, no subfolder
// homepage). vite preview cannot reproduce this routing, so direct routes
// like /fomo or /mitos only behave like production here.
//
//   node scripts/oss-sim.mjs dist
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';
import process from 'node:process';

const root = path.resolve(process.argv[2] ?? 'dist');
if (!existsSync(root)) {
  console.error(`dist folder not found: ${root}`);
  process.exit(1);
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.woff2': 'font/woff2',
};

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let key = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  // serve the exact key when it exists as a file; a path ending in "/" (or an
  // empty key) is NOT a subfolder homepage here: it falls through to the SPA
  // fallback like a missing key would
  const file = path.join(root, key);
  if (key !== '' && !key.endsWith('/') && existsSync(file) && statSync(file).isFile()) {
    res.writeHead(200, { 'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream' });
    createReadStream(file).pipe(res);
    return;
  }
  const index = await readFile(path.join(root, 'index.html'));
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(index);
});

const port = 4174;
server.listen(port, () => console.log(`oss-sim serving ${root} at http://localhost:${port}`));
