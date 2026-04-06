# 🔍 Broken Links and Images Checker Bookmarklet

Scan a page for suspicious links, duplicate URLs, broken-looking images, and missing image alt text.

## What it does

- Flags empty or placeholder links
- Detects `javascript:` links
- Finds unlabeled links
- Reports repeated destination URLs that appear many times
- Detects broken-looking images in the current render
- Flags images missing `src` or `alt`
- Lets you jump to each matched element

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/broken-links-images-checker.js](../bookmarklets/broken-links-images-checker.js)

## How to use

1. Click the bookmarklet on any page
2. Review the grouped findings for links and images
3. Jump to elements that need inspection
4. Re-run after fixes to verify the page is cleaner

## Use cases

- QA checks before release
- Content publishing reviews
- Accessibility and SEO cleanup passes
- Finding placeholder markup left in templates

## Notes

- This is a static page scan and does not crawl the full site
- Repeated URLs are reported as suspicious, not automatically wrong
