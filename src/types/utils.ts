import type { MouseEvent, TouchEvent } from "react";

export type ValueOf<T> = T[keyof T];

export type AnnotationEvent<C extends SVGSVGElement> = MouseEvent<C> | TouchEvent<C>;

export type AnnotationEvents<C extends SVGSVGElement> = Record<
  | "onMouseDown"
  | "onMouseMove"
  | "onMouseLeave"
  | "onMouseUp"
  | "onTouchStart"
  | "onTouchMove"
  | "onTouchEnd",
  (e: AnnotationEvent<C>) => void
>;

export interface Point {
  x: number;
  y: number;
}

export type ShapeControl = {
  point: Point;
  offset?: Point;
  translate?: Point;
};

export type ActionType = "move" | "resize";
