import { StyleSheet, View, Text, TouchableOpacity, Image, AccessibilityProps } from 'react-native';
import { Camera } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { ImageUploadService } from '@/utils/imageUploadService';
import { Alert } from 'react-native';

interface PhotoUploadProps extends AccessibilityProps {
  photo?: string;
  onPhotoSelected: (uri: string) => void;
  label?: string;
  isUploading?: boolean;
}

export default function PhotoUpload({ 
  photo, 
  onPhotoSelected, 
  label = "Adicionar foto", 
  isUploading = false,
  ...accessibilityProps 
}: PhotoUploadProps) {
  
  const handlePress = () => {
    Alert.alert(
      'Selecionar Foto',
      'Como você gostaria de adicionar uma foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Galeria', 
          onPress: async () => {
            const { uri, error } = await ImageUploadService.pickImage();
            if (uri) {
              onPhotoSelected(uri);
            } else if (error) {
              Alert.alert('Erro', error);
            }
          }
        },
        { 
          text: 'Câmera', 
          onPress: async () => {
            const { uri, error } = await ImageUploadService.takePhoto();
            if (uri) {
              onPhotoSelected(uri);
            } else if (error) {
              Alert.alert('Erro', error);
            }
          }
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={handlePress}
      disabled={isUploading}
      accessible={true}
      accessibilityLabel={label}
      accessibilityRole="button"
      accessibilityHint="Toque para selecionar uma foto"
      {...accessibilityProps}
    >
      {photo ? (
        <Image 
          source={{ uri: photo }} 
          style={styles.photo} 
          accessible={true}
          accessibilityLabel="Foto de perfil selecionada"
        />
      ) : (
        <View style={[styles.placeholder, isUploading && styles.uploading]}>
          <Camera size={32} color={Theme.colors.text.medium} />
          <Text style={styles.text}>
            {isUploading ? 'Enviando...' : label}
          </Text>
        </View>
      )}
      
      {isUploading && (
        <View style={styles.uploadingOverlay}>
          <Text style={styles.uploadingText}>Enviando...</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    overflow: 'hidden',
    alignSelf: 'center',
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
  uploading: {
    opacity: 0.7,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
});