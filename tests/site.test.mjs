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
