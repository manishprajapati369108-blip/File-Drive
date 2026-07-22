import { StrictMode } from "react";
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { FileProvider } from "./context/FileContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <FileProvider>
        <App />
      </FileProvider>
    </BrowserRouter>
  </StrictMode>,
);
