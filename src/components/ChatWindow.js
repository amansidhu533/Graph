import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import UploadModal from "./UploadModal";
import ConnectDBModal from "./ConnectDBModal";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import ResizeWindow from "./ResizeWindow";
import GraphComponent from "./Graph";
import AddDataSource from "../assests/images/add_datasource.png";

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
  const [queries, setQueries] = useState([]);
  const [selectedFileName, setSelectedFileName] = useState("Chat Application");
  const [previousChatContext, setPreviousChatContext] = useState(null);
  const [isNewChat, setIsNewChat] = useState(false);

  useEffect(() => {
    const savedFileName = localStorage.getItem("selectedFileName");
    if (savedFileName) {
      setSelectedFileName(savedFileName);
    }
  }, []);

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    const updatedFiles = savedFiles.map((file) => ({
      ...file,
      queries: file.queries || [],
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
    const newFile = { fileName, data: parsedData, queries: [] };
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

  const handleFileClick = (data, queries, fileName) => {
    console.log("File clicked:", fileName); // Log the clicked file name
    console.log("Data:", data); // Log the data associated with the clicked file
    console.log("Queries:", queries); // Log the queries associated with the clicked file

    // Set the previous chat context for reference
    setPreviousChatContext({ fileData, queries, selectedFileName });

    // Load the selected chat data and set the appropriate state
    setFileData(data);
    setQueries(queries || []); // Make sure queries are loaded when chat is selected
    setSelectedFileName(fileName);

    // Hide chat actions and mark it as not a new chat
    setShowChatActions(false);
    setIsNewChat(false);
  };

  const handleNewChatClick = () => {
    // Store the linked chat name only once
    const linkedChatName = `${selectedFileName} → New Chat`;

    // Add a new entry to uploadedFiles for the new chat (avoid duplicate name creation)
    const newChat = {
      fileName: linkedChatName,
      data: null,
      queries: previousChatContext ? previousChatContext.queries : [], // Include previous chat queries if they exist
    };

    const updatedFiles = [...uploadedFiles, newChat];
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    // Clear the current chat data and mark it as a new chat
    setFileData(null);
    setQueries(newChat.queries); // Set queries to the new chat's queries
    setSelectedFileName(linkedChatName); // Set the new chat's name here
    setShowChatActions(true); // Show chat actions
    setIsNewChat(true); // Flag as new chat
  };

  const handleAddDataSourceClick = () => {
    setShowChatActions(true);
    setIsNewChat(false);
  };

  const handleTextArea1Submit = () => {
    if (textArea1.trim()) {
      const updatedFiles = uploadedFiles.map((file) => {
        if (file.fileName === selectedFileName) {
          return {
            ...file,
            queries: [...file.queries, textArea1], // Append the new query
          };
        }
        return file;
      });

      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

      setQueries((prevQueries) => [...prevQueries, textArea1]); // Update the current chat queries

      setTextArea1(""); // Clear the text area after submission
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
          <h2 className="heading">
            Assistant for <span>{selectedFileName}</span>
          </h2>
          <div className="top-bar-buttons">
            <ThemeToggle />
            <ResizeWindow setWindowSize={setWindowSize} />
          </div>
        </div>

        <div className="main-content">
          <Sidebar
            uploadedFiles={uploadedFiles}
            onFileClick={handleFileClick} // Ensure this is passed correctly
            onNewChatClick={handleNewChatClick}
          />

          <div className="chat-window">
            <button
              onClick={handleAddDataSourceClick}
              className="add-datasource-btn"
            >
              <img src={AddDataSource} alt="Add DataSource" />
            </button>

            {showChatActions ? (
              <div className="message-container">
                {isNewChat && previousChatContext ? (
                  <p className="previous-chat-info">
                    Previous Chat: {previousChatContext.selectedFileName}
                  </p>
                ) : (
                  <div className="chat-actions">
                    <button onClick={handleUploadClick} className="submit-btn">
                      Upload CSV/Excel
                    </button>
                    <button onClick={handleDBClick} className="cancel-btn">
                      Connect DB
                    </button>
                  </div>
                )}
              </div>
            ) : fileData ? (
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
            ) : (
              <div className="message-container">
                <p>Please select a data source or add a new one.</p>
              </div>
            )}

            <div className="input-section">
              <div className="text-area-container">
                <textarea
                  value={textArea1}
                  onChange={(e) => setTextArea1(e.target.value)}
                  placeholder="Ask a query..."
                  rows="4"
                  cols="50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleTextArea1Submit();
                    }
                  }}
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
