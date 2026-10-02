import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import styles from "./../styles/elementModal.module.css";

export type VideoData = {
  width: number;
  height: number;
  src: string;
  autoplay: boolean;
  x: number;
  y: number;
};

type VideoModalProps = {
  mode: "add" | "edit";
  initialValues?: VideoData;
  onClose: () => void;
  onSave: (_values: VideoData) => void;
};

function VideoModal({ mode, initialValues, onClose, onSave }: VideoModalProps) {
  const [width, setWidth] = useState(String(initialValues?.width ?? ""));
  const [height, setHeight] = useState(String(initialValues?.height ?? ""));
  const [src, setSrc] = useState(initialValues?.src ?? "");
  const [autoplay, setAutoplay] = useState(initialValues?.autoplay ?? false);
  const [x, setX] = useState(String(initialValues?.x ?? 0));
  const [y, setY] = useState(String(initialValues?.y ?? 0));
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit() {
    if (width.trim() === "" || height.trim() === "" || src.trim() === "") {
      setErrorMsg("All fields are required");
      return;
    }

    const widthN = Number(width);
    const heightN = Number(height);
    const xN = Number(x);
    const yN = Number(y);

    if (
      Number.isNaN(widthN) ||
      Number.isNaN(heightN) ||
      widthN < 0 ||
      widthN > 100 ||
      heightN < 0 ||
      heightN > 100
    ) {
      setErrorMsg("Width and Height must be numbers between 0 and 100");
      return;
    }

    if (
      mode === "edit" &&
      (Number.isNaN(xN) ||
        Number.isNaN(yN) ||
        xN < 0 ||
        xN > 100 ||
        yN < 0 ||
        yN > 100)
    ) {
      setErrorMsg("X and Y position must be numbers between 0 and 100");
      return;
    }

    onSave({
      width: widthN,
      height: heightN,
      src,
      autoplay,
      x: mode === "edit" ? xN : 0,
      y: mode === "edit" ? yN : 0,
    });
  }

  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <h3 className={styles.title}>
            {mode === "add" ? "Add video" : "Edit video"}
          </h3>

          <div className={styles.content}>
            <div className={styles.row}>
              <label>Width (%)</label>
              <input
                type="number"
                value={width}
                min={0}
                max={100}
                placeholder="0-100"
                onChange={(e) => setWidth(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label>Height (%)</label>
              <input
                type="number"
                value={height}
                min={0}
                max={100}
                placeholder="0-100"
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label>YouTube video URL</label>
              <input
                type="text"
                value={src}
                placeholder="https://www.youtube.com/embed/..."
                onChange={(e) => setSrc(e.target.value)}
              />
            </div>

            <div className={styles.checkboxRow}>
              <label>Autoplay</label>
              <input
                type="checkbox"
                checked={autoplay}
                onChange={(e) => setAutoplay(e.target.checked)}
              />
            </div>

            {mode === "edit" && (
              <>
                <div className={styles.row}>
                  <label>X position (%)</label>
                  <input
                    type="number"
                    value={x}
                    min={0}
                    max={100}
                    placeholder="0-100"
                    onChange={(e) => setX(e.target.value)}
                  />
                </div>

                <div className={styles.row}>
                  <label>Y position (%)</label>
                  <input
                    type="number"
                    value={y}
                    min={0}
                    max={100}
                    placeholder="0-100"
                    onChange={(e) => setY(e.target.value)}
                  />
                </div>
              </>
            )}
          </div>

          <div className={styles.actions}>
            <button type="submit">{mode === "add" ? "Add" : "Save"}</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
    </div>
  );
}

export default VideoModal;
