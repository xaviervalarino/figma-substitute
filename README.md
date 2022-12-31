# Figma Substitute— another find & replace plugin

:mega: Due to Figma *finally* adding [Find & Replace](https://help.figma.com/hc/en-us/articles/9141292269847-Find-and-replace-text-in-Figma-files), this plugin is no longer under development and has been archived.

## Why?

I have yet to find a community _find and replace_ plugin that handles selection context and has Regex support. This plugin attempts to address both of those needs.

I'm essentially trying to create a find/replace experience similar to the ones found in InDesign and text editors like Sublime.

## Goals

- Selectively find text inside selection, or all text on the page
- Provide visual feedback for found text
- Offer complete (or what is available through JS) Regex support
- Learn the Figma API

## TODO

- [x] Find all text on page if nothing is selected
- [x] When there is a selection, only find text inside that area
- [x] Add edit text functionality
- [ ] Add `figma.ui` library for the plugin front-end
- [ ] Add find/replace functionality
  - [x] Add UI form for find/replace
  - [x] Pass in user find string
  - [ ] Pass in user replace string
  - [ ] "Find" selects next match
  - [ ] "Find all" selects matches
  - [ ] "Replace" next match
  - [ ] "Replace All" matches
- [ ] Add regex functionality
  - [x] Add regex search function
  - [ ] Add regex replace function
  - [ ] Add regex search flags function: ignore case, global, etc
  - [ ] Look into how to support positive/negative look-ahead and behind
  - [x] Add UI to toggle text/regex
  - [ ] Add regex UI toggles for flags
- [ ] Add visual feedback for search selection. Some potential solutions:
  - Underline the text range
  - Change the color of the text range
  - Overlay some sort of element at the exact XY coordinates of the element
    - caveats:
      - Would have to append to the root to avoid interfering with frame autolayout
      - Would have to recreate the string, split it into groups, color the match, and then turn the non-matching groups transparent
- [ ] Keep styles for textNodes with mixed fonts/sizes/weights
- Look into using [`getStyledTextSegments`](https://www.figma.com/plugin-docs/api/properties/TextNode-getstyledtextsegments/)
- Save UI state to storage
