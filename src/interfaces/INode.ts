// for Ingress and Egress nodes
export interface INode {
  name: string;
  value: string;
  category: string;
  txValue: number;
  label: {
    show: boolean;
  };
  symbolSize?: number;
}
