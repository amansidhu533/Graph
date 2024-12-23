import React, { useState } from "react";
import Papa from "papaparse";
import { fetchFileData, fetchFileJsonData } from "../modules";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UploadModal({
  setShowChatActions,
  handleCloseModal,
  handleFileSubmit,
  handleDBOptionSubmit,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileTypeError, setFileTypeError] = useState("");
  const [selectedFileIndex, setSelectedFileIndex] = useState(null);
  const [json, setJson] = useState("");
  const [token, setToken] = useState("");
  const [isCsvUploadEnabled, setIsCsvUploadEnabled] = useState(false);
  const [isJsonUploadEnabled, setIsJsonUploadEnabled] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileTypeError("");

    if (file) {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const csv = event.target.result;

          Papa.parse(csv, {
            header: true,
            skipEmptyLines: true,
            dynamicTyping: true,
            complete: function (results) {
              setFilePreview(results.data);
            },
            error: function (error) {
              setFilePreview(null);
              setFileTypeError("Error parsing CSV file: " + error.message);
              toast.error("Error parsing CSV file: " + error.message);
            },
          });
        };
        reader.readAsText(file);
      } else if (file.name.endsWith(".xlsx")) {
        setFilePreview("Preview not available for Excel files.");
        toast.info("Preview not available for Excel files");
      } else {
        setFilePreview(null);
        setFileTypeError(
          "Unsupported file type. Please upload a CSV or Excel file."
        );
        toast.error(
          "Unsupported file type. Please upload a CSV or Excel file."
        );
      }
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmitJSON = async () => {
    try {
      const jsonBlob = new Blob([json], { type: "application/json" });
      const result = await fetchFileJsonData(jsonBlob);

      const fileName =
        json.substring(json.lastIndexOf("/") + 1) || result.doctype;

      const storedData = {
        json,
        token,
        chartData: result.chart_data,
        fileName,
      };
      localStorage.setItem("jsonFileData", JSON.stringify(storedData));

      handleDBOptionSubmit(storedData);
      handleCloseModal();
      setShowChatActions(false);
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        console.log("Uploading file:", selectedFile);

        const response = await fetchFileData(selectedFile);
        console.log("File data fetched successfully:", response);

        const fileNameWithoutExtension = selectedFile.name.replace(
          /\.[^/.]+$/,
          ""
        );

        if (selectedFileIndex !== null) {
          console.log("Linking file to selected chat:", selectedFileIndex);
          handleFileSubmit(
            fileNameWithoutExtension,
            filePreview,
            selectedFileIndex
          );
          toast.success("File uploaded and linked to the selected chat!");
        } else {
          console.log("Creating a new file link");
          handleFileSubmit(fileNameWithoutExtension, filePreview);
          toast.success("File uploaded as a separate link!");
        }

        handleCloseModal();
        setShowChatActions(false);
      } catch (error) {
        console.error("Error during file upload:", error);
      }
    } else {
      toast.warn("Please upload a file");
    }
  };

  const handleJsonCheckboxChange = (e) => {
    setIsJsonUploadEnabled(e.target.checked);
    setIsCsvUploadEnabled(false); // Disable CSV when JSON is selected
  };

  const handleCsvCheckboxChange = (e) => {
    setIsCsvUploadEnabled(e.target.checked);
    setIsJsonUploadEnabled(false); // Disable JSON when CSV is selected
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content1">
        <h2>Upload CSV/Excel or JSON</h2>
        
        {/* Checkboxes for CSV/Excel and JSON */}
        <div>
          <label>
            <input
              type="checkbox"
              checked={isCsvUploadEnabled}
              onChange={handleCsvCheckboxChange}
            /> &nbsp; Upload CSV/Excel
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isJsonUploadEnabled}
              onChange={handleJsonCheckboxChange}
            /> &nbsp; Upload JSON
          </label>
        </div>

        {/* CSV/Excel file input field */}
        {isCsvUploadEnabled && (
          <div>
            <input type="file" accept=".csv, .xlsx" onChange={handleFileChange} />
            {selectedFile && (
              <div className="file-preview">
                <h4>File Preview:</h4>
                {filePreview ? (
                  <div className="preview-content">
                    {Array.isArray(filePreview) && filePreview.length > 0 ? (
                      <table cellSpacing={0} cellPadding={3}>
                        <thead>
                          <tr>
                            {Object.keys(filePreview[0] || {}).map((key) => (
                              <th key={key}>{key}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {filePreview.map((row, index) => (
                            <tr key={index}>
                              {Object.values(row).map((value, idx) => (
                                <td key={idx}>
                                  {value !== undefined ? value : "-"}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <p>No data available in CSV</p>
                    )}
                  </div>
                ) : (
                  <p>No preview available</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* JSON input fields (URL and Token) */}
        {isJsonUploadEnabled && (
          <div>
            <div>
              <label>Enter JSON URL:</label>
              <input
                type="text"
                value={json}
                onChange={(e) => setJson(e.target.value)}
                placeholder="Enter your JSON URL"
              />
            </div>
            <div>
              <label>Enter Token:</label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Enter your token"
              />
            </div>
          </div>
        )}

        {fileTypeError && <p className="error-message">{fileTypeError}</p>}

        <div className="modal-actions">
          {/* Conditionally render the Submit button or Submit JSON button */}
          {!isJsonUploadEnabled ? (
            <button className="submit-btn" onClick={handleSubmit}>
              Submit
            </button>
          ) : (
            <button onClick={handleSubmitJSON} className="submit-btn">
              Submit JSON
            </button>
          )}

          <button className="cancel-btn" onClick={handleCloseModal}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
