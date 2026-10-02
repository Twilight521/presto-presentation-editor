import styles from "./SlideControlPanel.module.css";
import type { BackgroundStyle, Slide } from "../../utils/types";
import SlideViewArea from "../SlideViewArea/SlideViewArea";

type SlideControlPanelProps = {
  isOpen: boolean;
  onClose: () => void;
  slides: Slide[];
  defaultBackground?: BackgroundStyle;
  onSelectSlide: (_index: number) => void;
};

function SlideControlPanel({
  isOpen,
  onClose,
  slides,
  defaultBackground,
  onSelectSlide,
}: SlideControlPanelProps) {
  if (!isOpen) return null;

  return (
    <div className={styles.panelBox}>
      <div className={styles.panel}>
        <div className={styles.header}>
          <h3>Slides</h3>
          <button onClick={onClose}>Close</button>
        </div>
        <div className={styles.cardGrid}>
          {slides.map((slide, index) => (
            <button
              type="button"
              className={styles.card}
              key={slide.id}
              onClick={() => onSelectSlide(index)}
            >
              <div className={styles.slidePreview}>
                <SlideViewArea
                  slide={slide}
                  defaultBackground={defaultBackground}
                  isPreview
                  onElementDoubleClick={() => {}}
                  onElementRightClick={() => {}}
                />
              </div>
              <div className={styles.slideNumber}>{index + 1}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SlideControlPanel;
