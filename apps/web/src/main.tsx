import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { initWebSentry } from './lib/sentry';
import './index.css';

initWebSentry();

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Elemento #root não encontrado');

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>
);
