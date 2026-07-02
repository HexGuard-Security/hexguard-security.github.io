import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const DOCS = join(process.cwd(), 'docs');

export function readOutput(relativePath) {
  return readFileSync(join(DOCS, relativePath), 'utf8');
}

test('home page builds and contains the HexGuard brand name', () => {
  const html = readOutput('index.html');
  assert.match(html, /HexGuard/);
});

test('design tokens stylesheet is copied to the build output', () => {
  const css = readOutput('assets/css/tokens.css');
  assert.match(css, /--bg: #FFFFFF/);
  assert.match(css, /--ink: #0A1220/);
});
