import { Match, FoundNode } from "./types";

export default class TextCollection {
  constructor() {
    this.#collection = [];
  }

  #collection: FoundNode[];
  #pattern: RegExp;

  private match(str: string): Match[] {
    const pattern = this.#pattern;
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

  criteria(str: string, pattern: Boolean) {
    this.#collection = [];
    // escape expression if searching for a plain string
    if (pattern) {
      str = str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
    }
    this.#pattern = new RegExp(str, "g");
  }

  findNodes(items: TextNode | TextNode[]) {
    if (!(items instanceof Array)) {
      items = [items];
    }
    this.#collection = items.reduce((filtered, n) => {
      const found = this.match(n.characters);
      let fonts: FontName[];

      if (found.length) {
        fonts = found.reduce((filtered, m, i) => {
          const fontName = n.getRangeFontName(...m.indices);
          // TODO: handle figma.mixed
          if (fontName !== figma.mixed) {
            let unique = !filtered.some((exists) => {
              return (
                fontName.family === exists.family &&
                fontName.style === exists.style
              );
            });
            if (i === 0 || unique) {
              filtered.push(fontName);
            }
            return filtered;
          }
          return filtered;
        }, []);

        filtered.push({
          textNode: n,
          match: found,
          transform: n.absoluteTransform,
          fonts: fonts,
        });
      }
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

  get list() {
    return this.#collection;
  }

  get matchCount() {
    let count = 0;
    for (const item of this.#collection) {
      count += item.match.length
    }
    return count
  }

  // get fontNames() {
  //   return this.fonts;
  // }
}
