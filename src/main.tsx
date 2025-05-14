import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { account } from './lib/appwrite.ts';
import { $user } from './state/userStore.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div className="dark text-foreground w-screen h-screen relative overflow-hidden">
      <App />
    </div>
  </React.StrictMode>,
);

// Use contextBridge
window.ipcRenderer.on('main-process-message', (_event, message) => {
  console.log(message)
})
