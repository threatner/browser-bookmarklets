# Browser Bookmarklets Collection

A curated collection of useful browser bookmarklets for developers, testers, designers, SEO specialists, and power users.

These JavaScript bookmarklets help you inspect pages, debug forms, analyze performance, review metadata, test accessibility, manage browser storage, and run quick utilities without installing a browser extension.

## What You'll Find

- Run lightweight website tools directly from your bookmarks bar
- Debug pages without opening a full browser extension workflow
- Inspect metadata, headings, links, storage, cookies, and DOM structure
- Support SEO audits, accessibility reviews, QA checks, and frontend development
- Keep a reusable set of one-click browser utilities for daily work

## How to Install a Bookmarklet

1. Click any bookmarklet name below to open its documentation
2. Copy the JavaScript code from the documentation or the matching file in `bookmarklets/`
3. Create a new bookmark in your browser
4. Paste the JavaScript code as the bookmark URL
5. Click the bookmark on any website to run the tool

## Categories

- Developer bookmarklets: DOM inspector, JSON formatter, CSS selector tester, page info, performance analyzer
- SEO bookmarklets: SEO meta inspector, heading outline, link extractor, broken links and images checker
- Accessibility bookmarklets: accessibility audit, heading outline, broken links and images checker
- QA and testing bookmarklets: form auto-filler, cookie manager, local storage manager, table to CSV
- Productivity bookmarklets: text formatter, focus mode, QR code generator, screenshot tool
- Design and UI bookmarklets: color picker, screen ruler, dark mode toggle

## Available Bookmarklets

| Name | Description |
|------|-------------|
| [📝 Form Auto-Filler](docs/form-auto-filler.md) | Fill forms with realistic test data for development and testing |
| [🍪 Cookie Manager](docs/cookie-manager.md) | View, edit, and delete cookies with advanced filtering and export |
| [⚡ Performance Analyzer](docs/performance-analyzer.md) | Comprehensive performance metrics and Core Web Vitals analysis |
| [🎨 Color Picker](docs/color-picker.md) | Extract colors from any element and generate color palettes |
| [📏 Screen Ruler](docs/screen-ruler.md) | Measure distances and element dimensions with pixel accuracy |
| [📊 Table to CSV](docs/table-to-csv.md) | Export HTML tables to CSV with customizable formatting |
| [🎯 Focus Mode](docs/focus-mode.md) | Hide distractions and enhance reading experience |
| [📷 Screenshot Tool](docs/full-page-screenshot.md) | Capture full-page screenshots using multiple methods |
| [🔍 DOM Inspector](docs/dom-inspector.md) | Advanced DOM inspection with element analysis and CSS debugging |
| [🕵️ Analytics Detector](docs/analytics-detector.md) | Detect tracking scripts and analyze privacy practices |
| [📊 Page Info](docs/page-info.md) | Display comprehensive page metadata and technical details |
| [🔗 Link Extractor](docs/link-extractor.md) | Extract and analyze all links with filtering and export options |
| [🌙 Dark Mode Toggle](docs/dark-mode-toggle.md) | Apply universal dark theme with smooth animations |
| [🔐 Password Generator](docs/password-generator.md) | Generate secure passwords with strength analysis |
| [📱 QR Code Generator](docs/qr-code-generator.md) | Generate QR codes for URLs or custom text |
| [✏️ Text Formatter](docs/text-formatter.md) | Transform text with case changes and encoding options |
| [🎨 Prettify JS](docs/prettify-js.md) | Beautify and syntax-highlight JavaScript code |
| [🗄️ Local Storage Manager](docs/local-storage-manager.md) | Inspect, edit, export, and clear localStorage or sessionStorage |
| [🧾 JSON Formatter](docs/json-formatter.md) | Validate, format, minify, sort, and copy JSON payloads |
| [♿ Accessibility Audit](docs/accessibility-audit.md) | Scan pages for common accessibility issues and jump to elements |
| [🔎 SEO Meta Inspector](docs/seo-meta-inspector.md) | Review metadata, social tags, heading structure, and JSON-LD |
| [🔗 URL Tools](docs/url-tools.md) | Parse, clean, sort, encode, decode, and copy URLs |
| [🔍 Broken Links & Images Checker](docs/broken-links-images-checker.md) | Find suspicious links, broken-looking images, and missing alt text |
| [🪜 Heading Outline](docs/heading-outline.md) | Build a clickable heading map and spot structural issues |
| [🎯 CSS Selector Tester](docs/css-selector-tester.md) | Test selectors live and highlight all matches on the page |

## Popular Use Cases

- Frontend development: inspect the DOM, test selectors, analyze performance, and debug page state
- SEO audits: review titles, descriptions, canonical tags, Open Graph tags, headings, and links
- Accessibility checks: find unlabeled controls, missing alt text, and heading hierarchy issues
- QA and testing: auto-fill forms, inspect cookies and local storage, and export data from tables
- Content and productivity workflows: extract links, format text, generate QR codes, and capture screenshots

## Who It's For

- Frontend developers
- QA engineers and software testers
- SEO specialists and content teams
- Designers and UX reviewers
- Browser power users looking for practical utilities

## Project Structure

```text
browser-bookmarklets/
├── bookmarklets/          # JavaScript bookmarklet files
├── docs/                  # Documentation for each bookmarklet
├── README.md             # Project overview and bookmarklet index
├── CLAUDE.md             # Project guidance for future updates
└── LICENSE               # MIT License
```

## Contributing

1. Fork this repository
2. Add your bookmarklet in the `bookmarklets/` directory
3. Add matching documentation in the `docs/` directory
4. Update this README with a clear, search-friendly description
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
