import React from "react";
import ReactDOM from "react-dom/client";

const container = document.getElementById("root");
if (!container) throw new Error("Root element with id 'root' not found");

const root = ReactDOM.createRoot(container);
root.render(
  <React.StrictMode>
    <h1>Hello Vercel!</h1>
  </React.StrictMode>
);
