import produce from "immer";
import { useCallback, useState, type RefObject } from "react";
import { Tools } from "../constants/tools";
import type { SVGObject, SVGStyleOption } from "../types/svg";
import { AnnotationEvent, Point } from "../types/utils";
import useAnnotationCore from "./useAnnotationCore";

const useShape = <T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>,
  styleOption?: SVGStyleOption,
) => {
  const { getTargetPoint, getElementId } = useAnnotationCore(ref);
  const [currentShape, setCurrentShape] = useState<SVGObject | null>(null);
  const [vectorPoint, setVectorPoint] = useState<Point | null>(null);

  const addShape = useCallback(
    (e: AnnotationEvent<T>, tool: Tools): SVGObject | null => {
      const point = getTargetPoint(e);
      const id = getElementId();
      const styles = {
        stroke: styleOption?.color ?? "black",
        strokeWidth: styleOption?.lineWidth ?? 5,
        fill: styleOption?.fillColor ?? "transparent",
      };
      if (tool === Tools.Circle) {
        return { id, tool, data: { cx: point.x, cy: point.y, r: 50, ...styles } };
      } else if (tool === Tools.Rectangle) {
        return { id, tool, data: { x: point.x, y: point.y, width: 50, height: 50, ...styles } };
      } else {
        return null;
      }
    },
    [getTargetPoint, getElementId, styleOption],
  );

  const moveShape = useCallback(
    (e: AnnotationEvent<T>) => {
      if (currentShape) {
        const point = getTargetPoint(e);
        setCurrentShape(
          produce((draft) => {
            if (draft?.tool === Tools.Circle) {
              draft.data.cx = point.x - (vectorPoint?.x ?? 0);
              draft.data.cy = point.y - (vectorPoint?.y ?? 0);
            } else if (draft?.tool === Tools.Rectangle) {
              draft.data.x = point.x - (vectorPoint?.x ?? 0);
              draft.data.y = point.y - (vectorPoint?.y ?? 0);
            }
          }),
        );
      }
    },
    [getTargetPoint, currentShape, vectorPoint],
  );

  const resizeShape = useCallback(
    (e: AnnotationEvent<T>) => {
      if (currentShape) {
        const point = getTargetPoint(e);

        console.log("resize", point);
      }
    },
    [getTargetPoint, currentShape],
  );

  const focusShape = useCallback(
    (e: AnnotationEvent<T>, get: (id: string) => SVGObject | undefined) => {
      e.stopPropagation();
      const target = e.target as HTMLElement;
      if (["rect", "circle"].includes(target.tagName) && target.id !== currentShape?.id) {
        const targetShape = get(target.id);
        if (targetShape) {
          setCurrentShape(targetShape);
          const targetPoint = getTargetPoint(e);
          let shapeX: number | null = null;
          let shapeY: number | null = null;
          if (targetShape.tool === Tools.Circle) {
            shapeX = Number(targetShape.data.cx);
            shapeY = Number(targetShape.data.cy);
          } else if (targetShape.tool === Tools.Rectangle) {
            shapeX = Number(targetShape.data.x);
            shapeY = Number(targetShape.data.y);
          }
          if (shapeX !== null && shapeY !== null) {
            setVectorPoint({
              x: targetPoint.x - shapeX,
              y: targetPoint.y - shapeY,
              pressure: 0,
            });
          }
        }
      }
    },
    [currentShape, getTargetPoint],
  );

  const clearShape = useCallback(() => {
    setCurrentShape(null);
    setVectorPoint(null);
  }, []);

  return { currentShape, addShape, moveShape, resizeShape, focusShape, clearShape };
};

export default useShape;
