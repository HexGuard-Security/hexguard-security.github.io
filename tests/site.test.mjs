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

test('policy creation service page renders with methodology and FAQ', () => {
  const html = readOutput('services/policy-creation/index.html');
  assert.match(html, /Policy &amp; Governance|Policy & Governance/);
  assert.match(html, /ISO 27001/);
  assert.match(html, /help us pass an ISO 27001/);
});

test('about page lists company facts, certifications, and team with roles', () => {
  const html = readOutput('about/index.html');
  assert.match(html, /U72900KA2024PTC186498/);
  assert.match(html, /CRTP/);
  assert.match(html, /Adlin Seedon D&#39;Souza|Adlin Seedon D'Souza/);
  assert.match(html, /Founder/);
  assert.match(html, /Advisor/);
  assert.match(html, /Security Consultant/);
});

test('client work page has real stats and anonymized engagement summaries', () => {
  const html = readOutput('client-work/index.html');
  assert.match(html, /31/);
  assert.match(html, /15/);
  assert.match(html, /Fintech Startup/);
  assert.doesNotMatch(html, /hexguardsec@gmail\.com.*client|client.*@/i);
});

test('contact page has a mailto CTA and carried-over contact info', () => {
  const html = readOutput('contact/index.html');
  assert.match(html, /mailto:hexguardsec@gmail\.com/);
  assert.match(html, /\+91 6366934469/);
  assert.match(html, /U72900KA2024PTC186498/);
});

test('privacy policy page exists and covers data collection and confidentiality', () => {
  const html = readOutput('privacy-policy/index.html');
  assert.match(html, /Privacy Policy/);
  assert.match(html, /does not use cookies/);
  assert.match(html, /confidential/i);
});

test('terms of service page exists and covers authorization and liability', () => {
  const html = readOutput('terms-of-service/index.html');
  assert.match(html, /Terms of Service/);
  assert.match(html, /authorized/i);
  assert.match(html, /liability/i);
});

test('every top-level page in the sitemap builds successfully', () => {
  const pages = [
    'index.html',
    'services/index.html',
    'services/cloud-vapt/index.html',
    'services/network-vapt/index.html',
    'services/application-security/index.html',
    'services/network-implementation/index.html',
    'services/sdlc-security/index.html',
    'services/policy-creation/index.html',
    'about/index.html',
    'client-work/index.html',
    'contact/index.html',
    'privacy-policy/index.html',
    'terms-of-service/index.html',
  ];

  for (const page of pages) {
    const html = readOutput(page);
    assert.match(html, /<html/, `${page} did not build valid HTML`);
    assert.match(html, /class="site-nav"/, `${page} is missing the shared nav`);
    assert.match(html, /class="site-footer"/, `${page} is missing the shared footer`);
  }
});
