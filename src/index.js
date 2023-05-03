import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import { ModularBus } from './contexts/ModularBusContext'
import { TransportContextWrapper } from './contexts/TransportContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <ModularBus>
    <TransportContextWrapper>
      <App />
    </TransportContextWrapper> 
  </ModularBus>
  // </React.StrictMode>
);

reportWebVitals();
