import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router/dom";
import { router } from './router/router.jsx';
import { ThemeProvider } from './provider/ThemeContext.jsx';
import AuthProvider from './contexts/AuthContext/AuthProvider.jsx';
import { Toaster } from 'react-hot-toast';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'

// AOS imports
import AOS from 'aos';
import 'aos/dist/aos.css';

const queryClient = new QueryClient()


// Initialize AOS before render
AOS.init({
  duration: 1000,
  once: true,
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <div className='font-roboto max-w-7xl mx-auto'> */}
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <Toaster position="top-right" autoClose={3000} />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
    {/* </div> */}
  </StrictMode>,
)
