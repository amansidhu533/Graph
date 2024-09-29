import React, { useState } from "react";
import ThemeToggle from "./ThemeToggle";
import ResizeWindow from "./ResizeWindow";

function TopBar({ onToggleTheme, onResizeWindow }) {
  return (
    <div className="top-bar">
      <h1 className="heading">Chat Application</h1>
      <div className="top-bar-buttons">
        <ThemeToggle />
        <ResizeWindow />
      </div>
    </div>
  );
}

export default TopBar;
