import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById("root")).render(

  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ThemeProvider>
        <Toaster position="top right" toastOptions={{ duration: 3000 }} />
        <App />
      </ThemeProvider>
    </AuthProvider>,
  </QueryClientProvider>
);

