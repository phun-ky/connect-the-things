import { Connection } from './Connection';

export type CTTSideType = 'top' | 'right' | 'bottom' | 'left';

/**
 * Class representing a ConnectionSlots instance.
 */
export class ConnectionSlots {
  slots = new Map<HTMLElement, Record<CTTSideType, Connection[]>>();

  constructor() {}
  register(element: HTMLElement, side: CTTSideType, connection: Connection) {
    if (!this.slots.has(element)) {
      this.slots.set(element, {
        top: [],
        right: [],
        bottom: [],
        left: []
      });
    }

    const slots = this.slots.get(element)!;

    if (!slots[side].includes(connection)) {
      slots[side].push(connection);
    }
  }
}
