import { ITx } from "../interfaces/ITx";

const SOCKET_URL = "ws://localhost:9000/";
let socketPromise: Promise<WebSocket>;

const hexToBytes = (hex: string): number[] => {
  let bytes = [];
  for (let c = 0; c < hex.length; c += 2) {
    bytes.push(parseInt(hex.substr(c, 2), 16));
  }
  return bytes;
};

const getSocket = (): Promise<WebSocket> => {
  if (socketPromise) {
    return socketPromise;
  }

  socketPromise = new Promise(function (resolve, reject) {
    let socket = new WebSocket(SOCKET_URL);

    socket.onopen = function (): void {
      resolve(socket);
    };
    socket.onerror = function (err): void {
      reject(err);
    };
  });

  return socketPromise;
};

let getSocketRes = async (txHash: string): Promise<ITx> => {
  let msg = new Uint8Array(hexToBytes(txHash)).buffer;
  let server: WebSocket;

  try {
    server = await getSocket();
    server.send(msg);
  } catch (err) {
    throw err;
  }

  return new Promise(function (resolve, reject) {
    const timeoutRemoveEL = setTimeout(() => {
      server.removeEventListener("message", checkData);
      reject(new Error("err"));
    }, 5000);

    function checkData(event: any): void {
      let textData = event.data.text();

      textData.then((res: any) => {
        if (res === "null") {
          server.removeEventListener("message", checkData);
          clearTimeout(timeoutRemoveEL);
          return reject(new Error("Inexistent tx hash"));
        }

        let resultJSON: any = JSON.parse(res);
        let txResult: ITx = resultJSON as ITx;

        // TODO: req send unique number/ string
        // TODO: to also add address
        if (resultJSON.tx.hash === txHash) {
          server.removeEventListener("message", checkData);

          clearTimeout(timeoutRemoveEL);
          resolve(txResult);
        }
      });
    }

    server.addEventListener("message", checkData);
  });
};

export default getSocketRes;
