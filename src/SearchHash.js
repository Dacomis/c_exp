import { useState } from "react";
import EGraph from "./graph";
import getSocketRes from "./services/WebSocketService";

const SearchHash = () => {
  const [txHash, setTxHash] = useState("");
  const [transactions, setTransactions] = useState({});

  // const example = {
  //   tx: {
  //     blockIdx: 0,
  //     hash: "6e17987f6507597b2032d6645787d7c9bbd1b86144335adc0cf7a78c5c221682",
  //     size: 466,
  //     fee: 218708,
  //     blockId: 157057,
  //     invalidHereafter: null,
  //     id: 44098,
  //     outSum: 22619875610222,
  //     deposit: 0,
  //     invalidBefore: null,
  //   },
  //   ingressT: [
  //     {
  //       value: 385505000000,
  //       addr: "DdzFFzCqrht4uUjnzfbJDzicc4x1kQ2mEsTT3poUSDDtdKGFrKsMBHd8iidrjQHhhEcjeKY5VGnErujCCfjEqXWp8e2aeY9mTQVxGssL",
  //       txHash:
  //         "463b51f4d9b19740da5ccb54025da3e4a406a51c04bb5b3a9065f34f34af69a2",
  //       txIdx: 0,
  //     },
  //     {
  //       value: 379414000000,
  //       addr: "DdzFFzCqrhsyk2yZ7TXysezs3Fbkda6TRMPYt1dWgzuYHMv8JHV4fwQr9kqcrBcgZc8ke4CYt1h5Z4JGZcCqnEofsP3UjpGLwEKCA7RB",
  //       txHash:
  //         "935a7892aa2dd481abcdb5fe41ea7b6d95047423b876eddf8058358293cf141c",
  //       txIdx: 0,
  //     },
  //     {
  //       value: 926997000000,
  //       addr: "DdzFFzCqrhshbhtJ5kzp4Mc67xMpF6TQGMhUMrLE5RVFaFRZKWJKwmU3W4uHxBdLJpJ5aUSpMMwK3b4sfb4qGQGzJReSZ8RWMLScr9aF",
  //       txHash:
  //         "232a69ea8b0439d893cc2d296026aacac329ae8963abe949d997333e04e9f7e6",
  //       txIdx: 0,
  //     },
  //     {
  //       value: 538861000000,
  //       addr: "DdzFFzCqrhsehuAU97soZ4uNKw6MoqRYd265qB22bu6ty7GnRLtGRsWwUth1kpS5AEfhSY9dhHSCb4WZQREtAqcWxg3PQFXsKW15TkeH",
  //       txHash:
  //         "353fc63cf007cde1a5ffb98eb3f88db40d82e77df056de818fb962826101d752",
  //       txIdx: 0,
  //     },
  //     {
  //       value: 1415034000000,
  //       addr: "DdzFFzCqrht5U1M8nJHVeNAMzc7ChnEoToFwEEFtyJJJikwKx3AfEFthC9f3Wc1ghJN4aiseVs9U76Shc7AktANMm5HRPYvu3Wp5jqWQ",
  //       txHash:
  //         "0b5cba9352a7d9c2a8341916b34b481db99e9a882bcd68ca46fc5aede40a54d1",
  //       txIdx: 0,
  //     },
  //     {
  //       value: 461144000000,
  //       addr: "DdzFFzCqrhszg6dedodcwyMr8TFS7wCuN8kPjEv6wmXZmZ1bLYqFGHD24nQimEiRCkfCGmLwwnwetPBh9m8LCiC2AzzQNnRSchJT3ZEo",
  //       txHash:
  //         "dcec257e21b4d78a66c1deb0461520ae6b541ff9effdb1095cd03a4c6d3afd7b",
  //       txIdx: 0,
  //     },
  //     {
  //       value: 18512920828930,
  //       addr: "DdzFFzCqrht52Jixi7XTEaDKZiNM9J1H7sgbrpsGeY4Kkmx4Q8gMJDWgA2AdygEeufV3ctVyQjWN3mKh7F2apbQDMpERThAUkGoWQA2w",
  //       txHash:
  //         "e34f4785655d758049939f226bf858a45d32c9dae2dd956356095d9cf32c5678",
  //       txIdx: 0,
  //     },
  //   ],
  //   egressT: [
  //     // {
  //     //   value: 10222,
  //     //   addr: "DdzFFzCqrhsxGudjSJbVwbR7hfBKJFmAtw64JmwQCqQK3yDVKyNV9z2iHdazMmJTCysjeBu1fmkFWiwE2YCKkyBhej2ktn6WgeyW6qyo",
  //     //   txHashMay: null,
  //     // },
  //     {
  //       value: 22619875600000,
  //       addr: "DdzFFzCqrhsnAnYhWdf2WTnZBH29inaqMSVisoaUKuXYHNeysYtRMzwdcWpKCr9M9c7QAMFxGKbbk2tkwrqtYGGq3bcWEYbAErkjNGKo",
  //       txHashMay:
  //         "6e17987f6507597b2032d6645787d7c9bbd1b86144335adc0cf7a78c5c221682",
  //     },
  //   ],
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTxHash(e.target[0].value);

    getSocketRes(txHash).then((res) => {
      setTransactions(res);
    });

    // setTransactions(example);
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
      {/* {transactions[0] && <TxsGraph tx={transactions} />} */}
      {transactions.tx && <EGraph tx={transactions} />}
    </section>
  );
};

export default SearchHash;
