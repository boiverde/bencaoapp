import { StyleSheet, View, Text, TouchableOpacity, Image, AccessibilityProps } from 'react-native';
import { Camera } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface PhotoUploadProps extends AccessibilityProps {
  photo?: string;
  onPress: () => void;
  label?: string;
}

export default function PhotoUpload({ photo, onPress, label = "Adicionar foto", ...accessibilityProps }: PhotoUploadProps) {
  return (
    <TouchableOpacity 
      style={styles.container} 
      onPress={onPress}
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
          loading="lazy"
        />
      ) : (
        <View style={styles.placeholder}>
          <Camera size={32} color={Theme.colors.text.medium} />
          <Text style={styles.text}>{label}</Text>
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
  },
});