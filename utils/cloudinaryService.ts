import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface CloudinaryUploadResult {
  url: string | null;
  error: string | null;
  publicId?: string;
}

export class CloudinaryService {
  private static readonly CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private static readonly API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
  private static readonly UPLOAD_PRESET = 'bencao_match_uploads';

  /**
   * Upload image to Cloudinary
   */
  static async uploadImage(
    uri: string,
    folder: string = 'profile-photos'
  ): Promise<CloudinaryUploadResult> {
    try {
      if (!this.CLOUD_NAME) {
        return { url: null, error: 'Cloudinary não configurado' };
      }

      // Process image first
      const { uri: processedUri, error: processError } = await this.processImage(uri);
      
      if (processError || !processedUri) {
        return { url: null, error: processError || 'Erro ao processar imagem' };
      }

      // Create form data
      const formData = new FormData();
      
      // Add file
      formData.append('file', {
        uri: processedUri,
        type: 'image/jpeg',
        name: `${Date.now()}.jpg`,
      } as any);
      
      formData.append('upload_preset', this.UPLOAD_PRESET);
      formData.append('folder', folder);
      formData.append('resource_type', 'image');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || 'Upload failed');
      }

      return { 
        url: data.secure_url, 
        error: null,
        publicId: data.public_id
      };
    } catch (error) {
      console.error('Upload to Cloudinary error:', error);
      return { url: null, error: 'Erro ao enviar imagem' };
    }
  }

  /**
   * Process and optimize image
   */
  private static async processImage(
    uri: string,
    maxWidth: number = 800,
    quality: number = 0.8
  ): Promise<{ uri: string | null; error: string | null }> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [
          { resize: { width: maxWidth } }
        ],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
          base64: false,
        }
      );

      return { uri: result.uri, error: null };
    } catch (error) {
      console.error('Process image error:', error);
      return { uri: null, error: 'Erro ao processar imagem' };
    }
  }

  /**
   * Delete image from Cloudinary
   */
  static async deleteImage(publicId: string): Promise<{ error: string | null }> {
    try {
      if (!this.CLOUD_NAME || !this.API_KEY) {
        return { error: 'Cloudinary não configurado' };
      }

      // In a real implementation, you would need to call Cloudinary's admin API
      // This requires server-side implementation for security
      console.log('Delete image:', publicId);
      
      return { error: null };
    } catch (error) {
      console.error('Delete image error:', error);
      return { error: 'Erro ao deletar imagem' };
    }
  }

  /**
   * Get optimized image URL
   */
  static getOptimizedUrl(
    url: string,
    width?: number,
    height?: number,
    quality?: number
  ): string {
    if (!url || !this.CLOUD_NAME) return url;

    // If it's a Cloudinary URL, add transformations
    if (url.includes('cloudinary.com')) {
      const transformations = [];
      
      if (width) transformations.push(`w_${width}`);
      if (height) transformations.push(`h_${height}`);
      if (quality) transformations.push(`q_${quality}`);
      
      if (transformations.length > 0) {
        const transformString = transformations.join(',');
        return url.replace('/upload/', `/upload/${transformString}/`);
      }
    }

    return url;
  }
}