import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ResizeWindow from "./ResizeWindow";

function TopBar({ onToggleTheme, onResizeWindow }) {
  return (
    <div className="top-bar">
      <h2 className="heading">Chat Application</h2>
      <div className="top-bar-buttons">
        <ThemeToggle />
        <ResizeWindow />
      </div>
    </div>
  );
}

export default TopBar;
