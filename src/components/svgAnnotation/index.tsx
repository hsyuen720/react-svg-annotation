import { FC, useCallback, useMemo } from "react";

import {
  AnnotationContainer,
  Container,
  Toolbar,
  ToolbarButton,
  ToolbarDropDown,
  ToolbarDropDownMenu,
  ToolbarDropdownMenuItem,
} from "./styles";
import { ImageType } from "../../constants/download";
import { ContainerSize } from "../../constants/setting";
import { Tools } from "../../constants/svg";
import useOutsideClick from "../../hooks/useOutsideClick";
import useSvgAnnotation from "../../hooks/useSvgAnnotation";
import type { SVGStyleOption } from "../../types/svg";
import SvgRenderer from "../svgRenderer";

export interface SvgAnnotationProps extends SVGStyleOption {
  backgroundImage?: string;
  width?: number;
  height?: number;
}

const toolMap: Array<{ tool: Tools; title: string }> = [
  { tool: Tools.Pointer, title: "Pointer" },
  { tool: Tools.Pen, title: "Pen" },
  { tool: Tools.Eraser, title: "Eraser" },
  { tool: Tools.Rectangle, title: "Rectangle" },
  { tool: Tools.Ellipse, title: "Circle" },
];

const SvgAnnotation: FC<SvgAnnotationProps> = (props) => {
  const {
    svgProps,
    changeTool,
    tool: currentTool,
    download,
  } = useSvgAnnotation({
    styleOption: {
      color: props.color,
      fillColor: props.fillColor,
      lineWidth: props.lineWidth,
    },
  });

  const { el, isOpen, close, toggle } = useOutsideClick<HTMLButtonElement>();

  const dimension = useMemo(
    () => ({ width: props.width ?? ContainerSize, height: props.height ?? ContainerSize }),
    [props.width, props.height],
  );

  const handleDownload = useCallback(
    async (type: ImageType) => {
      console.log("hello");
      await download(type);
      close();
    },
    [download, close],
  );

  const background = useMemo(() => {
    const regex =
      /^((https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?)|(^(\/[\w .-]+)+\/?)$/;
    return regex.test(props.backgroundImage ?? "") ? props.backgroundImage : undefined;
  }, [props.backgroundImage]);

  return (
    <Container width={dimension.width}>
      <div>{/* Custom Control Bar */}</div>
      <Toolbar>
        {toolMap.map(({ tool, title }) => (
          <ToolbarButton
            key={tool}
            onClick={() => changeTool(tool)}
            isActive={tool === currentTool}
          >
            {title}
          </ToolbarButton>
        ))}
        <ToolbarDropDown>
          <ToolbarButton ref={el} onClick={toggle}>
            Download
          </ToolbarButton>
          <ToolbarDropDownMenu isOpen={isOpen}>
            <ToolbarDropdownMenuItem onClick={() => handleDownload(ImageType.SVG)}>
              SVG
            </ToolbarDropdownMenuItem>
            <ToolbarDropdownMenuItem onClick={() => handleDownload(ImageType.PNG)}>
              PNG
            </ToolbarDropdownMenuItem>
            <ToolbarDropdownMenuItem onClick={() => handleDownload(ImageType.JPG)}>
              JPG
            </ToolbarDropdownMenuItem>
          </ToolbarDropDownMenu>
        </ToolbarDropDown>
      </Toolbar>
      <AnnotationContainer {...dimension} background={background}>
        <SvgRenderer {...svgProps} {...dimension} />
      </AnnotationContainer>
    </Container>
  );
};

SvgAnnotation.defaultProps = {
  color: "black",
  lineWidth: 5,
  fillColor: "transparent",
  backgroundImage: undefined,
};

export default SvgAnnotation;
