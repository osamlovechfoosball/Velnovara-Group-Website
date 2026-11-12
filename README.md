# Velnovara Group website

A bilingual one-page website for Velnovara Group. Bulgarian is the default at `/`; English is at `/en/`. The menu scrolls to each section of the page (Home, Services, About, Contact) and highlights the section in view. The design uses white and ivory surfaces, Manrope type (self-hosted, Cyrillic and Latin), black and restrained gold, and a dark contact section. The approved logo and Sofia photograph are retained. On phones (700px and narrower) the home page has its own layout: the Sofia photo behind the title, two shortcut cards (Services, Products) and a bar fixed to the bottom of the screen (Services · Products · Contact) that steps aside while the contact form is on screen. Desktop and tablet layouts are unchanged.

## Open in VS Code

Open this folder in VS Code (`File → Open Folder`). Install Node.js 24 LTS, then run in the integrated terminal:

```powershell
npm ci
npm run dev
```

Visit http://localhost:3000. Alternatively press **F5** and select **Velnovara website**. No VS Code extensions are required. Rebuild after editing with `npm run build`, then refresh the browser. The development command does not watch source files automatically. The local server (`server.mjs`) serves `dist/` the way GitHub Pages does; it only exists for previewing.

## Pages

| Page | Bulgarian | English |
| --- | --- | --- |
| One-page site | `/` (`#top`, `#services`, `#about`, `#contact`) | `/en/` (same anchors) |
| Privacy policy | `/privacy/` | `/en/privacy/` |
| Data protection (GDPR) | `/gdpr/` | `/en/gdpr/` |

The former pages `/services/`, `/about/` and `/contact/` (and their `/en/` versions) forward to the matching section, so old links and search results keep working. Language switching keeps the current section. All content is rendered in HTML, so search engines and visitors do not need JavaScript to read it. The mobile menu, section highlighting, service tabs and form submission use a small JavaScript file.

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

GitHub Pages cannot send headers or redirects, so the build adds a Content-Security-Policy and a referrer policy as meta tags, a `CNAME` file and small forwarding pages for the former `/services/`, `/about/` and `/contact/` routes. `app.js` also leaves any frame another site embeds the page in, since Pages cannot forbid framing with a header. GitHub Pages itself sends HSTS.

### Google Search Console

1. Open [Google Search Console](https://search.google.com/search-console), choose **Add property → Domain**, and enter `velnovaragroup.eu`.
2. Google shows a `TXT` record (`google-site-verification=…`). Add it at Porkbun as a `TXT` record with an empty host, next to the existing SPF record, then click **Verify**.
3. Under **Sitemaps**, submit `sitemap.xml`. Under **URL inspection**, request indexing for `https://velnovaragroup.eu/` and `https://velnovaragroup.eu/en/`.

## Contact form and email

- The form sends through [Web3Forms](https://web3forms.com) (free, 250 messages a month) to **velnovaragroup@gmail.com**. Get an access key at web3forms.com for that address and put it in `formKey` in the `company` object of `scripts/content.mjs`. The key is meant to be public: it only lets the form deliver to the inbox registered with it. Replies go to the visitor's own address.
- The public address shown on the site is **support@velnovaragroup.eu**. Porkbun email forwarding delivers it to velnovaragroup@gmail.com, and Gmail's *Send mail as* (SMTP `smtp.resend.com`) sends replies from it.

Without an access key, or if Web3Forms fails, the form shows an honest error with the support address; it never pretends to send. Bots that fill the hidden honeypot field get a success message and nothing is sent. If spam ever gets through, enable Web3Forms' captcha.

## Edit the website

- `scripts/content.mjs`: all Bulgarian and English text, plus company details.
- `scripts/legal.mjs`: privacy policy and GDPR page text.
- `scripts/build.mjs`: page structure, metadata, sitemap and static generation. CSS and JS links get a content hash, so visitors always receive the latest version after a rebuild.
- `public/styles.css`: responsive design, colours, typography, spacing, and reduced-motion handling.
- `public/app.js`: mobile menu, section highlighting, keeping the scroll position when switching language, service tabs, scroll reveals and form interaction.
- `public/enquiry.js`: sends the contact form to Web3Forms.
- `public/assets/mark.svg`: vector recreation of the approved symbol.
- `public/assets/og-image.jpg`: image shown when the site is shared on social media or messengers.
- `brand/logo-original.png`: original approved logo reference (not published with the site). `brand/unused/` holds earlier artwork the site no longer uses.
- `server.mjs`: local preview server for `dist/`.
- `tests/`: automated checks (see below).

No packages are required. This keeps the project portable and avoids unnecessary framework updates.

## Checks

```powershell
npm run check
```

This checks JavaScript syntax, builds both languages and runs the tests: the contact form's Web3Forms requests and every failure case (`tests/enquiry.test.mjs`), and the built pages' security policy, form key, GitHub Pages files and absence of secrets (`tests/build.test.mjs`).

On every push, GitHub Actions (`.github/workflows/ci.yml`) also runs `tests/browser-check.cjs` in a real browser: 6 pages at 5 screen widths, links, forwarding pages, mobile menu, language switch, service tabs and form states, with Web3Forms mocked so no email is sent. Screenshots are kept as a downloadable artifact of each run. To run it locally: `npm install --no-save playwright`, `npm start`, then `npm run test:browser` in a second terminal, with `BROWSER_EXECUTABLE` set to an installed Chrome or Edge.

## Publish the repository to GitHub

Open the folder in GitHub Desktop and choose **Publish repository**, named `velnovara-group-website`, with *Keep this code private* unticked (GitHub Pages is free only for public repositories). `.env`, `dist/` and the old preview folders are excluded by `.gitignore`, so no secrets are uploaded. Then follow *Live site: GitHub Pages* above.

## Image and brand credits

The typeface is [Manrope](https://github.com/sharanda/manrope), licensed under the SIL Open Font License (`public/assets/fonts/OFL.txt`).

The evening photo of Sofia was supplied by the owner (source in `brand/sofia-evening-source.webp`). It is cropped to 3:2 and served as AVIF with a WebP fallback in two widths. See `ASSET-CREDITS.md`.

The Velnovara logo was supplied and approved by the owner. The SVG is a faithful geometric recreation for web use; the original PNG remains in the repository for reference.

## Delivery status

- One-page responsive site with privacy and GDPR pages, in Bulgarian and English.
- Default route is Bulgarian, with correct language attributes and localised metadata.
- Published by GitHub Pages on velnovaragroup.eu after the one-time setup above.
- Contact form through Web3Forms, tested with real delivery to velnovaragroup@gmail.com.
- support@velnovaragroup.eu forwards to velnovaragroup@gmail.com; replies are sent from it through Resend SMTP.

No analytics, tracking cookies, or invented client testimonials are included.
