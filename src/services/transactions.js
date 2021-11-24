// fetch one tx by hash
// export const fetchTx = (hash) => {
//   fetch(`http://localhost:8000/transactions?hash=${hash}`)
//     .then((res) => res.json())
//     .then((data) => {
//       setTransactions(data);
//       console.log(transactions);
//     });
// };

// // constructs the ingress or egress objects based on the fetch by txHash
// export const constructTxIngressOrEgress = (tx, ingressOrEgress) => {
//   if (tx[0][ingressOrEgress]) {
//     for (let key in tx[0][ingressOrEgress]) {
//       fetch(
//         `http://localhost:8000/transactions?hash=${tx[0][ingressOrEgress][key]}`
//       )
//         .then((res) => res.json())
//         .then((data) => (tx[0][ingressOrEgress][key] = data));
//     }
//   }
// };

// export const fetchTxWithEgressAndIngress = (hash) => {
//   fetch(`http://localhost:8000/transactions?hash=${hash}`)
//     .then((res) => res.json())
//     .then((data) => {
//       setTransactions(data);

//       constructTxIngressOrEgress(transactions, "ingress");
//       constructTxIngressOrEgress(transactions, "egress");

//       console.log(transactions[0]);
//     });
// };
