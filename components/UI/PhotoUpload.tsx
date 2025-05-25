import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { Camera } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface PhotoUploadProps {
  photo?: string;
  onPress: () => void;
}

export default function PhotoUpload({ photo, onPress }: PhotoUploadProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {photo ? (
        <Image source={{ uri: photo }} style={styles.photo} />
      ) : (
        <View style={styles.placeholder}>
          <Camera size={32} color={Theme.colors.text.medium} />
          <Text style={styles.text}>Adicionar foto</Text>
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