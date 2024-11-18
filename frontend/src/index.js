import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  BrowserRouter,
} from 'react-router-dom'
import { Toaster } from "react-hot-toast";
import './CSS/index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //<React.StrictMode>
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <App />
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            zIndex: 9999,
            fontFamily: "Quicksand",
            fontWeight: "600",
          },
        }}
      />
    </QueryClientProvider>
  </BrowserRouter>
  //</React.StrictMode>
);