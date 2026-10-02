import type { Presentation } from "../../utils/types";
import "./PresentationCard.css";

type Props = {
  presentation: Presentation;
  onClick: () => void;
};

function PresentationCard({ presentation, onClick }: Props) {
  return (
    <div className="presentation-card" onClick={onClick}>
      <div className="presentation-card-thumbnail-box">
        {presentation.thumbnail ? (
          <img
            src={presentation.thumbnail}
            alt={`${presentation.name} thumbnail`}
            className="presentation-card-thumbnail"
          />
        ) : (
          <div className="presentation-card-thumbnail-placeholder" />
        )}
      </div>
      <div className="presentation-card-info">
        <h3 className="presentation-card-title">{presentation.name}</h3>
        {presentation.description && (
          <div className="presentation-card-description">
            {presentation.description}
          </div>
        )}
        <div className="presentation-card-slides">
          {presentation.slides.length} slide(s)
        </div>
      </div>
    </div>
  );
}
export default PresentationCard;
