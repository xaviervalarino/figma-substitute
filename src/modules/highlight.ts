import { ListItem } from "./types";
import clone from "./clone";

interface FontLoaded {
  [fontFamily: string]: {
    [fontStyle: string]: Promise<void>;
  };
}

let hlGrp: GroupNode;
const fontLoaded: FontLoaded = {};

function checkFontsLoaded(fonts: FontName[]): Promise<boolean> {
  const promises = [];
  for (const font of fonts) {
    if (!fontLoaded[font.family]) {
      fontLoaded[font.family] = {
        [font.style]: figma.loadFontAsync(font),
      };
    }
    if (!fontLoaded[font.family][font.style]) {
      fontLoaded[font.family][font.style] = figma.loadFontAsync(font);
    }
    promises.push(fontLoaded[font.family][font.style]);
  }
  return Promise.all(promises).then(() => true);
}

function changeFill(node, r, g, b) {
  const fills = clone(node.fills)
  fills[0].color = { r: r, g: g, b: b };
  node.fills = fills
  return node
}

function createContainer() {
  let container = figma.createFrame();
  container = changeFill(container, 0 , 0 ,0 )
  return container;
}

export default {
  create: (list: ListItem[]) => {
    console.log(list);
    const page = figma.currentPage;
    const clones = list.map(async (item, i) => {
      const hl = item.textNode.clone();
      const fontsLoaded = await checkFontsLoaded(item.fonts);
      if (fontsLoaded) {
        console.log("one", i);
        hl.textDecoration = "UNDERLINE";
        hl.relativeTransform = item.transform;
        return hl;
      }
    });
    createContainer()
    console.log(clones);
    Promise.all(clones).then((clones) => {
      console.log("two", clones);
      hlGrp = figma.group(clones, page);
      hlGrp.name = "Found Matches";
      hlGrp.locked = true;
      console.log("locked?", hlGrp.locked);
    });

    figma.currentPage.appendChild(hlGrp);
  },
  delete: () => hlGrp.type === "GROUP" && hlGrp.remove(),
};
