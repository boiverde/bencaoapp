import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NotificationBell from '@/components/UI/NotificationBell';
import { useNotifications } from '@/hooks/useNotifications';

// Mock the useNotifications hook
jest.mock('@/hooks/useNotifications', () => ({
  useNotifications: jest.fn()
}));

describe('NotificationBell', () => {
  const mockOnPress = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 0
    });
  });
  
  it('renders correctly with no unread notifications', () => {
    const { getByRole, queryByText } = render(
      <NotificationBell onPress={mockOnPress} />
    );
    
    // Should have a button role
    const button = getByRole('button');
    expect(button).toBeTruthy();
    
    // Should not have a badge when unreadCount is 0
    expect(queryByText('0')).toBeNull();
  });
  
  it('renders correctly with unread notifications', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 5
    });
    
    const { getByText } = render(
      <NotificationBell onPress={mockOnPress} />
    );
    
    // Should show the unread count
    expect(getByText('5')).toBeTruthy();
  });
  
  it('handles large unread counts correctly', () => {
    (useNotifications as jest.Mock).mockReturnValue({
      unreadCount: 100
    });
    
    const { getByText } = render(
      <NotificationBell onPress={mockOnPress} />
    );
    
    // Should show 99+ for counts over 99
    expect(getByText('99+')).toBeTruthy();
  });
  
  it('calls onPress when pressed', () => {
    const { getByRole } = render(
      <NotificationBell onPress={mockOnPress} />
    );
    
    fireEvent.press(getByRole('button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });
  
  it('applies custom size and color props', () => {
    const { UNSAFE_getByType } = render(
      <NotificationBell onPress={mockOnPress} size={32} color="red" />
    );
    
    // Check if the Bell icon has the correct props
    const bellIcon = UNSAFE_getByType('Icon');
    expect(bellIcon.props.size).toBe(32);
    expect(bellIcon.props.color).toBe('red');
  });
});