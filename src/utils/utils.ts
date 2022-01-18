import { IEgressIngressTx } from "../interfaces/IEgressIngressTx";
import { ITx } from "../interfaces/ITx";

export const shortener = (hash: string): string =>
  `${hash.slice(0, 3)}...${hash.slice(-3)}`;

export const lovelacesToAda = (lovelaces: number): string =>
  `${lovelaces / 1000000} ₳`;

export const formatTheLegend = (category: string): string => {
  if (category.length === 67) {
    // for Ingress and Egress Category
    return `${category.slice(0, 3)} ${category.slice(3, 6)}...${category.slice(
      -3
    )}`;
  }
  // for Main Category
  return `${category.slice(0, 3)}...${category.slice(-3)}`;
};

export const addUnspentTx = (currentTx: ITx): number | undefined =>
  currentTx.egressT.find((el: IEgressIngressTx) => !el.txHashMay)?.value;
