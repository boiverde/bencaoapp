import { Platform, Dimensions } from 'react-native';

/**
 * Utility for optimizing images in the application
 */
export class ImageOptimizer {
  /**
   * Get optimized image URL based on device screen size and platform
   * @param originalUrl Original image URL
   * @param options Options for optimization
   * @returns Optimized image URL
   */
  static getOptimizedImageUrl(
    originalUrl: string, 
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpeg' | 'png';
    } = {}
  ): string {
    // If not a Pexels URL, return original
    if (!originalUrl.includes('pexels.com')) {
      return originalUrl;
    }

    const { width: screenWidth } = Dimensions.get('window');
    
    // Default options
    const width = options.width || Math.round(screenWidth);
    const height = options.height;
    const quality = options.quality || 80;
    
    // For Pexels images, we can use their URL parameters
    let optimizedUrl = originalUrl;
    
    // Add size parameters
    if (originalUrl.includes('?')) {
      optimizedUrl += `&w=${width}`;
      if (height) {
        optimizedUrl += `&h=${height}`;
      }
      optimizedUrl += `&dpr=${Platform.OS === 'web' ? window.devicePixelRatio || 1 : 2}`;
    } else {
      optimizedUrl += `?w=${width}`;
      if (height) {
        optimizedUrl += `&h=${height}`;
      }
      optimizedUrl += `&dpr=${Platform.OS === 'web' ? window.devicePixelRatio || 1 : 2}`;
    }
    
    // Add quality parameter
    optimizedUrl += `&q=${quality}`;
    
    // Add format parameter for web
    if (Platform.OS === 'web' && options.format) {
      optimizedUrl += `&fm=${options.format}`;
    }
    
    return optimizedUrl;
  }

  /**
   * Get a placeholder image URL for lazy loading
   * @param originalUrl Original image URL
   * @returns Low quality placeholder image URL
   */
  static getPlaceholderUrl(originalUrl: string): string {
    if (!originalUrl.includes('pexels.com')) {
      return originalUrl;
    }
    
    // Create a very small, blurry version for placeholders
    let placeholderUrl = originalUrl;
    
    if (originalUrl.includes('?')) {
      placeholderUrl += '&w=20&blur=10';
    } else {
      placeholderUrl += '?w=20&blur=10';
    }
    
    return placeholderUrl;
  }

  /**
   * Get appropriate image size based on component dimensions
   * @param containerWidth Width of the container
   * @param containerHeight Height of the container
   * @returns Optimal image dimensions
   */
  static getOptimalImageSize(containerWidth: number, containerHeight: number): { width: number; height: number } {
    // Calculate optimal dimensions based on device pixel ratio
    const pixelRatio = Platform.OS === 'web' ? window.devicePixelRatio || 1 : 2;
    
    return {
      width: Math.round(containerWidth * pixelRatio),
      height: Math.round(containerHeight * pixelRatio)
    };
  }
}