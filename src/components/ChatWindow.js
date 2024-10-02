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
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [windowSize, setWindowSize] = useState({
    width: "80%",
    height: "600px",
  });
  const [fileData, setFileData] = useState(null);
  const [showChatActions, setShowChatActions] = useState(false);
  const [textArea1, setTextArea1] = useState("");
  const [textArea2, setTextArea2] = useState("");
  const [queries, setQueries] = useState([]); // State to store submitted queries

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    const updatedFiles = savedFiles.map(file => ({
      ...file,
      queries: file.queries || []  // Ensure each file has a queries array
    }));
    setUploadedFiles(updatedFiles);
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
    const newFile = { fileName, data: parsedData, queries: [] }; // Always add an empty queries array
    const updatedFiles = [...uploadedFiles, newFile];
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
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
  const handleFileClick = (data, queries) => {
    setFileData(data);
    setQueries(queries || []); // Ensure queries defaults to an empty array if not provided
    setShowChatActions(false);
  };
  

  const handleAddDataSourceClick = () => {
    setShowChatActions(true);
  };

  const handleTextArea1Submit = () => {
    if (textArea1.trim() && fileData) {
      const updatedFiles = uploadedFiles.map((file) => {
        if (file.data === fileData) {
          // Add the new query to the selected file
          return {
            ...file,
            queries: [...file.queries, textArea1],
          };
        }
        return file;
      });

      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

      setQueries((prevQueries) => [...prevQueries, textArea1]); // Update queries in the UI
      setTextArea1(""); // Clear the input after submission
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
            uploadedFiles={uploadedFiles}
            onFileClick={handleFileClick}
          />

          <div className="chat-window">
            <button
              onClick={handleAddDataSourceClick}
              className="add-datasource-btn"
            >
              Add New Datasource
            </button>

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
              <>
                <GraphComponent data={fileData} />
                <div className="submitted-queries-container">
                  {queries.length > 0 ? (
                    <ul>
                      {queries.map((query, index) => (
                        <li key={index} className="submitted-query">
                          {query}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No queries submitted for this file.</p>
                  )}
                </div>
              </>
            )}

            {/* Text area input section */}
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
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
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
