import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import styles from "./../styles/elementModal.module.css";

export type CodeData = {
  width: number;
  height: number;
  code: string;
  fontSize: number;
  x: number;
  y: number;
};

type CodeModalProps = {
  mode: "add" | "edit";
  initialValues?: CodeData;
  onClose: () => void;
  onSave: (_values: CodeData) => void;
};

function CodeModal({ mode, initialValues, onClose, onSave }: CodeModalProps) {
  const [width, setWidth] = useState(String(initialValues?.width ?? ""));
  const [height, setHeight] = useState(String(initialValues?.height ?? ""));
  const [code, setCode] = useState(initialValues?.code ?? "");
  const [fontSize, setFontSize] = useState(
    String(initialValues?.fontSize ?? ""),
  );
  const [x, setX] = useState(String(initialValues?.x ?? 0));
  const [y, setY] = useState(String(initialValues?.y ?? 0));
  const [errorMsg, setErrorMsg] = useState("");

  function handleSubmit() {
    if (
      width.trim() === "" ||
      height.trim() === "" ||
      code.trim() === "" ||
      fontSize.trim() === ""
    ) {
      setErrorMsg("All fields are required");
      return;
    }

    const widthN = Number(width);
    const heightN = Number(height);
    const fontSizeN = Number(fontSize);
    const xN = Number(x);
    const yN = Number(y);

    if (widthN < 0 || widthN > 100 || heightN < 0 || heightN > 100) {
      setErrorMsg("Width and Height must be between 0 and 100");
      return;
    }

    if (Number.isNaN(fontSizeN) || fontSizeN <= 0) {
      setErrorMsg("Font size must be greater than 0");
      return;
    }

    if (mode === "edit" && (xN < 0 || xN > 100 || yN < 0 || yN > 100)) {
      setErrorMsg("X and Y position must be between 0 and 100");
      return;
    }

    onSave({
      width: widthN,
      height: heightN,
      code,
      fontSize: fontSizeN,
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
            {mode === "add" ? "Add code" : "Edit code"}
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
              <label>Code</label>
              <textarea
                value={code}
                placeholder="Enter code"
                onChange={(e) => setCode(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label>Font Size (em)</label>
              <input
                type="number"
                step="0.1"
                min={0.5}
                value={fontSize}
                placeholder="decimal numbers"
                onChange={(e) => setFontSize(e.target.value)}
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

export default CodeModal;
