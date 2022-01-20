import { useState } from "react";
import Graph from "./Graph";
import { ICategory } from "./interfaces/ICategory";
import { IEgressIngressTx } from "./interfaces/IEgressIngressTx";
import { IGraph } from "./interfaces/IGraph";
import { ILink } from "./interfaces/ILink";
import { IMainNode } from "./interfaces/IMainNode";
import { INode } from "./interfaces/INode";
import { ITx } from "./interfaces/ITx";
import { addUnspentTx } from "./utils/utils";

const getMainNode = (currentTx: ITx): IMainNode => {
  let mainNode: IMainNode = {
    name: currentTx.tx.hash,
    value: currentTx.tx.hash,
    hash: currentTx.tx.hash,
    category: `${currentTx.tx.hash}`,
    outSum: currentTx.tx.outSum,
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

const getMainCategory = (currentTx: ITx): ICategory => ({
  name: currentTx.tx.hash,
});

const getIngressCategory = (currentTx: ITx): ICategory | false =>
  currentTx.ingressT.length !== 0 && {
    name: `Ing${currentTx.tx.hash}`,
  };

const getEgressCategory = (currentTx: ITx): ICategory => ({
  name: `Egr${currentTx.tx.hash}`,
});

const getIngressNodes = (currentTx: ITx): INode[] => {
  return currentTx.ingressT.map(
    (el: IEgressIngressTx) =>
      ({
        name: el.txHash,
        value: el.txHash,
        category: `Ing${currentTx.tx.hash}`,
        txValue: el.value,
        label: {
          show: false,
        },
        symbolSize: 10,
      } as INode)
  );
};

const getEgressNodes = (currentTx: ITx): (INode | null | undefined | "")[] => {
  return currentTx.egressT
    .filter((el: IEgressIngressTx) => !!el.txHashMay)
    .map(
      (el: IEgressIngressTx) =>
        el.txHashMay &&
        ({
          name: `Egr${el.txHashMay}`, // TODO: to be changed to egress tx and not this string literal after backend update
          value: el.txHashMay,
          category: `Egr${currentTx.tx.hash}`,
          txValue: el.value,
          label: {
            show: false,
          },
          symbolSize: 10,
        } as INode)
    );
};

const getIngressLinks = (currentTx: ITx): ILink[] => {
  return currentTx.ingressT.map(
    (el: IEgressIngressTx) =>
      ({
        source: `${el.txHash}`,
        target: `${currentTx.tx.hash}`,
        symbol: ["none", "arrow"],
      } as ILink)
  );
};

const getEgressLinks = (currentTx: ITx): (ILink | null | undefined | "")[] => {
  return currentTx.egressT
    .filter((el: IEgressIngressTx) => !!el.txHashMay) // filtering for unspent egress tx that are shown in the main node
    .map(
      (el: IEgressIngressTx) =>
        el.txHashMay &&
        ({
          source: `${currentTx.tx.hash}`,
          target: `Egr${el.txHashMay}`,
          symbol: ["none", "arrow"],
        } as ILink)
    );
};

const createGraphData = (tx: ITx): IGraph => {
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
    categories: [ingressCategory, mainCategory, egressCategory],
    links: [...egressLinks, ...ingressLinks],
    nodes: [...ingressNodes, mainNode, ...egressNodes],
    type: "force",
  } as IGraph;
};

const SearchHash = (): JSX.Element => {
  const [txHash, setTxHash] = useState("");
  const [graphData, setGraphData] = useState({
    type: "force",
    categories: [],
    nodes: [],
    links: [],
  } as IGraph);

  const fetchTxWithEgressAndIngress = (hash: string) => {
    fetch(`http://localhost:8000/transactions?hash=${hash}`)
      .then((res) => res.json())
      .then((data) => {
        let tx = data.filter((el: any) => el.tx.hash === hash)[0];

        const tempGraph = createGraphData(tx);
        setGraphData(tempGraph);
      });
  };

  const constructNewGraph = (hash: string) => {
    fetch(`http://localhost:8000/transactions?hash=${hash}`)
      .then((res) => res.json())
      .then((data) => {
        let currentGraph = { ...graphData };

        let tx = data.filter((el: any) => el.tx.hash === hash)[0];

        const ingressNodes = getIngressNodes(tx);
        const mainNode = getMainNode(tx);

        const ingressLinks = getIngressLinks(tx);

        const ingressCategory = getIngressCategory(tx);
        const mainCategory = getMainCategory(tx);

        // all the nodes in the current graph without the last node that has been searched for
        const currentGraphWithoutNode: INode[] = currentGraph.nodes.filter(
          (el: INode) => el.name !== tx.tx.hash
        );

        currentGraph.nodes = [
          ...currentGraphWithoutNode,
          mainNode,
          ...ingressNodes,
        ] as INode[] | IMainNode[];

        currentGraph.categories = [
          ...currentGraph.categories,
          ingressCategory,
          mainCategory,
        ] as ICategory[];

        currentGraph.links = [
          ...currentGraph.links,
          ...ingressLinks,
        ] as ILink[];

        setGraphData(currentGraph);
      });
  };

  const displayNewTx = async (node: INode): Promise<void> => {
    if (node.category !== node.value) {
      // check that a main node has not been clicked
      constructNewGraph(node.value);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent): Promise<void> => {
    e.preventDefault();

    const target = e.target as typeof e.target & [{ value: string }];
    setTxHash(target[0].value);

    fetchTxWithEgressAndIngress(txHash);
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
