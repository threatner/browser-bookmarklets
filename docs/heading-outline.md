# 🪜 Heading Outline Bookmarklet

Create a clickable heading map of the current page and spot structural issues quickly.

## What it does

- Lists all headings from `h1` to `h6`
- Preserves hierarchy visually with indentation
- Jumps to headings on click
- Warns about skipped heading levels
- Warns when there is no `h1`
- Warns when multiple `h1` elements exist

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/heading-outline.js](../bookmarklets/heading-outline.js)

## How to use

1. Click the bookmarklet on a content-heavy page
2. Review the warnings at the top if any exist
3. Use the outline list to jump around the document
4. Fix heading structure and rerun to confirm improvements

## Use cases

- Content QA and editorial review
- Accessibility structure checks
- SEO heading review
- Navigating long docs or articles quickly

## Notes

- Empty headings are still listed so they are easy to spot
- The outline reflects the DOM as rendered on the page
