import TextCollection from "./text-collection";

figma.showUI(__html__);

console.clear();

const collection = new TextCollection();

figma.ui.onmessage = ({ type, value, regex }) => {
  const currentPage = figma.currentPage;
  if (type === "find-input") {
    collection.criteria(value, regex);

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
