const SOCKET_URL = "ws://localhost:9000/";
let socketPromise;

const hexToBytes = (hex) => {
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
      console.log(
        `socket connection is opened [state = ${socket.readyState} ]:  ${socket.url}`
      );
      resolve(socket);
    };
    socket.onerror = function (err) {
      reject(err);
    };
  });
  return socketPromise;
};

let getSocketRes = (txHash) => {
  let msg = new Uint8Array(hexToBytes(txHash)).buffer;

  return getSocket(txHash)
    .then((server) => {
      server.send(msg);

      return new Promise(function (resolve, reject) {
        server.addEventListener("message", function (event) {
          let textData = event.data.text();

          textData.then((res) => {
            let resultJSON = JSON.parse(res);

            // TODO: to also add address
            if (resultJSON.tx.hash === txHash) {
              resolve(resultJSON);
            }
          });
        });
      });
    })
    .catch((err) => console.log(err));
};

export default getSocketRes;
