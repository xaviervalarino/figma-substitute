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

class TextCollection {
  private collection: TextNode[];
  private fonts: Promise<void>[];
  private expression: RegExp | string;

  private match(str: string) {
    const exp = this.expression;
    return exp instanceof RegExp ? exp.test(str) : str.includes(exp);
  }
  private getFontNames(node: TextNode): void {
    if (node.fontName === figma.mixed) {
      let fonts = node
        .getRangeAllFontNames(0, node.characters.length)
        .map((f: FontName) => figma.loadFontAsync(f));
      this.fonts = this.fonts.concat(fonts);
    } else {
      this.fonts.push(figma.loadFontAsync(node.fontName));
    }
  }

  constructor() {
    this.collection = [];
    this.fonts = [];
  }
  findExp(str: string, regex: Boolean) {
    this.collection = [];
    this.fonts = [];
    this.expression = regex ? new RegExp(str) : str;
  }
  findNodes(item: TextNode | TextNode[]) {
    if (item instanceof Array) {
      const matchingNodes = item.filter((n) => this.match(n.characters));
      if (matchingNodes.length) {
        let textNode: TextNode;
        for (textNode of matchingNodes) this.getFontNames(textNode);
        this.collection = this.collection.concat(matchingNodes);
      }
    } else if (this.match(item.characters)) {
      this.collection.push(item);
      this.getFontNames(item);
    }
  }
  async setText(callback: (characters: string) => string) {
    await Promise.all(this.fonts);
    for (const TextNode of this.collection) {
      TextNode.characters = callback(TextNode.characters);
    }
  }
  get nodes() {
    // console.log("exp", this.findExpression);
    console.log("nodes", this.collection);
    return this.collection;
  }
  get length() {
    return this.collection.length;
  }
  get fontNames() {
    return this.fonts;
  }
}

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
