import { INode } from "./INode";

export interface IMainNode extends INode {
  blockId: number,
  fee: number,
  // TODO: implement Lovelaces to ADA function here
  outSum: string,
  size: number,
  hash: string,
  unspentTx?: number
}