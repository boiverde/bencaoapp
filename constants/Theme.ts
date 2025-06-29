import { Colors } from './Colors';

export const Theme = {
  colors: Colors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 24,
    circle: 9999,
  },
  typography: {
    fontFamily: {
      heading: 'Montserrat-Bold',
      subheading: 'Montserrat-SemiBold',
      body: 'OpenSans-Regular',
      bodyBold: 'OpenSans-SemiBold',
      verse: 'PlayfairDisplay-Italic'
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 30,
    },
    lineHeight: {
      heading: 1.2,
      body: 1.5,
    },
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 6,
    },
  },
};

export default Theme;