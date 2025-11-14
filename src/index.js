import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from "@apollo/client";
import client from './views/admin/work-space/components/apolloClient';
import App from './App';
import './assets/css/App.css';

export const backendUrl = 'http://192.168.1.78:3000';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);
