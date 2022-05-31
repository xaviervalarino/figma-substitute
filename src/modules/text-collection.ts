import { Match, FoundNode } from "./types";

export default class TextCollection {
  constructor() {
    this.collection = [];
  }

  private collection: FoundNode[];
  private pattern: RegExp;

  private match(str: string): Match[] {
    const pattern = this.pattern;
    const matches: Match[] = [];
    let result: RegExpExecArray;

    const match = (found: RegExpExecArray): Match => ({
      indices: [found.index, found.index + found[0].length - 1],
      match: found.shift(),
      captured: [...found],
    });

    if (pattern.global) {
      while ((result = pattern.exec(str)) !== null) {
        matches.push(match(result));
      }
    } else {
      matches.push(match(pattern.exec(str)));
    }
    return matches;
  }

  // TODO: maybe delete this method
  private getFontNames(node: TextNode): void {
    if (node.fontName === figma.mixed) {
      let fonts = node
        .getRangeAllFontNames(0, node.characters.length)
        .map((f: FontName) => figma.loadFontAsync(f));
      // this.fonts = this.fonts.concat(fonts);
    } else {
      // this.fonts.push(figma.loadFontAsync(node.fontName));
    }
  }

  criteria(str: string, pattern: Boolean) {
    this.collection = [];
    // escape expression if searching for a plain string
    if (pattern) {
      str = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
    this.pattern = new RegExp(str, "g");
  }

  findNodes(items: TextNode | TextNode[]) {
    if (!(items instanceof Array)) {
      items = [items];
    }
    this.collection = items.reduce((filtered, n) => {
      const match = this.match(n.characters);
      if (match.length)
        filtered.push({
          textNode: n,
          match: match,
          transform: n.absoluteTransform,
        });
      return filtered;
    }, []);
  }

  // async setText(callback: (characters: string) => string) {
  //   await Promise.all(this.fonts);
  //   for (const TextNode of this.collection) {
  //     TextNode.characters = callback(TextNode.characters);
  //   }
  // }

  // async cloneNodes() {
  //   await Promise.all(this.fonts);
  //   return this.collection.map((n) => {
  //     console.log('compare transform', n.absoluteTransform, n.clone().absoluteTransform)
  //     return n.clone()
  //   });
  // return this.collection.map((n) => n.clone());
  // }

  get nodes() {
    return this.collection.map((obj) => obj.textNode);
  }

  get length() {
    return this.collection.length;
  }

  // get fontNames() {
  //   return this.fonts;
  // }
}