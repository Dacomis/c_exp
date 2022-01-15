const SOCKET_URL = "ws://localhost:9000/";
let socketPromise: any;

const hexToBytes = (hex: string): number[] => {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};

const getSocket = () => {
  if (socketPromise) {
    return socketPromise;
  }

  socketPromise = new Promise(function (resolve, reject) {
    let socket = new WebSocket(SOCKET_URL);

    socket.onopen = function () {
      resolve(socket);
    };
    socket.onerror = function (err) {
      reject(err);
    };
  });
  
  return socketPromise;
};

let getSocketRes = (txHash: string) => {
  let msg = new Uint8Array(hexToBytes(txHash)).buffer;

  return getSocket()
    .then((server: any) => {
      server.send(msg);

      return new Promise(function (resolve, reject) {
        server.addEventListener("message", function (event: any) {
          let textData = event.data.text();

          textData.then((res: any) => {
            let resultJSON = JSON.parse(res);

            // TODO: to also add address
            if (resultJSON.tx.hash === txHash) {
              resolve(resultJSON);
            }
          });
        });
      });
    })
    .catch((err: any) => console.error(err));
};
console.log(socketPromise);


export default getSocketRes;
