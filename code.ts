// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the

class TextCollection {
  private collection: TextNode[];
  private fonts: Promise<void>[];
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
  constructor(regex: string) {
    this.collection = [];
    this.fonts = [];
  }
  add(item: TextNode | TextNode[]) {
    if (item instanceof Array) {
      let text: TextNode;
      for (text of item) this.getFontNames(text);
      this.collection = this.collection.concat(item);
    } else {
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
  get length() {
    return this.collection.length;
  }
  get fontNames() {
    return this.fonts;
  }
}

figma.ui.onmessage = (msg) => {
  const currentPage = figma.currentPage;
  const collection = new TextCollection("string");

  if (msg.type === "find-text") {
    if (currentPage.selection.length) {
      console.log("inside selection");
      let node: SceneNode;
      for (node of currentPage.selection) {
        // TODO: handle "SHAPE_WITH_TEXT"?
        if (node.type === "TEXT") {
          collection.add(node);
        }
        if ("findAllWithCriteria" in node) {
          collection.add(node.findAllWithCriteria({ types: ["TEXT"] }));
        }
      }
    } else {
      collection.add(currentPage.findAllWithCriteria({ types: ["TEXT"] }));
    }

    collection.setText((text) => text.toUpperCase());
    figma.ui.postMessage(collection.length);
  }
  // figma.closePlugin();
};
