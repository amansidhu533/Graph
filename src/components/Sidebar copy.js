import React, { useState } from 'react';
 
function Sidebar({ uploadedFiles }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="collapse-toggle">
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? '→' : '←'}
        </button>
      </div>
      <div className={`uploaded-files-list ${collapsed ? 'hidden' : ''}`}>
        <h4>Data Source</h4>
        {uploadedFiles && uploadedFiles.length > 0 ? (  
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
