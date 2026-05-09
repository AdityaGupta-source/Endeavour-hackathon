import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: {
      main: '#00FFA3', // Neon Cyber Green
      light: '#66FFC2',
      dark: '#00B372',
    },
    secondary: {
      main: '#00F0FF', // Neon Cyan
      light: '#66F6FF',
      dark: '#00A8B3',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#A0AEC0',
      disabled: '#4A5568',
    },
    background: {
      default: '#0A0F16', // Deep charcoal/blue-black
      paper: '#131C28', // Slightly lighter for cards/surfaces
    },
    error: '#FF3366', // Neon Red/Pink
    success: '#00FFA3',
    warning: '#FFD700', // Neon Yellow
    info: '#00F0FF',
    disabled: '#4A5568',
    white: '#FFFFFF',
    border: '#2D3748', // Dark border
  },
  spacing: (multiplier = 1) => `${8 * multiplier}px`,
  breakpoints: {
    xs: '320px',
    sm: '576px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
  },
  shadows: {
    sm: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
  },
  typography: {
    fontFamily: '"Outfit", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    fontWeights: {
      light: 300,
      regular: 400,
      medium: 500,
      bold: 700,
    },
    fontSize: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '20px',
      xxl: '24px',
    },
  },
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '16px',
    xl: '24px',
    circle: '50%',
  },
};

export default theme; 