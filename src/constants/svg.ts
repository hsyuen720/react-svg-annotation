export enum Tools {
  Pointer,
  Eraser,
  Pen,
  Rectangle,
  Ellipse,
}

export enum Command {
  Move = "M",
  RelativeMove = "m",
  Line = "L",
  RelativeLine = "l",
  HorizontalLine = "H",
  RelativeHorizontalLine = "h",
  VerticalLine = "V",
  RelativeVerticalLine = "v",
  CubicCurve = "C",
  RelativeCubicCurve = "c",
  QuadraticCurve = "Q",
  RelativeQuadraticCurve = "q",
  SmoothQuadraticCurve = "T",
  RelativeSmoothQuadraticCurve = "t",
  EllipticalCurve = "A",
  RelativeEllipticalCurve = "a",
  ClosePath = "Z",
}

export const IdPrefix = "svg-";
