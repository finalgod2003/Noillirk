import { useMemo, type CSSProperties } from "react";
import { Cloud, Sparkles, Wind } from "lucide-react";
import type { RoundResult } from "../types";

export function CrowdField({
  crowd,
  reveal,
  pulseKey
}: {
  crowd: number;
  reveal?: RoundResult;
  pulseKey: number;
}) {
  const dots = useMemo(
    () =>
      Array.from({ length: 100 }, (_, index) => {
        const angle = (index / 100) * Math.PI * 2 + (index % 7) * 0.08;
        const ring = index % 4;
        const radius = 20 + ring * 5 + ((index * 13) % 7);
        const x = 50 + Math.cos(angle) * radius;
        const y = 43 + Math.sin(angle) * radius * 0.62;
        const joinedX = 50 + ((index % 10) - 4.5) * 1.45;
        const joinedY = 77 + Math.floor(index / 10) * 1.05;
        return {
          x,
          y,
          joinedX,
          joinedY,
          delay: (index % 13) * 34,
          tone: index % 5
        };
      }),
    []
  );

  return (
    <div className="crowd-field" key={pulseKey}>
      <div className="crowd-grid" aria-hidden="true" />
      {reveal?.topAnswers.map((answer, index) => (
        <div className={`crowd-label crowd-label-${index + 1}`} key={answer}>
          <span>{index === 0 ? "#1" : `#${index + 1}`}</span>
          {answer}
        </div>
      ))}
      {dots.map((dot, index) => {
        const joined = index < crowd;
        return (
          <span
            aria-hidden="true"
            className={`crowd-dot ${joined ? "is-joined" : ""} tone-${dot.tone}`}
            key={index}
            style={
              {
                "--x": `${dot.x}%`,
                "--y": `${dot.y}%`,
                "--jx": `${dot.joinedX}%`,
                "--jy": `${dot.joinedY}%`,
                transitionDelay: `${dot.delay}ms`
              } as CSSProperties
            }
          />
        );
      })}
      <div className="crowd-podium">
        <span className="crowd-podium-kicker">YOUR CROWD</span>
        <strong>{crowd}</strong>
        <span>/ 100 joined you</span>
      </div>
    </div>
  );
}

export function ClimbField({
  points,
  balloons,
  reveal,
  pulseKey
}: {
  points: number;
  balloons: number;
  reveal?: RoundResult;
  pulseKey: number;
}) {
  const progress = Math.min(1, points / 700);
  const altitude = points * 10;

  return (
    <div className="climb-field" key={pulseKey}>
      <div className="climb-sky" aria-hidden="true">
        <span className="star star-1" />
        <span className="star star-2" />
        <span className="star star-3" />
        <span className="star star-4" />
        <Cloud className="sky-cloud cloud-1" />
        <Cloud className="sky-cloud cloud-2" />
        <Cloud className="sky-cloud cloud-3" />
        <Wind className="sky-wind" />
      </div>

      <div className="balloon-rack" aria-label={`${balloons} balloons left`}>
        {[0, 1, 2].map((index) => (
          <span className={`mini-balloon ${index >= balloons ? "is-popped" : ""}`} key={index}>
            <span />
          </span>
        ))}
      </div>

      <div className="altitude-ruler" aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index}>{index === 0 ? "0 m" : `${index} km`}</span>
        ))}
      </div>

      <div className="climb-track">
        <div className="climb-fill" style={{ height: `${progress * 100}%` }} />
        <div className="climb-carriage" style={{ bottom: `calc(${progress * 100}% - 34px)` }}>
          <span className="carriage-glow" />
          <div className="carriage-body">
            <span className="carriage-eye eye-left" />
            <span className="carriage-eye eye-right" />
            <span className="carriage-smile" />
          </div>
          <span className="carriage-tail" />
        </div>
      </div>

      <div className="altitude-readout">
        <span>
          <Sparkles size={14} /> ALTITUDE
        </span>
        <strong>{altitude >= 1000 ? `${(altitude / 1000).toFixed(1)} km` : `${altitude} m`}</strong>
      </div>

      {reveal && (
        <div className="climb-board">
          <span className="climb-board-title">BOARD PREVIEW</span>
          {reveal.topAnswers.map((answer, index) => (
            <div className="climb-board-row" key={answer}>
              <span>{index + 1}</span>
              <strong>{answer}</strong>
              <em>{[100, 64, 64, 64, 32][index] ?? 32} pts</em>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
