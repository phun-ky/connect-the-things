import { uniqueID } from '../id';

/**
 * Class representing a ConnectionAnchor instance.
 */
export class ConnectionAnchor {
  point: { x: number; y: number };
  type: 'start' | 'milestone' | 'stop';
  id: string;
  element: HTMLSpanElement;
  constructor(point: { x: number; y: number }, type) {
    this.point = point;
    this.type = type;
    this.element = document.createElement('span');

    this.element.classList.add('anchor');
    this.element.classList.add(this.type);
    this.id = `ctt-anchor-${uniqueID()}`;

    this.element.setAttribute('data-id', this.id);

    Object.assign(this.element.style, {
      left: `calc(${this.point.x}px - 5px)`,
      top: `calc(${this.point.y}px - 5px)`
    });
  }

  update(point: { x: number; y: number }) {
    if (!this.element) return;

    this.point = point;

    Object.assign(this.element.style, {
      left: `calc(${this.point.x}px - 5px)`,
      top: `calc(${this.point.y}px - 5px)`
    });
  }
}
