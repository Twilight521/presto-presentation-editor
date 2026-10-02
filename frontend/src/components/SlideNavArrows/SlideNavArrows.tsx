import styles from "./SlideNavArrows.module.css";

type Props = {
  onPrev: () => void;
  onNext: () => void;
  isFirst: boolean;
  isLast: boolean;
};

function SlideNavArrows({ onPrev, onNext, isFirst, isLast }: Props) {
  return (
    <div className={styles.container}>
      <button onClick={onPrev} disabled={isFirst}>
        ←
      </button>
      <button onClick={onNext} disabled={isLast}>
        →
      </button>
    </div>
  );
}

export default SlideNavArrows;
