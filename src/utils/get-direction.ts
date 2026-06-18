import {
  CTTDirectionCrudeType,
  CTTDirectionDetailedType,
  CTTDirectionType
} from '../types/bezier';
import { directionOfElement } from './direction-of-element';
import { intrinsicCoords } from './intrinsic-coords';

export const getDirection = async (
  startElement: HTMLElement,
  stopElement: HTMLElement
): Promise<
  CTTDirectionType | CTTDirectionCrudeType | CTTDirectionDetailedType
> => {
  const { x: x1, y: y1 } = await intrinsicCoords(startElement);
  const { x: x2, y: y2 } = await intrinsicCoords(stopElement);

  return directionOfElement({
    coords: { x1, x2, y1, y2 }
  });
};
