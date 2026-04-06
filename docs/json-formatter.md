# 🧾 JSON Formatter Bookmarklet

Format, minify, validate, sort, and copy JSON directly from the current page or selected text.

## What it does

- Loads selected text into the formatter when available
- Validates JSON and shows parse errors
- Pretty-prints JSON with indentation
- Minifies JSON for compact output
- Sorts object keys recursively
- Copies formatted output to the clipboard

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/json-formatter.js](../bookmarklets/json-formatter.js)

## How to use

1. Select JSON on a page or paste JSON into the input area
2. Click `Format`, `Minify`, `Validate`, or `Sort Keys`
3. Review the output panel and summary stats
4. Use `Copy Output` when the result looks right

## Use cases

- Read API responses faster
- Clean up copied payloads for debugging
- Validate webhook or config JSON before reuse
- Normalize objects before sharing with teammates

## Notes

- This tool expects valid JSON, not JavaScript objects with comments or trailing commas
- Sorting keys is helpful for comparison, but it changes key order
