/* eslint-disable import/no-unused-modules */
import { CoordinatesForBezierObjectType } from '../../types/bezier';
import { createBezierCurveCoordinates, getSVGPath } from '../bezier';
import { getAnchorPosition } from '../get-anchor-position';
import { getCoordsPairFromObjects } from '../get-coords-pair-from-objects';
import { getDirection } from '../get-direction';
import { uniqueID } from '../id';

import { ConnectionAnchor } from './ConnectionAnchor';
import { ConnectionSlots, type CTTSideType } from './ConnectionSlots';

export type CTTConnectionParamsType = {
  startElement: HTMLElement;
  stopElement: HTMLElement;
  connectionSlots: ConnectionSlots;
  pos1: CTTSideType;
  pos2: CTTSideType;
};

/**
 * Class representing a Connection instance.
 */
export class Connection {
  startElement: HTMLElement;
  stopElement: HTMLElement;
  startAnchor!: ConnectionAnchor;
  stopAnchor!: ConnectionAnchor;
  pathElement: SVGPathElement | null = null;
  bezierCoordinates: CoordinatesForBezierObjectType | null = null;
  startPos: { x: number; y: number } | null = null;
  stopPos: { x: number; y: number } | null = null;
  pos1: CTTSideType;
  pos2: CTTSideType;
  connectionSlots;

  /**
   * Creates a new Connection instance.
   * @param startElement - The starting element for the bracket.
   * @param stopElement - The ending element for the bracket.
   */
  constructor(params: CTTConnectionParamsType) {
    const { startElement, stopElement, connectionSlots, pos1, pos2 } = params;

    if (!startElement || !stopElement) {
      throw Error('Missing inputs startElement and stopElement');
    }

    if (!document.body.contains(stopElement)) {
      throw Error('stopElement is not in the DOM');
    }

    if (!document.body.contains(startElement)) {
      throw Error('startElement is not in the DOM');
    }

    this.startElement = startElement;
    this.stopElement = stopElement;
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.pathElement = this.#getPathElement();
    this.connectionSlots = connectionSlots;
  }

  /**
   * Creates a new path element based on the provided path.
   * @param path - The SVGPathElement to be used as the base path.
   * @throws Will throw an error if no path is provided.
   * @returns A new SVGPathElement.
   */
  #getPathElement() {
    const _id = uniqueID();
    const _path_el_id = `ctt_draw_path-path-${_id}`;
    // const _new_path = path.cloneNode(false) as SVGPathElement;
    const _new_path_element = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'path'
    );
    const dataStartElID = this.startElement.getAttribute('id') || uniqueID();
    const dataStopElID = this.stopElement.getAttribute('id') || uniqueID();

    _new_path_element.classList.add('ctt');
    _new_path_element.classList.add('path');
    _new_path_element.setAttribute('fill', 'none');
    _new_path_element.setAttribute('stroke-width', '1');
    _new_path_element.setAttribute('stroke', 'currentColor');
    _new_path_element.setAttribute('data-start-el', dataStartElID);
    _new_path_element.setAttribute('data-start-el', dataStopElID);
    _new_path_element.setAttribute('id', _path_el_id);

    this.startElement.setAttribute('id', dataStartElID);
    this.stopElement.setAttribute('id', dataStopElID);

    return _new_path_element;
  }
  async update() {
    await this.calculate();
    console.log('update');

    if (this.bezierCoordinates) {
      // Update anchor positions
      this.startAnchor.update(this.bezierCoordinates.firstPoint);
      this.stopAnchor.update(this.bezierCoordinates.lastPoint);
    }
  }

  async calculate() {
    if (!this.pathElement) throw Error('Missing pathElement');

    const _direction = await getDirection(this.startElement, this.stopElement);
    const startConnections = this.connectionSlots.slots.get(this.startElement)![
      this.pos1
    ];
    const stopConnections = this.connectionSlots.slots.get(this.stopElement)![
      this.pos2
    ];
    const startIndex = startConnections.indexOf(this);
    const stopIndex = stopConnections.indexOf(this);

    console.log('startConnections', startConnections);

    this.startPos = await getAnchorPosition(
      this.startElement,
      this.pos1,
      startIndex,
      startConnections.length
    );
    this.stopPos = await getAnchorPosition(
      this.stopElement,
      this.pos2,
      stopIndex,
      stopConnections.length
    );

    const coordPairs = await getCoordsPairFromObjects(
      this.startElement,
      this.stopElement,
      this.pos1,
      this.pos2
    );
    const adjustedCoordPairs = {
      x1: coordPairs.x1,
      x2: coordPairs.x2,
      y1: coordPairs.y1 + document.documentElement.scrollTop,
      y2: coordPairs.y2 + document.documentElement.scrollTop
    };

    this.bezierCoordinates = createBezierCurveCoordinates(
      adjustedCoordPairs,
      _direction
    );

    const _path_d = await getSVGPath({
      pos1: this.pos1,
      pos2: this.pos2,
      bezierCoordinates: this.bezierCoordinates,
      type: 'orthogonal'
    });

    this.pathElement.setAttribute('data-direction', _direction);
    this.pathElement.setAttribute('data-pos1', this.pos1);
    this.pathElement.setAttribute('data-pos2', this.pos2);
    this.pathElement.setAttribute('d', _path_d);
  }

  /**
   * Draws the curly bracket based on the provided path.
   */
  async connect() {
    await this.calculate();

    if (this.bezierCoordinates && this.startPos && this.stopPos) {
      this.startAnchor = new ConnectionAnchor(this.startPos, 'start');

      this.stopAnchor = new ConnectionAnchor(this.stopPos, 'stop');
    }
  }
  // destroy() {
  //   this.pathElement?.remove();
  //   this.startAnchor?.element.remove();
  //   this.stopAnchor?.element.remove();
  // }
}
