import { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Theme from '@/constants/Theme';
import { RefreshCw } from 'lucide-react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error boundary component to catch and handle JavaScript errors
 * in child component tree
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
    
    // Here you would log to your error tracking service
    // Example: Sentry.captureException(error);
  }

  resetError = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <View style={styles.container}>
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Algo deu errado</Text>
            <Text style={styles.errorMessage}>
              Desculpe, ocorreu um erro inesperado.
            </Text>
            
            <ScrollView style={styles.errorDetails}>
              <Text style={styles.errorText}>
                {this.state.error?.toString()}
              </Text>
              {this.state.errorInfo && (
                <Text style={styles.stackTrace}>
                  {this.state.errorInfo.componentStack}
                </Text>
              )}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={this.resetError}
              accessibilityLabel="Tentar novamente"
              accessibilityRole="button"
            >
              <RefreshCw size={20} color="#fff" />
              <Text style={styles.resetButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.light,
  },
  errorCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    width: '90%',
    maxWidth: 500,
    alignItems: 'center',
    ...Theme.shadows.medium,
  },
  errorTitle: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.status.error,
    marginBottom: Theme.spacing.md,
  },
  errorMessage: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    marginBottom: Theme.spacing.lg,
  },
  errorDetails: {
    maxHeight: 200,
    width: '100%',
    marginBottom: Theme.spacing.lg,
  },
  errorText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.error,
    marginBottom: Theme.spacing.md,
  },
  stackTrace: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  resetButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    alignItems: 'center',
  },
  resetButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
});