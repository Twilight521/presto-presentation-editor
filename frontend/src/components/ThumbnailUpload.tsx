import { useState, type ChangeEvent } from "react";
import ErrorPopup from "./ErrorPopup";
import styles from "./../styles/elementModal.module.css";

type ThumbnailUploadProps = {
  onChange: (_thumbnail: string) => void;
};

function ThumbnailUpload({ onChange }: ThumbnailUploadProps) {
  const [preview, setPreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleThumbnailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    setPreview(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
    };
    reader.onerror = () => {
      setErrorMsg("Failed to read image file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <input type="file" accept="image/*" onChange={handleThumbnailChange} />

      {preview && (
        <div className={styles.preview}>
          <img src={preview} alt="Thumbnail preview" />
        </div>
      )}

      <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
    </>
  );
}

export default ThumbnailUpload;
