# Mimir - The Visual Cardano Explorer

With this project you can search Search by Transaction Hash the transactions in the Cardano blockchain and the result will be displayed in a graph.

This project is a `WIP` and communicates with a Cardano node as a backend through WebSockets. To emulate this behavior, change the branch to `json_server` and run `npm start`. This branch uses a json_server. Type in `6e17987f6507597b2032d6645787d7c9bbd1b86144335adc0cf7a78c5c221682` and click on the blue nodes aka Ingress Nodes. The egress functionality is in development.

## To Start the Project

### `npm i`

Install the dependencies.
This project uses TailwindCSS which requires node 12+.

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

This project uses TailwindCSS which requires node 12+.

### `npx json-server --watch db.json --port 8000`

Open the mock db [http://localhost:8000/transactions](http://localhost:8000/transactions) to view the available transactions you can search by. Any other transactions hash than the ones in this database and the display of the graph won't work/

### TODO:

- on node click get ingress tx;
- resolve legend issue;
- on input search issue;
- on click ease the animation of the creation of the graph;
- finish update to TS;
- tooltip on the right;
- i18n on buttons and text (Mandarin)
