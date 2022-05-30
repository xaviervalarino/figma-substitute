// This plugin will open a window to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
console.clear();
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
class TextCollection {
    constructor() {
        this.collection = [];
        this.fonts = [];
    }
    match(str) {
        const exp = this.expression;
        return exp instanceof RegExp ? exp.test(str) : str.includes(exp);
    }
    getFontNames(node) {
        if (node.fontName === figma.mixed) {
            let fonts = node
                .getRangeAllFontNames(0, node.characters.length)
                .map((f) => figma.loadFontAsync(f));
            this.fonts = this.fonts.concat(fonts);
        }
        else {
            this.fonts.push(figma.loadFontAsync(node.fontName));
        }
    }
    findExp(str, regex) {
        this.collection = [];
        this.fonts = [];
        this.expression = regex ? new RegExp(str) : str;
    }
    findNodes(item) {
        if (item instanceof Array) {
            const matchingNodes = item.filter((n) => this.match(n.characters));
            if (matchingNodes.length) {
                let textNode;
                for (textNode of matchingNodes)
                    this.getFontNames(textNode);
                this.collection = this.collection.concat(matchingNodes);
            }
        }
        else if (this.match(item.characters)) {
            this.collection.push(item);
            this.getFontNames(item);
        }
    }
    setText(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promise.all(this.fonts);
            for (const TextNode of this.collection) {
                TextNode.characters = callback(TextNode.characters);
            }
        });
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
const collection = new TextCollection();
figma.ui.onmessage = ({ type, value, regex }) => {
    const currentPage = figma.currentPage;
    if (type === "find-input") {
        collection.findExp(value, regex);
        if (currentPage.selection.length) {
            let node;
            for (node of currentPage.selection) {
                // TODO: handle "SHAPE_WITH_TEXT"?
                if (node.type === "TEXT") {
                    collection.findNodes(node);
                }
                if ("findAllWithCriteria" in node) {
                    collection.findNodes(node.findAllWithCriteria({ types: ["TEXT"] }));
                }
            }
        }
        else {
            collection.findNodes(currentPage.findAllWithCriteria({ types: ["TEXT"] }));
        }
        currentPage.selection = collection.nodes;
        // collection.setText((text) => text.toUpperCase());
        figma.ui.postMessage(collection.length);
    }
    // figma.closePlugin();
};
