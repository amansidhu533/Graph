import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, PlusCircle } from "lucide-react";

function Sidebar({ uploadedFiles, onFileClick, onNewChatClick }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  useEffect(() => {
    // Instead of setting files from localStorage, just use uploadedFiles
    setSelectedFileIndex(null); // Reset the selected file index
  }, [uploadedFiles]);

  const handleFileClick = (file, index) => {
    setSelectedFileIndex(index);
    localStorage.setItem("selectedFileName", file.fileName);
    // Ensure that we're passing the correct attributes
    onFileClick(file.data, file.queries, file.fileName);
  };

  const handleNewChatClick = () => {
    setSelectedFileIndex(null); // Deselect any file
    localStorage.removeItem("selectedFileName"); // Clear saved file
    onNewChatClick(); // Trigger the function to link the previous chat context
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <div className="d-flex">
          <div className="collapse-toggle">
            <button onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight /> : <ChevronLeft />}
            </button>
          </div>
          <h4>Data Source</h4>
        </div>
        <button
          onClick={handleNewChatClick}
          className="new-chat-btn bg-gray-200 px-2 py-1 rounded flex items-center text-xs ease-in-out"
        >
          New
          <PlusCircle size={12} className="ml-1" />
        </button>
      </div>

      <div className={`uploaded-files-list ${collapsed ? "hidden" : ""}`}>
        {uploadedFiles && uploadedFiles.length > 0 ? (
          <ul className="file-list">
            {uploadedFiles.map((file, index) => (
              <li
                key={index}
                onClick={() => handleFileClick(file, index)} // Ensure proper parameters are passed
                className={selectedFileIndex === index ? "selected" : ""}
              >
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
