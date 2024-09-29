import React, { useState } from "react";
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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: "80%",
    height: "600px",
  });
  const [fileData, setFileData] = useState(null); // State to store selected file data

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
    setUploadedFiles((prevFiles) => [...prevFiles, { fileName, data: parsedData }]);
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
    setFileData(data); // Set the data for graph rendering
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
          <h1 className="heading">Assistant</h1>
          <div className="top-bar-buttons">
            <ThemeToggle />
            <ResizeWindow setWindowSize={setWindowSize} />
          </div>
        </div>

        <div className="main-content">
          <Sidebar uploadedFiles={uploadedFiles} onFileClick={handleFileClick} />

          <div className="chat-window">
            {/* Conditionally render chat-actions or graph */}
            {!fileData ? (
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

            <div className="input-section">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message"
              />
              <button onClick={sendMessage}>Send</button>
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
