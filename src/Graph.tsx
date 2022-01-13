import React from "react";
import ReactECharts from "echarts-for-react";
import { INode } from "./utils/interfaces/INode";
import { IMainNode } from "./utils/interfaces/IMainNode";
import { ILink } from "./utils/interfaces/ILink";

const shortener = (hash: string) => `${hash.slice(0, 3)}...${hash.slice(-3)}`;

const lovelacesToAda = (lovelaces: number) => `${lovelaces / 1000000} ₳`;

const formatTheLegend = (category: string) => {
  if (category.length === 67) {
    // for Ingress and Egress Category
    return `${category.slice(0, 3)} ${category.slice(3, 6)}...${category.slice(
      -3
    )}`;
  }
  // for Main Category
  return `${category.slice(0, 3)}...${category.slice(-3)}`;
};

const displayLinkTooltip = (link: ILink) => {
  return `${shortener(link.source)} -> ${shortener(link.target)}`;
};

const displayMainNode = (mainNode: IMainNode) => {
  if (mainNode.unspentTx) {
    // display mainNode with unspentTx
    return `Tx Hash: ${shortener(mainNode.name)}<br />Out Sum: ${
      mainNode.outSum
    }<br />Size: ${mainNode.size}<br />Fee: ${mainNode.fee} L<br />BlockId: ${
      mainNode.blockId
    }<br />Unspent Tx: ${mainNode.unspentTx}`; // TODO: change currency
  }
  // display mainNode without unspentTx
  return `Tx Hash: ${shortener(mainNode.name)}<br />Out Sum: ${
    mainNode.outSum
  }<br />Size: ${mainNode.size}<br />Fee: ${mainNode.fee} L<br />BlockId: ${
    mainNode.blockId
  }`;
};

const displayNodeTooltip = (node: IMainNode | INode) => {
  const mainNode = node as IMainNode;
  const ingrEgrNode = node as INode;

  if (node.category.length === 67) {
    return `Tx Hash: ${shortener(
      ingrEgrNode.name
    )}<br />TxValue: ${lovelacesToAda(ingrEgrNode.txValue)}<br />TxValue: ${
      ingrEgrNode.txValue
    } L`;
  } else {
    return displayMainNode(mainNode);
  }
};

// @ts-ignore
const Graph = ({ graphData, onClick }) => {
  // TODO: decide on types -> A.B.
  console.log(`graph ---->`, graphData);
  console.log(onClick);

  const option = {
    tooltip: {
      formatter: function (a: { data: IMainNode | INode | ILink }) {
        const link = a.data as ILink;
        const node = a.data as IMainNode | INode;

        return link.source && link.target
          ? displayLinkTooltip(link)
          : displayNodeTooltip(node);
      },
    },
    legend: [
      {
        data: graphData.categories.map(function (a: { name: string }) {
          return a.name;
        }),
        bottom: "15",
        textStyle: {
          color: "#FFFFFF",
        },
        formatter: function (name: string) {
          return formatTheLegend(name);
        },
      },
    ],
    animationDuration: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        name: "Tx Graph",
        type: "graph",
        layout: "force",
        data: graphData.nodes,
        links: graphData.links,
        categories: graphData.categories,
        roam: true,
        label: {
          position: "right",
          formatter: "{b}",
        },
        lineStyle: {
          color: "source",
          curveness: 0.2,
          join: "miter",
          cap: "square",
          miterLimit: 50,
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 4,
          },
        },
        force: {
          // repulsion: 500,
          // friction: 0.1,
        },
        zoom: 3,
      },
    ],
  };

  console.log(`option`, option);

  const onChartClick = (params: { data: INode | IMainNode }) => {
    onClick(params.data);
  };

  const onEvents = {
    click: onChartClick,
  };

  return (
    <ReactECharts
      className="m-auto bg-indigo-900 rounded-lg -mt-8 shadow-2xl opacity-80"
      option={option}
      style={{ height: "650%", width: "90%" }}
      onEvents={onEvents}
    />
  );
};

export default Graph;
