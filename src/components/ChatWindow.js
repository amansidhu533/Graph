import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import UploadModal from "./UploadModal";
import ConnectDBModal from "./ConnectDBModal";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import ResizeWindow from "./ResizeWindow";
import GraphComponent from "./Graph";
import AddDataSource from "../assets/images/add_datasource.png";
import DBConnect from "../assets/images/database-connect1.gif";
import { fetchQueryResponse } from "../modules";
import ResponseGraph from "./ResponseGraph"; 

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
  const [loading, setLoading] = useState(false);
  const [dbChartData, setDbChartData] = useState(null);
  const [jsonChartData, setJsonChartData] = useState(null); 

  
  const handleDBOptionSubmit = ({ json, token, chartData, fileName }) => {
    if (chartData) {
      setJsonChartData(chartData); // Sets JSON data to display the chart
      setDbChartData(null); // Clears DB data chart if shown

      // Create JSON file object with type and add it to the uploaded files
      const newJsonFile = {
        fileName, // Dynamic JSON file name
        data: chartData,
        type: "json",
        queries: [],
      };

      const updatedFiles = [...uploadedFiles, newJsonFile];
      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles)); // Store all files in localStorage

      setFileData(null); // Clear previous data
      setShowChatActions(false);
    }
  };

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    const updatedFiles = savedFiles.map((file) => ({
      ...file,
      queries: file.queries || [],
    }));
    setUploadedFiles(updatedFiles);
  }, []);

  // Inside ChatWindow component

  const handleJsonChartClick = (data, fileName) => {
    setJsonChartData(data); // Sets JSON data for the chart
    setDbChartData(null); // Clears any DB chart data
    setSelectedFileName(fileName); // Sets the selected file name

    // Find existing queries for this JSON file, if any
    const selectedFile = uploadedFiles.find(
      (file) => file.fileName === fileName && file.type === "json"
    );
    const selectedQueries = selectedFile ? selectedFile.queries : [];
    setQueries(selectedQueries);
  };

  useEffect(() => {
    const savedFileName = localStorage.getItem("selectedFileName");
    if (savedFileName) {
      const fileNameWithoutExtension = savedFileName.replace(/\.[^/.]+$/, "");
      setSelectedFileName(fileNameWithoutExtension);
    }

    const savedChatState = JSON.parse(localStorage.getItem("chatState"));
    if (savedChatState) {
      setFileData(savedChatState.fileData);
      setQueries(savedChatState.queries);
      setTextArea1(savedChatState.textArea1);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "chatState",
      JSON.stringify({ fileData, queries, textArea1 })
    );
  }, [fileData, queries, textArea1]);

  const handleDeleteChat = (fileNameToDelete) => {
    const updatedFiles = uploadedFiles.filter(
      (file) => file.fileName !== fileNameToDelete
    );
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    if (fileNameToDelete === selectedFileName) {
      setFileData(null);
      setQueries([]);
      setSelectedFileName("Chat Application");

      if (updatedFiles.length === 0) {
        localStorage.removeItem("selectedFileName");
      } else {
        localStorage.setItem("selectedFileName", "Chat Application");
      }
    }
  };

  useEffect(() => {
    const savedFiles = JSON.parse(localStorage.getItem("uploadedFiles")) || [];
    const updatedFiles = savedFiles.map((file) => ({
      ...file,
      queries: file.queries || [],
    }));
    setUploadedFiles(updatedFiles);
  }, []);

  const handleUploadClick = () => setIsUploadModalOpen(true);
  const handleCloseUploadModal = () => setIsUploadModalOpen(false);
  const handleCloseDBModal = () => setIsDBModalOpen(false);

  const handleFileSubmit = (fileName, parsedData) => {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
    const newFile = {
      fileName: fileNameWithoutExtension,
      data: parsedData,
      queries: [],
    };

    const updatedFiles = [...uploadedFiles, newFile];
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    setFileData(parsedData);
    setQueries([]);
    setSelectedFileName(fileName);

    setShowChatActions(false);

    setIsUploadModalOpen(false);
  };

  const handleDBClick = () => setIsDBModalOpen(true);

  const incrementSuffix = (name) => {
    const match = name.match(/(.+?)(_(\d{2}))?(\.csv)?$/);
    if (match) {
      const baseName = match[1];
      const suffix = match[2] ? parseInt(match[2].slice(1), 10) + 1 : 1;
      const extension = match[3] ? match[3] : ".csv";
      return `${baseName}_${String(suffix).padStart(2, "0")}${extension}`;
    }
    return `${name}_01.csv`;
  };

  const handleNewChatClick = () => {
    const linkedChatName = incrementSuffix(selectedFileName).replace(
      /\.[^/.]+$/,
      ""
    );

    const newChat = {
      fileName: linkedChatName,
      data: null,
      queries: previousChatContext ? previousChatContext.queries : [],
    };

    const updatedFiles = [...uploadedFiles, newChat];
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    setFileData(null);
    setQueries(newChat.queries);
    setSelectedFileName(linkedChatName);
    setShowChatActions(false);
    setIsNewChat(true);

    localStorage.removeItem("chatState");
  };

  const handleAddDataSourceClick = () => {
    setShowChatActions(true);
    setIsNewChat(false);
  };

  const sendMessage = async () => {
    if (message.trim()) {
      setLoading(true);
      try {
        const apiResponse = await fetchQueryResponse(message);
        const newQuery = { query: message, response: apiResponse };

        // Update queries for the currently selected file (JSON or non-JSON)
        const updatedFiles = uploadedFiles.map((file) =>
          file.fileName === selectedFileName
            ? { ...file, queries: [...file.queries, newQuery] }
            : file
        );

        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
        setMessage("");
        setQueries((prevQueries) => [...prevQueries, newQuery]);
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleTextArea1Submit = async () => {
    if (textArea1.trim()) {
      try {
        const response = await fetchQueryResponse(textArea1);
        const newQuery = { query: textArea1, response };

        const updatedFiles = uploadedFiles.map((file) =>
          file.fileName === selectedFileName
            ? { ...file, queries: [...file.queries, newQuery] }
            : file
        );

        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
        setQueries((prevQueries) => [...prevQueries, newQuery]);
        setTextArea1("");
      } catch (error) {
        console.error("Error sending query:", error);
      }
    }
  };

  // Function to handle file clicks for JSON or Data Source files
  const handleFileClick = (data, queries, fileName) => {
    setPreviousChatContext({
      fileData: data,
      queries,
      selectedFileName: fileName,
    });
  
    const selectedFile = uploadedFiles.find(
      (file) => file.fileName === fileName
    );
    const selectedQueries = selectedFile ? selectedFile.queries : [];
    setFileData(data);
    setQueries(selectedQueries);   
    setSelectedFileName(fileName);
    setJsonChartData(null);
    setShowChatActions(false);
    setIsNewChat(false);
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
            <span className="db-connect" title={selectedFileName}>
              <img src={DBConnect} alt={selectedFileName} />
            </span>
            <ThemeToggle />
            <button
              onClick={handleAddDataSourceClick}
              className="add-datasource-btn"
            >
              <img src={AddDataSource} alt="Add DataSource" />
            </button>
            <ResizeWindow setWindowSize={setWindowSize} />
          </div>
        </div>

        <div className="main-content">
          <Sidebar
            uploadedFiles={uploadedFiles}
            onFileClick={handleFileClick}
            onNewChatClick={handleNewChatClick}
            onDeleteChat={handleDeleteChat}
            onJsonChartClick={handleJsonChartClick} // Update here
          />

          <div className="chat-window h-full">
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
            ) : jsonChartData || fileData ? (
              <div className="message-container chat-msg-container">
                <div className="bg-white flex flex-col text-black">
                  <div className="submitted-queries-container h-40">
                    {uploadedFiles
                      .find((file) => file.fileName === selectedFileName)
                      ?.queries.map((query, index) => (
                        <li key={index} className="mb-4 shadow-lg rounded-lg">
                          <div className="bg-gray-100 p-3 rounded-lg mb-4 mt-4 font-medium">
                            <strong>Q:</strong> {query.query}
                          </div>
                          {query.response && (
                            <div className="mt-2">
                              <ResponseGraph chartData={query.response} />
                            </div>
                          )}
                        </li>
                      ))}
                  </div>
                  {fileData && <GraphComponent data={fileData} />}
                </div>
              </div>
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
