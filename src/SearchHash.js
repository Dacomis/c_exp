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
    <div className="relative flex justify-center mt-60 w-1/3 rounded-lg shadow-lg bg-gray-100">
      <form className="flex flex-col justify-center" onSubmit={handleSubmit}>
        <input
          type="text"
          value={txHash}
          onChange={(e) => setTxHash(e.target.value)}
        />
        <button>Submit</button>
      </form>
      {transactions[0] && <TxsGraph tx={transactions} />}
    </div>
  );
};

export default SearchHash;

// class="w-full px-2 pb-1.5 text-primary outline-none text-base font-light rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
// class="hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
