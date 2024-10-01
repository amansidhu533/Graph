import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

function Sidebar({ uploadedFiles, onFileClick }) {
  const [collapsed, setCollapsed] = useState(false);
  const [files, setFiles] = useState([]);

  // Load files from localStorage when the component mounts
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setFiles(savedFiles);
  }, []);

  // Save files to localStorage whenever uploadedFiles changes
  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
      setFiles(uploadedFiles);
    }
  }, [uploadedFiles]);

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="collapse-toggle">
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>
        </div>
        <h4>Data Source</h4>{" "}
      </div>
      <div className={`uploaded-files-list ${collapsed ? "hidden" : ""}`}>
        {files && files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
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
