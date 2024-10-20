import React, { useState } from 'react';
import Papa from 'papaparse';
import { fetchFileData } from '../modules';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UploadModal({ handleCloseModal, handleFileSubmit }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [fileTypeError, setFileTypeError] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setFileTypeError('');

    if (file) {
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const csv = event.target.result;

          // Parse the CSV with enhanced options
          Papa.parse(csv, {
            header: true,           // Attempt to parse with headers
            skipEmptyLines: true,    // Ignore empty lines
            dynamicTyping: true,     // Auto-detect number and boolean types
            complete: function (results) {
              setFilePreview(results.data);
            },
            error: function (error) {
              setFilePreview(null);
              setFileTypeError('Error parsing CSV file: ' + error.message);
              toast.error('Error parsing CSV file: ' + error.message); // Toast error message
            }
          });
        };
        reader.readAsText(file);
      } else if (file.name.endsWith('.xlsx')) {
        setFilePreview("Preview not available for Excel files.");
        toast.info('Preview not available for Excel files'); // Info toast message
      } else {
        setFilePreview(null);
        setFileTypeError('Unsupported file type. Please upload a CSV or Excel file.');
        toast.error('Unsupported file type. Please upload a CSV or Excel file.'); // Error toast
      }
    } else {
      setFilePreview(null);
    }
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      try {
        const response = await fetchFileData(selectedFile);
        handleFileSubmit(selectedFile.name, filePreview); // Pass parsed data
        toast.success('File uploaded successfully!'); // Success toast
        handleCloseModal();
      } catch (error) {
        toast.error('Error uploading file. Please try again.'); // Failure toast
      }
    } else {
      toast.warn('Please upload a file'); // Warning toast
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Upload CSV/Excel</h3>
        <input 
          type="file" 
          accept=".csv, .xlsx" 
          onChange={handleFileChange} 
        />
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
                            <td key={idx}>{value !== undefined ? value : '-'}</td>
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

        {fileTypeError && <p className="error-message">{fileTypeError}</p>}

        <div className="modal-actions">
          <button className="submit-btn" onClick={handleSubmit}>Submit</button>
          <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default UploadModal;
