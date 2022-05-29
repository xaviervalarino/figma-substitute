# Figma Substitute— another find & replace plugin

:warning: This plugin is under development :warning:

## Why?

I have yet to find a community _find and replace_ plugins that handles selection context and has Regex support. This plugin attempts to address both of those needs.

## Goals

- Selectively find text inside selection, or all text on the page
- Offer complete (or what is available through JS) Regex support
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
