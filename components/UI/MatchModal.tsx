import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Theme from '@/constants/Theme';
import { Book, MessageSquare, HandHelping as PrayingHands } from 'lucide-react-native';

interface MatchModalProps {
  visible: boolean;
  onClose: () => void;
  userImage: string;
  matchImage: string;
  matchName: string;
}

export default function MatchModal({ visible, onClose, userImage, matchImage, matchName }: MatchModalProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowAnimation(true);
    } else {
      setShowAnimation(false);
    }
  }, [visible]);

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <LinearGradient
          colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac, Theme.colors.primary.pink]}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>Conexão Abençoada!</Text>
              <Text style={styles.verse}>"O que Deus uniu, o homem não separa." Mateus 19:6</Text>
            </View>
            
            <View style={styles.imagesContainer}>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: userImage }} style={styles.image} />
              </View>
              <View style={styles.heartsContainer}>
                {showAnimation && (
                  <View style={styles.hearts}>
                    <View style={[styles.heart, styles.heart1]} />
                    <View style={[styles.heart, styles.heart2]} />
                    <View style={[styles.heart, styles.heart3]} />
                  </View>
                )}
              </View>
              <View style={styles.imageWrapper}>
                <Image source={{ uri: matchImage }} style={styles.image} />
              </View>
            </View>
            
            <Text style={styles.matchText}>Você e {matchName} se conectaram!</Text>
            
            <View style={styles.buttonsContainer}>
              <TouchableOpacity style={[styles.button, styles.prayButton]} onPress={onClose}>
                <PrayingHands size={20} color="#fff" />
                <Text style={styles.buttonText}>Momento de Oração</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.messageButton]} onPress={onClose}>
                <MessageSquare size={20} color="#fff" />
                <Text style={styles.buttonText}>Enviar Mensagem</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>Continuar Descobrindo</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  gradient: {
    width: '90%',
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
  },
  content: {
    padding: Theme.spacing.lg,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.background.white,
    marginBottom: Theme.spacing.sm,
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  imagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.lg,
    width: '100%',
  },
  imageWrapper: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.circle,
    borderWidth: 3,
    borderColor: Theme.colors.background.white,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  heartsContainer: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hearts: {
    position: 'relative',
    width: 60,
    height: 60,
  },
  heart: {
    position: 'absolute',
    width: 20,
    height: 20,
    backgroundColor: Theme.colors.primary.gold,
    borderRadius: 10,
  },
  heart1: {
    top: 10,
    left: 20,
    transform: [{ rotate: '45deg' }],
  },
  heart2: {
    top: 10,
    left: 0,
    transform: [{ rotate: '45deg' }],
  },
  heart3: {
    top: 0,
    left: 10,
    width: 10,
    height: 10,
    backgroundColor: Theme.colors.background.white,
    borderRadius: 5,
  },
  matchText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.background.white,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonsContainer: {
    width: '100%',
    marginBottom: Theme.spacing.md,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    marginBottom: Theme.spacing.md,
  },
  prayButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  messageButton: {
    backgroundColor: Theme.colors.primary.pink,
  },
  buttonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
  closeButton: {
    padding: Theme.spacing.sm,
  },
  closeButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    textDecorationLine: 'underline',
  },
});