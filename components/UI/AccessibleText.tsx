import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useGlobalState } from '@/utils/stateManager';

interface AccessibleTextProps extends TextProps {
  variant?: 'body' | 'heading' | 'subheading' | 'caption' | 'verse';
  fontSize?: number;
  color?: string;
  centered?: boolean;
  children: React.ReactNode;
}

/**
 * Text component that respects accessibility settings
 */
export default function AccessibleText({
  variant = 'body',
  fontSize,
  color,
  centered = false,
  style,
  children,
  ...props
}: AccessibleTextProps) {
  // Get accessibility settings
  const [largeText] = useGlobalState<boolean>('accessibility_large_text', false);
  const [highContrast] = useGlobalState<boolean>('accessibility_high_contrast', false);
  
  // Calculate font size based on accessibility settings
  const getFontSize = () => {
    if (fontSize) {
      return largeText ? fontSize * 1.3 : fontSize;
    }
    
    // Default font sizes by variant
    const sizes = {
      body: 16,
      heading: 24,
      subheading: 18,
      caption: 14,
      verse: 16
    };
    
    return largeText ? sizes[variant] * 1.3 : sizes[variant];
  };
  
  // Get font family based on variant
  const getFontFamily = () => {
    switch (variant) {
      case 'heading':
        return 'Montserrat-Bold';
      case 'subheading':
        return 'Montserrat-SemiBold';
      case 'verse':
        return 'PlayfairDisplay-Italic';
      case 'caption':
      case 'body':
      default:
        return 'OpenSans-Regular';
    }
  };
  
  // Get text color based on accessibility settings
  const getTextColor = () => {
    if (color) return color;
    
    // Default colors by variant
    const colors = {
      body: '#2D3436',
      heading: '#2D3436',
      subheading: '#2D3436',
      caption: '#636E72',
      verse: '#2D3436'
    };
    
    // Increase contrast if needed
    if (highContrast) {
      return variant === 'caption' ? '#000000' : '#000000';
    }
    
    return colors[variant];
  };

  return (
    <Text
      style={[
        {
          fontFamily: getFontFamily(),
          fontSize: getFontSize(),
          color: getTextColor(),
          textAlign: centered ? 'center' : 'auto',
        },
        style
      ]}
      {...props}
    >
      {children}
    </Text>
  );
}