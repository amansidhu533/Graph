import React, { useState, useEffect } from "react"; 
import { faMoon, faSun } from "@fortawesome/free-solid-svg-icons";
import { Moon, Sun } from "lucide-react";

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
          <Sun />
        </>
      ) : (
        <>
          <Moon/>
        </>
      )}
    </button>
  );
}

export default ThemeToggle;
