import styles from "./../styles/elementModal.module.css";

type Props = {
  message: string;
  onClose: () => void;
};

function ErrorPopup({ message, onClose }: Props) {
  if (!message) return null;

  return (
    <div className={styles.modalBg}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Error</h3>

        <div className={styles.content}>
          <p>{message}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPopup;
