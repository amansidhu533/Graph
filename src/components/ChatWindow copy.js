import React, { useState } from "react";
import { Resizable } from "re-resizable"; // Import Resizable
import UploadModal from "./UploadModal";
import ConnectDBModal from "./ConnectDBModal";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ResizeWindow from "./ResizeWindow"; // Import ResizeWindow

function ChatWindow() {
  const [message, setMessage] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isDBModalOpen, setIsDBModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: "80%",
    height: "600px",
  }); // Default window size

  const handleUploadClick = () => {
    setIsUploadModalOpen(true);
  };

  const handleCloseUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleCloseDBModal = () => {
    setIsDBModalOpen(false);
  };

  const handleFileSubmit = (fileName) => {
    setUploadedFiles((prevFiles) => [...prevFiles, fileName]);
    setIsUploadModalOpen(false);
  };

  const handleDBClick = () => {
    setIsDBModalOpen(true);
  };

  const handleDBOptionSubmit = ({ file, token }) => {
    if (file) {
      console.log(`Uploaded JSON file: ${file.name}`);
      // Handle file upload logic here
    }
    if (token) {
      console.log(`Entered Token: ${token}`);
      // Handle token submission logic here
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      console.log(`Message sent: ${message}`);
      setMessage("");
    }
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
      minHeight="400px"
      maxWidth="100%"
      maxHeight="100%"
      style={{
      margin: "auto",
       
        padding: "10px",
        overflow: "hidden", // Prevent overflow of content
      }}
    >
      <div className="chat-window-container">
        {/* TopBar */}
        <div className="top-bar">
          <h1 className="heading">Chat Application</h1>
          <div className="top-bar-buttons">
            <ThemeToggle />
            <ResizeWindow setWindowSize={setWindowSize} />
          </div>
        </div>

        {/* Main section with Sidebar and ChatWindow */}
        <div className="main-content">
          <Sidebar uploadedFiles={uploadedFiles} />

          <div className="chat-window">
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
