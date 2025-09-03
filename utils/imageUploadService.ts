import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageUploadResult {
  url: string | null;
  error: string | null;
}

export class ImageUploadService {
  private static readonly CLOUDINARY_CLOUD_NAME = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
  private static readonly CLOUDINARY_API_KEY = process.env.EXPO_PUBLIC_CLOUDINARY_API_KEY;
  private static readonly CLOUDINARY_UPLOAD_PRESET = 'bencao_match_uploads';

  /**
   * Pick image from gallery
   */
  static async pickImage(): Promise<{ uri: string | null; error: string | null }> {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        return { uri: null, error: 'Permissão para acessar galeria negada' };
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return { uri: null, error: null };
      }

      return { uri: result.assets[0].uri, error: null };
    } catch (error) {
      console.error('Pick image error:', error);
      return { uri: null, error: 'Erro ao selecionar imagem' };
    }
  }

  /**
   * Take photo with camera
   */
  static async takePhoto(): Promise<{ uri: string | null; error: string | null }> {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        return { uri: null, error: 'Permissão para usar câmera negada' };
      }

      // Launch camera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (result.canceled) {
        return { uri: null, error: null };
      }

      return { uri: result.assets[0].uri, error: null };
    } catch (error) {
      console.error('Take photo error:', error);
      return { uri: null, error: 'Erro ao tirar foto' };
    }
  }

  /**
   * Compress and resize image
   */
  static async processImage(uri: string, maxWidth: number = 800, quality: number = 0.8): Promise<{ uri: string | null; error: string | null }> {
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
   * Upload image to Cloudinary
   */
  static async uploadToCloudinary(uri: string, folder: string = 'profile-photos'): Promise<ImageUploadResult> {
    try {
      if (!this.CLOUDINARY_CLOUD_NAME) {
        throw new Error('Cloudinary not configured');
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
      
      formData.append('upload_preset', this.CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', folder);
      formData.append('resource_type', 'image');

      // Upload to Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${this.CLOUDINARY_CLOUD_NAME}/image/upload`,
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

      return { url: data.secure_url, error: null };
    } catch (error) {
      console.error('Upload to Cloudinary error:', error);
      return { url: null, error: 'Erro ao enviar imagem' };
    }
  }

  /**
   * Upload image to Supabase Storage (alternative to Cloudinary)
   */
  static async uploadToSupabase(uri: string, bucket: string = 'profile-photos'): Promise<ImageUploadResult> {
    try {
      // Process image first
      const { uri: processedUri, error: processError } = await this.processImage(uri);
      
      if (processError || !processedUri) {
        return { url: null, error: processError || 'Erro ao processar imagem' };
      }

      // Convert URI to blob
      const response = await fetch(processedUri);
      const blob = await response.blob();
      
      const fileName = `${Date.now()}.jpg`;
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: false
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName);

      return { url: publicUrl, error: null };
    } catch (error) {
      console.error('Upload to Supabase error:', error);
      return { url: null, error: 'Erro ao enviar imagem' };
    }
  }

  /**
   * Delete image from storage
   */
  static async deleteImage(url: string): Promise<{ error: string | null }> {
    try {
      // Extract filename from URL
      const fileName = url.split('/').pop();
      
      if (!fileName) {
        return { error: 'URL inválida' };
      }

      const { error } = await supabase.storage
        .from('profile-photos')
        .remove([fileName]);

      if (error) {
        return { error: this.translateError(error.message) };
      }

      return { error: null };
    } catch (error) {
      console.error('Delete image error:', error);
      return { error: 'Erro ao deletar imagem' };
    }
  }

  /**
   * Get optimized image URL
   */
  static getOptimizedUrl(url: string, width?: number, height?: number, quality?: number): string {
    if (!url || !this.CLOUDINARY_CLOUD_NAME) return url;

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

  /**
   * Translate storage errors to Portuguese
   */
  private static translateError(errorMessage: string): string {
    const errorMap: { [key: string]: string } = {
      'The resource already exists': 'O arquivo já existe',
      'Invalid file type': 'Tipo de arquivo inválido',
      'File too large': 'Arquivo muito grande',
      'Storage quota exceeded': 'Cota de armazenamento excedida',
      'Network request failed': 'Erro de conexão. Verifique sua internet.',
    };

    return errorMap[errorMessage] || errorMessage;
  }
}