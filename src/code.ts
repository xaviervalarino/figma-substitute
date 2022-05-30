import TextCollection from "./text-collection";
// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

console.clear();
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the

const collection = new TextCollection();

figma.ui.onmessage = ({ type, value, regex }) => {
  const currentPage = figma.currentPage;
  if (type === "find-input") {
    collection.findExp(value, regex);

    if (currentPage.selection.length) {
      let node: SceneNode;
      for (node of currentPage.selection) {
        // TODO: handle "SHAPE_WITH_TEXT"?
        if (node.type === "TEXT") {
          collection.findNodes(node);
        }
        if ("findAllWithCriteria" in node) {
          collection.findNodes(node.findAllWithCriteria({ types: ["TEXT"] }));
        }
      }
    } else {
      collection.findNodes(
        currentPage.findAllWithCriteria({ types: ["TEXT"] })
      );
    }

    currentPage.selection = collection.nodes;
    // collection.setText((text) => text.toUpperCase());
    figma.ui.postMessage(collection.length);
  }
  // figma.closePlugin();
};
