import { Connection } from './utils/classes/Connection';
import { ConnectionSlots } from './utils/classes/ConnectionSlots';
import { getMaxDocumentHeight } from './utils/get-max-document-height';
import { getSides } from './utils/get-sides';
import { uniqueID } from './utils/id';
import { isOverlapping } from './utils/is-overlapping';
import { waitForFrame } from './utils/wait';

import './style.css';

const boxes = [...document.querySelectorAll('.box')];
const canvasElement = document.getElementById('ctt-svg');
const bodyElement = document.querySelector('body');
const connections = new Map<string, Connection>();

export type ConnectionDefinition = {
  startElement: HTMLElement;
  stopElement: HTMLElement;
};

// eslint-disable-next-line import/no-unused-modules
export const createConnections = async (
  connectionDefinitions: ConnectionDefinition[]
) => {
  if (!canvasElement || !bodyElement) return;

  setCanvasHeight();
  clearAnchors();
  connections.clear(); // Clear previous ones

  const pathFragment = document.createDocumentFragment();
  const anchorFragment = document.createDocumentFragment();

  for (const data of connectionDefinitions) {
    const { startElement, stopElement } = data;

    if (!startElement || !stopElement) break;

    const connection = await createConnection(
      startElement,
      stopElement,
      pathFragment,
      anchorFragment
    );
    const key = `${getElementID(startElement)}-${getElementID(stopElement)}`;

    connections.set(key, connection);
  }

  canvasElement.appendChild(pathFragment);
  bodyElement.appendChild(anchorFragment);
};

if (!canvasElement || !bodyElement) {
  throw Error(
    'Missing required SVG element to draw lines. Please see the documentation'
  );
}

const getElementID = (el: HTMLElement) => {
  if (!el.id) el.id = uniqueID();

  return el.id;
};
const connectionSlots = new ConnectionSlots();
const clearAnchors = () => {
  document.querySelectorAll('.anchor').forEach((el) => el.remove());
};
const createConnection = async (
  startElement,
  stopElement,
  pathFragment,
  anchorFragment
) => {
  // // If the boxes overlap, they are too close to be connected
  // const collision = await isOverlapping(startElement, stopElement);

  // if (collision) return;

  const { pos1, pos2 } = await getSides(startElement, stopElement);

  return new Connection({
    startElement,
    stopElement,
    connectionSlots,
    pos1,
    pos2
  });

  // connectionSlots.register(startElement, pos1, connection);
  // connectionSlots.register(stopElement, pos2, connection);

  // await connection.connect();

  // pathFragment.appendChild(connection.pathElement as SVGPathElement);

  // anchorFragment.appendChild(connection.startAnchor.element);
  // anchorFragment.appendChild(connection.stopAnchor.element);
};
const setCanvasHeight = async () => {
  if (canvasElement) {
    const height = await getMaxDocumentHeight();

    await waitForFrame();
    Object.assign(canvasElement.style, {
      height: `${height}px`
    });
  }
};

setCanvasHeight();
// createConnections();

// //give resizing time to happen
// let raf: number;

// window.addEventListener('resize', () => {
//   if (raf) window.cancelAnimationFrame(raf);

//   raf = requestAnimationFrame(async () => {
//     await setCanvasHeight();

//     connections.forEach(async (connection) => {
//       await connection.update();
//     });
//   });
// });
