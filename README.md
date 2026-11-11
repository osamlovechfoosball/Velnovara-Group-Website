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

## Activate the contact form

The server sends enquiries to **velnovaragroup@gmail.com**. The public address shown on the site is **support@velnovaragroup.eu**, which Porkbun email forwarding delivers to the same Gmail inbox (set under the domain's Email Forwarding in Porkbun). It sets Reply-To to the visitor’s email so you can reply normally. The browser never sees email credentials.

1. Copy `.env.example` to `.env`.
2. Create a [Resend API key](https://resend.com/docs/dashboard/api-keys/introduction) with permission to send email.
3. [Verify your sending domain](https://resend.com/docs/dashboard/domains/introduction) in Resend.
4. Set `RESEND_API_KEY` and `CONTACT_FROM` in `.env`. For example, `CONTACT_FROM="Velnovara Group <website@velnovaragroup.eu>"`.
5. Keep `CONTACT_TO=velnovaragroup@gmail.com`. Do not put Gmail as the sender unless an email provider explicitly authorises it; it is the destination here.
6. Restart `npm start`. Submit a real enquiry and confirm receipt in Gmail, including spam folders.

**Live delivery works.** On 11 November 2026 a real test enquiry was sent through the form handler from `website@velnovaragroup.eu` (domain verified in Resend, with a key limited to sending from that domain) to velnovaragroup@gmail.com, and Resend accepted it. Use the same `RESEND_API_KEY` and `CONTACT_FROM` on the hosting provider. Without credentials, the form gives an honest error and a direct email alternative. It never pretends to send. Automated tests use a mocked provider and do not send real messages.

API reference: [Resend send email](https://resend.com/docs/api-reference/emails/send-email).

## Deploy

This is a static website with a small Node.js email server. **GitHub Pages alone cannot run the contact endpoint.** Deploy the whole project to a Node.js host or container host with HTTPS.

- Build command: `npm ci && npm run build`
- Start command: `npm start`
- Node: 24 LTS (22+ supported)
- Set `HOST=0.0.0.0` on hosting and the provider’s `PORT`.
- Set `PUBLIC_ORIGIN=https://your-actual-domain.com` exactly (no trailing slash).
- Set `CONTACT_TO`, `CONTACT_FROM`, and `RESEND_API_KEY` in the hosting provider’s secret settings.
- Set `TRUST_PROXY=1` only if your trusted host overwrites X-Forwarded-For. Keep `0` otherwise.

The server validates input, enforces same-origin requests and a payload size limit, uses a honeypot, limits submissions per IP, and sends idempotency keys to the provider. The rate limit is in memory per server process; for multi-instance production traffic add a shared limiter or edge abuse protection. The server does not save enquiries locally or log message contents.

A Dockerfile is provided. Build with the live address: `docker build --build-arg SITE_URL=https://your-actual-domain.com -t velnovara-website .`; run with an environment file and published port. Place production traffic behind an HTTPS reverse proxy. Static routes, assets, and the contact endpoint must share the same origin.

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

The folder contains an initial Git commit on `main`, with secrets and generated build output excluded. In VS Code’s Source Control view, select **Publish Branch**, sign into GitHub, and choose the repository visibility. Alternatively:

```powershell
git remote add origin https://github.com/YOUR-ACCOUNT/velnovara-group-website.git
git push -u origin main
```

Create an empty GitHub repository first (without a README). No remote repository is created by this delivery.

## Image and brand credits

The typeface is [Manrope](https://github.com/sharanda/manrope), licensed under the SIL Open Font License (`public/assets/fonts/OFL.txt`).

The photo is [Cathedral Saint Alexander Nevsky](https://commons.wikimedia.org/wiki/File:Cathedral_Saint_Alexander_Nevsky_(23997168458).jpg), by **Deensel**, licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). It is cropped, resized, and optimised as WebP; visible attribution is included at the end of the privacy policy. See `ASSET-CREDITS.md`.

The Velnovara logo was supplied and approved by the owner. The SVG is a faithful geometric recreation for web use; the original PNG remains in the repository for reference.

## Delivery status

- One-page responsive site with privacy and GDPR pages, in Bulgarian and English.
- Default route is Bulgarian, with correct language attributes and localised metadata.
- Enquiries configured to the provided Gmail destination.
- Backend integration and error states tested without sending real email.
- Owner’s email credentials and a live receipt test remain necessary before enabling production enquiries.
- Local repository is ready for GitHub; publishing requires the owner’s GitHub sign-in.

No analytics, tracking cookies, or invented client testimonials are included.
