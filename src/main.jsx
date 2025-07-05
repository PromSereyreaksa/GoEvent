import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";  // make sure this path is correct
import App from "./App.jsx";
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));

try {
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
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
