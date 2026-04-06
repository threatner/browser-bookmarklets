# CLAUDE.md

## Project Overview

This repository contains standalone browser bookmarklets written in JavaScript. Each bookmarklet should live in `bookmarklets/` and have a matching documentation page in `docs/`. The README is the main landing page for search and discovery.

## Repository Goals

- Keep the bookmarklets practical for developers, testers, designers, SEO work, accessibility reviews, and browser productivity
- Favor real-world utilities over novelty tools
- Keep installation simple by preserving the bookmarklet-first workflow

## SEO-Friendly Documentation Rules

When updating `README.md` or anything in `docs/`:

- Use descriptive page titles that include the bookmarklet name and its main purpose
- Include natural keyword coverage such as `browser bookmarklet`, `JavaScript bookmarklet`, `developer bookmarklet`, `SEO bookmarklet`, `accessibility bookmarklet`, `testing tool`, or `productivity tool` when relevant
- Avoid keyword stuffing or repetitive phrasing that reads unnaturally
- Make the value of the bookmarklet clear in the first sentence
- Prefer short sections like `What it does`, `How to install`, `How to use`, `Use cases`, and `Notes`
- Keep each bookmarklet description distinct so multiple docs pages do not compete with nearly identical wording
- Use internal links between the README and the bookmarklet docs where helpful

## README Expectations

The README should:

- Explain what this bookmarklets collection offers
- State who it is for
- Cover major keyword themes naturally: browser bookmarklets, JavaScript bookmarklets, developer tools, SEO tools, accessibility tools, QA tools, and productivity tools
- Organize bookmarklets in a way that is easy to scan
- Keep descriptions concise, useful, and specific

## Docs Expectations

Each bookmarklet docs page should ideally include:

- A clear title with the bookmarklet name
- A short introductory sentence
- `What it does`
- `How to install`
- `How to use`
- `Use cases`
- `Notes` or limitations when relevant

## Implementation Guidance

- Keep bookmarklets standalone and easy to copy into a browser bookmark
- Prefer minimal dependencies
- If a tool relies on an external API or CDN, document that clearly
- Match the existing repository style unless making a consistent improvement across related files

## Required Updates for New Bookmarklets

Whenever adding a new bookmarklet, update:

- `bookmarklets/<name>.js`
- `docs/<name>.md`
- `README.md`

Also check that the README category structure still makes sense after the new addition.
