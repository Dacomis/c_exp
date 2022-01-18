import { INode } from "./INode";

export interface IMainNode extends INode {
  blockId: number;
  fee: number;
  outSum: string;
  size: number;
  hash: string;
  unspentTx?: number;
}
