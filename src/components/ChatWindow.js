import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import UploadModal from "./UploadModal";
import ConnectDBModal from "./ConnectDBModal";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ResizeWindow from "./ResizeWindow";
import GraphComponent from "./Graph";

function ChatWindow() {
  const [message, setMessage] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDBModalOpen, setIsDBModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]); // State to store all uploaded files
  const [windowSize, setWindowSize] = useState({
    width: "80%",
    height: "600px",
  });
  const [fileData, setFileData] = useState(null);
  const [showChatActions, setShowChatActions] = useState(false);
  const [textArea1, setTextArea1] = useState('');
  const [textArea2, setTextArea2] = useState('');

  // Load files from localStorage when the component mounts
  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    setUploadedFiles(savedFiles); // Set uploadedFiles state with loaded files
  }, []);

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleCloseDBModal = () => {
    setIsDBModalOpen(false);
  };

  const handleFileSubmit = (fileName, parsedData) => {
    const newFile = { fileName, data: parsedData };
    const updatedFiles = [...uploadedFiles, newFile]; // Add new file to existing files
    setUploadedFiles(updatedFiles); // Update local state
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles)); // Update local storage
    setIsUploadModalOpen(false);
  };

  const handleDBClick = () => {
    setIsDBModalOpen(true);
  };

  const handleDBOptionSubmit = ({ file, token }) => {
    if (file) {
      console.log(`Uploaded JSON file: ${file.name}`);
    }
    if (token) {
      console.log(`Entered Token: ${token}`);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      console.log(`Message sent: ${message}`);
      setMessage("");
    }
  };

  const handleFileClick = (data) => {
    setFileData(data);
    setShowChatActions(false);
  };

  const handleAddDataSourceClick = () => {
    setShowChatActions(true);
  };

  // Handler for the first text area button
  const handleTextArea1Submit = () => {
    console.log(`Text Area 1 content: ${textArea1}`);
    setTextArea1('');
  };

  // Handler for the second text area button
  const handleTextArea2Submit = () => {
    console.log(`Text Area 2 content: ${textArea2}`);
    setTextArea2('');
  };

  return (
    <Resizable
      size={windowSize}
      onResizeStop={(e, direction, ref, d) => {
        setWindowSize((prev) => ({
          width: prev.width + d.width,
          height: prev.height + d.height,
        }));
      }}
      minWidth="300px"
      minHeight="90vh"
      maxWidth="100%"
      maxHeight="100%"
      style={{
        margin: "auto",
        padding: "10px",
        overflow: "hidden",
      }}
    >
      <div className="chat-window-container">
        <div className="top-bar">
          <h2 className="heading">Assistant</h2>
          <div className="top-bar-buttons">
            <ThemeToggle />
            <ResizeWindow setWindowSize={setWindowSize} />
          </div>
        </div>

        <div className="main-content">
          <Sidebar
            uploadedFiles={uploadedFiles} // Pass updated files to Sidebar
            onFileClick={handleFileClick}
          />

          <div className="chat-window">
            {/* Always visible "Add New Datasource" button */}
            <button
              onClick={handleAddDataSourceClick}
              className="add-datasource-btn"
            >
              Add New Datasource
            </button>

            {/* Conditionally render chat-actions or graph */}
            {showChatActions || !fileData ? (
              <div className="message-container">
                <div className="chat-actions">
                  <button onClick={handleUploadClick} className="submit-btn">
                    Upload CSV/Excel
                  </button>
                  <button onClick={handleDBClick} className="cancel-btn">
                    Connect DB
                  </button>
                </div>
              </div>
            ) : (
              <GraphComponent data={fileData} /> // Display graph when file is clicked
            )}
 
            {/* Pair of text areas and buttons */}
            <div className="input-section"> 
              <div className="text-area-container">
                <textarea
                  value={textArea1}
                  onChange={(e) => setTextArea1(e.target.value)}
                  placeholder="Ask a query..."
                  rows="4"
                  cols="50"
                />
                <button onClick={handleTextArea1Submit}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>

            {isUploadModalOpen && (
              <UploadModal
                handleCloseModal={handleCloseUploadModal}
                handleFileSubmit={handleFileSubmit}
              />
            )}

            {isDBModalOpen && (
              <ConnectDBModal
                handleCloseModal={handleCloseDBModal}
                handleDBOptionSubmit={handleDBOptionSubmit}
              />
            )}
          </div>
        </div>
      </div>
    </Resizable>
  );
}

export default ChatWindow;
