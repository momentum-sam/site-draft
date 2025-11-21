import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import '@fontsource/open-sauce-sans/300.css';
import '@fontsource/open-sauce-sans/400.css';
import '@fontsource/open-sauce-sans/500.css';
import '@fontsource/open-sauce-sans/600.css';
import '@fontsource/open-sauce-sans/700.css';
import "./index.css";

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);