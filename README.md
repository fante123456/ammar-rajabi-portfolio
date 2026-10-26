# Ammar Rajabi – Portfolio

Source code of my personal portfolio: **https://ammar-rajabi.com**

A bilingual (French / English) static website, built without a framework or page builder.

## Features

- French pages at the root, English pages in `/en/`
- Case studies for each project in `/projects/` and `/en/projects/`
- Mobile-first, responsive layout
- Accessible markup: semantic HTML, keyboard navigation, visible focus, alt text
- Lightweight images (WebP), lazy loading and cache rules in `.htaccess`
- SEO: titles and descriptions per page, `hreflang`, `sitemap.xml`, `robots.txt`
- Contact form handled by a small PHP script (`contact.php`) with validation and a honeypot field

## Structure

```
index.html, realisations.html, studio.html, ...   French pages
en/                                               English pages
projects/, en/projects/                           Case studies
assets/css/site.css                               Styles
assets/js/site.js                                 Menu, gallery and form scripts
assets/img/, assets/fonts/                        Images and self-hosted fonts
contact.php                                       Contact form handler
.htaccess                                         HTTPS, redirects, caching, security headers
```

## Run locally

Open `index.html` in a browser, or start a simple local server:

```
python -m http.server 8000
```

Then open http://localhost:8000. The contact form needs a PHP server to send emails.

## Hosting

Hosted on o2switch (Apache). Files are uploaded as they are; no build step is needed.

---

Design and code by Ammar Rajabi · https://ammar-rajabi.com
