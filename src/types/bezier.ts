/**
 * Options for creating a curly bezier path.
 */
export type CurlyBezierPathOptionsType = {
  /**
   * The first position.
   */
  pos1: string;

  /**
   * The second position.
   */
  pos2: string;

  /**
   * The direction of the path.
   */
  direction: string;
};

/**
 * Options for creating a bezier path.
 */
export type BezierPathOptionsType = {
  /**
   * The first position.
   */
  pos1: string;

  /**
   * The second position.
   */
  pos2: string;

  bezierCoordinates: CoordinatesForBezierObjectType;
  type?: 'bezier' | 'orthogonal'; // optional, defaults to bezier
};

type CoordinatesType = {
  x: number;
  y: number;
};

export type CoordinatesForBezierObjectType = {
  firstPoint: CoordinatesType;
  firstControl: CoordinatesType;
  lastPoint: CoordinatesType;
  lastControl: CoordinatesType;
};

/**
 * Parameters for creating coordinates for a curve.
 */
export type CreateCoordinatesForCurveCoordParamType = {
  /**
   * The x-coordinate of the first point.
   */
  x1: number;

  /**
   * The x-coordinate of the second point.
   */
  x2: number;

  /**
   * The y-coordinate of the first point.
   */
  y1: number;

  /**
   * The y-coordinate of the second point.
   */
  y2: number;
};

export type CTTDirectionDetailedType =
  | 'north'
  | 'north-east'
  | 'north-west'
  | 'north-north-east'
  | 'north-north-west'
  | 'south'
  | 'south-east'
  | 'south-west'
  | 'south-south-east'
  | 'south-south-west'
  | 'west'
  | 'north-west'
  | 'south-west'
  | 'west-south-west'
  | 'west-north-west'
  | 'east'
  | 'north-east'
  | 'south-east'
  | 'east-south-east'
  | 'east-north-east';

export type CTTDirectionType =
  | 'east'
  | 'south-east'
  | 'south'
  | 'south-west'
  | 'west'
  | 'north-west'
  | 'north'
  | 'north-east';
export type CTTDirectionCrudeType = 'north' | 'south' | 'west' | 'east';
