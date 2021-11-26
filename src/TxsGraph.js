import { useRef } from "react";
// Check out the library doc: https://github.com/flavioschneider/graphire
import { Graph, useNode, useLink } from "graphire";

export default function TxsGraph(transactions) {
  console.log(`inside TxGraph`, transactions.tx[0]);

  const randomIntFromInterval = (min, max) => {
    // min and max included
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  return (
    <div className="m-auto w-10/12 bg-indigo-900 rounded-lg -mt-8 shadow-2xl opacity-80">
      <svg className="opacity-100" style={{ width: "90vw", height: "70vh" }}>
        <Graph>
          <g id="nodes">
            {/* Main node - of which the hash is being searched for*/}
            <Node
              uid={transactions.tx[0].hash}
              x={400}
              y={200}
              color="#e67e22"
              hash={`2`}
            />
            {/* Ingress Nodes */}
            {Object.keys(transactions.tx[0].ingress).map((key) => {
              console.log(`ingress ${key}`, transactions.tx[0].ingress[key]);
              return (
                <Node
                  uid={transactions.tx[0].ingress[key]}
                  x={randomIntFromInterval(500, 800)}
                  y={randomIntFromInterval(50, 500)}
                  color="#2ecc71"
                  hash={`3`}
                />
              );
            })}
            {/* Egress Nodes */}
            {Object.keys(transactions.tx[0].egress).map((key) => {
              console.log(`egress ${key}`, transactions.tx[0].egress[key]);
              return (
                <Node
                  uid={transactions.tx[0].egress[key]}
                  x={randomIntFromInterval(50, 300)}
                  y={randomIntFromInterval(50, 500)}
                  color="#3498db"
                  hash={`3`}
                />
              );
            })}
          </g>

          {/* Ingress Links */}
          {Object.keys(transactions.tx[0].ingress).map((key) => {
            return (
              <Link
                source={transactions.tx[0].hash}
                target={transactions.tx[0].ingress[key]}
              />
            );
          })}
          {/* Egress Links */}
          {Object.keys(transactions.tx[0].egress).map((key) => {
            return (
              <Link
                source={transactions.tx[0].egress[key]}
                target={transactions.tx[0].hash}
              />
            );
          })}
          <use href="#nodes" />
        </Graph>
      </svg>
    </div>
  );
}

// TODO: Extract in separate file
const Node = (props) => {
  const {
    color = "black",
    radius = 5,
    id,
    blockId,
    blockIdx,
    outsum,
    fee,
    size,
    indeg,
    outdeg,
    ...rest
  } = props;
  const ref = useRef();
  useNode(([cx, cy]) => {
    ref.current.setAttribute("cx", cx);
    ref.current.setAttribute("cy", cy);
  }, rest);
  return (
    <circle
      ref={ref}
      cx="0"
      cy="0"
      r={radius}
      fill={color}
      id={id}
      blockid={blockId}
      blockidx={blockIdx}
      outsum={outsum}
      fee={fee}
      size={size}
      indeg={indeg}
      outdeg={outdeg}
    />
  );
};

// TODO: Extract in separate file
const Link = (props) => {
  const { source, target, color = "#e0e7ff", ...rest } = props;
  const ref = useRef();

  useLink(
    ([x1, y1], [x2, y2]) => {
      ref.current.setAttribute("x1", x1);
      ref.current.setAttribute("y1", y1);
      ref.current.setAttribute("x2", x2);
      ref.current.setAttribute("y2", y2);
    },
    source,
    target,
    rest
  );
  return (
    <line
      ref={ref}
      x1="0"
      y1="0"
      x2="0"
      y2="0"
      stroke={color}
      strokeWidth={1}
    />
  );
};
