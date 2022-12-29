import { type FC } from "react";
import { Story, type Meta } from "@storybook/react";
import useSvgAnnotation from "../hooks/useSvgAnnotation";
import SvgRenderer from "../components/svgRenderer";
import AnnotationContainer from "../components/annotationContainer";
import { Tools } from "../constants/tools";

const Mock: FC = () => {
  const { containerProps, svgProps, changeTool } = useSvgAnnotation<HTMLDivElement>();
  return (
    <>
      <button onClick={() => changeTool(Tools.Pointer)}>pointer</button>
      <button onClick={() => changeTool(Tools.Circle)}>circle</button>
      <button onClick={() => changeTool(Tools.Rectangle)}>rect</button>
      <AnnotationContainer {...containerProps}>
        <SvgRenderer {...svgProps} />
      </AnnotationContainer>
    </>
  );
};

export default {
  component: Mock,
  title: "SVG Annotation",
} as Meta;

export const Example: Story = () => <Mock />;
