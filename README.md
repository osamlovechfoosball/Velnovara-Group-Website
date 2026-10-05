# Velnovara Group website

A complete four-page bilingual website for Velnovara Group. Bulgarian is the default; English has its own `/en/` routes. The design combines restrained editorial typography with the approved double-V identity and a real Sofia photograph.

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
| Home | `/` | `/en/` |
| Services | `/services/` | `/en/services/` |
| About | `/about/` | `/en/about/` |
| Contact | `/contact/` | `/en/contact/` |

Language switching preserves the current page. Navigation and all page content are rendered in HTML, so search engines and visitors do not need JavaScript to read the website. Mobile navigation and form submission use a small JavaScript file.

## Activate the contact form

The server sends enquiries to **velnovaragroup@gmail.com**. It sets Reply-To to the visitor’s email so you can reply normally. The browser never sees email credentials.

1. Copy `.env.example` to `.env`.
2. Create a [Resend API key](https://resend.com/docs/dashboard/api-keys/introduction) with permission to send email.
3. [Verify your sending domain](https://resend.com/docs/dashboard/domains/introduction) in Resend.
4. Set `RESEND_API_KEY` and `CONTACT_FROM` in `.env`. For example, `CONTACT_FROM="Velnovara Group <website@your-verified-domain.com>"`.
5. Keep `CONTACT_TO=velnovaragroup@gmail.com`. Do not put Gmail as the sender unless an email provider explicitly authorises it; it is the destination here.
6. Restart `npm start`. Submit a real enquiry and confirm receipt in Gmail, including spam folders.

**Live delivery has not been verified because credentials are supplied by the owner.** Without credentials, the form gives an honest error and a direct email alternative. It never pretends to send. Automated tests use a mocked provider and do not send real messages.

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

A Dockerfile is provided. Build: `docker build -t velnovara-website .`; run with an environment file and published port. Place production traffic behind an HTTPS reverse proxy. Static routes, assets, and the contact endpoint must share the same origin.

## Edit the website

- `scripts/content.mjs`: all Bulgarian and English text.
- `scripts/build.mjs`: layout and static page generation.
- `public/styles.css`: responsive design, colours, spacing, and reduced-motion handling.
- `public/app.js`: mobile menu and form interaction.
- `public/assets/mark.svg`: vector recreation of the approved symbol.
- `public/assets/logo-original.png`: original approved logo reference.
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

The photo is [Cathedral Saint Alexander Nevsky](https://commons.wikimedia.org/wiki/File:Cathedral_Saint_Alexander_Nevsky_(23997168458).jpg), by **Deensel**, licensed under [CC BY 2.0](https://creativecommons.org/licenses/by/2.0/). It is cropped, resized, and optimised as WebP; visible attribution is included in the footer. See `ASSET-CREDITS.md`.

The Velnovara logo was supplied and approved by the owner. The SVG is a faithful geometric recreation for web use; the original PNG remains in the repository for reference.

## Delivery status

- Four complete responsive pages, in Bulgarian and English.
- Default route is Bulgarian, with correct language attributes and localised metadata.
- Enquiries configured to the provided Gmail destination.
- Backend integration and error states tested without sending real email.
- Owner’s email credentials and a live receipt test remain necessary before enabling production enquiries.
- Local repository is ready for GitHub; publishing requires the owner’s GitHub sign-in.

No analytics, tracking cookies, or invented client testimonials are included.
