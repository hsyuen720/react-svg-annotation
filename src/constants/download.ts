export enum ImageType {
  SVG = "svg",
  PNG = "png",
  JPG = "jpg",
}

export const ImageExtension: { [K in ImageType]: string } = {
  [ImageType.SVG]: ".svg",
  [ImageType.PNG]: ".png",
  [ImageType.JPG]: ".jpg",
};

export const CanvasImageMap = {
  [ImageType.PNG]: "image/png",
  [ImageType.JPG]: "image/jpg",
};
