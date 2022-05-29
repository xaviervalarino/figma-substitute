# Figma Substitute --- another find & replace plugin

## Why?

- The two main _find and replace_ plugins that are available don't offer a good experience.

## Goals

- If no frame is selected, find/replace all occurences on the page
- Offer complete (or what is available through JS) Regex support
- Under consideration: use a simple `s/find/replace/flags` string format
- Learn the Figma API

## TODO

- [x] Find all nodes on page if no nodes is selected
- [x] If no nodes are selected, find only nodes that are selected if
- [ ] Add `figma.ui` library for the plugin front-end
- [ ] Add find/replace functionality
  - [ ] Add UI form for find/replace
  - [ ] Pass in user find string
  - [ ] Pass in user replace string
- [ ] Add regex functionality
  - [ ] Add regex function
  - [ ] Add regex UI toggle
