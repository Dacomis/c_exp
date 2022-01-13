import { ICategory } from "./ICategory";
import { ILink } from "./ILink";
import { IMainNode } from "./IMainNode";
import { INode } from "./INode";

export interface IGraph {
    categories: ICategory[],
    links: ILink[],
    nodes: INode[] | IMainNode[] // TODO: make sure this is correct -> A.B.
    force?: string
}