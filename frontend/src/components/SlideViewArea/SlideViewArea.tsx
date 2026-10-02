// video display docs from
// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/iframe
// code highlighter from https://www.npmjs.com/package/react-syntax-highlighter
// code theme from https://github.com/react-syntax-highlighter/react-syntax-highlighter/blob/HEAD/AVAILABLE_STYLES_HLJS.MD

import type { BackgroundStyle, Slide, SlideElement } from "../../utils/types";
import styles from "./SlideViewArea.module.css";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import js from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import python from "react-syntax-highlighter/dist/esm/languages/hljs/python";
import c from "react-syntax-highlighter/dist/esm/languages/hljs/c";
import { atomOneLight } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { memo } from "react";

SyntaxHighlighter.registerLanguage("javascript", js);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("c", c);

type SlideViewAreaProps = {
  slide: Slide | null;
  slideNumber?: number;
  defaultBackground?: BackgroundStyle;
  isPreview?: boolean;
  onElementDoubleClick: (_element: SlideElement) => void;
  onElementRightClick: (_element: SlideElement) => void;
};

function SlideViewArea({
  slide,
  slideNumber,
  defaultBackground,
  isPreview = false,
  onElementDoubleClick,
  onElementRightClick,
}: SlideViewAreaProps) {
  if (!slide) {
    return <div>No slide found</div>;
  }

  const getBgStyle = (background: BackgroundStyle) => {
    if (!background) return {};
    if (background.type === "solid") {
      return { background: background.color };
    }
    if (background.type === "image") {
      return {
        backgroundImage: `url(${background.src})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      };
    }
    if (background.type === "gradient") {
      return {
        background: `linear-gradient(${background.direction}, ${background.from}, ${background.to})`,
      };
    }
    return {};
  };

  let slideStyle = {};
  const interactionHint = isPreview
    ? undefined
    : "Double-click to edit. Right-click to delete.";
  if (slide.background) {
    slideStyle = getBgStyle(slide.background);
  } else if (defaultBackground) {
    slideStyle = getBgStyle(defaultBackground);
  }

  return (
    <div
      className={`${styles.slideViewArea} ${isPreview ? styles.previewSlideViewArea : ""}`}
      style={slideStyle}
    >
      {/* bottom-left slide number */}
      {slideNumber !== undefined && (
        <div className={styles.slideNumber}>{slideNumber}</div>
      )}
      {slide.elements.map((element) => {
        if (element.type === "text") {
          const textHeight = element.height ?? 20;

          return (
            <div
              key={element.id}
              title={interactionHint}
              className={`${styles.textBox} ${isPreview ? styles.previewTextBox : ""}`}
              onDoubleClick={() => onElementDoubleClick(element)}
              onContextMenu={(e) => {
                e.preventDefault();
                onElementRightClick(element);
              }}
              style={{
                width: `${element.width}%`,
                height: `${textHeight}%`,
                fontSize: `${element.fontSize}em`,
                color: element.color,
                left: `${((100 - element.width) * element.x) / 100}%`,
                top: `${((100 - textHeight) * element.y) / 100}%`,
                zIndex: element.layer,
                fontFamily: element.fontFamily || "sans-serif",
              }}
            >
              {element.text}
            </div>
          );
        }

        if (element.type === "image") {
          return (
            <div
              key={element.id}
              title={interactionHint}
              className={`${styles.imageBox} ${isPreview ? styles.previewImageBox : ""}`}
              onDoubleClick={() => onElementDoubleClick(element)}
              onContextMenu={(e) => {
                e.preventDefault();
                onElementRightClick(element);
              }}
              style={{
                width: `${element.width}%`,
                height: `${element.height}%`,
                left: `${element.x}%`,
                top: `${element.y}%`,
                zIndex: element.layer,
              }}
            >
              <img
                src={element.src}
                alt={element.description}
                className={styles.image}
              />
            </div>
          );
        }

        if (element.type === "video") {
          let videoUrl = element.src;
          if (element.autoplay) {
            if (element.src.includes("?")) {
              videoUrl = element.src + "&autoplay=1";
            } else {
              videoUrl = element.src + "?autoplay=1";
            }
          }
          return (
            <div
              key={element.id}
              title={interactionHint}
              className={`${styles.videoBox} ${isPreview ? styles.previewVideoBox : ""}`}
              onDoubleClick={() => onElementDoubleClick(element)}
              onContextMenu={(e) => {
                e.preventDefault();
                onElementRightClick(element);
              }}
              style={{
                width: `${element.width}%`,
                height: `${element.height}%`,
                left: `${element.x}%`,
                top: `${element.y}%`,
                zIndex: element.layer,
              }}
            >
              <div className={styles.videoFrame}>
                <iframe
                  title="Embedded video"
                  src={videoUrl}
                  className={styles.video}
                  allow="autoplay; encrypted-media; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          );
        }

        if (element.type === "code") {
          return (
            <div
              key={element.id}
              title={interactionHint}
              className={`${styles.codeBox} ${isPreview ? styles.previewCodeBox : ""}`}
              onDoubleClick={() => onElementDoubleClick(element)}
              onContextMenu={(e) => {
                e.preventDefault();
                onElementRightClick(element);
              }}
              style={{
                width: `${element.width}%`,
                height: `${element.height}%`,
                left: `${element.x}%`,
                top: `${element.y}%`,
                zIndex: element.layer,
              }}
            >
              <div
                className={`${styles.languageLabel} ${isPreview ? styles.previewLanguageLabel : ""}`}
              >
                {element.language}
              </div>
              <SyntaxHighlighter
                language={element.language}
                style={atomOneLight}
                customStyle={{
                  margin: 0,
                  fontSize: `${element.fontSize}em`,
                }}
              >
                {element.code}
              </SyntaxHighlighter>
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

export default memo(SlideViewArea);
