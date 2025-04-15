import { StrictMode } from 'react'
import React from "react"
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AppContextProvider } from './Context/AppContext.jsx'

const GA_ID = import.meta.env.VITE_GA_ID;

if (GA_ID) {
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  script.onload = () => {
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID);
  };
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AppContextProvider>
    <App />
    </AppContextProvider>
  </StrictMode>,
)
