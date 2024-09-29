import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";

function ThemeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  return (
    <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
      {darkMode ? (
        <>
          <FontAwesomeIcon icon={faSun} />
        </>
      ) : (
        <>
          <FontAwesomeIcon icon={faMoon} />
        </>
      )}
    </button>
  );
}

export default ThemeToggle;
