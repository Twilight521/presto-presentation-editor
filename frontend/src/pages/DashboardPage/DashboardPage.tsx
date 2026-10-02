import { useNavigate } from "react-router-dom";
import ErrorPopup from "../../components/ErrorPopup";
import { useEffect, useState } from "react";
import { fetchPresentations, isAuthError, setStore } from "../../utils/api";
import CreateModal from "../../components/CreateModal";
import type { Presentation } from "../../utils/types";
import PresentationCard from "../../components/PresentationCard/PresentationCard";
import styles from "./DashboardPage.module.css";

type SaveStatus = "idle" | "saving" | "saved" | "error";

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [presentations, setPresentations] = useState<Presentation[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const loadPresentations = async () => {
      try {
        const data = await fetchPresentations();
        setPresentations(data);
      } catch (error) {
        if (isAuthError(error)) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        setErrorMsg(String(error));
      } finally {
        setIsLoading(false);
      }
    };

    loadPresentations();
  }, [navigate]);

  const handleCreate = async (newPresentation: Presentation) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const newPresentations = [...presentations, newPresentation];
    const previousPresentations = presentations;

    setShowCreateModal(false);
    setPresentations(newPresentations);
    setSaveStatus("saving");

    try {
      await setStore(token, {
        presentations: newPresentations,
      });
      setSaveStatus("saved");
    } catch (error: unknown) {
      setPresentations(previousPresentations);
      setSaveStatus("error");

      if (isAuthError(error)) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      setErrorMsg(String(error));
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <h1 className={styles.title}>Dashboard</h1>

      <button onClick={() => setShowCreateModal(true)}>New Presentation</button>

      {saveStatus !== "idle" && (
        <span
          className={`${styles.saveStatus} ${styles[saveStatus]}`}
          role="status"
          aria-live="polite"
        >
          {saveStatus === "saving" && "Saving…"}
          {saveStatus === "saved" && "Saved"}
          {saveStatus === "error" && "Save failed"}
        </span>
      )}

      {showCreateModal && (
        <CreateModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreate}
        />
      )}

      <h2>Presentation list</h2>

      <div className={styles.presentationList}>
        {isLoading && <p>Loading presentations...</p>}

        {!isLoading && presentations.length === 0 && (
          <p>No presentations yet</p>
        )}

        {!isLoading &&
          presentations.map((pres) => (
            <PresentationCard
              key={pres.id}
              presentation={pres}
              onClick={() => navigate(`/presentation/edit/${pres.id}/1`)}
            />
          ))}
      </div>

      <ErrorPopup message={errorMsg} onClose={() => setErrorMsg("")} />
    </div>
  );
}

export default DashboardPage;
