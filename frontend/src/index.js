import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from "./App";

import AlertProvider from "./context/AlertProvider";

ReactDOM.render(
  <React.StrictMode>
    <AlertProvider>
      <App />
    </AlertProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
