## HexGuard Website

This repository contains the source code for the HexGuard website, deployed at `https://hexguard.net` via GitHub Pages.

### Project Structure

- `docs/` — GitHub Pages site root
  - `index.html` — main landing page
  - `css/styles.css` — site styles
  - `js/scripts.js` — client-side scripts
- `SECURITY.md` — responsible disclosure policy
- `LICENSE` — project license

### Local Preview

You can preview the static site locally with any static server. Example using Python:

```bash
cd docs
python3 -m http.server 8000
# open http://localhost:8000
```

Or using Node.js (http-server):

```bash
npx --yes http-server docs -p 8000
# open http://localhost:8000
```

### Deployment

The site is served from the `docs/` directory on the `main` branch using GitHub Pages. Pushing changes to `main` will automatically update the live site after Pages rebuilds.

### Contributing

1. Create a feature branch.
2. Make edits under `docs/` and validate locally.
3. Open a Pull Request with a clear description and screenshots where helpful.

Please avoid submitting security-related issues via public PRs or issues.

### Security

See `SECURITY.md` for our reporting policy and scope. Use the repository’s Security tab to submit a private advisory.

### License

See `LICENSE` for licensing information.


