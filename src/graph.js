import React from "react";
import ReactECharts from "echarts-for-react";

let shortener = (text) => `${text.slice(0, 3)}...${text.slice(-3)}`;
let lovelacesToAda = (lovelaces) => lovelaces / 1000000;

let getMainNode = (currentTx, graph) => {
  graph.categories.push({ name: `${currentTx.tx.tx.hash}` });
  graph.nodes.push({
    name: currentTx.tx.tx.hash,
    value: currentTx.tx.tx.hash,
    category: `${currentTx.tx.tx.hash}`,
    outSum: currentTx.tx.tx.outSum,
    size: 466,
    fee: 218708,
    blockId: 157057,
    label: {
      show: false,
    },
  });
};

const addUnspentTx = (tx, graphNodes, currentIngressNode) =>
  graphNodes.filter(
    (node) =>
      node.name === tx &&
      (node["unspentTx"] = { unspentTx: currentIngressNode.value })
  );

let getIngressNodes = (currentTx, graph) => {
  let ingressCategory = `Ingress${currentTx.tx.tx.hash}`;
  graph.categories.push({ name: ingressCategory });
  return currentTx.tx.ingressT.map((el) =>
    graph.nodes.push({
      name: el.txHash,
      value: el.txHash,
      category: ingressCategory,
      txValue: el.value,
      label: {
        show: false,
      },
    })
  );
};

let getEgressNodes = (currentTx, graph) => {
  let egressCategory = `Egress${currentTx.tx.tx.hash}`;
  graph.categories.push({ name: egressCategory });
  currentTx.tx.egressT.map((el) =>
    el.txHashMay
      ? graph.nodes.push({
          name: `Egress${el.txHashMay}`,
          value: el.txHashMay,
          category: egressCategory,
          txValue: el.value,
          label: {
            show: false,
          },
        })
      : addUnspentTx(currentTx.tx.tx.hash, graph.nodes, el)
  );
};

let getIngressLinks = (currentTx, graph) => {
  return currentTx.tx.ingressT.map((el, index) =>
    graph.links.push({
      source: `${el.txHash}`,
      target: `${currentTx.tx.tx.hash}`,
      // TODO line style
      lineStyle: {
        join: "bevel",
        width: 2,
      },
      emphasis: {
        lineStyle: {
          join: "bevel",
        },
      },
    })
  );
};

let getEgressLinks = (currentTx, graph) => {
  return currentTx.tx.egressT.map(
    (el) =>
      el.txHashMay &&
      graph.links.push({
        source: `${currentTx.tx.tx.hash}`,
        target: `Egress${el.txHashMay}`,
        // TODO line style
        lineStyle: {
          join: "bevel",
          width: 2,
        },
        emphasis: {
          lineStyle: {
            join: "bevel",
          },
        },
      })
  );
};

const formatTheLegend = (category) => {
  switch (category.length) {
    case 70:
      return `${category.slice(0, 6)} ${category.slice(
        6,
        9
      )}...${category.slice(-3)}`;
    case 71:
      return `${category.slice(0, 7)} ${category.slice(
        7,
        10
      )}...${category.slice(-3)}`;
    default:
      return `${category.slice(0, 3)}...${category.slice(-3)}`;
  }
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
      return `TxValue: ${lovelacesToAda(node.data.txValue)} ₳<br />TxValue: ${
        node.data.txValue
      } L`;
    case 71:
      return `Tx Hash: ${shortener(
        node.data.name
      )}<br />TxValue: ${lovelacesToAda(node.data.txValue)} ₳<br />TxValue: ${
        node.data.txValue
      } L`;
    default:
      return displayCurrentNode(node);
  }
};

const displayLinkTooltip = (link) => {
  return link.data.target.length === 64
    ? `${shortener(link.data.source)} -> ${shortener(link.data.target)}`
    : `${shortener(link.data.source)} -> ${link.data.target.slice(
        0,
        6
      )} ${link.data.target.slice(6, 9)}...${link.data.target.slice(-3)}`;
};

const EGraph = (transaction) => {
  const graphData = {
    type: "force",
    categories: [],
    nodes: [],
    links: [],
  };

  getMainNode(transaction, graphData);
  getEgressNodes(transaction, graphData);
  getIngressNodes(transaction, graphData);
  getEgressLinks(transaction, graphData);
  getIngressLinks(transaction, graphData);

  console.log(graphData);

  const option = {
    tooltip: {
      formatter: function (a, b, c, d) {
        // console.dir("a", a, "b", b, "c", c, "d", d);

        return a.data.source && a.data.target
          ? displayLinkTooltip(a)
          : displayNodeTooltip(a);
      },
    },
    legend: [
      {
        // selectedMode: 'single',
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
        },
        emphasis: {
          focus: "adjacency",
          lineStyle: {
            width: 5,
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

  return (
    <ReactECharts
      className="m-auto bg-indigo-900 rounded-lg -mt-8 shadow-2xl opacity-80"
      option={option}
      style={{ height: "650%", width: "90%" }}
    />
  );
};

export default EGraph;
