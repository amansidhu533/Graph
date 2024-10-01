import React, { useState } from "react";
import { Resizable } from "re-resizable";
import UploadModal from "./UploadModal";
import ConnectDBModal from "./ConnectDBModal";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import ResizeWindow from "./ResizeWindow";
import GraphComponent from "./Graph";
import { Send } from 'lucide-react';

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
  const [showChatActions, setShowChatActions] = useState(false); // New state to toggle chat actions
  const [textArea1, setTextArea1] = useState(''); // State for first text area
  const [textArea2, setTextArea2] = useState(''); // State for second text area

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
    setUploadedFiles((prevFiles) => [
      ...prevFiles,
      { fileName, data: parsedData },
    ]);
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
    setShowChatActions(false); // Hide chat actions when viewing graph
  };

  const handleAddDataSourceClick = () => {
    setShowChatActions(true); // Show chat actions on button click
  };

  // Handler for the first text area button
  const handleTextArea1Submit = () => {
    console.log(`Text Area 1 content: ${textArea1}`);
    setTextArea1(''); // Clear the text area after submit
  };

  // Handler for the second text area button
  const handleTextArea2Submit = () => {
    console.log(`Text Area 2 content: ${textArea2}`);
    setTextArea2(''); // Clear the text area after submit
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
          <Sidebar
            uploadedFiles={uploadedFiles}
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
                <button onClick={handleTextArea1Submit}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg></button>
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
