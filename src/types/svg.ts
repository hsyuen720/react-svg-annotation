import { SVGAttributes } from "react";
import { Tools } from "../constants/tools";
import { ValueOf } from "./utils";

export type SVGStyleOption = {
  color: string;
  lineWidth: number;
  fillColor: string;
};

export type PathObject = SVGAttributes<SVGPathElement>;

export type CircleObject = SVGAttributes<SVGCircleElement>;

export type RectangleObject = SVGAttributes<SVGRectElement>;

export type SVGObject = ValueOf<{
  [T in Tools]: {
    id: string;
    tool: T;
    data: T extends Tools.Pen
      ? PathObject
      : T extends Tools.Circle
      ? CircleObject
      : T extends Tools.Rectangle
      ? RectangleObject
      : never;
  };
}>;
export type Annotation = Array<SVGObject>;
