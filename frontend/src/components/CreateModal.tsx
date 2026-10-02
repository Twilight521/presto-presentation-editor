import { useState } from "react";
import ErrorPopup from "./ErrorPopup";
import type { Presentation } from "../utils/types";
import ThumbnailUpload from "./ThumbnailUpload";
import styles from "./../styles/elementModal.module.css";

type Props = {
  onClose: () => void;
  onCreate: (_data: Presentation) => void;
};

function CreateModal({ onClose, onCreate }: Props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleCreate = () => {
    const presName = name.trim() || "Untitled presentation";
    const newPresentation: Presentation = {
      id: Date.now(),
      name: presName,
      description,
      thumbnail,
      defaultBackground: {
        type: "solid",
        color: "#ffffff",
      },
      slides: [
        {
          id: Date.now(),
          elements: [],
        },
      ],
    };
    onCreate(newPresentation);
    onClose();
  };

  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreate();
          }}
        >
          <h3 className={styles.title}>Create new presentation</h3>

          <div className={styles.content}>
            <div className={styles.row}>
              <label>Presentation Name</label>
              <input
                name="pName"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className={styles.row}>
              <label>Description</label>
              <input
                name="pDescription"
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.row}>
            <label>Thumbnail</label>
            <ThumbnailUpload onChange={setThumbnail} />
          </div>
          <div className={styles.actions}>
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
        <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
      </div>
    </div>
  );
}

export default CreateModal;
