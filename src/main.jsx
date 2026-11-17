import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "@/App";
import { ActivityProvider } from "@/context/ActivityContext";
import "@/index.css";

// Providers wrap the app so any component below can use what they offer:
// BrowserRouter -> current URL and navigation
// ActivityProvider -> the list of recent requests (see context/ActivityContext.jsx)
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ActivityProvider>
        <App />
      </ActivityProvider>
    </BrowserRouter>
  </StrictMode>
);
