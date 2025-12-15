// Theme Configuration
// Customize aplikasi dengan mudah melalui file ini

export const themeConfig = {
  // Brand Colors
  brand: {
    primary: '#213448',      // slate-900 - warna utama aplikasi
    secondary: '#64748b',    // slate-500 - warna sekunder
    accent: '#3b82f6',       // blue-500 - warna aksen/highlight
  },

  // Sidebar Configuration
  sidebar: {
    background: '#f8fafc',   // slate-50 - background sidebar
    textColor: '#64748b',    // slate-600 - text color default
    textHover: '#0f172a',    // slate-900 - text color on hover
    activeBackground: '#ffffff', // white - background menu aktif
    activeBorder: '#213448', // slate-300 - border menu aktif
    activeText: '#0f172a',   // slate-900 - text color menu aktif
    width: '16rem',          // w-64 - lebar sidebar
    collapsedWidth: '4rem',  // w-16 - lebar sidebar collapsed
  },

  // Header Configuration
  header: {
    background: '#ffffff',   // white - background header
    borderColor: '#e2e8f0',  // slate-200 - border color
    height: '3.5rem',        // h-14 - tinggi header
    textColor: '#0f172a',    // slate-900 - text color
  },

  // Button Configuration
  button: {
    primary: {
      background: '#0f172a',
      text: '#ffffff',
      hover: '#1e293b',      // slate-800
    },
    secondary: {
      background: '#f1f5f9',
      text: '#0f172a',
      hover: '#e2e8f0',
    },
    danger: {
      background: '#dc2626',  // red-600
      text: '#ffffff',
      hover: '#b91c1c',       // red-700
    },
  },

  // Card Configuration
  card: {
    background: '#ffffff',
    border: '#e2e8f0',
    shadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
  },

  // Toast/Notification Configuration
  toast: {
    success: {
      background: '#f0fdf4',  // green-50
      border: '#22c55e',      // green-500
      text: '#14532d',        // green-900
    },
    error: {
      background: '#fef2f2',  // red-50
      border: '#ef4444',      // red-500
      text: '#7f1d1d',        // red-900
    },
    info: {
      background: '#eff6ff',  // blue-50
      border: '#3b82f6',      // blue-500
      text: '#1e3a8a',        // blue-900
    },
  },

  // Table Configuration
  table: {
    headerBackground: '#f8fafc', // slate-50/50 muted
    headerText: '#475569',       // slate-600
    rowHoverBackground: '#f8fafc', // slate-50/50 muted
    borderColor: '#e2e8f0',      // slate-200
  },

  // Form Configuration
  form: {
    inputBorder: '#e2e8f0',
    inputFocus: '#3b82f6',
    inputBackground: '#ffffff',
    labelColor: '#0f172a',
    errorColor: '#ef4444',
    errorBackground: '#fef2f2',
  },

  // Status Badge Configuration
  badge: {
    active: {
      background: '#dcfce7',  // green-100
      text: '#166534',        // green-800
    },
    inactive: {
      background: '#f1f5f9',  // gray-100
      text: '#475569',        // gray-800
    },
  },

  // Typography
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    heading: '#0f172a',
    body: '#475569',
    muted: '#94a3b8',
  },

  // Spacing (dalam rem)
  spacing: {
    xs: '0.5rem',   // 8px
    sm: '0.75rem',  // 12px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
  },

  // Border Radius
  borderRadius: {
    sm: '0.375rem',  // 6px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    full: '9999px',
  },

  // Transitions
  transitions: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
  },
}

// Helper function untuk generate CSS variables
export function generateCSSVariables() {
  return `
    --color-primary: ${themeConfig.brand.primary};
    --color-secondary: ${themeConfig.brand.secondary};
    --color-accent: ${themeConfig.brand.accent};
    
    --sidebar-bg: ${themeConfig.sidebar.background};
    --sidebar-text: ${themeConfig.sidebar.textColor};
    --sidebar-active-bg: ${themeConfig.sidebar.activeBackground};
    
    --header-bg: ${themeConfig.header.background};
    --header-border: ${themeConfig.header.borderColor};
    
    --font-family: ${themeConfig.typography.fontFamily};
  `
}

export default themeConfig
