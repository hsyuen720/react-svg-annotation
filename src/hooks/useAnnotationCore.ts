import { type RefObject, useCallback } from "react";
import type { AnnotationEvent, Point } from "../types/utils";
import uniqid from "uniqid";

const useAnnotationCore = <C extends HTMLElement>(ref: RefObject<C>) => {
  const getTargetPoint = useCallback(
    (e: AnnotationEvent<C>) => {
      const point: Point = { x: 0, y: 0, pressure: 0 };
      const offsetX = ref.current?.offsetLeft ?? 0;
      const offsetY = ref.current?.offsetTop ?? 0;
      if (e.nativeEvent instanceof MouseEvent) {
        point.x = e.nativeEvent.clientX - offsetX;
        point.y = e.nativeEvent.clientY - offsetY;
        point.pressure = 0;
      } else if (e.nativeEvent instanceof TouchEvent) {
        const touch = e.nativeEvent.touches[0];
        point.x = touch.clientX - offsetX;
        point.y = touch.clientY - offsetY;
        point.pressure = touch.force;
      }
      return point;
    },
    [ref],
  );

  const getElementId = useCallback(() => uniqid("svg-"), []);

  return { getTargetPoint, getElementId };
};
export default useAnnotationCore;
