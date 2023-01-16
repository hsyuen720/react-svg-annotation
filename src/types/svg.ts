import type { SVGAttributes } from "react";

import type { ValueOf } from "./utils";
import type { Tools } from "../constants/svg";

export type SVGStyleOption = Partial<{
  color: string;
  lineWidth: number;
  fillColor: string;
}>;

interface PathObject extends SVGAttributes<SVGPathElement> {
  d: string;
}

interface RectangleObject extends SVGAttributes<SVGRectElement> {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface EllipseObject extends SVGAttributes<SVGEllipseElement> {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export type SVGObject = ValueOf<{
  [T in Tools]: {
    id: string;
    tool: T;
    data: T extends Tools.Pen
      ? PathObject
      : T extends Tools.Rectangle
      ? RectangleObject
      : T extends Tools.Ellipse
      ? EllipseObject
      : never;
  };
}>;

export type Annotation = Array<SVGObject>;
