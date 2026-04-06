# 🔗 URL Tools Bookmarklet

Parse, clean, sort, encode, decode, and copy URLs without leaving the page.

## What it does

- Breaks a URL into origin, protocol, host, path, search, and hash
- Lists every query parameter
- Removes common tracking parameters like `utm_*`, `gclid`, and `fbclid`
- Sorts parameters alphabetically
- Encodes or decodes URL text
- Copies transformed output to the clipboard

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/url-tools.js](../bookmarklets/url-tools.js)

## How to use

1. Launch the bookmarklet to load the current page URL
2. Paste any URL into the input box if you want to inspect a different one
3. Use `Strip Tracking`, `Sort Params`, `Encode`, or `Decode`
4. Copy the output once you have the version you want

## Use cases

- Clean up URLs before sharing
- Inspect analytics-heavy campaign links
- Sort query strings for easier diffs
- Decode encoded callback or redirect URLs

## Notes

- The tracking-parameter cleanup targets common patterns, not every possible tracker
- Invalid URLs will show a parse error until corrected
