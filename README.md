# React SVG Annotation

The SVG Annotation Tool

## Live Demo

Checkout [Storybook Demo](https://hsyuen720.github.io/react-svg-annotation/) to get more information!

## Installation

```shell
# use yarn
yarn add react-svg-annotation

# use npm
npm install react-svg-annotation
```

## Basic Usage

```tsx
import { SvgAnnotation } from "react-svg-annotation";

const Example = () => {
  return <SvgAnnotation width={400} height={400} />;
};

export default Example;
```

## Advanced Usage with Custom UI

If `SvgAnnotation` Component is not suitable for your use case, you may combine `useSvgAnnotation` and `SvgRenderer` to make your own component

```tsx
import { useSvgAnnotation, SvgRenderer } from "react-svg-annotation";

const Example = () => {
  const { svgProps, changeTool, tool } = useSvgAnnotation({
    styleOption: {
      color: "black",
      fillColor: "transparent",
      lineWidth: 5,
    },
  });

  return (
    <div>
      <div>{/* Custom Control Component */}</div>
      <SvgRenderer {...svgProps} width={400} height={400} />
    </div>
  );
};

export default Example;
```

## Common Type

### `Annotation`

```tsx
type Annotation = Array<SVGObject>; // list of SVG Object
```

### `SVGStyleOption`

```tsx
type SVGStyleOption = Partial<{
  color: string;
  lineWidth: number;
  fillColor: string;
}>;
```

| Property    | Type     | Description                 | Default Value |
| :---------- | :------- | :-------------------------- | :------------ |
| `color`     | `string` | stroke color of svg element | `black`       |
| `fillColor` | `string` | fill color of svg element   | `transparent` |
| `lineWidth` | `number` | stroke width of svg element | `5`           |

## Component API

### `SvgAnnotation` Component

```tsx
interface SvgAnnotationProps extends SVGStyleOption {
  backgroundImage?: string;
  width?: number;
  height?: number;
  value?: Annotation;
  onChange?: (value: Annotation) => void;
}
```

| Property          | Type                          | Description                 | Default Value |
| ----------------- | ----------------------------- | --------------------------- | ------------- |
| `backgroundImage` | `string`                      | custom background image url | `NA`          |
| `width`           | `number`                      | width of svg                | `400`         |
| `height`          | `number`                      | height of svg               | `400`         |
| `value`           | `Annotation`                  | Annotation Object           | `undefined`   |
| `onChange`        | `(value: Annotation) => void` | handle change function      | `undefined`   |

### `useSvgAnnotation` hook

```tsx
type UseSvgAnnotationParams = {
  styleOption?: SVGStyleOption;
  value?: Annotation;
  onChange?: (value: Annotation) => void;
};

type UseSvgAnnotation<T extends SVGSVGElement> = (options?: UseSvgAnnotationParams) => {
  svgProps: SvgRendererProps;
  tool: Tools;
  changeTool: (value: Tools) => void;
  download: (type: ImageType) => void;
  toSvgString: () => string | null;
};
```

### `SvgRenderer` Component

```tsx
interface SvgRendererProps extends SVGAttributes<SVGSVGElement> {
  tool: Tools;
  annotation: Annotation;
  currentSVGObject: SVGObject | null;
  shapeControl: ShapeControl | null;
}
```
