# ⚡ Performance Analyzer Bookmarklet

Inspect page timing, resource breakdown, DOM complexity, and quick performance recommendations from a single overlay.

## What it does

- Collects navigation and paint timing data
- Summarizes total resources and transfer size
- Shows a simple performance score
- Breaks down images, scripts, styles, fonts, XHR, and other requests
- Displays memory usage when the browser exposes it
- Generates quick recommendations based on common thresholds

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/performance-analyzer.js](../bookmarklets/performance-analyzer.js)

## How to use

1. Open a page and let it finish loading
2. Click the bookmarklet
3. Review the score, key metrics, and resource breakdown
4. Use the recommendations section to spot obvious performance bottlenecks

## Use cases

- Frontend performance spot checks
- Quick demos during development
- Comparing different pages or releases
- Finding oversized images, scripts, or too many requests

## Notes

- Data quality depends on what the browser exposes through the Performance APIs
- This is a fast diagnostic tool, not a replacement for Lighthouse or full profiling
