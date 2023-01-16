import styled from "@emotion/styled";

import SvgRenderer from "../svgRenderer";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ControlContainer = styled.div``;

export const ControlButton = styled.button``;

export const AnnotationContainer = styled.div<{ width: number; height: number }>`
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
`;

export const SVG = styled(SvgRenderer)`
  border: 1px dashed black;
`;
