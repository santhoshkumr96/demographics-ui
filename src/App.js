import './App.css';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Login from './Login/Login';
import LanguageProvider from './LanguageProvider/LanguageProvider';
import { Fab } from '@mui/material';
import ErrorProvider from './ErrorProvider/ErrorProvider';
import AppNavigator from './AppNavigator';
import LoginProvider from './LoginAuthProvider/LoginProvider';
import { BrowserRouter } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function App() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <ErrorProvider>
          <LanguageProvider>
            <LoginProvider>
              <AppNavigator />
            </LoginProvider>
          </LanguageProvider>
        </ErrorProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

export default App;
