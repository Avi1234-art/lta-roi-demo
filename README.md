# LTA ROI Demo

Persana ROI calculator demo site using vanilla HTML/CSS/JS.

## Files

- `index.html`: app shell
- `styles.css`: Serif design system tokens + layout
- `app.js`: calculator logic, scenarios, chart rendering, auto-fill flow
- `cloudflare-worker/company-lookup-worker.js`: lookup API (Wikidata/Wikipedia + demo fallback)
- `cloudflare-worker/wrangler.toml`: worker deployment config

## Frontend deploy (GitHub Pages)

This repo is already set up for GitHub Pages at:

- `https://avi1234-art.github.io/lta-roi-demo/`

When you push to `main`, Pages redeploys automatically.

## Cloudflare Worker deploy

1. Install Wrangler:

```bash
npm install -g wrangler
```

2. Login:

```bash
wrangler login
```

3. Deploy from worker folder:

```bash
cd /Users/avi/Downloads/LTA/cloudflare-worker
wrangler deploy
```

4. Copy deployed endpoint URL and append `/company-lookup`, then paste into the app's `Cloudflare Worker URL` input.

## Notes

- No API keys are required for Wikipedia/Wikidata lookup.
- If live lookup fails, the app uses deterministic demo fallback values.
- Rotate any keys that were shared in chat; never put secrets in frontend code.
