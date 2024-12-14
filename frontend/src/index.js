import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fortawesome/fontawesome-free/css/all.min.css';
import App from './App'; // Import App.js chứa cấu hình routing
import Admin from './Admin/Admin';
//import './index.css'; // Nếu có style tùy chỉnh

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
    <App /> 
  //</React.StrictMode>
);
