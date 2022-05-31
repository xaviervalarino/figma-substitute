export interface Match {
  indices: [number, number];
  match: string;
  captured: string[];
}

export interface ListItem {
  textNode: TextNode;
  match: Match[];
  transform: Transform;
  fonts: FontName[];
}
