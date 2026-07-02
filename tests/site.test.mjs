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

test('logo mark uses the navy palette, not the old cyan/blue gradient', () => {
  const svg = readOutput('assets/img/logo.svg');
  assert.match(svg, /#1E3A8A/);
  assert.doesNotMatch(svg, /#00D4FF/);
});

test('home page includes primary navigation and footer legal info', () => {
  const html = readOutput('index.html');
  assert.match(html, /href="\/services\/cloud-vapt\/"/);
  assert.match(html, /href="\/contact\/"/);
  assert.match(html, /U72900KA2024PTC186498/);
});
