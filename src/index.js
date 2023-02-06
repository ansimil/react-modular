import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { ModularBus } from './contexts/ModularBusContext'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ModularBus>
    <App />
  </ModularBus>
  // </React.StrictMode>
);

reportWebVitals();
