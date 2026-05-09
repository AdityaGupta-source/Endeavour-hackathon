import { createGlobalStyle } from 'styled-components';

// Define color palette
export const colors = {
  // Primary colors
  primary: {
    main: '#00FFA3', // Neon Cyber Green
    light: '#66FFC2',
    dark: '#00B372',
    contrastText: '#0A0F16'
  },
  // Secondary colors
  secondary: {
    main: '#00F0FF', // Neon Cyan
    light: '#66F6FF',
    dark: '#00A8B3',
    contrastText: '#0A0F16'
  },
  // Accent color
  accent: {
    main: '#FFD700', // Neon Yellow
    light: '#FFEA70',
    dark: '#B29600',
    contrastText: '#0A0F16'
  },
  // Neutral colors
  neutral: {
    white: '#FFFFFF',
    light: '#2D3748',
    medium: '#4A5568',
    grey: '#A0AEC0',
    darkGrey: '#CBD5E0',
    dark: '#F7FAFC',
    black: '#000000'
  },
  // Feedback colors
  feedback: {
    success: '#00FFA3',
    info: '#00F0FF',
    warning: '#FFD700',
    error: '#FF3366'
  },
  // Background colors
  background: {
    default: '#0A0F16', // Deep charcoal
    paper: '#131C28', // Slightly lighter
    dark: '#05080C'
  },
  // Text colors
  text: {
    primary: '#FFFFFF',
    secondary: '#A0AEC0',
    disabled: '#4A5568',
    hint: '#4A5568'
  },
  // Border colors
  border: {
    light: '#2D3748',
    main: '#1A2433',
    dark: '#0A0F16'
  }
};

// Define typography
export const typography = {
  fontFamily: "'Poppins', 'Roboto', 'Helvetica', 'Arial', sans-serif",
  fontSize: 16,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 700,
  h1: {
    fontSize: '2.5rem',
    fontWeight: 700,
    lineHeight: 1.2
  },
  h2: {
    fontSize: '2rem',
    fontWeight: 600,
    lineHeight: 1.3
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: 600,
    lineHeight: 1.3
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: 600,
    lineHeight: 1.4
  },
  h6: {
    fontSize: '1.125rem',
    fontWeight: 600,
    lineHeight: 1.5
  },
  body1: {
    fontSize: '1rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: 400,
    lineHeight: 1.5
  },
  button: {
    fontSize: '0.875rem',
    fontWeight: 500,
    lineHeight: 1.75,
    textTransform: 'uppercase'
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: 400,
    lineHeight: 1.66
  }
};

// Define spacing
export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  xxl: '3rem'
};

// Define breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px'
};

// Define shadows
export const shadows = {
  sm: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
  md: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
  lg: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
  xl: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
  xxl: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
};

// Define border radius
export const borderRadius = {
  xs: '2px',
  sm: '4px',
  md: '8px',
  lg: '12px',
  xl: '16px',
  xxl: '24px',
  round: '50%'
};

// Define z-index
export const zIndex = {
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500
};

// Define transitions
export const transitions = {
  easing: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)'
  },
  duration: {
    shortest: 150,
    shorter: 200,
    short: 250,
    standard: 300,
    complex: 375,
    enteringScreen: 225,
    leavingScreen: 195
  }
};

// Create theme object
export const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  zIndex,
  transitions
};

// Define global styles
export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    font-family: ${typography.fontFamily};
    font-size: ${typography.fontSize}px;
    line-height: 1.5;
    color: ${colors.text.primary};
    background-color: ${colors.background.default};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  a {
    color: ${colors.primary.main};
    text-decoration: none;
    transition: color 0.2s ${transitions.easing.easeInOut};
    
    &:hover {
      color: ${colors.primary.dark};
    }
  }

  button {
    font-family: ${typography.fontFamily};
    border: none;
    cursor: pointer;
  }

  ul, ol {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${colors.neutral.light};
  }

  ::-webkit-scrollbar-thumb {
    background: ${colors.neutral.grey};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${colors.neutral.darkGrey};
  }
`;

export default theme; 