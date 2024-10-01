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
        {/* {isMaximized ? 'Restore Window' : 'Maximize Window'} */}
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize2"><polyline points="15 3 21 3 21 9"></polyline><polyline points="9 21 3 21 3 15"></polyline><line x1="21" x2="14" y1="3" y2="10"></line><line x1="3" x2="10" y1="21" y2="14"></line></svg>
      </button>
    </div>
  );
}

export default ResizeWindow;
