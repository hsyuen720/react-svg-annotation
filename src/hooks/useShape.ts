import produce from "immer";
import { type RefObject, useCallback, useState } from "react";

import useAnnotationCore from "./useAnnotationCore";
import { ControlId } from "../constants/setting";
import { IdPrefix, Tools } from "../constants/svg";
import type { SVGObject, SVGStyleOption } from "../types/svg";
import type { ActionType, AnnotationEvent, Point, ShapeControl } from "../types/utils";

const useShape = <T extends SVGSVGElement>(ref: RefObject<T>, styleOption?: SVGStyleOption) => {
  const { getCurrentPosition, getShapeControl, getId } = useAnnotationCore(ref);

  const [actionType, setActionType] = useState<ActionType | null>(null);
  const [currentShape, setCurrentShape] = useState<SVGObject | null>(null);
  const [originalShape, setOriginalShape] = useState<SVGObject | null>(null);
  const [shapeControl, setShapeControl] = useState<ShapeControl | null>(null);
  const [refPoint, setRefPoint] = useState<Point | null>(null);

  const addShape = useCallback(
    (e: AnnotationEvent<T>, tool: Tools): SVGObject | null => {
      const point = getCurrentPosition(e);
      const id = getId();
      const styles = {
        stroke: styleOption?.color ?? "black",
        strokeWidth: styleOption?.lineWidth ?? 5,
        fill: styleOption?.fillColor ?? "transparent",
      };

      if (tool === Tools.Rectangle) {
        return {
          id,
          tool,
          data: { ...styles, x: point.x, y: point.y, width: 50, height: 50 },
        };
      } else if (tool === Tools.Ellipse) {
        return {
          id,
          tool,
          data: { ...styles, cx: point.x, cy: point.y, rx: 50, ry: 50 },
        };
      } else {
        return null;
      }
    },
    [getCurrentPosition, getId, styleOption],
  );

  const controlShape = useCallback(
    (e: AnnotationEvent<T>) => {
      if (actionType !== null && currentShape) {
        const currentPosition = getCurrentPosition(e);
        setCurrentShape(
          produce((draft) => {
            if (draft) {
              if (actionType === "move") {
                const translateX = currentPosition.x - (refPoint?.x ?? 0);
                const translateY = currentPosition.y - (refPoint?.y ?? 0);

                if (draft.tool === Tools.Ellipse) {
                  draft.data.cx = translateX;
                  draft.data.cy = translateY;
                } else if (draft.tool === Tools.Rectangle) {
                  draft.data.x = translateX;
                  draft.data.y = translateY;
                } else if (draft.tool === Tools.Pen) {
                  draft.data.transform = `translate(${translateX},${translateY})`;
                }
              } else if (actionType === "resize" && originalShape) {
                const offsetX = currentPosition.x - (refPoint?.x ?? 0);
                const offsetY = currentPosition.y - (refPoint?.y ?? 0);
                if (draft.tool === Tools.Rectangle && originalShape.tool === Tools.Rectangle) {
                  draft.data.width = originalShape.data.width + offsetX;
                  draft.data.height = originalShape.data.height + offsetY;
                } else if (draft.tool === Tools.Ellipse && originalShape.tool === Tools.Ellipse) {
                  draft.data.rx = originalShape.data.rx + offsetX;
                  draft.data.ry = originalShape.data.ry + offsetY;
                }
              }
            }
          }),
        );

        setShapeControl(
          produce((draft) => {
            if (draft?.offset) {
              draft.translate = {
                x: currentPosition.x - draft.offset.x,
                y: currentPosition.y - draft.offset.y,
              };
            }
          }),
        );
      }
    },
    [actionType, currentShape, getCurrentPosition, refPoint, originalShape],
  );

  const getShapeOffsetPoint = useCallback(
    (targetShape: SVGObject, current: Point): Point | null => {
      let shapeX: number | null = null;
      let shapeY: number | null = null;

      if (targetShape.tool === Tools.Ellipse) {
        shapeX = targetShape.data.cx;
        shapeY = targetShape.data.cy;
      } else if (targetShape.tool === Tools.Rectangle) {
        shapeX = targetShape.data.x;
        shapeY = targetShape.data.y;
      } else if (targetShape.tool == Tools.Pen) {
        const el = document.querySelector<SVGSVGElement>(`#${targetShape.id}`);
        const offset = el?.transform.baseVal.consolidate();
        shapeX = offset?.matrix.e ?? 0;
        shapeY = offset?.matrix.f ?? 0;
      }

      if (shapeX !== null && shapeY !== null) {
        return {
          x: current.x - shapeX,
          y: current.y - shapeY,
        };
      } else {
        return null;
      }
    },
    [],
  );

  const focusShape = useCallback(
    (e: AnnotationEvent<T>, get: (id: string) => SVGObject | undefined) => {
      const el = e.target as SVGSVGElement;
      const currentPosition = getCurrentPosition(e);
      let targetShape: SVGObject | null = currentShape;
      if (el.id.startsWith(IdPrefix) && el.id !== currentShape?.id) {
        targetShape = get(el.id) ?? null;
        setCurrentShape(targetShape);
        setOriginalShape(targetShape);
      }

      if (actionType === null && targetShape) {
        const newAction: ActionType | null =
          el.id === targetShape.id ? "move" : el.id === ControlId ? "resize" : null;
        if (newAction !== null) {
          setRefPoint(
            newAction === "move"
              ? getShapeOffsetPoint(targetShape, currentPosition)
              : currentPosition,
          );
        }
        setActionType(newAction);
        if (targetShape.tool !== Tools.Pen) {
          const shapeEl = document.querySelector<SVGSVGElement>(`#${targetShape.id}`);
          if (shapeEl) {
            const shapeControl = getShapeControl(shapeEl);
            setShapeControl(
              produce<ShapeControl>({ point: shapeControl }, (draft) => {
                if (draft) {
                  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                  const transform = svg.createSVGTransform();
                  transform.setTranslate(draft.translate?.x ?? 0, draft.translate?.y ?? 0);
                  draft.offset = {
                    x: currentPosition.x - transform.matrix.e,
                    y: currentPosition.y - transform.matrix.f,
                  };
                }
              }),
            );
          }
        } else {
          setShapeControl(null);
        }
      }
    },
    [currentShape, getShapeControl, actionType, getCurrentPosition, getShapeOffsetPoint],
  );

  const clearShape = useCallback(
    (callback?: (currentShape: SVGObject) => void) => {
      if (callback) {
        if (actionType !== null && currentShape) {
          callback(currentShape);
          setOriginalShape(currentShape);
          setActionType(null);
        }
      } else {
        setCurrentShape(null);
        setOriginalShape(null);
        setShapeControl(null);
        setRefPoint(null);
        setActionType(null);
      }
    },
    [actionType, currentShape],
  );

  return { currentShape, shapeControl, addShape, controlShape, focusShape, clearShape };
};

export default useShape;
