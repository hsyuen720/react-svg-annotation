import { FC, useMemo } from "react";

import { AnnotationContainer, Container, Toolbar, ToolbarButton } from "./styles";
import { ContainerSize } from "../../constants/setting";
import useSvgAnnotation from "../../hooks/useSvgAnnotation";
import type { SVGStyleOption } from "../../types/svg";
import SvgRenderer from "../svgRenderer";

export interface SvgAnnotationProps extends SVGStyleOption {
  background?: string;
  width?: number;
  height?: number;
}

const SvgAnnotation: FC<SvgAnnotationProps> = (props) => {
  const { svgProps } = useSvgAnnotation({
    color: props.color,
    fillColor: props.fillColor,
    lineWidth: props.lineWidth,
  });

  const dimension = useMemo(
    () => ({ width: props.width ?? ContainerSize, height: props.height ?? ContainerSize }),
    [props.width, props.height],
  );

  return (
    <Container width={dimension.width}>
      <Toolbar>
        <ToolbarButton>Pointer</ToolbarButton>
        <ToolbarButton>Eraser</ToolbarButton>
        <ToolbarButton>Pen</ToolbarButton>
        <ToolbarButton>Rectangle</ToolbarButton>
        <ToolbarButton>Ellipse</ToolbarButton>
        <ToolbarButton>Download</ToolbarButton>
      </Toolbar>
      <AnnotationContainer {...dimension}>
        <SvgRenderer {...svgProps} {...dimension} />
      </AnnotationContainer>
    </Container>
  );
};

SvgAnnotation.defaultProps = {
  color: "black",
  lineWidth: 5,
  fillColor: "transparent",
  background: undefined,
};

export default SvgAnnotation;
