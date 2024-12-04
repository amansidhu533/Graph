import React, { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft, PlusCircle, Trash2 } from "lucide-react";

function Sidebar({
  uploadedFiles,
  onFileClick,
  onNewChatClick,
  onDeleteChat,
  onJsonChartClick,
  onDBConnectChartClick, // Added for DBConnect
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [localFiles, setLocalFiles] = useState([]);

  useEffect(() => {
    // Load JSON files from localStorage on mount
    const storedJsonData = localStorage.getItem("jsonFileData");
    if (storedJsonData) {
      try {
        const parsedData = JSON.parse(storedJsonData);
        const file = {
          fileName: parsedData.fileName || "Uploaded JSON",
          data: parsedData.json,
          type: "json",
        };
        setLocalFiles([file]);
      } catch (error) {
        console.error("Error parsing JSON from localStorage:", error);
      }
    }
  }, []);

  const allFiles = [...localFiles, ...uploadedFiles];

  useEffect(() => {
    // Reset the selected index if necessary
    if (selectedFileIndex === null && allFiles.length > 0) {
      setSelectedFileIndex(0); // Default to the first file
    }
  }, [allFiles]);

  const handleNewChatClick = () => {
    const newChatId = `chat_${Date.now()}`;  
    const newChatIndex = allFiles.length;  
    setSelectedFileIndex(newChatIndex);  
    onNewChatClick(newChatId, newChatIndex); 
  };

  const handleFileClick = (file, index) => {
    setSelectedFileIndex(index);  
    localStorage.setItem("selectedFileName", file.fileName);

    if (file.fileName.startsWith("DB_Data")) { 
      onDBConnectChartClick(file.data, file.fileName);  
    } else if (file.type === "json") {
      onJsonChartClick(file.data, file.fileName);  
    } else {
      onFileClick(file.data, file.queries, file.fileName);  
    }
  };

  const handleDeleteClick = (fileName, event) => { 
    event.stopPropagation();
    onDeleteChat(fileName); 
    if (localFiles.some((file) => file.fileName === fileName)) {
      localStorage.removeItem("jsonFileData");
      setLocalFiles([]);
    }
 
    if (allFiles.length > 0) {
      setSelectedFileIndex((prevIndex) => Math.max(0, prevIndex - 1));
    } else {
      setSelectedFileIndex(null);  
    }
  };

  const handleDBConnectFileClick = (file) => {
    if (onDBConnectChartClick) {
        onDBConnectChartClick(file.data, file.fileName)   
    }
}

  return (
    <div className={`sidebar-chat ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header-chat">
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
        {allFiles && allFiles.length > 0 ? (
          <ul className="file-list">
            {allFiles.map((file, index) => (
              <li
                key={file.fileName}
                className={`file-item ${index === selectedFileIndex ? "selected" : ""}`}
                onClick={() => handleFileClick(file, index)}
              >
                <span>
                  {file.fileName} {file.type === "json" ? "(JSON)" : ""}
                  {file.fileName.startsWith("DB_Data") ? "(DBConnect)" : ""}
                </span>
                
                <button
                  onClick={(event) => handleDeleteClick(file.fileName, event)}
                  className="delete-btn ml-2"
                >
                  <Trash2 size={16} />
                </button>
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
