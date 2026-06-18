import { angle } from '@phun-ky/angle';

import {
  CTTDirectionCrudeType,
  CTTDirectionDetailedType,
  CTTDirectionType
} from '../types/bezier';
import {
  cardinalDirection,
  cardinalDirectionCrude,
  cardinalDirectionDetailed
} from '@phun-ky/cardinal';

export type CTTDirectionOfElementPropsType = {
  coords: { x1: number; y1: number; x2: number; y2: number };
  version?: 'default' | 'crude' | 'detailed';
};

export type CTTDirectionOfElementReturnType =
  | CTTDirectionType
  | CTTDirectionCrudeType
  | CTTDirectionDetailedType;

export const directionOfElement = (
  props: CTTDirectionOfElementPropsType
): CTTDirectionOfElementReturnType => {
  const { coords, version = 'default' } = props;
  const { x1, y1, x2, y2 } = coords;

  const _angle = angle(x1, y1, x2, y2);
  if (version === 'detailed') return cardinalDirectionDetailed(_angle);
  if (version === 'crude') return cardinalDirectionCrude(_angle);
  return cardinalDirection(_angle);
};
