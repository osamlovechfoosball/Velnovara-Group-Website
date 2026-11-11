# Velnovara Group — design and content review

Completed 5 October 2026. Scope: Home, Services, About and Contact in Bulgarian and English. Desktop folder updated with source and rebuilt output.

## Design direction

“Connected Structures” takes its geometry from the supplied double-V identity. Warm paper and ink blue establish the base; copper identifies actions and a pale blue drawing surface frames the custom system illustration. Serif headlines, numbered annotations, straight rules and deliberate asymmetry replace the previous generic dark hero and repeated horizontal service rows. The diagram is original inline SVG, readable without an image service or external fonts. It is explicitly identified as an illustration, not a shipped product.

## Page-by-page decisions

| Page | Previous issue | Final structure and copy |
| --- | --- | --- |
| Home | General promises repeated across the hero, service overview and company introduction. | A specific manual-work/connected-systems headline; a custom double-V hero illustration; five service entry points written around situations visitors recognise; company context; delivery steps; a direct project invitation. |
| Services | Lists of technologies offered little help choosing a service. | A separate blue index hero; numbered navigation; each service explains when it fits, what work it covers, an explicitly hypothetical example, and the decisions to clarify before building. Each contact link carries the selected service. |
| About | Abstract values and broad slogans explained little about how decisions are made. | Sofia photography belongs in the hero, followed by the starting-point explanation and three practical commitments: scope, appropriate tools, and planning beyond handover. No invented team biographies, customer logos or results. |
| Contact | Another general “conversation” slogan and a standard boxed two-column form. | A direct question, email alternative, helpful briefing prompts and a paper-like form. Required fields remain labelled; feedback remains accessible; service context carries into the message and survives a language switch. |

Both languages were reviewed for meaning rather than relying on word-for-word translation. Vague promises about “practical value”, “clear purpose” and “solutions shaped around your business” were replaced with concrete tasks, decisions and explanations. Existing company identity and contact details remain the factual foundation.

## Visual and functional verification

- Full-page desktop and phone screenshots captured for all eight routes; reviewed for hero composition, heading rhythm, copy wrapping, section spacing and footer layout.
- All eight routes checked at 1440, 768, 390 and 320 pixels: 32 page/viewport combinations.
- No horizontal page overflow, missing images, broken in-page anchors or browser script exceptions in those checks.
- One H1 per page; page language and language-switch routes checked.
- Mobile navigation opens, closes with Escape, and restores button focus.
- Mocked contact success and unavailable states checked without sending live messages.
- Five existing email endpoint tests pass; JavaScript syntax and the bilingual build pass.
- Small copper labels on the peach call-to-action were changed to ink for readable contrast. Text elsewhere uses contrasting paper/ink, copper/paper and muted/blue combinations.
- Motion is restrained to the diagram marker and is disabled when reduced motion is requested.
- A custom bilingual 404 page was also reviewed at 1440, 390 and 320 pixels, including the actual HTTP 404 status and mobile overflow.

Screenshots and machine-readable viewport results are in `design-previews/`. The previous design is backed up in the companion workspace under `website-before-restyle/`.

## Operating note

The contact backend still needs the owner's email-provider configuration before real delivery can be verified. Without it, visitors receive an honest unavailable message and the direct email address. This restyle does not publish or configure a live host.
