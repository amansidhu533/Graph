import React, { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import ResizeWindow from "./ResizeWindow";

function TopBar() {
  const [selectedFileName, setSelectedFileName] = useState("Chat Application");

  // Load the selected file name from localStorage when the component mounts
  useEffect(() => {
    const savedFileName = localStorage.getItem("selectedFileName");
    if (savedFileName) {
      setSelectedFileName(savedFileName);
    }
  }, []);

  return (
    <div className="top-bar">
      <h2 className="heading">{selectedFileName}</h2>
      <div className="top-bar-buttons">
        <ThemeToggle />
        <ResizeWindow />
      </div>
    </div>
  );
}

export default TopBar;
