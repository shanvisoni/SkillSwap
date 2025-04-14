import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext";
import { MatchProvider } from "./context/MatchContext";
import { ChatProvider } from "./context/ChatContext";
import 'react-toastify/dist/ReactToastify.css';
createRoot(document.getElementById('root')).render(
  <StrictMode>
 <AuthProvider>
      <MatchProvider>
      <ChatProvider>
          <App />
          </ChatProvider>
      </MatchProvider>
    </AuthProvider>
  </StrictMode>,
)
