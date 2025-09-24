## Security Policy

Thank you for helping keep HexGuard and our users safe. This repository contains the source for the HexGuard website (hexguard.net). We take security issues seriously and appreciate responsible disclosure.

### Reporting a Vulnerability

Please report vulnerabilities privately using GitHub Security Advisories:

- Go to this repository’s Security tab and choose “Report a vulnerability” to open a private advisory draft.

This creates a private workspace where we can discuss details without public disclosure. If you cannot use GitHub Security Advisories, note an alternative contact method you prefer in the advisory draft; we will accommodate a secure channel.

When reporting, include as much detail as possible:

- Affected pages/endpoints or files
- Steps to reproduce, proof-of-concept, and impact
- Any logs, screenshots, or network traces
- Your assessment of severity and potential remediation ideas

We kindly ask that you avoid public filing of issues or pull requests for security-sensitive content.

### Our Commitment

- We will acknowledge receipt within 3 business days.
- We will provide regular updates (at least every 7 days) until resolution.
- We aim to remediate within 90 days for most issues, with priority given to critical impact.
- We will credit you (with your consent) in any relevant release notes or acknowledgements.

### Scope

In scope:

- The HexGuard website source in this repository and its deployed instance at hexguard.net
- Client-side code and static assets under `docs/`

Out of scope (unless explicitly stated otherwise):

- Third-party services, providers, or dependencies not controlled by HexGuard
- Denial-of-service (DoS) or volumetric attacks
- Social engineering or phishing of our staff or users
- Non-exploitable best-practice gaps without demonstrable impact

### Testing Guidelines

- Do not perform actions that could degrade service for other users.
- Only test against your own data and accounts; avoid accessing data that isn’t yours.
- No automated scanning that generates excessive traffic.
- Never attempt data exfiltration beyond minimally necessary proof.

### Safe Harbor

We support responsible disclosure. If you make a good-faith effort to comply with this policy while researching and reporting, we will not pursue or support legal action against you for your research activities that align with this policy.

### Versions and Updates

This is a static site; security fixes will generally be deployed promptly after merging to `main`. Keep your local clones and deployments updated.

### Thank You

We appreciate the time and effort it takes to report security issues responsibly. Your contributions help keep HexGuard safe for everyone.


