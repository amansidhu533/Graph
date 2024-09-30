import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

function Sidebar({ uploadedFiles, onFileClick }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="collapse-toggle">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>
      <div className={`uploaded-files-list ${collapsed ? "hidden" : ""}`}>
        <h4>Data Source</h4>
        {uploadedFiles && uploadedFiles.length > 0 ? (
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index} onClick={() => onFileClick(file.data)}>
                {file.fileName}
              </li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
