import produce from "immer";
import { useCallback, useMemo, useRef, useState } from "react";

import useDrawing from "./useDrawing";
import useShape from "./useShape";
import { CanvasImageMap, ImageExtension, ImageType } from "../constants/download";
import { ContainerSize } from "../constants/setting";
import { Tools } from "../constants/svg";
import type { Annotation, SVGStyleOption } from "../types/svg";
import type { AnnotationEvent } from "../types/utils";

const useSvgAnnotation = <T extends SVGSVGElement>(styleOption?: SVGStyleOption) => {
  const ref = useRef<T>(null);

  const [tool, setTool] = useState<Tools>(Tools.Pen);
  const [annotation, setAnnotation] = useState<Annotation>([]);

  const { currentPath, onDrawStart, onDrawProceed, onDrawEnd, clearDrawing } = useDrawing(
    ref,
    styleOption,
  );
  const { currentShape, shapeControl, addShape, focusShape, controlShape, clearShape } = useShape(
    ref,
    styleOption,
  );

  const changeTool = useCallback(
    (value: Tools) => {
      if (tool === Tools.Pointer) {
        clearShape();
      } else if (tool === Tools.Pen) {
        clearDrawing();
      }
      setTool(value);
    },
    [clearShape, clearDrawing, tool],
  );

  const toSvgString = useCallback(() => (ref.current ? ref.current.outerHTML : null), []);

  const download = useCallback(
    async (type: ImageType) => {
      const fileName = `image${ImageExtension[type]}`;
      const svgString = toSvgString();
      if (svgString) {
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        let url = URL.createObjectURL(blob);
        if (type !== ImageType.SVG) {
          const width = ref.current?.clientWidth ?? ContainerSize;
          const height = ref.current?.clientHeight ?? ContainerSize;
          url = await (() =>
            new Promise<string>((resolve) => {
              const image = new Image();
              image.onload = () => {
                const canvas = document.createElement("canvas");
                canvas.width = width;
                canvas.height = height;
                const context = canvas.getContext("2d");
                if (context) {
                  context.fillStyle = "#fff";
                  context.fillRect(0, 0, width, height);
                  context.drawImage(image, 0, 0);
                }
                resolve(canvas.toDataURL(CanvasImageMap[type]));
                canvas.remove();
              };
              image.src = url;
            }))();
        }
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", fileName);
        link.click();
        link.remove();
      } else {
        throw new Error("No SVG Data");
      }
    },
    [toSvgString],
  );

  const onEventStart = useCallback(
    (e: AnnotationEvent<T>) => {
      e.preventDefault();
      e.stopPropagation();
      if (tool === Tools.Pointer) {
        focusShape(e, (id) => annotation.find((value) => value.id === id));
      } else if (tool === Tools.Eraser) {
        const id = (e.target as T).id;
        setAnnotation(
          produce((draft) => {
            const index = draft.findIndex((value) => value.id === id);
            if (index !== -1) draft.splice(index, 1);
          }),
        );
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
      e.preventDefault();
      e.stopPropagation();

      if (tool === Tools.Pen) {
        onDrawProceed(e);
      } else if (tool === Tools.Pointer) {
        controlShape(e);
      }
    },
    [tool, onDrawProceed, controlShape],
  );

  const onEventComplete = useCallback(
    (e: AnnotationEvent<T>) => {
      e.preventDefault();
      e.stopPropagation();

      if (tool === Tools.Pen) {
        onDrawEnd((value) => {
          setAnnotation(
            produce((draft) => {
              draft.push(value);
            }),
          );
        });
      } else if (tool === Tools.Pointer) {
        clearShape((currentShape) => {
          setAnnotation(
            produce((draft) => {
              const index = draft.findIndex((value) => value.id === currentShape.id);
              draft[index] = currentShape;
            }),
          );
        });
      }
    },
    [tool, onDrawEnd, clearShape],
  );

  const svgProps = useMemo(
    () => ({
      ref,
      tool,
      annotation,
      currentSVGObject: tool === Tools.Pen ? currentPath : currentShape,
      shapeControl,
      onMouseDown: onEventStart,
      onMouseMove: onEventProceed,
      onMouseLeave: onEventComplete,
      onMouseUp: onEventComplete,
      onTouchStart: onEventStart,
      onTouchMove: onEventProceed,
      onTouchEnd: onEventComplete,
    }),
    [
      annotation,
      shapeControl,
      currentPath,
      tool,
      currentShape,
      onEventStart,
      onEventProceed,
      onEventComplete,
    ],
  );

  return { svgProps, tool, changeTool, download, toSvgString };
};
export default useSvgAnnotation;
