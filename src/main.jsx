import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

// Add error boundary
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Error rendering app:", error);
  root.render(
    <div style={{ padding: "20px", color: "red" }}>
      <h1>Error loading application</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
