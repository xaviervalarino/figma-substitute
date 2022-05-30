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
    return this.collection;
  }
  get length() {
    return this.collection.length;
  }
  get fontNames() {
    return this.fonts;
  }
}
export default TextCollection;
