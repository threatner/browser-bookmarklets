# 🎯 CSS Selector Tester Bookmarklet

Try selectors against the live page, highlight matches, and inspect what each selector really targets.

## What it does

- Runs any CSS selector against the current page
- Highlights all matches directly in the document
- Reports the total number of matched elements
- Shows a clickable list of matched nodes
- Includes a few quick sample selectors
- Copies the current selector to the clipboard

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/css-selector-tester.js](../bookmarklets/css-selector-tester.js)

## How to use

1. Open the bookmarklet on any site
2. Enter a selector like `.card h2` or `[data-testid]`
3. Click `Test Selector`
4. Review the count, inspect the match list, and jump to elements as needed
5. Clear highlights when you are done

## Use cases

- Building more accurate selectors for automation
- Debugging scraping or testing locators
- Inspecting complex component markup
- Teaching CSS selectors visually

## Notes

- Invalid selectors are caught and shown as errors
- Only the first 50 matches are listed in the side panel, but all matches are highlighted
