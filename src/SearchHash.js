import { useState } from "react";
import TxsGraph from "./TxsGraph";

const SearchHash = () => {
  const [txHash, setTxHash] = useState("");
  const [transactions, setTransactions] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    setTxHash(e.target[0].value);

    fetchTxWithEgressAndIngress(txHash);
  };

  // constructs the ingress or egress objects based on the fetch by txHash
  const constructTxIngressOrEgress = (tx, ingressOrEgress) => {
    if (tx[0] && tx[0][ingressOrEgress]) {
      for (let key in tx[0][ingressOrEgress]) {
        fetch(
          `http://localhost:8000/transactions?hash=${tx[0][ingressOrEgress][key]}`
        )
          .then((res) => res.json())
          .then((data) => (tx[0][ingressOrEgress][key] = data));
      }
    }
  };

  const fetchTxWithEgressAndIngress = (hash) => {
    fetch(`http://localhost:8000/transactions?hash=${hash}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data);

        constructTxIngressOrEgress(transactions, "ingress");
        constructTxIngressOrEgress(transactions, "egress");
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
      {transactions[0] && <TxsGraph tx={transactions} />}
    </section>
  );
};

export default SearchHash;
