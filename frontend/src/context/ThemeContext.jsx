import { createContext, useState, useContext, useEffect } from 'react';
import { createTheme } from '@mui/material';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  // Load theme preference from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
  };

  // Create theme based on mode
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: '#ff5722', // Deep orange
      },
      secondary: {
        main: '#4caf50', // Green
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
      },
      h2: {
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
      },
      h4: {
        fontWeight: 500,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            paddingTop: '1rem',
            paddingBottom: '1rem',
            flex: 1,
          },
        },
      },
      MuiCssBaseline: {
        styleOverrides: `
          html, body, #root {
            height: 100%;
            width: 100%;
          }
          #root {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
          }
        `,
      },
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

export default ThemeContext;