import TextCollection from "./modules/text-collection";
import highlight from "./modules/highlight";

figma.showUI(__html__);

console.clear();

const collection = new TextCollection();

figma.ui.onmessage = ({ type, value, regex }) => {
  const page = figma.currentPage;
  if (type === "find-input") {
    collection.criteria(value, regex);

    if (page.selection.length) {
      let node: SceneNode;
      for (node of page.selection) {
        // TODO: handle "SHAPE_WITH_TEXT"?
        if (node.type === "TEXT") {
          collection.findNodes(node);
        }
        if ("findAllWithCriteria" in node) {
          collection.findNodes(node.findAllWithCriteria({ types: ["TEXT"] }));
        }
      }
    } else {
      collection.findNodes(page.findAllWithCriteria({ types: ["TEXT"] }));
    }
    
    collection.list.length && highlight.create(collection.list);

    // collection.setText((text) => text.toUpperCase());
    figma.ui.postMessage(collection.matchCount);
  }
  // figma.closePlugin();
};
