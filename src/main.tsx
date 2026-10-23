import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { EventProvider } from './context/EventRuntime';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('The application root element is missing.');
}

createRoot(rootElement).render(
  <React.StrictMode>
    <EventProvider><App /></EventProvider>
  </React.StrictMode>,
);
