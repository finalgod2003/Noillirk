import { useEffect, useState, type ReactNode } from "react";
import { MotionConfig, useReducedMotion } from "motion/react";
import { Pause, Play } from "lucide-react";

export function MotionSettings({ children }: { children: ReactNode }) {
  const systemReduced = useReducedMotion();
  const [preference, setPreference] = useState<boolean | null>(() => {
    try {
      const saved = localStorage.getItem("noillirk-reduced-motion");
      return saved === null ? null : saved === "true";
    } catch { return null; }
  });
  const reduced = preference ?? Boolean(systemReduced);
  useEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
  }, [reduced]);
  const toggle = () => {
    setPreference(!reduced);
    try { localStorage.setItem("noillirk-reduced-motion", String(!reduced)); } catch { /* Session preference still works. */ }
  };
  return <MotionConfig reducedMotion={reduced ? "always" : "never"}>
    {children}
    <button className="motion-toggle" aria-pressed={reduced} onClick={toggle} title="Reduce decorative motion">
      {reduced ? <Play size={13} /> : <Pause size={13} />}<span>Reduce motion</span>
    </button>
  </MotionConfig>;
}
