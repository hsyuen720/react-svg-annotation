import type { Meta, Story } from "@storybook/react";

import SvgAnnotation, { SvgAnnotationProps } from "../components/svgAnnotation";

export default {
  component: SvgAnnotation,
  title: "SVG Annotation",
} as Meta;

const Template: Story<SvgAnnotationProps> = (props) => <SvgAnnotation {...props} />;

export const Basic = Template.bind({});
Basic.args = {
  color: "black",
  lineWidth: 5,
  fillColor: "transparent",
  width: 400,
  height: 400,
};
