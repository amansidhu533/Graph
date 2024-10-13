import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, PlusCircle } from "lucide-react";

function Sidebar({ uploadedFiles, onFileClick }) {
  const [collapsed, setCollapsed] = useState(false);
  const [files, setFiles] = useState([]);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setFiles(savedFiles);

    const savedFileName = localStorage.getItem("selectedFileName");
    if (savedFileName) {
      const selectedIndex = savedFiles.findIndex(
        (file) => file.fileName === savedFileName
      );
      setSelectedFileIndex(selectedIndex);
    }
  }, []);

  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
      localStorage.setItem("uploadedFiles", JSON.stringify(uploadedFiles));
      setFiles(uploadedFiles);
    }
  }, [uploadedFiles]);

  const handleFileClick = (file, index) => {
    setSelectedFileIndex(index);
    localStorage.setItem("selectedFileName", file.fileName);
    onFileClick(file.data, file.queries, file.fileName); // Pass file name along with data and queries
  };

  const handleNewChatClick = () => {
    setSelectedFileIndex(null); // Deselect any file
    localStorage.removeItem("selectedFileName"); // Clear saved file
    onFileClick(null, [], "New Chat"); // Send empty data to ChatWindow
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
        {files && files.length > 0 ? (
          <ul>
            {files.map((file, index) => (
              <li
                key={index}
                onClick={() => handleFileClick(file, index)}
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
