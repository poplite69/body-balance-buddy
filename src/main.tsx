
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.tsx';
import './index.css';

console.log("main.tsx is executing - about to render the app");

const rootElement = document.getElementById("root");
console.log("Root element found:", rootElement ? "yes" : "no");

if (rootElement) {
  const root = createRoot(rootElement);
  console.log("React root created successfully");
  
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  console.log("App rendered into the DOM");
} else {
  console.error("Failed to find root element - this could be causing the blank screen");
}
