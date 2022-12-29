import type { MouseEvent, TouchEvent } from "react";

export type ValueOf<T> = T[keyof T];

export type AnnotationEvent<C extends HTMLElement> = MouseEvent<C> | TouchEvent<C>;

export interface Point {
  x: number;
  y: number;
  pressure: number;
}
