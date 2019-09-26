import React, { useState, useEffect, useRef } from "react";
import "./App.css";

var colorlist = [
  "#E1000E",
  "#F28B09",
  "#F9EC14",
  "#9AFC13",
  "#21FE6E",
  "#23FBF6",
  "#19A1F1",
  "#200DF3",
  "#9400F3",
  "#EC02CB",
  "#F48BC3"
];
var gameData = {
  total: 10,
  addPerRev: 0,
  ringlist: []
};

function App() {
  initializeGameData();
  return (
    <div style={{ background: "black" }}>
      <Upgrades />
      <Circles delay={50} />
    </div>
  );
}

function initializeGameData() {
  for (let index = 0; index < 11; index++) {
    gameData.ringlist[index] = {
      rps: 0,
      row: index + 1,
      cost: Math.pow(10, index + 1),
      color: colorlist[index],
      percentage: 0,
      revolutions: 0,
      rpsIncrement: 0.6 / (index + 1),
      costMultiplier: 1.1,
      ascentions: 0
    };
  }
}

const Button = props => {
  const element = props.element;
  const [cost, setcost] = useState(element.cost);
  if (cost < 1000) {
    return (
      <button
        style={{ background: element.color }}
        onClick={() => {
          if (element.cost <= gameData.total) {
            gameData.total -= element.cost;
            element.cost = element.cost * element.costMultiplier;
            element.rps = element.rps + element.rpsIncrement;
            setcost(element.cost.toFixed(2));
          }
        }}
      >
        {element.row}
        <br />
        {element.cost.toFixed(2)}
      </button>
    );
  } else {
    return (
      <button
        style={{ background: element.color }}
        onClick={() => {
          if (element.cost <= gameData.total) {
            gameData.total -= element.cost;
            element.cost = Math.round(element.cost * element.costMultiplier);
            element.rps = element.rps + element.rpsIncrement;
            setcost(element.cost);
          }
        }}
      >
        {element.row}
        <br />
        {element.cost.toExponential(2).replace("+", "")}
      </button>
    );
  }
};

const Upgrades = props => {
  const elements = [];
  for (let index = 0; index < gameData.ringlist.length; index++) {
    const element = gameData.ringlist[index];
    elements.push(<Button element={element} />);
  }
  /*
  Object.keys(gameData.ringlist).forEach(ring => {
    elements.push(
    <button style={{background: gameData.rings[ring].color}} onClick={() => {
      gameData.rings[ring].rps = gameData.rings[ring].rps + gameData.rings[ring].rpsIncrement
      }}>
      {ring}
    </button>
      );
      
  });
  */
  return <div className="test">{elements}</div>;
};

const Circles = ({ delay }) => {
  const [elements, setElements] = useState([]);
  const [mathstring, setmathstring] = useState(colorlist => {
    let elements = [];
    gameData.ringlist.forEach(element => {
      if (element.row !== gameData.ringlist.length) {
        elements.push(
          <React.Fragment>
            <span style={{ color: element.color }}>
              {"1.00"}
            </span>
            {" x "}
          </React.Fragment>
        );
      } else {
        elements.push(
          <React.Fragment>
            <span style={{ color: element.color }}>
              {"1.00"}
            </span>
          </React.Fragment>
        );
      }
    });
    elements.push(
      <React.Fragment>
        {" "}
        = 1.00 per revolution
      </React.Fragment>
    );
    return (elements);});
  useInterval(() => {
    let tmpelements = [];
    for (let index = 0; index < gameData.ringlist.length; index++) {
      const element = gameData.ringlist[index];
      element.percentage += (element.rps * delay) / 10;
      if (element.percentage >= 100) {
        element.revolutions += Math.floor(element.percentage / 100);
        element.percentage %= 100;
        gameData.addPerRev = 1;
        let tmpmathelements = [];
        gameData.ringlist.forEach(element => {
          if (element.row !== gameData.ringlist.length) {
            tmpmathelements.push(
              <React.Fragment>
                <span style={{ color: element.color }}>
                  {(1 + element.revolutions * 0.01).toFixed(2)}
                </span>
                {" x "}
              </React.Fragment>
            );
          } else {
            tmpmathelements.push(
              <React.Fragment>
                <span style={{ color: element.color }}>
                  {(1 + element.revolutions * 0.01).toFixed(2)}
                </span>
              </React.Fragment>
            );
          }
          gameData.addPerRev *= 1 + element.revolutions * 0.01;
        });
        if (gameData.addPerRev > 1000) {
          tmpmathelements.push(
            <React.Fragment>
              {" "}
              = {gameData.addPerRev.toExponential(2).replace("+", "")} per
              revolution
            </React.Fragment>
          );
        } else {
          tmpmathelements.push(
            <React.Fragment>
              {" "}
              = {gameData.addPerRev.toFixed(2)} per revolution
            </React.Fragment>
          );
        }
        setmathstring(tmpmathelements);
        gameData.total += gameData.addPerRev;
      }
      if (element.rps < 10) {
        tmpelements.push(
          <DrawCircle
            percentage={element.percentage}
            color={element.color}
            row={element.row}
          />
        );
      } else {
        tmpelements.push(
          <DrawCircle
            percentage={100}
            color={element.color}
            row={element.row}
          />
        );
      }
    }
    setElements(tmpelements);
  }, delay);
  if (gameData.total > 1000) {
    return (
      <div>
        <h2>{mathstring}</h2>
        <h1>{gameData.total.toExponential(2).replace("+", "")}</h1>
        <div>{elements}</div>
      </div>
    );
  } else {
    return (
      <div>
        <h2>{mathstring}</h2>
        <h1>{gameData.total.toFixed(2)}</h1>
        <div>{elements}</div>
      </div>
    );
  }
};

const DrawCircle = props => {
  const strokeWidthNum = 10;
  // Size of the enclosing square
  const sqSize = 20 + props.row * strokeWidthNum * 2.5;
  // SVG centers the stroke width on the radius, subtract out so circle fits in square
  const radius = (sqSize - strokeWidthNum) / 2;
  // Enclose cicle in a circumscribing square
  const viewBox = `0 0 ${sqSize} ${sqSize}`;
  // Arc length at 100% coverage is the circle circumference
  const dashArray = radius * Math.PI * 2;
  // Scale 100% coverage overlay with the actual percent
  const dashOffset = dashArray - (dashArray * props.percentage) / 100;

  return (
    <svg
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        marginLeft: -sqSize / 2 + "px",
        marginTop: -sqSize / 2 + "px"
      }}
      width={sqSize}
      height={sqSize}
      viewBox={viewBox}
    >
      <circle
        className="circle-progress"
        cx={sqSize / 2}
        cy={sqSize / 2}
        r={radius}
        strokeWidth={`${strokeWidthNum}px`}
        // Start progress marker at 12 O'Clock
        transform={`rotate(-90 ${sqSize / 2} ${sqSize / 2})`}
        style={{
          strokeDasharray: dashArray,
          strokeDashoffset: dashOffset,
          stroke: props.color
        }}
      />
    </svg>
  );
};

// hook for creating interval
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest function.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export default App;
