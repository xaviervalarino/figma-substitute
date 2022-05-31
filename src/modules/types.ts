export interface Match {
  indices: [number, number];
  match: string;
  captured: string[];
}

export interface FoundNode {
  textNode: TextNode;
  match: Match[];
  transform: Transform;
  // fontLoaded: Promise<void>;
}
