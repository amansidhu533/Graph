import React, { useState } from "react";

function ConnectDBModal({ handleCloseModal, handleDBOptionSubmit }) {
  const [json, setJson] = useState("");
  const [token, setToken] = useState("");

  const handleJsonChange = (event) => {
    setJson(event.target.value);
  };

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleSubmit = () => {
    handleDBOptionSubmit({ json, token });
    handleCloseModal();
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
