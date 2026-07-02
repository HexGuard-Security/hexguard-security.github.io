## HexGuard Website

This repository contains the source code for the HexGuard website, deployed at `https://hexguard.net` via GitHub Pages.

### Project Structure

- `src/` — Eleventy source: page templates, `_includes/` layouts (nav/footer/service), and `assets/` (CSS, JS, images)
- `docs/` — GitHub Pages site root (generated build output — do not edit directly, run `npm run build` instead)
- `tests/` — build verification tests
- `SECURITY.md` — responsible disclosure policy
- `LICENSE` — project license

### Local Preview

This site is built with [Eleventy](https://www.11ty.dev/). To preview it locally:

```bash
npm install
npm run serve
# open http://localhost:8080
```

### Building

```bash
npm run build
```

This compiles the templates in `src/` into static HTML in `docs/`, which is the GitHub Pages source directory.

### Testing

```bash
npm test
```

This builds the site and runs assertions against the generated HTML in `docs/` using Node's built-in test runner.

### Deployment

The site is served from the `docs/` directory on the `main` branch using GitHub Pages. After making changes under `src/`, run `npm run build`, commit both the `src/` changes and the regenerated `docs/` output, and push to `main` — GitHub Pages will pick up the change automatically.

### Contributing

1. Create a feature branch.
2. Make edits under `src/`, run `npm run build` and `npm test` to validate locally, and commit both the `src/` changes and the regenerated `docs/` output.
3. Open a Pull Request with a clear description and screenshots where helpful.

Please avoid submitting security-related issues via public PRs or issues.

### Security

See `SECURITY.md` for our reporting policy and scope. Use the repository’s Security tab to submit a private advisory.

### License

See `LICENSE` for licensing information.

