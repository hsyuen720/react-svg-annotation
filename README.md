# React SVG Annotation

## 🚧 Note: This Project is still under construction. Some Function is not stable.

## Live Demo

[Storybook Demo](https://hsyuen720.github.io/react-svg-annotation/)

## Installation

```shell
# use yarn
yarn add react-svg-annotation

# use npm
npm install react-svg-annotation
```

## Basic Usage

```tsx
import { useSvgAnnotation, SvgRenderer, ImageType, Tools } from "react-svg-annotation";

const App = () => {
  const { svgProps, changeTool, download } = useSvgAnnotation({ color: "black" });
  return (
    <>
      <div>
        <button onClick={() => changeTool(Tools.Pointer)}>pointer</button>
        <button onClick={() => changeTool(Tools.Eraser)}>Eraser</button>
        <button onClick={() => changeTool(Tools.Pen)}>Pen</button>
        <button onClick={() => changeTool(Tools.Circle)}>circle</button>
        <button onClick={() => changeTool(Tools.Rectangle)}>rect</button>
        <button onClick={() => download(ImageType.SVG)}>Download</button>
      </div>
      <SvgRenderer {...svgProps} width={400} height={400} />
    </>
  );
};
```

## Component API
