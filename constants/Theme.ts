const Theme = {
  colors: {
    primary: {
      blue: '#6BBBDD',
      pink: '#FF8FAB',
      lilac: '#C8A2C8',
      gold: '#FFD700'
    },
    status: {
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336'
    },
    text: {
      dark: '#333333',
      medium: '#666666',
      light: '#999999'
    },
    background: {
      white: '#FFFFFF',
      light: '#F5F5F5',
      lilac: '#F8F5FF'
    },
    ui: {
      border: '#E0E0E0',
      disabled: '#CCCCCC'
    }
  },
  typography: {
    fontFamily: {
      heading: 'Montserrat-Bold',
      subheading: 'Montserrat-SemiBold',
      body: 'OpenSans-Regular',
      verse: 'PlayfairDisplay-Italic'
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 24,
      xxl: 32,
      xxxl: 48
    }
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    circle: 9999
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 4
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 8
    }
  }
};

export default Theme;