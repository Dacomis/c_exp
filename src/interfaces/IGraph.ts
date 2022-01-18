import { ICategory } from "./ICategory";
import { ILink } from "./ILink";
import { IMainNode } from "./IMainNode";
import { INode } from "./INode";

export interface IGraph {
  categories: ICategory[];
  links: ILink[];
  nodes: (IMainNode | INode)[];
  type?: string;
}
