import React from "react";
import "./toast.css";

function Toast({ message, type }) {
  return (
    <div className={`custom-toast ${type}`}>
      <strong>{type === "success" ? "✅" : type === "error" ? "❌" : type === "warning" ? "⚠️" : "ℹ️"}</strong>
      <span>{message}</span>
    </div>
  );
}

export default Toast;
