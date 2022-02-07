import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Grommet } from 'grommet';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ApiContextProvider } from './apiContext';
import { AccountContextProvider } from './accountContext';
import { ChainContextProvider } from './chainContext';

const theme = {
  global: {
    font: {
      family: 'Roboto',
      size: '14px',
      height: '20px',
    },
  },
};

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Grommet theme={theme}>
        <ChainContextProvider>
          <AccountContextProvider>
            <ApiContextProvider>
              <App />
            </ApiContextProvider>
          </AccountContextProvider>
        </ChainContextProvider>
      </Grommet>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
