import React from 'react'; 
import ChatWindow from './components/ChatWindow';
import './assets/css/style.css';
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
