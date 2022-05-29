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
// Calls to "parent.postMessage" from within the HTML page will trigger this
// callback. The callback will be passed the "pluginMessage" property of the
class TextCollection {
    constructor(regex) {
        this.collection = [];
        this.fonts = [];
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
    add(item) {
        if (item instanceof Array) {
            let text;
            for (text of item)
                this.getFontNames(text);
            this.collection = this.collection.concat(item);
        }
        else {
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
            let node;
            for (node of currentPage.selection) {
                // TODO: handle "SHAPE_WITH_TEXT"?
                if (node.type === "TEXT") {
                    collection.add(node);
                }
                if ("findAllWithCriteria" in node) {
                    collection.add(node.findAllWithCriteria({ types: ["TEXT"] }));
                }
            }
        }
        else {
            collection.add(currentPage.findAllWithCriteria({ types: ["TEXT"] }));
        }
        collection.setText((text) => text.toUpperCase());
        figma.ui.postMessage(collection.length);
    }
    // figma.closePlugin();
};
