import { getPositionsForSVGPath } from './bezier';
import { CTTSideType } from './classes/ConnectionSlots';
import { getDirection } from './get-direction';

export const getSides = async (
  startElement: HTMLElement,
  stopElement: HTMLElement
): Promise<{ pos1: CTTSideType; pos2: CTTSideType }> => {
  const _direction = await getDirection(startElement, stopElement);
  return getPositionsForSVGPath(_direction);
};
