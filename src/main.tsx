import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/bricolage-grotesque/standard.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/silkscreen/400.css";
import "./visual.css";
import "./pixel.css";
import App from "./App";
import { MotionSettings } from "./components/MotionSettings";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionSettings><App /></MotionSettings>
  </StrictMode>
);
