import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type {
  BackgroundStyle,
  CodeElement,
  ImageElement,
  Presentation,
  Slide,
  SlideElement,
  TextElement,
  VideoElement,
} from "../../utils/types";
import {
  fetchPresentations,
  getStore,
  isAuthError,
  setStore,
} from "../../utils/api";
import styles from "./EditPage.module.css";
import modalStyles from "../../styles/elementModal.module.css";
import checkCodeLanguage from "../../utils/checkCodeLanguage";
import SlideViewArea from "../../components/SlideViewArea/SlideViewArea";
import ErrorPopup from "../../components/ErrorPopup";
import SlideControlPanel from "../../components/SlideControlPanel/SlideControlPanel";

import editIcon from "../../assets/icons/edit.svg";
import thumbnailIcon from "../../assets/icons/thumbnail.svg";
import deletePresIcon from "../../assets/icons/deletePres.svg";
import textIcon from "../../assets/icons/text.svg";
import imageIcon from "../../assets/icons/image.svg";
import videoIcon from "../../assets/icons/video.svg";
import codeIcon from "../../assets/icons/code.svg";
import addSlideIcon from "../../assets/icons/addSlide.svg";
import deleteSlideIcon from "../../assets/icons/deleteSlide.svg";
import themeIcon from "../../assets/icons/theme.svg";
import previewIcon from "../../assets/icons/preview.svg";
import panelIcon from "../../assets/icons/panel.svg";

import EditThumbnailModal from "../../components/EditThumbnail";
import BackgroundModal from "../../components/BackgroundModal";
import SlideNavArrows from "../../components/SlideNavArrows/SlideNavArrows";
import TextModal, { type TextData } from "../../components/TextModal";
import ImageModal, { type ImageData } from "../../components/ImageModal";
import CodeModal, { type CodeData } from "../../components/CodeModal";
import VideoModal, { type VideoData } from "../../components/VideoModal";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function EditPage() {
  const navigate = useNavigate();
  const { presentationId, slideNumber } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [presentation, setPresentation] = useState<Presentation | null>(null);
  const [presTitle, setPresTitle] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [activeModal, setActiveModal] = useState<
    | null
    | { type: "editTitle" }
    | { type: "editThumbnail" }
    | { type: "backgroundChange" }
    | { type: "deletePresentation" }
    | { type: "deleteLastSlideConfirm" }
    | { type: "addText" }
    | { type: "addImage" }
    | { type: "addVideo" }
    | { type: "addCode" }
    | { type: "editText"; element: TextElement }
    | { type: "editImage"; element: ImageElement }
    | { type: "editVideo"; element: VideoElement }
    | { type: "editCode"; element: CodeElement }
    | { type: "slidePanel" }
  >(null);

  const currentSlideNumber = Number(slideNumber);
  const currentSlideIndex = currentSlideNumber - 1;
  const currentSlide = presentation?.slides[currentSlideIndex] || null;

  const isFirstSlide = currentSlideNumber === 1;
  const isLastSlide = presentation
    ? currentSlideNumber === presentation.slides.length
    : false;

  const handleError = (error: unknown) => {
    if (isAuthError(error)) {
      localStorage.removeItem("token");
      navigate("/login");
      return;
    }

    setErrorMsg(String(error));
  };

  const getElementNewLayer = (slide: Slide) => {
    let layer = 1;

    if (slide.elements.length !== 0) {
      layer = Math.max(...slide.elements.map((element) => element.layer)) + 1;
    }

    return layer;
  };

  useEffect(() => {
    fetchPresentations()
      .then((presentations) => {
        const currPresentation = presentations.find(
          (p: Presentation) => p.id === Number(presentationId),
        );

        setPresentation(currPresentation || null);
      })
      .catch((error) => {
        handleError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [presentationId]);

  useEffect(() => {
    if (!presentation || activeModal) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft" && currentSlideNumber > 1) {
        navigate(
          `/presentation/edit/${presentationId}/${currentSlideNumber - 1}`,
        );
      }

      if (
        event.key === "ArrowRight" &&
        currentSlideNumber < presentation.slides.length
      ) {
        navigate(
          `/presentation/edit/${presentationId}/${currentSlideNumber + 1}`,
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [presentation, activeModal, presentationId, currentSlideNumber, navigate]);

  const handleBack = () => {
    navigate("/dashboard");
  };

  const savePresentationToStore = async (updatedPresentation: Presentation) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const previousPresentation = presentation;
    setSaveStatus("saving");

    try {
      const data = await getStore(token);
      const store = data.store;

      const updatedPresentations = store.presentations.map(
        (p: Presentation) => {
          if (p.id !== Number(presentationId)) return p;
          return updatedPresentation;
        },
      );

      await setStore(token, {
        presentations: updatedPresentations,
      });
      setSaveStatus("saved");
    } catch (error: unknown) {
      setPresentation(previousPresentation);
      setSaveStatus("error");
      handleError(error);
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setActiveModal(null);

    try {
      const data = await getStore(token);
      const store = data.store;

      const updatedPresentations = store.presentations.filter(
        (p: Presentation) => p.id !== Number(presentationId),
      );

      await setStore(token, {
        presentations: updatedPresentations,
      });

      navigate("/dashboard");
    } catch (error: unknown) {
      handleError(error);
    }
  };

  const handleOpenEditTitleModal = () => {
    setPresTitle(presentation?.name || "Untitled presentation");
    setActiveModal({ type: "editTitle" });
  };

  const handleUpdateTitle = async () => {
    if (!presentation) return;

    const finalTitle = presTitle.trim() || "Untitled presentation";

    const updatedPresentation: Presentation = {
      ...presentation,
      name: finalTitle,
    };

    setPresentation(updatedPresentation);
    setActiveModal(null);

    await savePresentationToStore(updatedPresentation);
  };

  const handleUpdateThumbnail = async (newThumbnail: string) => {
    if (!presentation) return;

    const updatedPresentation: Presentation = {
      ...presentation,
      thumbnail: newThumbnail,
    };

    setPresentation(updatedPresentation);
    setActiveModal(null);

    await savePresentationToStore(updatedPresentation);
  };

  const handleAddSlide = async () => {
    if (!presentation) return;

    const newSlide: Slide = {
      id: Date.now(),
      elements: [],
    };

    const updatedPresentation: Presentation = {
      ...presentation,
      slides: [...presentation.slides, newSlide],
    };

    const newSlideNumber = updatedPresentation.slides.length;

    setPresentation(updatedPresentation);
    navigate(`/presentation/edit/${presentationId}/${newSlideNumber}`);

    await savePresentationToStore(updatedPresentation);
  };

  const handleDeleteSlide = async () => {
    if (!presentation) return;

    if (presentation.slides.length === 1) {
      setActiveModal({ type: "deleteLastSlideConfirm" });
      return;
    }

    const updatedSlides = presentation.slides.filter((_, index) => {
      return index !== currentSlideIndex;
    });

    let newDisplaySlideNo = currentSlideNumber;

    if (newDisplaySlideNo > updatedSlides.length) {
      newDisplaySlideNo = updatedSlides.length;
    }

    const updatedPresentation: Presentation = {
      ...presentation,
      slides: updatedSlides,
    };

    setPresentation(updatedPresentation);
    navigate(`/presentation/edit/${presentationId}/${newDisplaySlideNo}`);

    await savePresentationToStore(updatedPresentation);
  };

  const goToPrevSlide = () => {
    if (currentSlideNumber > 1) {
      navigate(
        `/presentation/edit/${presentationId}/${currentSlideNumber - 1}`,
      );
    }
  };

  const goToNextSlide = () => {
    if (presentation && currentSlideNumber < presentation.slides.length) {
      navigate(
        `/presentation/edit/${presentationId}/${currentSlideNumber + 1}`,
      );
    }
  };

  const updateCurrentSlideHelper = async (
    updateSlideFn: (_slide: Slide) => Slide,
  ) => {
    if (!presentation) return;

    const updatedPresentation: Presentation = {
      ...presentation,
      slides: presentation.slides.map((slide, index) => {
        if (index !== currentSlideIndex) return slide;
        return updateSlideFn(slide);
      }),
    };

    setPresentation(updatedPresentation);

    await savePresentationToStore(updatedPresentation);
  };

  const handleChangeDefaultBg = async (background: BackgroundStyle) => {
    if (!presentation) return;

    const updatedPresentation: Presentation = {
      ...presentation,
      defaultBackground: background,
    };

    setPresentation(updatedPresentation);
    setActiveModal(null);

    await savePresentationToStore(updatedPresentation);
  };

  const handleSlideBgChange = async (background: BackgroundStyle) => {
    setActiveModal(null);

    await updateCurrentSlideHelper((slide) => {
      return {
        ...slide,
        background,
      };
    });
  };

  const addElementToSlide = async (newElement: SlideElement) => {
    await updateCurrentSlideHelper((slide) => {
      return {
        ...slide,
        elements: [...slide.elements, newElement],
      };
    });
  };

  const updateElementInSlide = async (updatedElement: SlideElement) => {
    await updateCurrentSlideHelper((slide) => {
      return {
        ...slide,
        elements: slide.elements.map((element) => {
          if (element.id !== updatedElement.id) return element;
          return updatedElement;
        }),
      };
    });
  };

  const handleAddText = async (newTextEl: TextData) => {
    if (!currentSlide) return;

    setActiveModal(null);

    const newElement: TextElement = {
      id: Date.now(),
      type: "text",
      width: newTextEl.width,
      height: newTextEl.height,
      text: newTextEl.text,
      fontSize: newTextEl.fontSize,
      color: newTextEl.color,
      x: 0,
      y: 0,
      layer: getElementNewLayer(currentSlide),
      fontFamily: newTextEl.fontFamily,
    };

    await addElementToSlide(newElement);
  };

  const handleUpdateText = async (updatedTextEl: TextData) => {
    if (activeModal?.type !== "editText") return;

    const oldElement = activeModal.element;
    setActiveModal(null);

    const updatedElement: TextElement = {
      id: oldElement.id,
      type: "text",
      width: updatedTextEl.width,
      height: updatedTextEl.height,
      text: updatedTextEl.text,
      fontSize: updatedTextEl.fontSize,
      color: updatedTextEl.color,
      x: updatedTextEl.x,
      y: updatedTextEl.y,
      layer: oldElement.layer,
      fontFamily: updatedTextEl.fontFamily,
    };

    await updateElementInSlide(updatedElement);
  };

  const handleAddImage = async (newImageEl: ImageData) => {
    if (!currentSlide) return;

    setActiveModal(null);

    const newElement: ImageElement = {
      id: Date.now(),
      type: "image",
      width: newImageEl.width,
      height: newImageEl.height,
      src: newImageEl.src,
      description: newImageEl.description,
      x: 0,
      y: 0,
      layer: getElementNewLayer(currentSlide),
    };

    await addElementToSlide(newElement);
  };

  const handleUpdateImage = async (updatedImageEl: ImageData) => {
    if (activeModal?.type !== "editImage") return;

    const oldElement = activeModal.element;
    setActiveModal(null);

    const updatedElement: ImageElement = {
      ...oldElement,
      width: updatedImageEl.width,
      height: updatedImageEl.height,
      src: updatedImageEl.src,
      description: updatedImageEl.description,
      x: updatedImageEl.x,
      y: updatedImageEl.y,
    };

    await updateElementInSlide(updatedElement);
  };

  const handleAddVideo = async (newVideoEl: VideoData) => {
    if (!currentSlide) return;

    setActiveModal(null);

    const newElement: VideoElement = {
      id: Date.now(),
      type: "video",
      width: newVideoEl.width,
      height: newVideoEl.height,
      src: newVideoEl.src,
      autoplay: newVideoEl.autoplay,
      x: 0,
      y: 0,
      layer: getElementNewLayer(currentSlide),
    };

    await addElementToSlide(newElement);
  };

  const handleUpdateVideo = async (updatedVideoEl: VideoData) => {
    if (activeModal?.type !== "editVideo") return;

    const oldElement = activeModal.element;
    setActiveModal(null);

    const updatedElement: VideoElement = {
      ...oldElement,
      width: updatedVideoEl.width,
      height: updatedVideoEl.height,
      src: updatedVideoEl.src,
      autoplay: updatedVideoEl.autoplay,
      x: updatedVideoEl.x,
      y: updatedVideoEl.y,
    };

    await updateElementInSlide(updatedElement);
  };

  const handleAddCode = async (newCodeEl: CodeData) => {
    if (!currentSlide) return;

    setActiveModal(null);

    const codeLanguage = checkCodeLanguage(newCodeEl.code);

    const newElement: CodeElement = {
      id: Date.now(),
      type: "code",
      width: newCodeEl.width,
      height: newCodeEl.height,
      code: newCodeEl.code,
      fontSize: newCodeEl.fontSize,
      language: codeLanguage,
      x: 0,
      y: 0,
      layer: getElementNewLayer(currentSlide),
    };

    await addElementToSlide(newElement);
  };

  const handleUpdateCode = async (updatedCodeEl: CodeData) => {
    if (activeModal?.type !== "editCode") return;

    const oldElement = activeModal.element;
    setActiveModal(null);

    const newCodeLanguage = checkCodeLanguage(updatedCodeEl.code);

    const updatedElement: CodeElement = {
      ...oldElement,
      width: updatedCodeEl.width,
      height: updatedCodeEl.height,
      code: updatedCodeEl.code,
      fontSize: updatedCodeEl.fontSize,
      language: newCodeLanguage,
      x: updatedCodeEl.x,
      y: updatedCodeEl.y,
    };

    await updateElementInSlide(updatedElement);
  };

  const handleDeleteElement = async (element: SlideElement) => {
    if (!currentSlide) return;

    await updateCurrentSlideHelper((slide) => {
      return {
        ...slide,
        elements: slide.elements.filter((el) => el.id !== element.id),
      };
    });
  };

  const getInitialBg = () => {
    if (!presentation) return undefined;
    return currentSlide?.background || presentation.defaultBackground;
  };

  const handleResetSlideBg = async () => {
    setActiveModal(null);

    await updateCurrentSlideHelper((slide) => {
      return {
        ...slide,
        background: undefined,
      };
    });
  };

  const goToPreview = () => {
    window.open(
      `/presentation/preview/${presentationId}/${currentSlideNumber}`,
      "_blank",
    );
  };

  return (
    <div className={styles.editorPage}>
      <div className={styles.editorHeader}>
        <button type="button" className={styles.backAction} onClick={handleBack}>
          <span aria-hidden="true">←</span> Back
        </button>
      </div>

      <div className={styles.mainLayout}>
        <aside className={styles.toolbar}>
          <section className={styles.toolSection}>
            <div className={styles.sectionLabel}>Presentation</div>
            <div className={styles.utilityGrid}>
              <div className={styles.toolItem} onClick={handleOpenEditTitleModal}>
                <div className={styles.smallIcon}>
                  <img src={editIcon} alt="edit title icon" />
                </div>
                <div className={styles.toolLabel}>Title</div>
              </div>

              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "editThumbnail" })}
              >
                <div className={styles.smallIcon}>
                  <img src={thumbnailIcon} alt="edit thumbnail icon" />
                </div>
                <div className={styles.toolLabel}>Thumbnail</div>
              </div>
            </div>
          </section>

          <section className={styles.toolSection}>
            <div className={styles.sectionLabel}>Insert</div>
            <div className={styles.toolGrid}>
              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "addText" })}
              >
                <div className={styles.toolIcon}>
                  <img src={textIcon} alt="text icon" />
                </div>
                <div className={styles.toolLabel}>Text</div>
              </div>

              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "addImage" })}
              >
                <div className={styles.toolIcon}>
                  <img src={imageIcon} alt="image icon" />
                </div>
                <div className={styles.toolLabel}>Image</div>
              </div>

              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "addVideo" })}
              >
                <div className={styles.toolIcon}>
                  <img src={videoIcon} alt="video icon" />
                </div>
                <div className={styles.toolLabel}>Video</div>
              </div>

              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "addCode" })}
              >
                <div className={styles.toolIcon}>
                  <img src={codeIcon} alt="code icon" />
                </div>
                <div className={styles.toolLabel}>Code</div>
              </div>
            </div>
          </section>

          <section className={styles.toolSection}>
            <div className={styles.sectionLabel}>Slides</div>
            <div className={styles.toolGrid}>
              <div className={styles.toolItem} onClick={handleAddSlide}>
                <div className={styles.toolIcon}>
                  <img src={addSlideIcon} alt="add slide icon" />
                </div>
                <div className={styles.toolLabel} title="Add slide">
                  Add
                </div>
              </div>

              <div className={styles.toolItem} onClick={handleDeleteSlide}>
                <div className={styles.toolIcon}>
                  <img src={deleteSlideIcon} alt="delete slide icon" />
                </div>
                <div className={styles.toolLabel} title="Delete slide">
                  Delete
                </div>
              </div>

              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "slidePanel" })}
              >
                <div className={styles.toolIcon}>
                  <img src={panelIcon} alt="panel icon" />
                </div>
                <div className={styles.toolLabel}>Panel</div>
              </div>
            </div>
          </section>

          <section className={styles.toolSection}>
            <div className={styles.sectionLabel}>Design</div>
            <div className={styles.toolGrid}>
              <div
                className={styles.toolItem}
                onClick={() => setActiveModal({ type: "backgroundChange" })}
              >
                <div className={styles.toolIcon}>
                  <img src={themeIcon} alt="theme icon" />
                </div>
                <div className={styles.toolLabel}>Theme</div>
              </div>

              <div className={styles.toolItem} onClick={goToPreview}>
                <div className={styles.toolIcon}>
                  <img src={previewIcon} alt="preview icon" />
                </div>
                <div className={styles.toolLabel}>Preview</div>
              </div>
            </div>
          </section>

          <div className={styles.destructiveArea}>
            <div
              className={styles.deletePresentation}
              onClick={() => setActiveModal({ type: "deletePresentation" })}
            >
              <div className={styles.smallIcon}>
                <img src={deletePresIcon} alt="delete presentation icon" />
              </div>
              <div>Delete presentation</div>
            </div>
          </div>
        </aside>

        <main className={styles.canvasArea}>
          {saveStatus !== "idle" && (
            <div
              className={`${styles.saveStatus} ${styles[saveStatus]}`}
              role="status"
              aria-live="polite"
            >
              {saveStatus === "saving" && "Saving…"}
              {saveStatus === "saved" && "Saved"}
              {saveStatus === "error" && "Save failed"}
            </div>
          )}
          <div className={styles.canvasCenter}>
            <div className={styles.canvasBox}>
              <div className={styles.slideWrapper}>
                <div className={styles.slideBox}>
                  <div className={styles.slideInner}>
                    {isLoading ? (
                      <div>Loading slide...</div>
                    ) : (
                      <SlideViewArea
                        slide={currentSlide}
                        slideNumber={currentSlideNumber}
                        defaultBackground={presentation?.defaultBackground}
                        onElementDoubleClick={(element) => {
                          if (element.type === "text") {
                            setActiveModal({ type: "editText", element });
                          }

                          if (element.type === "image") {
                            setActiveModal({ type: "editImage", element });
                          }

                          if (element.type === "video") {
                            setActiveModal({ type: "editVideo", element });
                          }

                          if (element.type === "code") {
                            setActiveModal({ type: "editCode", element });
                          }
                        }}
                        onElementRightClick={handleDeleteElement}
                      />
                    )}
                  </div>
                </div>

                {presentation && presentation.slides.length >= 2 && (
                  <SlideNavArrows
                    onPrev={goToPrevSlide}
                    onNext={goToNextSlide}
                    isFirst={isFirstSlide}
                    isLast={isLastSlide}
                  />
                )}

                <div className={styles.pageNo}>Page {currentSlideNumber}</div>
              </div>
            </div>
          </div>
          <div className={styles.editorHint} role="note">
            Double-click an element to edit · Right-click to delete
          </div>
        </main>
      </div>

      <EditThumbnailModal
        isOpen={activeModal?.type === "editThumbnail"}
        onClose={() => setActiveModal(null)}
        onSave={handleUpdateThumbnail}
      />

      {activeModal?.type === "editTitle" && (
        <div className={modalStyles.modalBg}>
          <div className={modalStyles.modal}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateTitle();
              }}
            >
              <h3 className={modalStyles.title}>Edit title</h3>

              <div className={modalStyles.content}>
                <div className={modalStyles.row}>
                  <label>New title</label>
                  <input
                    name="title"
                    autoFocus
                    value={presTitle}
                    onChange={(e) => setPresTitle(e.target.value)}
                  />
                </div>

                <div className={modalStyles.actions}>
                  <button type="submit">Update</button>
                  <button type="button" onClick={() => setActiveModal(null)}>
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      <BackgroundModal
        isOpen={activeModal?.type === "backgroundChange"}
        initialBackground={getInitialBg()}
        onClose={() => setActiveModal(null)}
        onSave={handleSlideBgChange}
        onSaveDefault={handleChangeDefaultBg}
        onResetToDefault={handleResetSlideBg}
      />

      {activeModal?.type === "deletePresentation" && (
        <div className={modalStyles.modalBg}>
          <div className={modalStyles.modal}>
            <h3>Are you sure you want to delete the presentation?</h3>

            <div className={modalStyles.actions}>
              <button
                type="submit"
                className={modalStyles.deleteBtn}
                onClick={handleDelete}
              >
                Delete
              </button>

              <button type="button" onClick={() => setActiveModal(null)}>
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {activeModal?.type === "deleteLastSlideConfirm" && (
        <div className={modalStyles.modalBg}>
          <div className={modalStyles.modal}>
            <h3 className={modalStyles.title}>This is the last slide.</h3>

            <div className={modalStyles.content}>
              Do you want to delete the entire presentation?
            </div>

            <div className={modalStyles.actions}>
              <button className={modalStyles.deleteBtn} onClick={handleDelete}>
                Delete
              </button>

              <button onClick={() => setActiveModal(null)}>No</button>
            </div>
          </div>
        </div>
      )}

      <SlideControlPanel
        isOpen={activeModal?.type === "slidePanel"}
        onClose={() => setActiveModal(null)}
        slides={presentation?.slides || []}
        defaultBackground={presentation?.defaultBackground}
        onSelectSlide={(index) => {
          navigate(`/presentation/edit/${presentationId}/${index + 1}`);
          setActiveModal(null);
        }}
      />

      {activeModal?.type === "addText" && (
        <TextModal
          mode="add"
          onClose={() => setActiveModal(null)}
          onSave={handleAddText}
        />
      )}

      {activeModal?.type === "editText" && (
        <TextModal
          mode="edit"
          initialValues={activeModal.element}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdateText}
        />
      )}

      {activeModal?.type === "addImage" && (
        <ImageModal
          mode="add"
          onClose={() => setActiveModal(null)}
          onSave={handleAddImage}
        />
      )}

      {activeModal?.type === "editImage" && (
        <ImageModal
          mode="edit"
          initialValues={activeModal.element}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdateImage}
        />
      )}

      {activeModal?.type === "addVideo" && (
        <VideoModal
          mode="add"
          onClose={() => setActiveModal(null)}
          onSave={handleAddVideo}
        />
      )}

      {activeModal?.type === "editVideo" && (
        <VideoModal
          mode="edit"
          initialValues={activeModal.element}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdateVideo}
        />
      )}

      {activeModal?.type === "addCode" && (
        <CodeModal
          mode="add"
          onClose={() => setActiveModal(null)}
          onSave={handleAddCode}
        />
      )}

      {activeModal?.type === "editCode" && (
        <CodeModal
          mode="edit"
          initialValues={activeModal.element}
          onClose={() => setActiveModal(null)}
          onSave={handleUpdateCode}
        />
      )}

      <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
    </div>
  );
}

export default EditPage;
