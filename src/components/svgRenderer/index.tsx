import { type SVGAttributes, forwardRef, useCallback, useMemo } from "react";

import { ControlPoint, SVG } from "./styles";
import { ContainerSize, ControlId } from "../../constants/setting";
import { Tools } from "../../constants/svg";
import type { Annotation, SVGObject } from "../../types/svg";
import { ShapeControl } from "../../types/utils";

export interface SvgRendererProps extends SVGAttributes<SVGSVGElement> {
  tool: Tools;
  annotation: Annotation;
  currentSVGObject: SVGObject | null;
  shapeControl: ShapeControl | null;
}

const SvgRenderer = forwardRef<SVGSVGElement, SvgRendererProps>(
  ({ annotation, currentSVGObject, shapeControl, ...rest }, ref) => {
    const renderItem = useCallback((value: SVGObject | null) => {
      if (value?.tool === Tools.Pen) {
        return <path {...value.data} id={value.id} key={value.id} />;
      } else if (value?.tool === Tools.Rectangle) {
        return <rect {...value.data} id={value.id} key={value.id} />;
      } else if (value?.tool === Tools.Ellipse) {
        return <ellipse {...value.data} id={value.id} key={value.id} />;
      } else {
        return null;
      }
    }, []);

    const renderShapeControl = useMemo(() => {
      if (!shapeControl) return null;
      const { point, translate } = shapeControl;
      return (
        <ControlPoint
          id={ControlId}
          cx={point.x}
          cy={point.y}
          r={3}
          transform={translate ? `translate(${translate.x},${translate.y})` : undefined}
        />
      );
    }, [shapeControl]);

    return (
      <SVG
        {...rest}
        ref={ref}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        width={rest.width ?? `${ContainerSize}px`}
        height={rest.height ?? `${ContainerSize}px`}
      >
        {annotation.map((value) => (value.id === currentSVGObject?.id ? null : renderItem(value)))}
        {renderItem(currentSVGObject)}
        {renderShapeControl}
      </SVG>
    );
  },
);

SvgRenderer.displayName = "SvgRenderer";

export default SvgRenderer;
