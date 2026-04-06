# ♿ Accessibility Audit Bookmarklet

Run a fast accessibility-focused scan for common issues and jump straight to the affected elements.

## What it does

- Checks images for missing or empty `alt` text
- Finds form controls without labels
- Flags buttons and links without accessible names
- Detects heading-level skips
- Warns when the document is missing a `lang` attribute
- Lets you jump to each reported element

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/accessibility-audit.js](../bookmarklets/accessibility-audit.js)

## How to use

1. Open any page and click the bookmarklet
2. Review high, medium, and low severity findings
3. Click `Jump to element` to inspect issues in context
4. Fix the page and rerun the bookmarklet to compare results

## Use cases

- Quick pre-QA accessibility pass
- Frontend reviews before shipping
- Spot-checking marketing or content pages
- Teaching teams the most common markup issues

## Notes

- This is a fast heuristic audit, not a full WCAG review
- Some empty `alt` attributes may be intentional for decorative images
