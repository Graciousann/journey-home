# Home Journey

A standalone, mobile-friendly real-estate roadmap for GraceAnn Visser's clients. It supports personalized buyer, seller, and combined journeys; next-best-action guidance; closing-date milestones; progress tracking; step notes; document checklists; local backups; printing; calculators; timelines; legal guidance; resources; and a searchable glossary.

Journey information is stored privately in the visitor's browser. There is no account, database, or server-side client data.

## Run locally

Requirements: Node.js 20 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Create a production build with:

```bash
pnpm build
```

The finished static site is written to `dist/`.

## Publish the code to GitHub

1. Create a new empty GitHub repository, such as `home-journey`.
2. Open a terminal in this project folder.
3. Run:

```bash
git init
git add .
git commit -m "Launch Home Journey"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/home-journey.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username. If GitHub created the repository with a README, create it again as an empty repository or reconcile the histories before pushing.

## Deploy on Cloudflare Pages

1. In Cloudflare, open **Workers & Pages** and choose **Create application** → **Pages** → **Connect to Git**.
2. Authorize GitHub and select the `home-journey` repository.
3. Use these build settings:
   - Framework preset: **Vite**
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: `/`
4. Save and deploy.
5. In the Pages project, open **Custom domains** to connect the final domain if desired.

Cloudflare will rebuild the site whenever the `main` branch changes. The Wrangler configuration supplies the single-page-app routing fallback used by direct roadmap links.

If the repository was connected as a Cloudflare Worker rather than a Pages project, the included `wrangler.jsonc` serves the `dist` build and provides the same single-page-app routing fallback.

## Before launch

- Confirm GraceAnn's portrait crop on the final domain and replace it later under `public/graceann-headshot.jpeg` if a newer image is preferred.
- Review phone, email, brokerage address, Instagram link, legal explanations, and state-specific language.
- This roadmap is educational and is not legal, tax, lending, or financial advice.
