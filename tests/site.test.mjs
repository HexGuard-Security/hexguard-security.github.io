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

test('home page has the new positioning headline, certifications, and engagement count', () => {
  const html = readOutput('index.html');
  assert.match(html, /Cybersecurity That Protects What You've Built/);
  assert.match(html, /OSCP/);
  assert.match(html, /31 engagements since 2020/);
});

test('services hub lists both categories and links to all six service pages', () => {
  const html = readOutput('services/index.html');
  assert.match(html, /Vulnerability Assessment/);
  assert.match(html, /Security Solutions/);
  assert.match(html, /href="\/services\/policy-creation\/"/);
});

test('cloud VAPT service page renders with methodology and FAQ', () => {
  const html = readOutput('services/cloud-vapt/index.html');
  assert.match(html, /Cloud Security Assessment/);
  assert.match(html, /CIS benchmarks/);
  assert.match(html, /Which cloud providers do you support/);
});

test('network VAPT service page renders with methodology and FAQ', () => {
  const html = readOutput('services/network-vapt/index.html');
  assert.match(html, /Network Penetration Testing/);
  assert.match(html, /lateral movement/);
  assert.match(html, /Do you test internal networks/);
});

test('application security service page renders with methodology and FAQ', () => {
  const html = readOutput('services/application-security/index.html');
  assert.match(html, /Application\/Product Security/);
  assert.match(html, /OWASP Top 10/);
  assert.match(html, /Do you test mobile apps/);
});

test('network implementation service page renders with methodology and FAQ', () => {
  const html = readOutput('services/network-implementation/index.html');
  assert.match(html, /Network Infrastructure Security/);
  assert.match(html, /segmentation/);
  assert.match(html, /administrative access to our network devices/);
});

test('SDLC security service page renders with methodology and FAQ', () => {
  const html = readOutput('services/sdlc-security/index.html');
  assert.match(html, /SDLC Security Integration/);
  assert.match(html, /CI\/CD/);
  assert.match(html, /Which CI\/CD platforms do you support/);
});
