import { useState } from "react";
import Graph from "./Graph";
import getSocketRes from "./services/WebSocketService";
import { ICategory } from "./utils/interfaces/ICategory";
import { IEgressIngressTx } from "./utils/interfaces/IEgressIngressTx";
import { IGraph } from "./utils/interfaces/IGraph";
import { ILink } from "./utils/interfaces/ILink";
import { IMainNode } from "./utils/interfaces/IMainNode";
import { INode } from "./utils/interfaces/INode";
import { ITx } from "./utils/interfaces/ITx";

const lovelacesToAda = (lovelaces: number) => `${lovelaces / 1000000} ₳`;

const addUnspentTx = (currentTx: ITx) =>
  currentTx.egressT.find((el: IEgressIngressTx) => !el.txHashMay)?.value;

const getMainNode = (currentTx: ITx) => {
  let mainNode: IMainNode = {
    name: currentTx.tx.hash,
    value: currentTx.tx.hash,
    hash: currentTx.tx.hash,
    category: `${currentTx.tx.hash}`,
    outSum: lovelacesToAda(Number(currentTx.tx.outSum)),
    txValue: Number(currentTx.tx.outSum),
    size: currentTx.tx.size,
    fee: currentTx.tx.fee,
    blockId: currentTx.tx.blockId,
    label: {
      show: false,
    },
    symbolSize: 10,
  };

  if (currentTx.egressT.some((el: IEgressIngressTx) => el.txHashMay === null)) {
    mainNode["unspentTx"] = addUnspentTx(currentTx);
  }

  return mainNode;
};

const getMainCategory = (currentTx: ITx) => ({ name: currentTx.tx.hash });

const getIngressCategory = (currentTx: ITx) =>
  currentTx.ingressT.length !== 0 && {
    name: `Ing${currentTx.tx.hash}`,
  };

const getEgressCategory = (currentTx: ITx) => ({
  name: `Egr${currentTx.tx.hash}`,
});

const getIngressNodes = (currentTx: ITx) => {
  return currentTx.ingressT.map((el: IEgressIngressTx) => ({
    name: el.txHash,
    value: el.txHash,
    category: `Ing${currentTx.tx.hash}`,
    txValue: el.value,
    label: {
      show: false,
    },
    symbolSize: 10,
  }));
};

const getEgressNodes = (currentTx: ITx) => {
  return currentTx.egressT
    .filter((el: IEgressIngressTx) => !!el.txHashMay)
    .map(
      (el: IEgressIngressTx) =>
        el.txHashMay && {
          name: `Egr${el.txHashMay}`, // TODO: to be changed to egress tx and not this string literal after backend update
          value: el.txHashMay,
          category: `Egr${currentTx.tx.hash}`,
          txValue: el.value,
          label: {
            show: false,
          },
          symbolSize: 10,
        }
    );
};

const getIngressLinks = (currentTx: ITx) => {
  return currentTx.ingressT.map((el: IEgressIngressTx) => ({
    source: `${el.txHash}`,
    target: `${currentTx.tx.hash}`,
    symbol: ["none", "arrow"],
  }));
};

const getEgressLinks = (currentTx: ITx) => {
  return currentTx.egressT
    .filter((el: IEgressIngressTx) => !!el.txHashMay) // filtering for unspent egress tx that are shown in the main node
    .map(
      (el: IEgressIngressTx) =>
        el.txHashMay && {
          source: `${currentTx.tx.hash}`,
          target: `Egr${el.txHashMay}`,
          symbol: ["none", "arrow"],
        }
    );
};

//@ts-ignore
const createGraphData = (tx) => {
  // nodes
  const ingressNodes = getIngressNodes(tx);
  const mainNode = getMainNode(tx);
  const egressNodes = getEgressNodes(tx);

  //links
  const ingressLinks = getIngressLinks(tx);
  const egressLinks = getEgressLinks(tx);

  // categories
  const ingressCategory = getIngressCategory(tx);
  const mainCategory = getMainCategory(tx);
  const egressCategory = getEgressCategory(tx);

  return {
    type: "force",
    categories: [ingressCategory, mainCategory, egressCategory],
    nodes: [...ingressNodes, mainNode, ...egressNodes],
    links: [...egressLinks, ...ingressLinks],
  };
};

const SearchHash = () => {
  const [txHash, setTxHash] = useState("");
  const [graphData, setGraphData] = useState({
    type: "force",
    categories: [],
    nodes: [],
    links: [],
  });

  const displayNewTx = async (node: INode) => {
    console.log(node);

    let currentGraph = { ...graphData };

    //@ts-ignore
    if (node.data.category !== node.data.value) {
      // check that a main node has not been clicked
      //@ts-ignore
      await getSocketRes(node.value).then((res) => {
        console.log(`res ->`, res);

        const ingressNodes = getIngressNodes(res);
        const mainNode = getMainNode(res);

        const ingressLinks = getIngressLinks(res);

        const ingressCategory = getIngressCategory(res);
        const mainCategory = getMainCategory(res);

        const currentGraphWithoutNode = currentGraph.nodes.filter(
          //@ts-ignore
          (el) => el.name !== res.tx.hash
        );

        //@ts-ignore
        currentGraph.nodes = [
          ...currentGraphWithoutNode,
          mainNode,
          ...ingressNodes,
        ];
        currentGraph.categories = [
          //@ts-ignore
          ...currentGraph.categories,
          //@ts-ignore
          ingressCategory,
          //@ts-ignore
          mainCategory,
        ];
        //@ts-ignore
        currentGraph.links = [...currentGraph.links, ...ingressLinks];

        console.log(currentGraph);

        setGraphData(currentGraph);
      });
    }
  };

  //@ts-ignore
  const handleSubmit = async (e) => {
    e.preventDefault();
    setTxHash(e.target[0].value);

    //@ts-ignore
    await getSocketRes(txHash).then((res) => {
      const tempGraph = createGraphData(res);
      //@ts-ignore
      setGraphData(tempGraph);
    });
  };

  return (
    <section className="flex flex-col">
      <div className="flex justify-center mt-8">
        <form
          className="flex justify-center rounded-lg bg-indigo-100 shadow-2xl p-5 w-5/12 relative z-10"
          onSubmit={handleSubmit}
        >
          <input
            className="border-indigo-300 border-b-2 rounded-lg text-indigo-900 flex-grow pl-5 p-2 text-sm
                      focus:outline-none focus:border-indigo-600 shadow-xl truncate overflow-clip"
            type="text"
            value={txHash}
            placeholder="Transaction Hash"
            onChange={(e) => setTxHash(e.target.value)}
          />
          <button className="bg-indigo-600 w-24 rounded-lg ml-5 border-indigo-300 text-gray-100 shadow-2xl">
            Search
          </button>
        </form>
      </div>
      {graphData.nodes.length !== 0 && (
        <Graph graphData={graphData} onClick={displayNewTx} />
      )}
    </section>
  );
};

export default SearchHash;
