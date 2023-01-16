import { FC, useMemo } from "react";

import { AnnotationContainer, Container, ControlButton, ControlContainer, SVG } from "./styles";
import { ContainerSize } from "../../constants/setting";
import useSvgAnnotation from "../../hooks/useSvgAnnotation";
import type { SVGStyleOption } from "../../types/svg";

export interface SvgAnnotationProps extends SVGStyleOption {
  background?: string;
  width?: number;
  height?: number;
}

const SvgAnnotation: FC<SvgAnnotationProps> = (props) => {
  const { svgProps, changeTool, download } = useSvgAnnotation({
    color: props.color,
    fillColor: props.fillColor,
    lineWidth: props.lineWidth,
  });

  const dimension = useMemo(
    () => ({
      width: props.width ?? ContainerSize,
      height: props.height ?? ContainerSize,
    }),
    [props.width, props.height],
  );

  return (
    <Container>
      <ControlContainer>
        <ControlButton>Button</ControlButton>
      </ControlContainer>
      <AnnotationContainer {...dimension}>
        <SVG {...svgProps} {...dimension} />
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
