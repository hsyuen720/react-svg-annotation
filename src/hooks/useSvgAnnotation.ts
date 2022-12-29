import { useMemo, useState, useCallback, useRef } from "react";
import { Tools } from "../constants/tools";
import type { Annotation } from "../types/svg";
import type { AnnotationEvent } from "../types/utils";
import type { ImageType } from "../constants/download";
import produce from "immer";
import useDrawing from "./useDrawing";
import useShape from "./useShape";

const useSvgAnnotation = <T extends HTMLElement = HTMLDivElement>() => {
  const ref = useRef<T>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [tool, setTool] = useState<Tools>(Tools.Pen);
  const [annotation, setAnnotation] = useState<Annotation>([]);

  const { currentPath, onDrawStart, onDrawProceed, onDrawEnd, clearDrawing } = useDrawing(ref);
  const { currentShape, addShape, focusShape, moveShape, resizeShape, clearShape } = useShape(ref);

  const changeTool = useCallback(
    (value: Tools) => {
      setTool(value);
      clearShape();
      clearDrawing();
    },
    [clearShape, clearDrawing],
  );

  const download = useCallback((type: ImageType) => {
    console.log("hello", svgRef.current, type);
  }, []);

  const toSvgString = useCallback(() => (svgRef.current ? svgRef.current.outerHTML : null), []);

  const onEventStart = useCallback(
    (e: AnnotationEvent<T>) => {
      if (tool === Tools.Pointer) {
        focusShape(e, (id) => annotation.find((value) => value.id === id));
      } else if (tool === Tools.Pen) {
        onDrawStart();
      } else {
        setAnnotation(
          produce((draft) => {
            const shape = addShape(e, tool);
            if (shape) draft.push(shape);
          }),
        );
      }
    },
    [tool, addShape, focusShape, onDrawStart, annotation],
  );

  const onEventProceed = useCallback(
    (e: AnnotationEvent<T>) => {
      if (tool === Tools.Pen) {
        onDrawProceed(e);
      } else if (tool === Tools.Pointer) {
        const isResizeMode = false;
        isResizeMode ? resizeShape(e) : moveShape(e);
      }
    },
    [tool, onDrawProceed, moveShape, resizeShape],
  );

  const onEventComplete = useCallback(() => {
    if (tool === Tools.Pen) {
      onDrawEnd((value) => {
        setAnnotation(
          produce((draft) => {
            draft.push(value);
          }),
        );
      });
    } else if (tool === Tools.Pointer) {
      if (currentShape) {
        setAnnotation(
          produce((draft) => {
            const index = draft.findIndex((value) => value.id === currentShape.id);
            draft[index] = currentShape;
          }),
        );
        clearShape();
      }
    }
  }, [tool, onDrawEnd, currentShape, clearShape]);

  const containerProps = useMemo(
    () => ({
      ref,
      onMouseDown: onEventStart,
      onMouseMove: onEventProceed,
      onMouseLeave: onEventComplete,
      onMouseUp: onEventComplete,
      onTouchStart: onEventStart,
      onTouchMove: onEventProceed,
      onTouchEnd: onEventComplete,
    }),
    [onEventStart, onEventProceed, onEventComplete],
  );

  const svgProps = useMemo(
    () => ({
      ref: svgRef,
      annotation,
      currentSVGObject: tool === Tools.Pen ? currentPath : currentShape,
    }),
    [annotation, currentPath, tool, currentShape],
  );

  return { containerProps, svgProps, tool, changeTool, download, toSvgString };
};
export default useSvgAnnotation;
