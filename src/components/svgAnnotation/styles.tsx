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

export const ToolbarButton = styled.button<{ isActive?: boolean }>`
  font-size: 0.8em;
  border-radius: 0.5em;
  border: none;
  background-color: ${(props) => (props.isActive ? "#2A9D8F" : "#264653")};
  color: white;
  border: none;
  padding: 0.5em 0.75em;
  cursor: pointer;
  transition: all 250ms ease-in-out;
`;

export const ToolbarDropDown = styled.div`
  margin-left: auto;
  position: relative;
`;

export const ToolbarDropDownMenu = styled.div<{ isOpen: boolean }>`
  position: absolute;
  width: 100%;
  z-index: 100;
  background-color: white;
  margin-top: 0.5em;
  display: flex;
  flex-direction: column;
  gap: 0.25em;
  transition: 100ms all ease;
  opacity: ${(props) => (props.isOpen ? 1 : 0)};
  visibility: ${(props) => (props.isOpen ? "visible" : "hidden")};
  border-radius: 0.25em;
`;

export const ToolbarDropdownMenuItem = styled.div`
  cursor: pointer;
  padding: 0.25em;
  text-align: center;
  border-radius: inherit;
  &:hover {
    background-color: #264653;
    color: white;
  }
`;

export const AnnotationContainer = styled.div<{
  width: number;
  height: number;
  background?: string;
}>`
  width: ${(props) => `${props.width}px`};
  height: ${(props) => `${props.height}px`};
  background-size: ${(props) => (props.background ? "contain" : "20px 20px")};
  background-position: ${(props) => (props.background ? "center" : "unset")};
  background-image: ${(props) =>
    props.background
      ? `url(${props.background})`
      : "radial-gradient(circle, #7d7d7d 1px, transparent 1px)"};
  background-repeat: ${(props) => (props.background ? "no-repeat" : "repeat")};
`;
