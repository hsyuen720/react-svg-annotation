import { DetailedHTMLProps, forwardRef, HTMLAttributes } from "react";
import { Container } from "./styles";

export type AnnotationContainerProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const AnnotationContainer = forwardRef<HTMLDivElement, AnnotationContainerProps>((props, ref) => {
  return <Container {...props} ref={ref} />;
});

AnnotationContainer.displayName = "AnnotationContainer";

export default AnnotationContainer;
