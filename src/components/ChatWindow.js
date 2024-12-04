import React, { useState, useEffect } from "react";
import { Resizable } from "re-resizable";
import UploadModal from "./UploadModal";
import ConnectDBModal from "./ConnectDBModal";
import ThemeToggle from "./ThemeToggle";
import Sidebar from "./Sidebar";
import ResizeWindow from "./ResizeWindow";
import GraphComponent from "./Graph";
import AddDataSource from "../assets/images/add_datasource.png";
import { fetchFileJsonData, fetchDBData, fetchQueryResponse } from "../modules";
import ResponseGraph from "./ResponseGraph";
import JsonChart from "./JsonChart";
import DBConnectChart from "./DBConnectChart";

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
  // const [databaseName, setDatabaseName] = useState("My Database");
  // const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dbChartData, setDbChartData] = useState(null);
  const [jsonChartData, setJsonChartData] = useState(null);
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);

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

  const handleFileSubmit = (
    fileName,
    filePreview,
    selectedFileIndex = null
  ) => {
    const fileNameWithoutExtension = fileName.replace(/\.[^/.]+$/, "");

    const newFileData = {
      fileName: fileNameWithoutExtension,
      data: filePreview,
      queries: [], // Assume you're handling queries separately
    };

    // Check if a chat is selected
    if (selectedFileName !== "Chat Application" && selectedFileName !== "") {
      // Update the existing chat with the new file
      const updatedFiles = uploadedFiles.map((file, index) =>
        file.fileName === selectedFileName
          ? { ...file, data: filePreview, queries: [] } // Update the selected file
          : file
      );
      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
    } else {
      // If no chat is selected, create a new chat entry (a new file in the list)
      const updatedFiles = [...uploadedFiles, newFileData];
      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));
      setSelectedFileName(fileNameWithoutExtension);
      setShowChatActions(false);
      setIsUploadModalOpen(false); // Close upload modal
    }

    // Update the current file data and other states
    setFileData(filePreview);
    setQueries([]); // Reset queries
    setShowChatActions(false);
  };

  const incrementSuffix = (name) => {
    const match = name.match(/(.+?)(_(\d{2}))?(\.csv)?$/);
    if (match) {
      const baseName = match[1];
      const suffix = match[3] ? parseInt(match[3], 10) + 1 : 1;
      const extension = match[4] ? match[4] : ""; // Keep the extension if it exists
      return `${baseName}_${String(suffix).padStart(2, "0")}${extension}`;
    }
    return `${name}_01`;
  };

  const handleNewChatClick = () => {
    // Start with a base name (use selectedFileName or default to "Chat")
    let baseName = selectedFileName || "Chat";

    // Ensure the base name doesn't have an existing suffix
    baseName = baseName.replace(/_(\d{2})(\.csv)?$/, "");

    // Find all existing names to ensure unique incremental naming
    const existingNames = uploadedFiles.map((file) => file.fileName);

    // Increment suffix until a unique name is found
    let newChatName = baseName;
    while (existingNames.includes(newChatName)) {
      newChatName = incrementSuffix(newChatName);
    }

    // Create the new chat object
    const newChat = {
      fileName: newChatName,
      data: null,
      queries: [],
    };

    // Update the state with the new chat
    const updatedFiles = [...uploadedFiles, newChat];
    setUploadedFiles(updatedFiles);
    localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

    // Update other state variables
    setFileData(null);
    setQueries([]);
    setSelectedFileName(newChatName);
    setShowChatActions(false);
    setIsNewChat(true);

    // Optionally set the new chat as selected
    setSelectedFileIndex(updatedFiles.length - 1);
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
        setQueries((prevQueries) => [...prevQueries, newQuery]);
        setMessage("");

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

  // Update handleTextArea1Submit to handle JSON file queries
  const handleTextArea1Submit = async () => {
    if (textArea1.trim()) {
      try {
        const response = await fetchQueryResponse(textArea1);
        const newQuery = { query: textArea1, response: response };
        setQueries((prevQueries) => [...prevQueries, newQuery]);
        setTextArea1("");

        // Update uploadedFiles to include the new query for JSON or Data Source
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

  // const handleDBClick = () => setIsDBModalOpen(true)
  const handleDBClick = async () => {
    const tableName = "Data_Saless123_7TvOf";

    try {
      setLoading(true);
      const chartData = await fetchDBData(tableName);

      const dbFileName = `DB_${tableName}`;
      const newDBFile = {
        fileName: dbFileName,
        data: chartData,
        type: "db",
        queries: [],
      };

      const updatedFiles = [...uploadedFiles, newDBFile];
      setUploadedFiles(updatedFiles);
      localStorage.setItem("uploadedFiles", JSON.stringify(updatedFiles));

      setSelectedFileName(dbFileName);
      setDbChartData(chartData);
      setJsonChartData(null);
      setFileData(null);
      setShowChatActions(false);
    } catch (error) {
      console.error("Error connecting to the database:", error);
      alert(
        `Failed to connect to database: ${
          error.response?.data?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDBConnectChartClick = (data, fileName) => {
    // Set the DB chart data for rendering the graph
    setDbChartData(data);

    // Clear any JSON chart data if the DB chart is clicked
    setJsonChartData(null);

    // Set the selected file name to reflect which file was clicked
    setSelectedFileName(fileName);

    // Find the DB file in the uploadedFiles array
    const selectedFile = uploadedFiles.find(
      (file) => file.fileName === fileName && file.type === "db"
    );

    // Ensure that queries exist for the selected DB file
    const selectedQueries = selectedFile ? selectedFile.queries : [];

    // Set the queries for the selected DB file to state
    setQueries(selectedQueries);

    // Optionally, log for debugging purposes
    console.log("DB Chart Data:", data);
    console.log("Selected File:", selectedFile);
    console.log("Queries for selected file:", selectedQueries);
  };

  const handleJsonChartClick = (data, fileName) => {
    setJsonChartData(data);
    console.log(data, "JSON chart clicked");
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
            onJsonChartClick={handleJsonChartClick}
            onDBConnectChartClick={handleDBConnectChartClick}
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
                    <button onClick={handleDBClick} className="connect-db-btn">
                      Connect DB
                    </button>
                  </div>
                )}
              </div>
            ) : dbChartData ? (
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
                              className="mb-4 shadow-lg rounded-lg"
                            >
                              <div className="bg-gray-100 p-3 rounded-lg mb-4 font-medium">
                                <strong>Q:</strong> {query.query}
                              </div>
                              {query.response && (
                                <div className="mt-2">
                                  <strong>Title: </strong> {query.query}
                                  {/* Display ResponseGraph if it's a query response */}
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
                  {/* Show DBConnectChart when dbChartData is active */}
                  <DBConnectChart chartData={dbChartData} />
                </div>
              </div>
            ) : jsonChartData ? (
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
                              className="mb-4 shadow-lg rounded-lg"
                            >
                              <div className="bg-gray-100 p-3 rounded-lg mb-4 font-medium">
                                <strong>Q:</strong> {query.query}
                              </div>
                              {query.response && (
                                <div className="mt-2">
                                  <strong>Title: </strong> {query.query}
                                  {/* Display ResponseGraph if it's a query response */}
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
                  {/* Show JsonChart if jsonChartData is active */}
                  <JsonChart chartData={jsonChartData} />
                </div>
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
                              className="mb-4 shadow-lg rounded-lg"
                            >
                              <div className="bg-gray-100 p-3 rounded-lg mb-4 font-medium">
                                <strong>Q:</strong> {query.query}
                              </div>
                              {query.response && (
                                <div className="mt-2">
                                  <strong>Title: </strong> {query.query}
                                  {/* Display ResponseGraph if it's a query response */}
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
                  {/* Show GraphComponent if fileData is active */}
                  <GraphComponent data={fileData} />
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
