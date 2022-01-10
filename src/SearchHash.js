import { useState } from "react";
import EGraph from "./graph";
import getSocketRes from "./services/WebSocketService";

const lovelacesToAda = (lovelaces) => `${lovelaces / 1000000} ₳`;

const addUnspentTx = (currentTx) => {
  return { unspentTx: currentTx.egressT.find((el) => !el.txHashMay).value };
};

const getMainNode = (currentTx) => {
  let mainNode = {
    name: currentTx.tx.hash,
    value: currentTx.tx.hash,
    category: `${currentTx.tx.hash}`,
    outSum: lovelacesToAda(currentTx.tx.outSum),
    size: currentTx.tx.size,
    fee: currentTx.tx.fee,
    blockId: currentTx.tx.blockId,
    label: {
      show: false,
    },
    symbolSize: 10,
  };

  if (currentTx.egressT.some((el) => el.txHashMay === null)) {
    mainNode["unspentTx"] = addUnspentTx(currentTx);
  }

  return mainNode;
};

const getMainCategory = (currentTx) => ({ name: currentTx.tx.hash });

const getIngressCategory = (currentTx) =>
  currentTx.ingressT.length !== 0 && {
    name: `Ing${currentTx.tx.hash}`,
  };

const getEgressCategory = (currentTx) => ({
  name: `Egr${currentTx.tx.hash}`,
});

const getIngressNodes = (currentTx) => {
  return currentTx.ingressT.map((el) => ({
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

const getEgressNodes = (currentTx, graph) => {
  return currentTx.egressT
    .filter((el) => !!el.txHashMay)
    .map(
      (el) =>
        el.txHashMay && {
          name: `Egr${el.txHashMay}`,
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

const getIngressLinks = (currentTx) => {
  return currentTx.ingressT.map((el) => ({
    source: `${el.txHash}`,
    target: `${currentTx.tx.hash}`,
    symbol: ["none", "arrow"],
  }));
};

const getEgressLinks = (currentTx) => {
  return currentTx.egressT
    .filter((el) => !!el.txHashMay)
    .map(
      (el) =>
        el.txHashMay && {
          source: `${currentTx.tx.hash}`,
          target: `Egr${el.txHashMay}`,
          symbol: ["none", "arrow"],
        }
    );
};

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

  const displayNewTx = async (node) => {
    console.log(node);

    let currentGraph = { ...graphData };

    if (node.data.category !== node.data.value) {
      // check that a main node has not been clicked
      await getSocketRes(node.value).then((res) => {
        console.log(`res ->`, res);

        const ingressNodes = getIngressNodes(res);
        const mainNode = getMainNode(res);

        const ingressLinks = getIngressLinks(res);

        const ingressCategory = getIngressCategory(res);
        const mainCategory = getMainCategory(res);

        const currentGraphWithoutNode = currentGraph.nodes.filter(
          (el) => el.name !== res.tx.hash
        );

        currentGraph.nodes = [
          ...currentGraphWithoutNode,
          mainNode,
          ...ingressNodes,
        ];
        currentGraph.categories = [
          ...currentGraph.categories,
          ingressCategory,
          mainCategory,
        ];
        currentGraph.links = [...currentGraph.links, ...ingressLinks];

        console.log(currentGraph);

        setGraphData(currentGraph);
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTxHash(e.target[0].value);

    await getSocketRes(txHash).then((res) => {
      const tempGraph = createGraphData(res);

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
        <EGraph graphData={graphData} onClick={displayNewTx} />
      )}
    </section>
  );
};

export default SearchHash;
