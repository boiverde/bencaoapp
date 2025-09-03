import { ImageOptimizer } from '@/utils/imageOptimizer';
import { Platform, Dimensions } from 'react-native';

// Mock Platform and Dimensions
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn(obj => obj.web || obj.default),
}));

jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
}));

// Add window.devicePixelRatio for web tests
Object.defineProperty(window, 'devicePixelRatio', {
  value: 2,
  writable: true,
});

describe('ImageOptimizer', () => {
  const pexelsUrl = 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg';
  const nonPexelsUrl = 'https://example.com/image.jpg';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('getOptimizedImageUrl', () => {
    it('returns original URL for non-Pexels images', () => {
      const result = ImageOptimizer.getOptimizedImageUrl(nonPexelsUrl);
      expect(result).toBe(nonPexelsUrl);
    });
    
    it('adds width parameter to Pexels URL', () => {
      const result = ImageOptimizer.getOptimizedImageUrl(pexelsUrl);
      expect(result).toContain('w=375');
    });
    
    it('adds custom width and height parameters when provided', () => {
      const result = ImageOptimizer.getOptimizedImageUrl(pexelsUrl, { width: 500, height: 300 });
      expect(result).toContain('w=500');
      expect(result).toContain('h=300');
    });
    
    it('adds quality parameter', () => {
      const result = ImageOptimizer.getOptimizedImageUrl(pexelsUrl, { quality: 90 });
      expect(result).toContain('q=90');
    });
    
    it('adds format parameter for web platform', () => {
      const result = ImageOptimizer.getOptimizedImageUrl(pexelsUrl, { format: 'webp' });
      expect(result).toContain('fm=webp');
    });
    
    it('handles URLs with existing query parameters', () => {
      const urlWithParams = `${pexelsUrl}?auto=compress`;
      const result = ImageOptimizer.getOptimizedImageUrl(urlWithParams, { width: 400 });
      expect(result).toContain('auto=compress');
      expect(result).toContain('w=400');
    });
    
    it('adds device pixel ratio for responsive images', () => {
      const result = ImageOptimizer.getOptimizedImageUrl(pexelsUrl);
      expect(result).toContain('dpr=2');
    });
  });
  
  describe('getPlaceholderUrl', () => {
    it('returns original URL for non-Pexels images', () => {
      const result = ImageOptimizer.getPlaceholderUrl(nonPexelsUrl);
      expect(result).toBe(nonPexelsUrl);
    });
    
    it('adds blur and small width for Pexels images', () => {
      const result = ImageOptimizer.getPlaceholderUrl(pexelsUrl);
      expect(result).toContain('w=20');
      expect(result).toContain('blur=10');
    });
    
    it('handles URLs with existing query parameters', () => {
      const urlWithParams = `${pexelsUrl}?auto=compress`;
      const result = ImageOptimizer.getPlaceholderUrl(urlWithParams);
      expect(result).toContain('auto=compress');
      expect(result).toContain('w=20');
      expect(result).toContain('blur=10');
    });
  });
  
  describe('getOptimalImageSize', () => {
    it('calculates optimal dimensions based on container size and pixel ratio', () => {
      const result = ImageOptimizer.getOptimalImageSize(100, 200);
      expect(result).toEqual({ width: 200, height: 400 });
    });
  });
});