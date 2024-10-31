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
import JsonChart from "./JsonChart";

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
  const [databaseName, setDatabaseName] = useState("My Database");
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbChartData, setDbChartData] = useState(null);
  const [jsonChartData, setJsonChartData] = useState(null);

  const handleDBOptionSubmit = ({ json, token, chartData }) => {
    if (chartData) {
      setJsonChartData(chartData);
      setDbChartData(null);
      setFileData(null);
      setShowChatActions(false);
    }
  };

  useEffect(() => { 
    const savedFileName = localStorage.getItem("selectedFileName");
    if (savedFileName) {
      // Remove the file extension from the saved file name, if it has one
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
      setSelectedFileName("Chat Application"); // Reset selectedFileName to default

      // Update local storage for selectedFileName if there are no files left
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
    const newFile = { fileName: fileNameWithoutExtension, data: parsedData, queries: [] };
 
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
    const linkedChatName = incrementSuffix(selectedFileName);

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
  // Update the sendMessage function
  const sendMessage = async () => {
    if (message.trim()) {
      setLoading(true);
      try {
        const apiResponse = await fetchQueryResponse(message);
        const newQuery = { query: message, response: apiResponse };
        setQueries((prevQueries) => [...prevQueries, newQuery]);
        setMessage("");

        // Update the queries for the current file in uploadedFiles
        const updatedFiles = uploadedFiles.map((file) =>
          file.fileName === selectedFileName
            ? { ...file, queries: [...file.queries, newQuery] }
            : file
        );
        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
      } catch (error) {
        console.error("Error sending message:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Update the handleTextArea1Submit function similarly
  const handleTextArea1Submit = async () => {
    if (textArea1.trim()) {
      try {
        const response = await fetchQueryResponse(textArea1);
        const newQuery = { query: textArea1, response: response || staticData };
        setQueries((prevQueries) => [...prevQueries, newQuery]);
        setTextArea1("");

        // Save the query to the current file's queries in uploadedFiles
        const updatedFiles = uploadedFiles.map((file) =>
          file.fileName === selectedFileName
            ? { ...file, queries: [...file.queries, newQuery] }
            : file
        );
        setUploadedFiles(updatedFiles);
        localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
      } catch (error) {
        console.error("Error sending query:", error);
      }
    }
  };

  // Update the handleFileClick function to load the saved queries
  const handleFileClick = (data, queries, fileName) => {
    // Strip extension from fileName
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");
  
    setPreviousChatContext({
      fileData: data,
      queries,
      selectedFileName: fileNameWithoutExtension,
    });
  
    // Retrieve the queries for the selected file and set them in state
    const selectedFile = uploadedFiles.find(
      (file) => file.fileName === fileNameWithoutExtension
    );
    const selectedQueries = selectedFile ? selectedFile.queries : [];
  
    setFileData(data || null);
    setQueries(selectedQueries); // Load saved queries for this file
    setSelectedFileName(fileNameWithoutExtension); // Use name without extension
    setShowChatActions(false);
    setIsNewChat(false);
  };

  const staticData = {
    chart_type: "bar",
    data: [
      {
        product: "Gadget A",
        customer_segment: "Small Business",
        total_sales: 4500.0,
      },
      {
        product: "Gadget B",
        customer_segment: "Enterprise",
        total_sales: 5000.0,
      },
      {
        product: "Gadget B",
        customer_segment: "Small Business",
        total_sales: 4000.0,
      },
      {
        product: "Gadget X",
        customer_segment: "Small Business",
        total_sales: 9000.0,
      },
      {
        product: "Gadget Y",
        customer_segment: "Consumer",
        total_sales: 7200.0,
      },
      {
        product: "Gadget Y",
        customer_segment: "Small Business",
        total_sales: 9000.0,
      },
      {
        product: "Service Package B",
        customer_segment: "Enterprise",
        total_sales: 22500.0,
      },
      {
        product: "Service Package C",
        customer_segment: "Enterprise",
        total_sales: 30000.0,
      },
      {
        product: "Widget A",
        customer_segment: "Consumer",
        total_sales: 4000.0,
      },
      {
        product: "Widget A",
        customer_segment: "Small Business",
        total_sales: 5000.0,
      },
      {
        product: "Widget B",
        customer_segment: "Enterprise",
        total_sales: 9000.0,
      },
      {
        product: "Widget X",
        customer_segment: "Consumer",
        total_sales: 12000.0,
      },
      {
        product: "Widget X",
        customer_segment: "Small Business",
        total_sales: 9000.0,
      },
      {
        product: "Widget Y",
        customer_segment: "Consumer",
        total_sales: 14400.0,
      },
    ],
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
            onFileClick={(data, queries, fileName) => {
              setFileData(data);
              setQueries(queries);
              setSelectedFileName(fileName);
              setShowChatActions(false);
              setIsNewChat(false);
              setJsonChartData(null);
            }}
            onNewChatClick={handleNewChatClick}
            onDeleteChat={handleDeleteChat}
            onJsonChartClick={() => setJsonChartData(null)}
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
            ) : fileData || queries.length ? (
              <div className="message-container chat-msg-container">
                <div className="bg-white flex flex-col text-black">
                  <div className="submitted-queries-container h-40">
                    {queries.length > 0 ? (
                      <ul>
                        {queries
                          .slice()
                          .reverse()
                          .map((query, index) => (
                            <li
                              key={index}
                              className="mb-4  shadow-lg rounded-lg "
                            >
                              <div className="bg-gray-100 p-3 rounded-lg mb-4 font-medium">
                                <strong>Q:</strong> {query.query}
                              </div> 
                              {query.response && (
                                <div className="mt-2">
                                  <strong>Title: </strong> {query.query}
                                  <ResponseGraph chartData={query.response} />
                                </div>
                              )}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500">No queries submitted yet.</p>
                    )}
                  </div>
                  {/* {dbChartData && <ResponseGraph chartData={dbChartData} />}
                  {jsonChartData && <JsonChart data={jsonChartData} />}
                  {fileData && <GraphComponent data={fileData} />} */}
                  {jsonChartData ? (
                    <JsonChart jsonData={jsonChartData} />
                  ) : dbChartData ? (
                    <ResponseGraph chartData={dbChartData} />
                  ) : fileData ? (
                    <GraphComponent data={fileData} />
                  ) : null}
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
