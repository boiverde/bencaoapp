import React from 'react';
import { 
  TouchableOpacity, 
  TouchableOpacityProps, 
  StyleSheet, 
  Text, 
  View 
} from 'react-native';
import Theme from '@/constants/Theme';

interface AccessibleTouchableProps extends TouchableOpacityProps {
  label: string;
  hint?: string;
  role?: 'button' | 'link' | 'tab' | 'checkbox' | 'radio' | 'menuitem' | 'switch';
  isSelected?: boolean;
  isDisabled?: boolean;
  children: React.ReactNode;
  labelStyle?: any;
  showLabel?: boolean;
}

/**
 * An accessible touchable component that follows best practices for accessibility
 */
export default function AccessibleTouchable({
  label,
  hint,
  role = 'button',
  isSelected,
  isDisabled,
  children,
  labelStyle,
  showLabel = false,
  style,
  ...props
}: AccessibleTouchableProps) {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isDisabled && styles.disabled,
        style
      ]}
      accessible={true}
      accessibilityLabel={label}
      accessibilityHint={hint}
      accessibilityRole={role}
      accessibilityState={{
        selected: isSelected,
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      {...props}
    >
      {children}
      
      {showLabel && (
        <Text style={[styles.label, labelStyle]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
  },
});