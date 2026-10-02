import { useState, type ChangeEvent } from "react";
import type { BackgroundStyle } from "../utils/types";
import ErrorPopup from "./ErrorPopup";
import modalStyles from "../styles/elementModal.module.css";

type BackgroundProps = {
  isOpen: boolean;
  initialBackground?: BackgroundStyle;
  onClose: () => void;
  onSave: (_background: BackgroundStyle) => void;
  onSaveDefault: (_background: BackgroundStyle) => void;
  onResetToDefault: () => void;
};

function BackgroundModal({
  isOpen,
  initialBackground,
  onClose,
  onSave,
  onSaveDefault,
  onResetToDefault,
}: BackgroundProps) {
  const form = getFormState(initialBackground);
  const [backgroundType, setBackgroundType] = useState(form.backgroundType);
  const [selectedColor, setSelectedColor] = useState(form.selectedColor);
  const [uploadedImage, setUploadedImage] = useState(form.uploadedImage);
  const [gradientFrom, setGradientFrom] = useState(form.gradientFrom);
  const [gradientTo, setGradientTo] = useState(form.gradientTo);
  const [gradientDirection, setGradientDirection] = useState(
    form.gradientDirection,
  );
  const [errorMsg, setErrorMsg] = useState("");

  function getFormState(initialBackground?: BackgroundStyle) {
    if (!initialBackground) {
      return {
        backgroundType: "solid" as const,
        selectedColor: "#ffffff",
        uploadedImage: "",
        gradientFrom: "#ffffff",
        gradientTo: "#000000",
        gradientDirection: "to bottom",
        errorMsg: "",
      };
    }
    if (initialBackground.type === "solid") {
      return {
        backgroundType: "solid" as const,
        selectedColor: initialBackground.color,
        uploadedImage: "",
        gradientFrom: "#ffffff",
        gradientTo: "#000000",
        gradientDirection: "to bottom",
        errorMsg: "",
      };
    }
    if (initialBackground.type === "image") {
      return {
        backgroundType: "image" as const,
        selectedColor: "#ffffff",
        uploadedImage: initialBackground.src,
        gradientFrom: "#ffffff",
        gradientTo: "#000000",
        gradientDirection: "to bottom",
        errorMsg: "",
      };
    }

    return {
      backgroundType: "gradient" as const,
      selectedColor: "#ffffff",
      uploadedImage: "",
      gradientFrom: initialBackground.from,
      gradientTo: initialBackground.to,
      gradientDirection: initialBackground.direction,
      errorMsg: "",
    };
  }

  function resetForm() {
    const form = getFormState(initialBackground);
    setBackgroundType(form.backgroundType);
    setSelectedColor(form.selectedColor);
    setUploadedImage(form.uploadedImage);
    setGradientFrom(form.gradientFrom);
    setGradientTo(form.gradientTo);
    setGradientDirection(form.gradientDirection);
    setErrorMsg("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "solid" | "image" | "gradient";
    setBackgroundType(value);
    setErrorMsg("");
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSlideBg = () => {
    if (backgroundType === "solid") {
      onSave({
        type: "solid",
        color: selectedColor,
      });
      return;
    }

    if (backgroundType === "image") {
      if (!uploadedImage) {
        setErrorMsg("Please select a background image.");
        return;
      }
      onSave({
        type: "image",
        src: uploadedImage,
      });
    }

    if (backgroundType === "gradient") {
      onSave({
        type: "gradient",
        from: gradientFrom,
        to: gradientTo,
        direction: gradientDirection,
      });
    }
  };

  const handleSaveDefaultBg = () => {
    if (backgroundType === "solid") {
      onSaveDefault({
        type: "solid",
        color: selectedColor,
      });
      return;
    }

    if (backgroundType === "image") {
      if (!uploadedImage) {
        setErrorMsg("Please select a background image");
        return;
      }
      onSaveDefault({
        type: "image",
        src: uploadedImage,
      });
    }

    if (backgroundType === "gradient") {
      onSaveDefault({
        type: "gradient",
        from: gradientFrom,
        to: gradientTo,
        direction: gradientDirection,
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className={modalStyles.modalBg}>
      <div className={modalStyles.modal}>
        <h3 className={modalStyles.title}>Background</h3>
        <button type="button" onClick={handleClose}>
          Cancel
        </button>
        <div className={modalStyles.content}>
          <div className={modalStyles.row}>
            <label>Background type</label>
            <select value={backgroundType} onChange={handleTypeChange}>
              <option value="solid">Solid colour</option>
              <option value="image">Image</option>
              <option value="gradient">Gradient</option>
            </select>
          </div>
        </div>

        {backgroundType === "solid" && (
          <div>
            <label>Solid colour</label>
            <input
              className={modalStyles.colorPicker}
              type="color"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            />
          </div>
        )}

        {backgroundType === "image" && (
          <div className={modalStyles.imageUploadBox}>
            <div className={modalStyles.row}>
              <label>Background image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
            </div>

            {uploadedImage && (
              <div className={modalStyles.preview}>
                <img src={uploadedImage} alt="Background preview" />
              </div>
            )}
          </div>
        )}

        {backgroundType === "gradient" && (
          <div>
            <div className={modalStyles.colorRow}>
              <div className={modalStyles.colorBox}>
                <label>From colour</label>
                <input
                  type="color"
                  value={gradientFrom}
                  className={modalStyles.colorPicker}
                  onChange={(e) => setGradientFrom(e.target.value)}
                />
              </div>

              <div className={modalStyles.colorBox}>
                <label>To colour</label>
                <input
                  type="color"
                  className={modalStyles.colorPicker}
                  value={gradientTo}
                  onChange={(e) => setGradientTo(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label>Direction</label>
              <select
                value={gradientDirection}
                onChange={(e) => setGradientDirection(e.target.value)}
              >
                <option value="to bottom">Top to bottom</option>
                <option value="to right">Left to right</option>
                <option value="to bottom right">
                  Top left to bottom right
                </option>
                <option value="to bottom left">Top right to bottom left</option>
              </select>
            </div>
          </div>
        )}

        <div className={modalStyles.actions}>
          <button type="button" onClick={handleSaveSlideBg}>
            Save current slide
          </button>

          <button type="button" onClick={onResetToDefault}>
            Apply default background
          </button>

          <button type="button" onClick={handleSaveDefaultBg}>
            Save Default Background
          </button>
        </div>
        <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
      </div>
    </div>
  );
}

export default BackgroundModal;
