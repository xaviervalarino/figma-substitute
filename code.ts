// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the

figma.ui.onmessage = (msg) => {
  let textNodes: TextNode[] = [];

  if (msg.type === "find-text") {
    if (figma.currentPage.selection.length) {
      console.log("inside selection");
      let node: SceneNode;
      for (node of figma.currentPage.selection) {
        // TODO: handle "SHAPE_WITH_TEXT"?
        if (node.type === "TEXT") {
          textNodes.push(node);
        }
        if ("findAllWithCriteria" in node) {
          textNodes = textNodes.concat(
            node.findAllWithCriteria({ types: ["TEXT"] })
          );
        }
      }
    } else {
      textNodes = figma.currentPage.findAllWithCriteria({ types: ["TEXT"] });
    }

    console.log(textNodes.map((n) => n.characters));
    figma.ui.postMessage(textNodes.length);
  }
  // figma.closePlugin();
};
