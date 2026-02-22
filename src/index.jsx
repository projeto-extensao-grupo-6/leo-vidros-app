import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global/index.css';
import './styles/global/tailwind.css';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <App />
);