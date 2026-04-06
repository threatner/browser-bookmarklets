# 🗄️ Local Storage Manager Bookmarklet

Inspect and manage `localStorage` and `sessionStorage` with search, editing, export, and clear actions.

## What it does

- Switches between `localStorage` and `sessionStorage`
- Lists all keys with value previews
- Filters entries by key or value
- Adds, edits, copies, and deletes individual items
- Copies the current store as formatted JSON
- Clears the active store with confirmation

## How to install

1. Create a new bookmark in your browser
2. Open the source file below
3. Copy the full bookmarklet code and paste it as the bookmark URL

Source: [bookmarklets/local-storage-manager.js](../bookmarklets/local-storage-manager.js)

## How to use

1. Click the bookmarklet on any website
2. Choose `localStorage` or `sessionStorage`
3. Search entries or use the action buttons to edit values
4. Use `Copy JSON` to export the active store
5. Use `Clear Store` only when you want to remove everything in the selected storage

## Use cases

- Debug saved app state during development
- Inspect feature flags or cached preferences
- Remove stale keys without opening DevTools
- Export storage data for troubleshooting

## Notes

- Only storage available to the current page origin is shown
- Values are copied exactly as stored
- Clearing a store can sign you out or reset app state
