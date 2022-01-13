import { IEgressIngressTx } from "./IEgressIngressTx";
import { IMainNode } from "./IMainNode";

export interface ITx {
  egressT: IEgressIngressTx[],
  ingressT: IEgressIngressTx[],
  tx: IMainNode
}