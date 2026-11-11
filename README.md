# Velnovara Group website

A bilingual one-page website for Velnovara Group. Bulgarian is the default at `/`; English is at `/en/`. The menu scrolls to each section of the page (Home, Services, About, Contact) and highlights the section in view. The design uses white and ivory surfaces, Manrope type (self-hosted, Cyrillic and Latin), black and restrained gold, and a dark contact section. The approved logo and Sofia photograph are retained.

## Open in VS Code

Open this folder in VS Code (`File → Open Folder`). Install Node.js 24 LTS, then run in the integrated terminal:

```powershell
npm ci
npm run dev
```

Visit http://localhost:3000. Alternatively press **F5** and select **Velnovara website**. No VS Code extensions are required. Rebuild after editing with `npm run build`, then refresh the browser. The development command does not watch source files automatically.

## Pages

| Page | Bulgarian | English |
| --- | --- | --- |
| One-page site | `/` (`#top`, `#services`, `#about`, `#contact`) | `/en/` (same anchors) |
| Privacy policy | `/privacy/` | `/en/privacy/` |
| Data protection (GDPR) | `/gdpr/` | `/en/gdpr/` |

The former pages `/services/`, `/about/` and `/contact/` (and their `/en/` versions) permanently redirect to the matching section, so old links and search results keep working. Language switching keeps the current section. All content is rendered in HTML, so search engines and visitors do not need JavaScript to read it. The mobile menu, section highlighting, service tabs and form submission use a small JavaScript file.

## Company details and contact information

The registered details of Велновара Груп ЕООД (ЕИК 208991366) are in the `company` object at the top of `scripts/content.mjs`: legal name, ЕИК, address, contact email and phone. They appear in the contact section, footer, privacy policy and structured data. To change one, edit it there and run `npm run build`; an empty field is left out. Add the VAT number there if the company registers for VAT. Bulgarian law (ЗЕТ, чл. 4) requires the legal name, ЕИК, registered address and an email address to be shown on the site.

Set `SITE_URL` in `.env` (or the host's environment) to the live address, e.g. `https://velnovaragroup.eu`. It is used for canonical links, language alternates, sharing previews and `sitemap.xml`.

## Live site: GitHub Pages (free)

The site is published at **https://velnovaragroup.eu** by GitHub Pages. Every push to `main` runs `.github/workflows/pages.yml`, which checks and builds the site and deploys `dist/`. GitHub Pages is free for public repositories.

One-time setup:

1. Publish the repository on GitHub as **public** (GitHub Desktop: *Publish repository*, untick *Keep this code private*).
2. On GitHub: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. In **Settings → Pages → Custom domain**, enter `velnovaragroup.eu` and save; once the certificate is ready, tick **Enforce HTTPS**.
4. At Porkbun (DNS for velnovaragroup.eu): replace the parking `ALIAS` on the root domain with four `A` records pointing to `185.199.108.153`, `185.199.109.153`, `185.199.110.153` and `185.199.111.153`, and add `CNAME www → <github-username>.github.io`. Keep the MX, SPF, Resend (`resend._domainkey`, `rsend`, `send`) and `_dmarc` records unchanged.

GitHub Pages cannot send headers or redirects, so the build adds a Content-Security-Policy meta tag, a `CNAME` file and small forwarding pages for the former `/services/`, `/about/` and `/contact/` routes.

## Contact form and email

- **On GitHub Pages** the form sends through [Web3Forms](https://web3forms.com) (free, 250 messages a month) to **velnovaragroup@gmail.com**. Get an access key at web3forms.com for that address and put it in `formKey` in the `company` object of `scripts/content.mjs`. The key is meant to be public: it only lets the form deliver to the inbox registered with it. Replies go to the visitor's own address.
- **With the Node server** (`npm start` or Docker, when `formKey` is empty) the form posts to `/api/contact`, which sends through Resend from `website@velnovaragroup.eu` (domain verified in Resend). Set `RESEND_API_KEY`, `CONTACT_FROM` and `CONTACT_TO` in `.env`; see `.env.example`. A real test on 11 November 2026 was delivered to velnovaragroup@gmail.com. The server validates input, enforces same-origin requests, uses a honeypot and limits submissions per IP; it never stores enquiries.
- The public address shown on the site is **support@velnovaragroup.eu**. Porkbun email forwarding delivers it to velnovaragroup@gmail.com, and Gmail's *Send mail as* (SMTP `smtp.resend.com`) sends replies from it.

Without a working setup the form shows an honest error with the support address; it never pretends to send.

## Other hosting (optional)

The project still runs as a small Node.js server (`npm start`, Node 24) or Docker image: `docker build --build-arg SITE_URL=https://velnovaragroup.eu -t velnovara-website .`. Then set `HOST=0.0.0.0`, the host's `PORT`, `PUBLIC_ORIGIN=https://velnovaragroup.eu` and the Resend settings, and put it behind HTTPS.

## Edit the website

- `scripts/content.mjs`: all Bulgarian and English text, plus company details.
- `scripts/legal.mjs`: privacy policy and GDPR page text.
- `scripts/build.mjs`: page structure, metadata, sitemap and static generation. CSS and JS links get a content hash, so visitors always receive the latest version after a rebuild.
- `public/styles.css`: responsive design, colours, typography, spacing, and reduced-motion handling.
- `public/app.js`: mobile menu, section highlighting, keeping the scroll position when switching language, service tabs, scroll reveals and form interaction.
- `public/assets/mark.svg`: vector recreation of the approved symbol.
- `public/assets/og-image.jpg`: image shown when the site is shared on social media or messengers.
- `brand/logo-original.png`: original approved logo reference (not published with the site). `brand/unused/` holds earlier artwork the site no longer uses.
- `contact.mjs`: email submission handler.
- `server.mjs`: server, static routing, security headers.
- `tests/contact.test.mjs`: contact validation, forwarding, error states, and rate limit tests.

No application runtime packages are required. This keeps the project portable and avoids unnecessary framework updates. Node’s native HTTP server and fetch power the integration.

## Checks

```powershell
npm run check
```

This checks JavaScript syntax, builds both languages, and runs meaningful email endpoint tests. GitHub Actions runs the same checks on pushes and pull requests.

## Publish the repository to GitHub

Open the folder in GitHub Desktop and choose **Publish repository**, named `velnovara-group-website`, with *Keep this code private* unticked (GitHub Pages is free only for public repositories). `.env`, `dist/` and the old preview folders are excluded by `.gitignore`, so no secrets are uploaded. Then follow *Live site: GitHub Pages* above.

## Image and brand credits

The typeface is [Manrope](https://github.com/sharanda/manrope), licensed under the SIL Open Font License (`public/assets/fonts/OFL.txt`).

The photo is [Cathedral Saint Alexander Nevsky](https://commons.wikimedia.org/wiki/File:Cathedral_Saint_Alexander_Nevsky_(23997168458).jpg), by **Deensel**, licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). It is cropped, resized, and optimised as WebP; visible attribution is included at the end of the privacy policy. See `ASSET-CREDITS.md`.

The Velnovara logo was supplied and approved by the owner. The SVG is a faithful geometric recreation for web use; the original PNG remains in the repository for reference.

## Delivery status

- One-page responsive site with privacy and GDPR pages, in Bulgarian and English.
- Default route is Bulgarian, with correct language attributes and localised metadata.
- Published by GitHub Pages on velnovaragroup.eu after the one-time setup above.
- Contact form: Web3Forms on GitHub Pages (needs the access key in `formKey`); Resend through the Node server, tested with real delivery.
- support@velnovaragroup.eu forwards to velnovaragroup@gmail.com; replies are sent from it through Resend SMTP.

No analytics, tracking cookies, or invented client testimonials are included.
