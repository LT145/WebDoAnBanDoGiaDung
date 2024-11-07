import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Views/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Detail from './Views/Detail/Detail';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import Admin from './Admin/Admin';




const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <Home /> */}
   <Detail />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
