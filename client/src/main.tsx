import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './css/index.css';

import { ApolloProvider } from '@apollo/client';
import client from './api/graphqlClient';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>
);
