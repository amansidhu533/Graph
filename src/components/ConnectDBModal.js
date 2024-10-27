import React, { useState } from "react";
import { fetchFileJsonData } from "../modules";

function ConnectDBModal({ handleCloseModal, handleDBOptionSubmit }) {
  const [json, setJson] = useState("");
  const [token, setToken] = useState("");

  const handleJsonChange = (event) => {
    setJson(event.target.value);
  };

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };
 

  const handleSubmit = async () => {
    try {
      // Convert the JSON text input to a Blob and use it as a 'file'
      const jsonBlob = new Blob([json], { type: "application/json" });
      const result = await fetchFileJsonData(jsonBlob); // Call fetchFileJsonData

      console.log("File processed successfully:", result);

      // Pass the chart data to the ChatWindow via handleDBOptionSubmit
      handleDBOptionSubmit({ json, token, chartData: result.chart_data });
      handleCloseModal(); // Close the modal after submitting
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  return (
    <div className="modal-overlay connectDB">
      <div className="modal-content">
        <h2>Select DB Connection Method</h2>
        <div>
          <label htmlFor="json-input">Enter JSON URL</label>
          <input
            type="text"
            id="json-input"
            value={json}
            onChange={handleJsonChange}
            placeholder="Enter your JSON"
          />
        </div>
        <div>
          <label htmlFor="token-input">Enter Token</label>
          <input
            type="text"
            id="token-input"
            value={token}
            onChange={handleTokenChange}
            placeholder="Enter your token"
          />
        </div>
        <div className="modal-actions">
          <button onClick={handleSubmit} className="submit-btn">
            Submit
          </button>
          <button onClick={handleCloseModal} className="cancel-btn">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConnectDBModal;
