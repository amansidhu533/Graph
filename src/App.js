import React from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './assests/css/style.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <div className="app">
       <ToastContainer />
      <ChatWindow />
    </div>
  );
}

export default App;
