import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import styles from "./../styles/elementModal.module.css";

export type TextData = {
  width: number;
  height: number;
  text: string;
  fontSize: number;
  color: string;
  fontFamily: string;
  x: number;
  y: number;
};

type TextModalProps = {
  mode: "add" | "edit";
  initialValues?: TextData;
  onClose: () => void;
  onSave: (_values: TextData) => void;
};

function TextModal({ mode, initialValues, onClose, onSave }: TextModalProps) {
  const [width, setWidth] = useState(String(initialValues?.width ?? ""));
  const [height, setHeight] = useState(
    String(initialValues?.height ?? (mode === "add" ? 20 : "")),
  );
  const [text, setText] = useState(initialValues?.text ?? "");
  const [fontSize, setFontSize] = useState(
    String(initialValues?.fontSize ?? ""),
  );
  const [color, setColor] = useState(initialValues?.color ?? "#000000");
  const [fontFamily, setFontFamily] = useState(
    initialValues?.fontFamily ?? "Arial",
  );
  const [x, setX] = useState(String(initialValues?.x ?? 0));
  const [y, setY] = useState(String(initialValues?.y ?? 0));
  const [errorMsg, setErrorMsg] = useState("");
  const colorPickerValue = /^#[0-9a-fA-F]{6}$/.test(color)
    ? color
    : "#000000";

  function handleSubmit() {
    if (
      width.trim() === "" ||
      height.trim() === "" ||
      text.trim() === "" ||
      fontSize.trim() === "" ||
      color.trim() === ""
    ) {
      setErrorMsg("All fields are required");
      return;
    }

    const widthN = Number(width);
    const heightN = Number(height);
    const fontSizeN = Number(fontSize);
    const xN = Number(x);
    const yN = Number(y);

    if (widthN <= 0 || widthN > 100) {
      setErrorMsg("Width must be greater than 0 and no more than 100");
      return;
    }

    if (heightN <= 0 || heightN > 100) {
      setErrorMsg("Height must be greater than 0 and no more than 100");
      return;
    }

    if (fontSizeN < 0.5 || fontSizeN > 10) {
      setErrorMsg("Font size must be between 0.5 and 10");
      return;
    }

    if (mode === "edit" && (xN < 0 || xN > 100 || yN < 0 || yN > 100)) {
      setErrorMsg("X and Y position must be between 0 and 100");
      return;
    }

    onSave({
      width: widthN,
      height: heightN,
      text,
      fontSize: fontSizeN,
      color: color.trim(),
      fontFamily,
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
            {mode === "add" ? "Add text" : "Edit text"}
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
                min={1}
                max={100}
                placeholder="1-100"
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label>Text</label>
              <textarea
                value={text}
                placeholder="Enter text"
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label>Font Size (em)</label>
              <input
                type="number"
                step="0.1"
                value={fontSize}
                min={0.5}
                max={10}
                placeholder="decimal numbers, e.g. 1.2"
                onChange={(e) => setFontSize(e.target.value)}
              />
            </div>

            <div className={styles.row}>
              <label>Text Colour (HEX)</label>
              <div className={styles.colorInputGroup}>
                <input
                  className={styles.colorPicker}
                  type="color"
                  value={colorPickerValue}
                  aria-label="Choose text colour"
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  type="text"
                  value={color}
                  placeholder="#000000"
                  onChange={(e) => setColor(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <label>Font Family</label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
              >
                <option value="Avenir">Avenir</option>
                <option value="Arial">Arial</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Helvetica">Helvetica</option>
                <option value="sans-serif">sans-serif</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Verdana">Verdana</option>
              </select>
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
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">{mode === "add" ? "Add" : "Save"}</button>
          </div>
        </form>
      </div>

      <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
    </div>
  );
}

export default TextModal;
