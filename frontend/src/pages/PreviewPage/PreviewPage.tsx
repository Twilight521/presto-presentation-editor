import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { Presentation } from "../../utils/types";
import { fetchPresentations } from "../../utils/api";
import SlideViewArea from "../../components/SlideViewArea/SlideViewArea";
import ErrorPopup from "../../components/ErrorPopup";
import styles from "./PreviewPage.module.css";

function PreviewPage() {
  const navigate = useNavigate();
  const { presentationId, slideNumber } = useParams();
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const currentSlideNumber = Number(slideNumber);
  const currentSlideIndex = currentSlideNumber - 1;
  const currentSlide = presentation?.slides[currentSlideIndex] || null;

  useEffect(() => {
    fetchPresentations()
      .then((presentations) => {
        const currPresentation = presentations.find(
          (p: Presentation) => p.id === Number(presentationId),
        );
        setPresentation(currPresentation || null);
      })
      .catch((error) => {
        setErrorMsg(String(error));
      });
  }, [presentationId]);

  useEffect(() => {
    if (!presentation) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentSlideNumber > 1) {
        navigate(
          `/presentation/preview/${presentationId}/${currentSlideNumber - 1}`,
        );
      }
      if (
        event.key === "ArrowRight" &&
        currentSlideNumber < presentation.slides.length
      ) {
        navigate(
          `/presentation/preview/${presentationId}/${currentSlideNumber + 1}`,
        );
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [presentation, presentationId, currentSlideNumber, navigate]);

  return (
    <div className={styles.previewPage}>
      {/* view slide canva area */}
      <div className={styles.previewCanvas}>
        <div className={styles.previewFrame}>
          <div className={styles.previewSlideBox}>
            <SlideViewArea
              slide={currentSlide}
              slideNumber={currentSlideNumber}
              defaultBackground={presentation?.defaultBackground}
              isPreview={true}
              onElementDoubleClick={() => {}}
              onElementRightClick={() => {}}
            />
          </div>
        </div>
      </div>
      <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
    </div>
  );
}

export default PreviewPage;
