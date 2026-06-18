import {
  BezierPathOptionsType,
  CoordinatesForBezierObjectType,
  CreateCoordinatesForCurveCoordParamType,
  CTTDirectionCrudeType,
  CTTDirectionDetailedType,
  CTTDirectionType
} from '../types/bezier';
import { CTTSideType } from './classes/ConnectionSlots';

export const euclideanDistance = (
  set1: { x: number; y: number },
  set2: { x: number; y: number }
): number => {
  const dx = set2.x - set1.x;
  const dy = set2.y - set1.y;
  return Math.sqrt(dx * dx + dy * dy);
};

/**
 * Normalizes a distance to a 0–1 range based on max distance.
 *
 * @param distance - The actual distance.
 * @param maxDistance - The distance treated as 100% (1.0).
 * @returns Normalized value between 0 and 1.
 */
export const normalizeDistance = (
  distance: number,
  maxDistance: number = 1000
): number => {
  return Math.min(distance / maxDistance, 1);
};

/**
 * Maps a normalized value [0, 1] to a value between min and max.
 *
 * @param norm - Normalized value (0 to 1).
 * @param min - Minimum output value.
 * @param max - Maximum output value.
 * @returns Value between min and max.
 */
export const lerp = (norm: number, min: number, max: number): number => {
  return min + (max - min) * norm;
};

/**
 * Calculates a curve multiplier based on distance.
 *
 * @param distance - Distance between points.
 * @param min - Minimum multiplier.
 * @param max - Maximum multiplier.
 * @param maxDistance - Distance at which max multiplier is used.
 * @returns A multiplier between min and max.
 */
export const curveMultiplierFromDistance = (
  distance: number,
  min: number = 1.1,
  max: number = 3.5,
  maxDistance: number = 1000
): number => {
  const normalized = normalizeDistance(distance, maxDistance);
  return lerp(normalized, min, max);
};

/* node:coverage disable */
/**
 * Calculates coordinates for a Bezier curve between two points.
 *
 * @param {CreateCoordinatesForCurveCoordParamType} coords - The coordinates of the start and end points.
 * @param {CreateCoordinatesForCurveOptionsParamType} options - Options for controlling the curve's shape.
 * @returns Coordinates for the Bezier curve.
 *
 * @example
 * ```ts
 * const coordinates = createBezierCurveCoordinates(
 *   { x1: 0, x2: 100, y1: 0, y2: 100 },
 *   { direction: 'west' }
 * );
 * ```
 */
/* node:coverage enable */
export const createBezierCurveCoordinates = (
  coords: CreateCoordinatesForCurveCoordParamType,
  direction: CTTDirectionType | CTTDirectionCrudeType | CTTDirectionDetailedType
): CoordinatesForBezierObjectType => {
  const { x1, x2, y1, y2 } = coords;

  const firstPoint = { x: x1, y: y1 };
  const lastPoint = { x: x2, y: y2 };

  const distance = euclideanDistance(firstPoint, lastPoint);
  const multiplier = curveMultiplierFromDistance(distance); // e.g. 1.1–3.5

  let dxOffset = 0;
  let dyOffset = 0;

  // Adjust control offsets based on direction
  if (direction.includes('east')) dxOffset = +distance / multiplier;
  if (direction.includes('west')) dxOffset = -distance / multiplier;
  if (direction.includes('south')) dyOffset = +distance / multiplier;
  if (direction.includes('north')) dyOffset = -distance / multiplier;

  const firstControl = {
    x: x1 + dxOffset,
    y: y1 + dyOffset
  };

  const lastControl = {
    x: x2 - dxOffset,
    y: y2 - dyOffset
  };

  return {
    firstPoint,
    firstControl,
    lastPoint,
    lastControl
  };
};

export const createOrthogonalPath = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  pos1: string,
  pos2: string,
  radius: number = 12
): string => {
  // Direction of final vertical or horizontal based on actual positions
  const dirY = y2 > y1 ? 1 : -1;
  const dirX = x2 > x1 ? 1 : -1;

  const path: string[] = [];

  // Handle horizontal routing (left/right)
  if (
    (pos1 === 'left' || pos1 === 'right') &&
    (pos2 === 'left' || pos2 === 'right')
  ) {
    const midX = (x1 + x2) / 2;

    const bend1X = midX;
    const bend1Y = y1 + radius * dirY;

    const bend2X = midX + radius * dirX;
    const bend2Y = y2;

    path.push(`M ${x1} ${y1}`);
    path.push(`L ${midX - radius * dirX} ${y1}`);
    path.push(`Q ${midX} ${y1}, ${bend1X} ${bend1Y}`);
    path.push(`L ${bend1X} ${y2 - radius * dirY}`);
    path.push(`Q ${bend1X} ${y2}, ${bend2X} ${bend2Y}`);
    path.push(`L ${x2} ${y2}`);
  }

  // Handle vertical routing (top/bottom)
  else if (
    (pos1 === 'top' || pos1 === 'bottom') &&
    (pos2 === 'top' || pos2 === 'bottom')
  ) {
    const midY = (y1 + y2) / 2;

    const bend1Y = midY;
    const bend1X = x1 + radius * dirX;

    const bend2Y = midY + radius * dirY;
    const bend2X = x2;

    path.push(`M ${x1} ${y1}`);
    path.push(`L ${x1} ${midY - radius * dirY}`);
    path.push(`Q ${x1} ${midY}, ${bend1X} ${bend1Y}`);
    path.push(`L ${x2 - radius * dirX} ${bend1Y}`);
    path.push(`Q ${x2} ${bend1Y}, ${bend2X} ${bend2Y}`);
    path.push(`L ${x2} ${y2}`);
  }

  return path.join(' ');
};

/* node:coverage disable */
/**
 * Generates an SVG path for a straight line between two HTML elements.
 *
 * @param startEl - The starting HTML element.
 * @param stopEl - The ending HTML element.
 * @param options - Options for controlling the straight line.
 * @returns The SVG path string for the straight line.
 *
 * @example
 * ```ts
 * const svgPath = getSVGPath(startElement, stopElement, {
 *   pos1: 'left',
 *   pos2: 'right',
 * });
 * ```
 */
/* node:coverage enable */
export const getSVGPath = async (options: BezierPathOptionsType) => {
  const { pos1, pos2, bezierCoordinates, type = 'bezier' } = options;

  const { firstPoint, firstControl, lastControl, lastPoint } =
    bezierCoordinates;

  if (type === 'orthogonal') {
    return createOrthogonalPath(
      firstPoint.x,
      firstPoint.y,
      lastPoint.x,
      lastPoint.y,
      pos1,
      pos2
    );
  }

  return (
    `M ${firstPoint.x} ${firstPoint.y}` +
    `C ${firstControl.x} ${firstControl.y}, ${lastControl.x} ${lastControl.y}, ${lastPoint.x} ${lastPoint.y}`
  );
};

/**
 * Returns positions for creating an SVG path based on a cardinal direction.
 * The positions are side anchors for drawing a directional connection (e.g. from "top" to "bottom").
 *
 * @param direction - The cardinal direction (e.g. "east", "south-west", "north-north-west").
 * @returns An object containing `pos1` (start position) and `pos2` (end position) for the SVG path.
 *
 * @example
 * ```ts
 * const positions = getPositionsForSVGPath('south-south-east');
 * // { pos1: 'bottom', pos2: 'top' }
 * ```
 */
export const getPositionsForSVGPath = (
  direction: string
): { pos1: CTTSideType; pos2: CTTSideType } => {
  // Normalize direction to lowercase
  const dir = direction.toLowerCase();

  // Mapping of direction keywords to SVG sides
  const sides = {
    top: [
      'north',
      'north-east',
      'north-west',
      'north-north-east',
      'north-north-west'
    ],
    bottom: [
      'south',
      'south-east',
      'south-west',
      'south-south-east',
      'south-south-west'
    ],
    left: [
      'west',
      'north-west',
      'south-west',
      'west-south-west',
      'west-north-west'
    ],
    right: [
      'east',
      'north-east',
      'south-east',
      'east-south-east',
      'east-north-east'
    ]
  };

  const getSide = (dir: string): 'top' | 'bottom' | 'left' | 'right' => {
    for (const [side, keywords] of Object.entries(sides)) {
      if (keywords.includes(dir))
        return side as 'top' | 'bottom' | 'left' | 'right';
    }
    // Default fallback
    return 'top';
  };

  const pos1 = getSide(dir);
  const opposite: Record<typeof pos1, CTTSideType> = {
    top: 'bottom',
    bottom: 'top',
    left: 'right',
    right: 'left'
  };
  const pos2 = opposite[pos1];

  return { pos1, pos2 };
};
