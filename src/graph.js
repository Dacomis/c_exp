import React from "react";
import ReactECharts from "echarts-for-react";

const shortener = (text) => `${text.slice(0, 3)}...${text.slice(-3)}`;

const lovelacesToAda = (lovelaces) => `${lovelaces / 1000000} ₳`;

const formatTheLegend = (category) => {
  console.log(category, category.length);
  if (category.length === 67) {
    // for Ingress and Egress Category
    return `${category.slice(0, 3)} ${category.slice(3, 6)}...${category.slice(
      -3
    )}`;
  }
  return `${category.slice(0, 3)}...${category.slice(-3)}`;
};

const displayLinkTooltip = (link) => {
  return link.data.target.length === 64
    ? `${shortener(link.data.source)} -> ${shortener(link.data.target)}`
    : `${shortener(link.data.source)} -> ${link.data.target.slice(
        0,
        6
      )} ${link.data.target.slice(6, 9)}...${link.data.target.slice(-3)}`;
};

const displayCurrentNode = (node) => {
  if (node.data.unspentTx?.unspentTx) {
    return `Tx Hash: ${shortener(node.data.name)}<br />Out Sum: ${
      node.data.outSum
    }<br />Size: ${node.data.size}<br />Fee: ${node.data.fee} L<br />BlockId: ${
      node.data.blockId
    }<br />Unspent Tx: ${node.data.unspentTx.unspentTx}`;
  } else {
    return `Tx Hash: ${shortener(node.data.name)}<br />Out Sum: ${
      node.data.outSum
    }<br />Size: ${node.data.size}<br />Fee: ${node.data.fee} L<br />BlockId: ${
      node.data.blockId
    }`;
  }
};

const displayNodeTooltip = (node) => {
  switch (node.data.category.length) {
    case 70:
      return `TxValue: ${lovelacesToAda(node.data.txValue)}<br />TxValue: ${
        node.data.txValue
      } L`;
    case 71:
      return `Tx Hash: ${shortener(
        node.data.name
      )}<br />TxValue: ${lovelacesToAda(node.data.txValue)}<br />TxValue: ${
        node.data.txValue
      } L`;
    default:
      return displayCurrentNode(node);
  }
};

const EGraph = ({ graphData, onClick }) => {
  console.log(`graph ---->`, graphData);

  const option = {
    tooltip: {
      formatter: function (a) {
        return a.data.source && a.data.target
          ? displayLinkTooltip(a)
          : displayNodeTooltip(a);
      },
    },
    legend: [
      {
        data: graphData.categories.map(function (a) {
          return a.name;
        }),
        bottom: "15",
        textStyle: {
          color: "#FFFFFF",
        },
        formatter: function (name) {
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

  const onChartClick = (params) => {
    console.log(`params`, params.value);
    onClick(params);
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

export default EGraph;
