import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import ThumbnailUpload from "./ThumbnailUpload";
import styles from "./../styles/elementModal.module.css";

type EditThumbnailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (_thumbnail: string) => void;
};

function EditThumbnailModal({
  isOpen,
  onClose,
  onSave,
}: EditThumbnailModalProps) {
  const [thumbnail, setThumbnail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;
  const handleSave = () => {
    if (!thumbnail) {
      setErrorMsg("Please choose an image");
      return;
    }
    onSave(thumbnail);
  };

  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Update thumbnail</h3>
        <div className={styles.content}>
          <div className={styles.imageUploadBox}>
            <label>Thumbnail</label>
            <ThumbnailUpload onChange={setThumbnail} />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit" onClick={handleSave}>
            Update
          </button>
          <button onClick={onClose}>Close</button>
        </div>
        <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
      </div>
    </div>
  );
}

export default EditThumbnailModal;
