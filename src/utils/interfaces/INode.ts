// for Ingress and Egress nodes
export interface INode { 
  name: string;
  value: string;
  category: string;
  // TODO: implement Lovelaces to ADA function here
  txValue: number;
  label: {
    show: boolean;
  };
  symbolSize?: number;
}
