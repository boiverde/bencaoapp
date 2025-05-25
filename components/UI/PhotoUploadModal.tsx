import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, Image } from 'react-native';
import Theme from '@/constants/Theme';
import { X, Camera, ImagePlus, Trash2 } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';

interface PhotoUploadModalProps {
  visible: boolean;
  onClose: () => void;
  photos: string[];
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploadModal({ 
  visible, 
  onClose, 
  photos, 
  onPhotosChange,
  maxPhotos = 5 
}: PhotoUploadModalProps) {
  const [loading, setLoading] = useState(false);

  const handleSelectPhoto = async () => {
    if (photos.length >= maxPhotos) {
      return;
    }

    try {
      setLoading(true);
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        onPhotosChange([...photos, result.assets[0].uri]);
      }
    } catch (error) {
      console.error('Error selecting photo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Suas Fotos</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.photoList}>
            <View style={styles.photosGrid}>
              {photos.map((photo, index) => (
                <View key={index} style={styles.photoContainer}>
                  <Image source={{ uri: photo }} style={styles.photo} />
                  <TouchableOpacity 
                    style={styles.removeButton}
                    onPress={() => handleRemovePhoto(index)}
                  >
                    <Trash2 size={20} color={Theme.colors.status.error} />
                  </TouchableOpacity>
                </View>
              ))}
              
              {photos.length < maxPhotos && (
                <TouchableOpacity 
                  style={styles.addPhotoButton}
                  onPress={handleSelectPhoto}
                  disabled={loading}
                >
                  <ImagePlus 
                    size={32} 
                    color={Theme.colors.primary.blue}
                  />
                  <Text style={styles.addPhotoText}>
                    Adicionar Foto
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.helpText}>
              Adicione até {maxPhotos} fotos para seu perfil
            </Text>
          </ScrollView>

          <TouchableOpacity 
            style={styles.doneButton}
            onPress={onClose}
          >
            <Text style={styles.doneButtonText}>Concluir</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Theme.colors.background.white,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  photoList: {
    padding: Theme.spacing.md,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Theme.spacing.md,
  },
  photoContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  removeButton: {
    position: 'absolute',
    top: Theme.spacing.xs,
    right: Theme.spacing.xs,
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.circle,
    padding: Theme.spacing.xs,
  },
  addPhotoButton: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background.light,
  },
  addPhotoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
  },
  helpText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    marginTop: Theme.spacing.lg,
  },
  doneButton: {
    margin: Theme.spacing.md,
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});