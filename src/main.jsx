import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from "react-router/dom";
import { router } from './router/router.jsx';
import { ThemeProvider } from './provider/ThemeContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className='font-roboto max-w-7xl mx-auto'>
      <ThemeProvider>
        <RouterProvider router={router} />
      </ThemeProvider>
    </div>
  </StrictMode>,
)
