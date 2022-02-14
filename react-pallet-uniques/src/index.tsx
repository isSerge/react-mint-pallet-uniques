import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';

import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApiProvider } from './apiContext';
import { AccountProvider } from './accountContext';
import { SubspaceProvider } from './subspaceContext';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <AccountProvider>
        <ApiProvider>
          <SubspaceProvider>
            <>
              <CssBaseline />
              <App />
            </>
          </SubspaceProvider>
        </ApiProvider>
      </AccountProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
