import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, PlusCircle, Trash2 } from "lucide-react"; // Import Trash Icon

function Sidebar({ uploadedFiles, onFileClick, onNewChatClick, onDeleteChat, onJsonChartClick  }) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

  useEffect(() => {
    setSelectedFileIndex(null); // Reset the selected file index
  }, [uploadedFiles]);

  const handleFileClick = (file, index) => {
    setSelectedFileIndex(index);
    localStorage.setItem("selectedFileName", file.fileName);
    onFileClick(file.data, file.queries, file.fileName);
  };

  const handleNewChatClick = () => {
    setSelectedFileIndex(null); // Deselect any file
    localStorage.removeItem("selectedFileName"); // Clear saved file
    onNewChatClick(); // Trigger the function to link the previous chat context
  };

  const handleDeleteClick = (fileName, event) => {
    event.stopPropagation(); // Prevents triggering file click when deleting
    onDeleteChat(fileName); // Call the delete handler passed from parent
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
          <>
            {" "}
            <ul className="file-list">
              {uploadedFiles.map((file, index) => (
                <li
                  key={index}
                  onClick={() => handleFileClick(file, index)}
                  className={selectedFileIndex === index ? "selected" : ""}
                >
                  <span>{file.fileName}</span>
                  <button
                    onClick={(event) => handleDeleteClick(file.fileName, event)}
                    className="delete-btn ml-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </li>
              ))}
            </ul>
            {/* <button onClick={onJsonChartClick} className="json-chart-btn">
              View JSON Chart
            </button> */}
          </>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
