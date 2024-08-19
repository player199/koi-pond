import { createSignal } from "solid-js";
import koi from "./assets/koi.png";
import { listen } from "@tauri-apps/api/event";
import "./App.css";

function App() {
  let koiRef: HTMLDivElement;

  type Position = {
    x: number;
    y: number;
  };

  const homePosition = { x: 0, y: 0 };

  const [position, setPosition] = createSignal(homePosition);
  const [direction, setDirection] = createSignal(0);

  listen<Position>("mouse_click", (event) => {
    if (sendHome(event.payload)) return;

    calculateDirection(position(), event.payload);
    setPosition(event.payload);
  });

  const sendHome = (clickPosition: Position) => {
    if (!koiRef) return false;

    const boundingBox = koiRef.getBoundingClientRect();
    if (!boundingBoxIsClicked(boundingBox, clickPosition)) return false;

    calculateDirection(position(), homePosition);
    setPosition(homePosition);
    return true;
  };

  const boundingBoxIsClicked = (
    boundingBox: DOMRect,
    clickPosition: Position
  ) => {
    const { x, y } = clickPosition;

    return (
      x > boundingBox.left &&
      x < boundingBox.right &&
      y > boundingBox.top &&
      y < boundingBox.bottom
    );
  };

  const calculateDirection = (oldPosition: Position, newPosition: Position) => {
    const x = oldPosition.x - newPosition.x;
    const y = oldPosition.y - newPosition.y;
    let angle = (Math.atan2(y, x) * 180) / Math.PI;

    if (angle < 0) angle = 360 + angle;
    setDirection(angle);
  };

  const calculateStyle = (position: Position, direction: number) => {
    return `position: absolute; left: ${position.x - 50}px; top: ${
      position.y - 80
    }px; 
    animation-timing-function: ease-in-out;
    transition: top 1.5s, left 1.5s, transform 0.5s;
    transform: rotate(${direction}deg);
  `;
  };

  return (
    <div class="container">
      <div style={calculateStyle(position(), direction())} ref={koiRef}>
        <img class="koi" width={100} src={koi} />
      </div>
    </div>
  );
}

export default App;
