import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <ThemeProvider>
      <Toaster position="top right" toastOptions={{ duration: 3000 }} />
      <App />
    </ThemeProvider>
  </AuthProvider>,
);

