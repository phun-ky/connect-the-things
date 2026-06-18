import { waitForFrame } from './wait';

export const isOverlapping = async (
  el1: HTMLElement,
  el2: HTMLElement
): Promise<boolean> => {
  await waitForFrame();
  const rect1 = el1.getBoundingClientRect();
  await waitForFrame();
  const rect2 = el2.getBoundingClientRect();

  return !(
    rect1.right < rect2.left || // el1 is to the left of el2
    rect1.left > rect2.right || // el1 is to the right of el2
    rect1.bottom < rect2.top || // el1 is above el2
    rect1.top > rect2.bottom // el1 is below el2
  );
};
