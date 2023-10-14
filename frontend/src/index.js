import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import './index.css'; 
import App from './App'; 
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import { store } from './app/store'
import { Provider } from 'react-redux'
import { config } from './constants/backend-api'

const root = ReactDOM.createRoot(document.getElementById('root')); 
console.log(config.url.API_URL);
root.render( 
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);