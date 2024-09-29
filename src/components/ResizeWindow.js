import React, { useState } from 'react';

function ResizeWindow({ setWindowSize }) {
  const [isMaximized, setIsMaximized] = useState(false);

  const toggleWindowSize = () => {
    if (isMaximized) {
      // Restore to original size
      setWindowSize({ width: "80%", height: "600px" }); // Restore to defined size
    } else {
      // Maximize to full screen size
      setWindowSize({ width: "100%", height: "100vh" }); // Maximize to cover entire viewport
    }
    setIsMaximized(!isMaximized); // Toggle state
  };

  return (
    <div className="resize-window-container">
      <button onClick={toggleWindowSize}>
        {isMaximized ? 'Restore Window' : 'Maximize Window'}
      </button>
    </div>
  );
}

export default ResizeWindow;
