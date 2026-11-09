# LOVYRN — educational website project

A three-page static website for practicing technical SEO, analytics and conversion tracking.

## Pages
- `index.html` — home page, indexable
- `services.html` — services and inquiry form, indexable
- `thank-you.html` — confirmation page, `noindex, follow`, excluded from sitemap

## Before publishing
1. Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` in canonical URLs, structured data, `robots.txt` and `sitemap.xml`.
2. In `js/config.js`, add your GTM container ID, Microsoft Clarity project ID and Formspree endpoint.
3. The form will not submit until a real endpoint is configured. Do not use real personal data while testing.
4. Check the external image URLs and replace any image you do not have permission to use. Current images are remote Unsplash image URLs used as temporary visual references.
5. Configure a privacy notice appropriate to the countries and tools you actually use before enabling analytics for real visitors.

## Analytics event plan
- `page_view` — configure in GA4/GTM
- `view_services` — services navigation / services page
- `cta_click` — CTA click, with `cta_name`
- `form_start` — first interaction with the form
- `generate_lead` — only after the form provider confirms successful submission
- `thank_you_view` — thank-you page view

Custom events are pushed to `dataLayer`. Create matching GA4 Event tags and triggers in GTM. Load GTM and Clarity only after the visitor accepts optional analytics.

## Important implementation note
The `generate_lead` event is passed on the thank-you page only when the successful form response sets a one-time `sessionStorage` flag. Refreshing the thank-you page will not fire it again. This is a training implementation; validate it in GTM Preview and GA4 DebugView before treating it as production-ready.

## Form setup
The current form endpoint is a placeholder. Create a Formspree form (or another compatible endpoint) and paste its endpoint into `js/config.js`. Test with dummy data only. A successful response redirects to `thank-you.html`.
