import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Share } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Book, Share2, Heart, Bookmark, RefreshCw } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { DailyVerse } from '@/utils/spiritualContent';

interface DailyVerseCardProps {
  verse: DailyVerse;
  onRead?: () => void;
  onGetNewVerse?: () => void;
  hasRead?: boolean;
  compact?: boolean;
}

export default function DailyVerseCard({ 
  verse, 
  onRead, 
  onGetNewVerse,
  hasRead = false,
  compact = false 
}: DailyVerseCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `"${verse.verse}" - ${verse.reference}\n\nCompartilhado do Bênção Match 🙏`,
        title: 'Versículo do Dia'
      });
    } catch (error) {
      console.log('Error sharing verse:', error);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (onRead && !hasRead) {
      onRead();
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  if (compact) {
    return (
      <TouchableOpacity style={styles.compactContainer} onPress={onRead}>
        <View style={styles.compactHeader}>
          <Book size={16} color={Theme.colors.primary.lilac} />
          <Text style={styles.compactTitle}>Versículo do Dia</Text>
        </View>
        <Text style={styles.compactVerse} numberOfLines={2}>
          "{verse.verse}"
        </Text>
        <Text style={styles.compactReference}>{verse.reference}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Theme.colors.primary.lilac + '20', Theme.colors.background.lilac]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Book size={20} color={Theme.colors.primary.lilac} />
            </View>
            <View>
              <Text style={styles.title}>Versículo do Dia</Text>
              <Text style={styles.theme}>{verse.theme}</Text>
            </View>
          </View>
          {onGetNewVerse && (
            <TouchableOpacity style={styles.refreshButton} onPress={onGetNewVerse}>
              <RefreshCw size={18} color={Theme.colors.primary.lilac} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.verseContainer}>
          <Text style={styles.verse}>"{verse.verse}"</Text>
          <Text style={styles.reference}>{verse.reference}</Text>
        </View>

        {verse.reflection && (
          <View style={styles.reflectionContainer}>
            <Text style={styles.reflectionTitle}>Reflexão</Text>
            <Text style={styles.reflection}>{verse.reflection}</Text>
          </View>
        )}

        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, isLiked && styles.actionButtonActive]}
            onPress={handleLike}
          >
            <Heart 
              size={18} 
              color={isLiked ? Theme.colors.status.error : Theme.colors.text.medium}
              fill={isLiked ? Theme.colors.status.error : 'transparent'}
            />
            <Text style={[
              styles.actionText,
              isLiked && { color: Theme.colors.status.error }
            ]}>
              {isLiked ? 'Curtido' : 'Curtir'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.actionButton, isSaved && styles.actionButtonActive]}
            onPress={handleSave}
          >
            <Bookmark 
              size={18} 
              color={isSaved ? Theme.colors.primary.blue : Theme.colors.text.medium}
              fill={isSaved ? Theme.colors.primary.blue : 'transparent'}
            />
            <Text style={[
              styles.actionText,
              isSaved && { color: Theme.colors.primary.blue }
            ]}>
              {isSaved ? 'Salvo' : 'Salvar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Share2 size={18} color={Theme.colors.text.medium} />
            <Text style={styles.actionText}>Compartilhar</Text>
          </TouchableOpacity>
        </View>

        {hasRead && (
          <View style={styles.readIndicator}>
            <Text style={styles.readText}>✓ Lido hoje</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.lg,
    overflow: 'hidden',
    ...Theme.shadows.medium,
  },
  compactContainer: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginVertical: Theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.lilac,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  compactTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.lilac,
    marginLeft: Theme.spacing.xs,
  },
  compactVerse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
    lineHeight: 18,
  },
  compactReference: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.lilac,
    textAlign: 'right',
  },
  gradient: {
    padding: Theme.spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  theme: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.small,
  },
  verseContainer: {
    marginBottom: Theme.spacing.lg,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    lineHeight: 28,
    marginBottom: Theme.spacing.md,
    textAlign: 'center',
  },
  reference: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.lilac,
    textAlign: 'right',
  },
  reflectionContainer: {
    backgroundColor: Theme.colors.background.white + '80',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  reflectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  reflection: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.background.white + '50',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  actionButtonActive: {
    backgroundColor: Theme.colors.background.white + '30',
  },
  actionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  readIndicator: {
    alignItems: 'center',
    marginTop: Theme.spacing.sm,
  },
  readText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.status.success,
  },
});