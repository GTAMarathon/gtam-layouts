declare module 'big-text.js' {
  interface Options {
    rotateText?: number;
    fontSizeFactor?: number;
    maximumFontSize?: number;
    limitingDimension?: 'width' | 'height' | 'both';
    horizontalAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'center' | 'bottom';
    textAlign?: 'left' | 'center' | 'right';
    whiteSpace?: 'nowrap' | 'pre';
  }
  function BigText(element: HTMLElement, options?: Options): void;
  export = BigText;
}
