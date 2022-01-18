import ReactECharts from "echarts-for-react";
import { INode } from "./interfaces/INode";
import { IMainNode } from "./interfaces/IMainNode";
import { ILink } from "./interfaces/ILink";
import { IGraph } from "./interfaces/IGraph";
import { formatTheLegend, lovelacesToAda, shortener } from "./utils/utils";

const displayLinkTooltip = (link: ILink): string => {
  return `${shortener(link.source)} -> ${shortener(link.target)}`;
};

const displayMainNode = (mainNode: IMainNode): string => {
  if (mainNode.unspentTx) {
    // display mainNode with unspentTx
    return `Tx Hash: ${shortener(mainNode.name)}<br />Out Sum: ${lovelacesToAda(
      mainNode.txValue
    )}<br />Fee: ${lovelacesToAda(mainNode.fee)}<br />BlockId: ${
      mainNode.blockId
    }<br />Size: ${mainNode.size}<br />Unspent Tx: ${lovelacesToAda(
      mainNode.unspentTx
    )}`;
  }
  // display mainNode without unspentTx
  return `Tx Hash: ${shortener(mainNode.name)}<br />Out Sum: ${lovelacesToAda(
    mainNode.txValue
  )}<br />Fee: ${lovelacesToAda(mainNode.fee)}<br />BlockId: ${
    mainNode.blockId
  }<br />Size: ${mainNode.size}`;
};

const displayNodeTooltip = (node: IMainNode | INode): string => {
  const mainNode = node as IMainNode;
  const ingrEgrNode = node as INode;

  if (node.category.length === 67) {
    return `Tx Hash: ${shortener(
      ingrEgrNode.name
    )}<br />TxValue: ${lovelacesToAda(ingrEgrNode.txValue)}`;
  } else {
    return displayMainNode(mainNode);
  }
};

const Graph = ({
  graphData,
  onClick,
}: {
  graphData: IGraph;
  onClick: (node: IMainNode | INode) => Promise<void>;
}): JSX.Element => {
  const option = {
    tooltip: {
      formatter: function (a: { data: IMainNode | INode | ILink }): string {
        const link = a.data as ILink;
        const node = a.data as IMainNode | INode;

        return link.source && link.target
          ? displayLinkTooltip(link)
          : displayNodeTooltip(node);
      },
    },
    legend: [
      {
        data: graphData.categories.map(function (a: { name: string }): string {
          return a.name;
        }),
        bottom: "15",
        textStyle: {
          color: "#FFFFFF",
        },
        formatter: function (name: string): string {
          return formatTheLegend(name);
        },
      },
    ],
    animationDuration: 9000, // TODO: resolve "choppines" of animation
    animationEasingUpdate: "quadraticIn",
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

  const onChartClick = (params: { data: INode | IMainNode }): void => {
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
