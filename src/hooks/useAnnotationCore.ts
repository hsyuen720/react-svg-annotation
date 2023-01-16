import { type RefObject, useCallback } from "react";
import uniqid from "uniqid";

import { ControlSpacing } from "../constants/setting";
import { IdPrefix } from "../constants/svg";
import type { AnnotationEvent, Point } from "../types/utils";

const useAnnotationCore = <T extends SVGSVGElement>(ref: RefObject<T>) => {
  const getCTMPoint = useCallback(
    (x: number, y: number): Point => {
      const ctm = ref.current?.getScreenCTM();
      if (ctm) {
        return {
          x: (x - ctm.e) / ctm.a,
          y: (y - ctm.f) / ctm.d,
        };
      } else {
        return { x, y };
      }
    },
    [ref],
  );

  const getCurrentPosition = useCallback(
    (e: AnnotationEvent<T>) => {
      let point: Point = { x: 0, y: 0 };
      if (e.nativeEvent instanceof MouseEvent) {
        point = getCTMPoint(e.nativeEvent.clientX, e.nativeEvent.clientY);
      } else if (e.nativeEvent instanceof TouchEvent) {
        const touch = e.nativeEvent.touches[0];
        point = getCTMPoint(touch.clientX, touch.clientY);
      }
      return point;
    },
    [getCTMPoint],
  );

  const getShapeControl = useCallback(
    (el: SVGElement): Point => {
      const box = el.getBoundingClientRect();
      const origin: Point = getCTMPoint(box.x, box.y);
      return {
        x: origin.x + box.width + ControlSpacing,
        y: origin.y + box.height + ControlSpacing,
      };
    },
    [getCTMPoint],
  );

  const getId = useCallback(() => uniqid(IdPrefix), []);

  return { getCurrentPosition, getShapeControl, getId };
};
export default useAnnotationCore;
