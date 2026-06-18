import { CTTSideType } from './classes/ConnectionSlots';
import { waitForFrame } from './wait';

const getPositionX = (
  length: number,
  index: number,
  count: number,
  spacing: number,
  element: HTMLElement
): number => {
  if (count <= 0 || index < 0 || index >= count) {
    throw RangeError('Invalid index or count');
  }

  const center = length / 2;
  const totalSpan = spacing * (count - 1);
  const start = center - totalSpan / 2;

  if (element.getAttribute('id') === '_e86x7wtmv') {
    console.table({
      count,
      index,
      spacing,
      center,
      start,
      totalSpan,
      position: start + index * spacing
    });
  }

  return start + index * spacing;
};

export const getAnchorPosition = async (
  element: HTMLElement,
  side: CTTSideType,
  index: number,
  total: number
): Promise<{ x: number; y: number }> => {
  await waitForFrame();

  const rect = element.getBoundingClientRect();
  const padding = 40; // visual offset away from element

  if (element.getAttribute('id') === '_e86x7wtmv') {
    console.log('getAnchorPosition', side, index, total);
  }

  switch (side) {
    case 'top': {
      const x =
        rect.left + getPositionX(rect.width, index, total, padding, element);

      return { x, y: rect.top };
    }
    case 'bottom': {
      const x =
        rect.left + getPositionX(rect.width, index, total, padding, element);

      return { x, y: rect.bottom };
    }
    case 'left': {
      const y =
        rect.top + getPositionX(rect.height, index, total, padding, element);

      return { x: rect.left, y };
    }
    case 'right': {
      const y =
        rect.top + getPositionX(rect.height, index, total, padding, element);

      return { x: rect.right, y };
    }
  }
};
