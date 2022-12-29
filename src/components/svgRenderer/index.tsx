import { forwardRef, useCallback } from "react";
import { Tools } from "../../constants/tools";
import type { Annotation, SVGObject } from "../../types/svg";

export type SvgRendererProps = {
  annotation: Annotation;
  currentSVGObject: SVGObject | null;
};

const SvgRenderer = forwardRef<SVGSVGElement, SvgRendererProps>(
  ({ annotation, currentSVGObject }, ref) => {
    const renderSvgElement = useCallback((value: SVGObject) => {
      if (value.tool === Tools.Pen) {
        return <path {...value.data} key={value.id} id={value.id} />;
      } else if (value.tool === Tools.Rectangle) {
        return <rect {...value.data} key={value.id} id={value.id} />;
      } else if (value.tool === Tools.Circle) {
        return <circle {...value.data} key={value.id} id={value.id} />;
      } else {
        return null;
      }
    }, []);

    return (
      <svg ref={ref} version="1.1" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
        {annotation.map((value) =>
          value.id === currentSVGObject?.id ? null : renderSvgElement(value),
        )}
        {currentSVGObject ? renderSvgElement(currentSVGObject) : null}
      </svg>
    );
  },
);

SvgRenderer.displayName = "SvgRenderer";

export default SvgRenderer;
