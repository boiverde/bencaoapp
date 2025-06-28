import { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Book, HandHelping as PrayingHands, MapPin, Play, MoveHorizontal as MoreHorizontal, Copy, Share2, Trash2, CreditCard as Edit3, Heart, Smile, ThumbsUp, Star } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Message, CommunicationSystem } from '@/utils/communicationSystem';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (message: Message) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  onDelete?: (messageId: string) => void;
  onTranslate?: (messageId: string) => void;
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar = false,
  onReaction,
  onReply,
  onEdit,
  onDelete,
  onTranslate
}: MessageBubbleProps) {
  const [showActions, setShowActions] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const getMessageTypeIcon = () => {
    switch (message.type) {
      case 'verse':
        return <Book size={16} color={Theme.colors.primary.lilac} />;
      case 'prayer':
        return <PrayingHands size={16} color={Theme.colors.primary.blue} />;
      case 'location':
        return <MapPin size={16} color={Theme.colors.status.success} />;
      case 'voice':
        return <Play size={16} color={Theme.colors.primary.pink} />;
      default:
        return null;
    }
  };

  const getMessageContent = () => {
    if (message.metadata?.translatedContent) {
      return (
        <View>
          <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
            {message.metadata.translatedContent}
          </Text>
          <Text style={styles.originalText}>
            Original: {message.content}
          </Text>
        </View>
      );
    }

    switch (message.type) {
      case 'verse':
        return (
          <View style={styles.verseContainer}>
            <View style={styles.verseHeader}>
              <Book size={16} color={Theme.colors.primary.lilac} />
              <Text style={styles.verseLabel}>Versículo</Text>
            </View>
            <Text style={styles.verseText}>"{message.content}"</Text>
            {message.metadata?.verseReference && (
              <Text style={styles.verseReference}>{message.metadata.verseReference}</Text>
            )}
          </View>
        );

      case 'prayer':
        return (
          <View style={styles.prayerContainer}>
            <View style={styles.prayerHeader}>
              <PrayingHands size={16} color={Theme.colors.primary.blue} />
              <Text style={styles.prayerLabel}>Pedido de Oração</Text>
            </View>
            <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
              {message.content}
            </Text>
            {message.metadata?.prayerCategory && (
              <Text style={styles.prayerCategory}>
                Categoria: {message.metadata.prayerCategory}
              </Text>
            )}
          </View>
        );

      case 'voice':
        return (
          <View style={styles.voiceContainer}>
            <Play size={20} color={Theme.colors.primary.pink} />
            <Text style={styles.voiceText}>
              Mensagem de voz • {message.metadata?.voiceDuration || 0}s
            </Text>
          </View>
        );

      case 'image':
        return (
          <View style={styles.imageContainer}>
            {message.metadata?.imageUrl && (
              <Image source={{ uri: message.metadata.imageUrl }} style={styles.messageImage} />
            )}
            {message.content && (
              <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
                {message.content}
              </Text>
            )}
          </View>
        );

      case 'sticker':
        return (
          <View style={styles.stickerContainer}>
            {message.metadata?.imageUrl && (
              <Image source={{ uri: message.metadata.imageUrl }} style={styles.stickerImage} />
            )}
          </View>
        );

      case 'location':
        return (
          <View style={styles.locationContainer}>
            <MapPin size={20} color={Theme.colors.status.success} />
            <View style={styles.locationInfo}>
              <Text style={styles.locationTitle}>Localização Compartilhada</Text>
              {message.metadata?.location?.address && (
                <Text style={styles.locationAddress}>{message.metadata.location.address}</Text>
              )}
            </View>
          </View>
        );

      default:
        return (
          <Text style={[styles.messageText, isOwn ? styles.ownMessageText : styles.otherMessageText]}>
            {message.content}
          </Text>
        );
    }
  };

  const handleLongPress = () => {
    setShowActions(true);
  };

  const handleReaction = (emoji: string) => {
    if (onReaction) {
      onReaction(message.id, emoji);
    }
    setShowReactions(false);
  };

  const handleEdit = () => {
    if (onEdit) {
      Alert.prompt(
        'Editar Mensagem',
        'Digite o novo conteúdo:',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Salvar', 
            onPress: (newContent) => {
              if (newContent && newContent.trim()) {
                onEdit(message.id, newContent.trim());
              }
            }
          }
        ],
        'plain-text',
        message.content
      );
    }
    setShowActions(false);
  };

  const handleDelete = () => {
    Alert.alert(
      'Excluir Mensagem',
      'Tem certeza que deseja excluir esta mensagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Excluir', 
          style: 'destructive',
          onPress: () => {
            if (onDelete) {
              onDelete(message.id);
            }
          }
        }
      ]
    );
    setShowActions(false);
  };

  const reactions = ['❤️', '🙏', '🙌', '😊', '👍', '⭐'];

  return (
    <View style={[styles.container, isOwn ? styles.ownContainer : styles.otherContainer]}>
      <TouchableOpacity
        style={[styles.bubble, isOwn ? styles.ownBubble : styles.otherBubble]}
        onLongPress={handleLongPress}
        delayLongPress={500}
      >
        {message.type !== 'text' && (
          <View style={styles.typeIndicator}>
            {getMessageTypeIcon()}
          </View>
        )}
        
        {getMessageContent()}
        
        <View style={styles.messageFooter}>
          <Text style={[styles.timestamp, isOwn ? styles.ownTimestamp : styles.otherTimestamp]}>
            {CommunicationSystem.formatMessageTime(message.timestamp)}
          </Text>
          
          {message.edited && (
            <Text style={styles.editedIndicator}>editado</Text>
          )}
          
          {isOwn && (
            <Text style={styles.status}>
              {message.status === 'sending' && '⏳'}
              {message.status === 'sent' && '✓'}
              {message.status === 'delivered' && '✓✓'}
              {message.status === 'read' && '✓✓'}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      {message.reactions && message.reactions.length > 0 && (
        <View style={[styles.reactionsContainer, isOwn ? styles.ownReactions : styles.otherReactions]}>
          {message.reactions.map((reaction, index) => (
            <View key={index} style={styles.reactionBubble}>
              <Text style={styles.reactionEmoji}>{reaction.emoji}</Text>
            </View>
          ))}
        </View>
      )}

      {showReactions && (
        <View style={[styles.reactionsPanel, isOwn ? styles.ownReactionsPanel : styles.otherReactionsPanel]}>
          {reactions.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={styles.reactionButton}
              onPress={() => handleReaction(emoji)}
            >
              <Text style={styles.reactionButtonEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showActions && (
        <View style={styles.actionsOverlay}>
          <View style={styles.actionsPanel}>
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowReactions(true)}>
              <Smile size={20} color={Theme.colors.text.dark} />
              <Text style={styles.actionText}>Reagir</Text>
            </TouchableOpacity>
            
            {onReply && (
              <TouchableOpacity style={styles.actionButton} onPress={() => { onReply(message); setShowActions(false); }}>
                <Share2 size={20} color={Theme.colors.text.dark} />
                <Text style={styles.actionText}>Responder</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity style={styles.actionButton} onPress={() => setShowActions(false)}>
              <Copy size={20} color={Theme.colors.text.dark} />
              <Text style={styles.actionText}>Copiar</Text>
            </TouchableOpacity>
            
            {onTranslate && message.type === 'text' && (
              <TouchableOpacity style={styles.actionButton} onPress={() => { onTranslate(message.id); setShowActions(false); }}>
                <Book size={20} color={Theme.colors.text.dark} />
                <Text style={styles.actionText}>Traduzir</Text>
              </TouchableOpacity>
            )}
            
            {isOwn && onEdit && (
              <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
                <Edit3 size={20} color={Theme.colors.text.dark} />
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
            )}
            
            {isOwn && onDelete && (
              <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
                <Trash2 size={20} color={Theme.colors.status.error} />
                <Text style={[styles.actionText, { color: Theme.colors.status.error }]}>Excluir</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Theme.spacing.xs,
    paddingHorizontal: Theme.spacing.md,
  },
  ownContainer: {
    alignItems: 'flex-end',
  },
  otherContainer: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    position: 'relative',
  },
  ownBubble: {
    backgroundColor: Theme.colors.primary.blue,
  },
  otherBubble: {
    backgroundColor: Theme.colors.background.white,
    ...Theme.shadows.small,
  },
  typeIndicator: {
    marginBottom: Theme.spacing.xs,
  },
  messageText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    lineHeight: 20,
  },
  ownMessageText: {
    color: Theme.colors.background.white,
  },
  otherMessageText: {
    color: Theme.colors.text.dark,
  },
  originalText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.light,
    marginTop: Theme.spacing.xs,
    fontStyle: 'italic',
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.lilac,
  },
  verseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  verseLabel: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.lilac,
    marginLeft: Theme.spacing.xs,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    marginBottom: Theme.spacing.xs,
  },
  verseReference: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.lilac,
    textAlign: 'right',
  },
  prayerContainer: {
    backgroundColor: Theme.colors.primary.blue + '20',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.blue,
  },
  prayerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  prayerLabel: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  prayerCategory: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
  },
  voiceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.pink + '20',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  voiceText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  imageContainer: {
    borderRadius: Theme.borderRadius.md,
    overflow: 'hidden',
  },
  messageImage: {
    width: 200,
    height: 150,
    borderRadius: Theme.borderRadius.md,
  },
  stickerContainer: {
    alignItems: 'center',
  },
  stickerImage: {
    width: 120,
    height: 120,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.status.success + '20',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  locationInfo: {
    marginLeft: Theme.spacing.sm,
  },
  locationTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
  },
  locationAddress: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: Theme.spacing.xs,
  },
  timestamp: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
  },
  ownTimestamp: {
    color: Theme.colors.background.white + 'AA',
  },
  otherTimestamp: {
    color: Theme.colors.text.light,
  },
  editedIndicator: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
    marginLeft: Theme.spacing.xs,
    fontStyle: 'italic',
  },
  status: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white + 'AA',
    marginLeft: Theme.spacing.xs,
  },
  reactionsContainer: {
    flexDirection: 'row',
    marginTop: Theme.spacing.xs,
  },
  ownReactions: {
    justifyContent: 'flex-end',
  },
  otherReactions: {
    justifyContent: 'flex-start',
  },
  reactionBubble: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.circle,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    marginHorizontal: 2,
    ...Theme.shadows.small,
  },
  reactionEmoji: {
    fontSize: 14,
  },
  reactionsPanel: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.sm,
    marginTop: Theme.spacing.sm,
    ...Theme.shadows.medium,
  },
  ownReactionsPanel: {
    alignSelf: 'flex-end',
  },
  otherReactionsPanel: {
    alignSelf: 'flex-start',
  },
  reactionButton: {
    padding: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.circle,
    marginHorizontal: Theme.spacing.xs,
  },
  reactionButtonEmoji: {
    fontSize: 20,
  },
  actionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  actionsPanel: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    minWidth: 200,
    ...Theme.shadows.large,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  actionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
});