import { useState, type ChangeEvent } from "react";
import ErrorPopup from "./ErrorPopup";
import styles from "./../styles/elementModal.module.css";

export type ImageData = {
  width: number;
  height: number;
  src: string;
  description: string;
  x: number;
  y: number;
};

type ImageModalProps = {
  mode: "add" | "edit";
  initialValues?: ImageData;
  onClose: () => void;
  onSave: (_values: ImageData) => void;
};

function ImageModal({ mode, initialValues, onClose, onSave }: ImageModalProps) {
  const [width, setWidth] = useState(String(initialValues?.width ?? ""));
  const [height, setHeight] = useState(String(initialValues?.height ?? ""));
  const [src, setSrc] = useState(initialValues?.src ?? "");
  const [description, setDescription] = useState(
    initialValues?.description ?? "",
  );
  const [x, setX] = useState(String(initialValues?.x ?? 0));
  const [y, setY] = useState(String(initialValues?.y ?? 0));
  const [preview, setPreview] = useState(initialValues?.src ?? "");
  const [errorMsg, setErrorMsg] = useState("");

  function handleImageChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => {
      setSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    if (
      width.trim() === "" ||
      height.trim() === "" ||
      src.trim() === "" ||
      description.trim() === ""
    ) {
      setErrorMsg("All fields are required");
      return;
    }

    const widthN = Number(width);
    const heightN = Number(height);
    const xN = Number(x);
    const yN = Number(y);

    if (widthN < 0 || widthN > 100 || heightN < 0 || heightN > 100) {
      setErrorMsg("Width and Height must be numbers between 0 and 100");
      return;
    }

    if (mode === "edit" && (xN < 0 || xN > 100 || yN < 0 || yN > 100)) {
      setErrorMsg("X and Y position must be numbers between 0 and 100");
      return;
    }

    onSave({
      width: widthN,
      height: heightN,
      src,
      description: description.trim(),
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
            {mode === "add" ? "Add image" : "Edit image"}
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
              <label>Upload image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>

            <div className={styles.preview}>
              {preview && (
                <div>
                  <img src={preview} alt="Image preview" width="120" />
                </div>
              )}
            </div>

            <div className={styles.row}>
              <label>Description</label>
              <input
                type="text"
                value={description}
                placeholder="Enter text"
                onChange={(e) => setDescription(e.target.value)}
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

export default ImageModal;
