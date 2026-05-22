EXIM ADVICE — Hosting & Calendly Setup

Quick steps to host this static site and configure Calendly:

- Hosting (GitHub Pages - recommended):
  1. Create a new GitHub repository and push this project (root contains index.html).
  2. In the repository settings -> Pages, select branch `main` (or `gh-pages`) and root `/` to publish.
  3. Wait a few minutes — your site will be available at `https://<your-username>.github.io/<repo-name>/`.

- Alternative hosting: Netlify or Vercel — connect the repo and deploy (they auto-detect static sites).

- Calendly integration:
  - Inline widget: `enroll.html` contains an inline Calendly widget div. Replace the `data-url` value with your Calendly link, e.g. `https://calendly.com/your-name/30min`.
  - Popup widget: Navigation CTA uses `Calendly.initPopupWidget(...)` — update the URL there if you change the Calendly link.
  - The Calendly CSS and JS are already included near the footers of `contact.html` and `enroll.html`.

- Quick local test:
  - Run a simple static server (Python):

    python -m http.server 8000

  - Open `http://localhost:8000` and test the Calendly widget and popup.

If you want, I can:
- Prepare a GitHub Actions workflow to auto-deploy to `gh-pages`.
- Deploy to Netlify/Vercel if you provide repo access or connect the site.
