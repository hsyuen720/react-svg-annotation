import produce from "immer";
import { RefObject, useCallback, useMemo, useState } from "react";
import { Command } from "../constants/svg";
import { Tools } from "../constants/tools";
import type { PathObject, SVGStyleOption, SVGObject } from "../types/svg";
import type { AnnotationEvent, Point } from "../types/utils";
import useAnnotationCore from "./useAnnotationCore";

const useDrawing = <T extends HTMLElement = HTMLDivElement>(
  ref: RefObject<T>,
  styleOption?: SVGStyleOption,
) => {
  const { getTargetPoint, getElementId } = useAnnotationCore(ref);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingPoint, setDrawingPoint] = useState<Point[]>([]);

  const currentPath = useMemo<SVGObject | null>(() => {
    if (drawingPoint.length <= 1) return null;

    const commands = drawingPoint.map(
      (point, index) => `${index === 0 ? Command.Move : Command.Line} ${point.x} ${point.y}`,
    );
    return {
      id: "tempId",
      tool: Tools.Pen,
      data: {
        d: commands.join(" "),
        stroke: styleOption?.color ?? "black",
        strokeWidth: styleOption?.lineWidth ?? 5,
        fill: styleOption?.fillColor ?? "transparent",
        strokeLinecap: "round",
        strokeLinejoin: "round",
      },
    };
  }, [drawingPoint, styleOption]);

  const onDrawStart = useCallback(() => setIsDrawing(true), []);

  const onDrawProceed = useCallback(
    (e: AnnotationEvent<T>) => {
      if (isDrawing) {
        const point = getTargetPoint(e);
        setDrawingPoint(
          produce((draft) => {
            draft.push(point);
          }),
        );
      }
    },
    [isDrawing, getTargetPoint],
  );

  const onDrawEnd = useCallback(
    (callback: (value: SVGObject) => void) => {
      if (isDrawing) {
        if (currentPath) {
          callback({ ...currentPath, id: getElementId() });
        }
        setDrawingPoint([]);
        setIsDrawing(false);
      }
    },
    [isDrawing, currentPath, getElementId],
  );

  const clearDrawing = useCallback(() => {
    setDrawingPoint([]);
    setIsDrawing(false);
  }, []);

  return { currentPath, onDrawStart, onDrawProceed, onDrawEnd, clearDrawing };
};
export default useDrawing;
