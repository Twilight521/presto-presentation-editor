type BaseElement = {
  id: number;
  width: number;
  x: number;
  y: number;
  layer: number;
};

type SizedElement = BaseElement & {
  height: number;
};

export type SolidBackground = {
  type: 'solid';
  color: string;
};

export type ImageBackground = {
  type: 'image';
  src: string;
};

export type GradientBackground = {
  type: 'gradient';
  from: string;
  to: string;
  direction: string;
};

export type BackgroundStyle = SolidBackground | ImageBackground | GradientBackground;

export type TextElement = SizedElement & {
  type: 'text';
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
};

export type ImageElement = SizedElement & {
  type: 'image';
  src: string;
  description: string;
};

export type VideoElement = SizedElement & {
  type: 'video';
  src: string;
  autoplay: boolean;
};

export type CodeLanguage = 'c' | 'python' | 'javascript';

export type CodeElement = SizedElement & {
  type: 'code';
  code: string;
  fontSize: number;
  language: CodeLanguage;
};

export type SlideElement = TextElement | ImageElement | VideoElement | CodeElement;

export type Slide = {
  id: number;
  elements: SlideElement[];
  background?:BackgroundStyle;
};

export type Presentation = {
  id: number;
  name: string;
  description: string;
  thumbnail: string;
  defaultBackground: BackgroundStyle;
  slides: Slide[];
};
