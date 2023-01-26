import styled from "@emotion/styled";

export const Container = styled.div<{ width: number }>`
  font-size: 15px;
  width: ${(props) => `${props.width}px`};
  display: flex;
  flex-direction: column;
  gap: 0.25em;
`;

export const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  gap: 0.25em;
`;

export const ToolbarButton = styled.button`
  font-size: 0.8em;
  border-radius: 0.5em;
  border: none;
  background-color: black;
  color: white;
  border: none;
  padding: 0.5em 0.75em;
  cursor: pointer;
`;

export const AnnotationContainer = styled.div<{ width: number; height: number }>`
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  background-size: 20px 20px;
  background-image: radial-gradient(circle, #7d7d7d 1px, transparent 1px);
  background-repeat: repeat;
`;
