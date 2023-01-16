import styled from "@emotion/styled";

import { Tools } from "../../constants/svg";

export const SVG = styled.svg<{ tool: Tools }>`
  touch-action: none;
  > * {
    cursor: ${({ tool }) =>
      tool === Tools.Pointer ? "move" : tool === Tools.Eraser ? "not-allowed" : "auto"};
  }
`;

export const ControlPoint = styled.circle`
  cursor: nwse-resize;
  stroke: red;
  fill: red;
`;
