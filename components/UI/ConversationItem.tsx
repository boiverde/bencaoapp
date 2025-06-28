import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { 
  MessageSquare, 
  Phone, 
  Video, 
  HandHelping as PrayingHands,
  Users,
  VolumeX,
  Archive,
  Pin
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { Conversation, CommunicationSystem } from '@/utils/communicationSystem';

interface ConversationItemProps {
  conversation: Conversation;
  isOnline?: boolean;
  isTyping?: boolean;
  onPress: () => void;
  onVoiceCall?: () => void;
  onVideoCall?: () => void;
  onArchive?: () => void;
  onMute?: () => void;
  onPin?: () => void;
}

export default function ConversationItem({
  conversation,
  isOnline = false,
  isTyping = false,
  onPress,
  onVoiceCall,
  onVideoCall,
  onArchive,
  onMute,
  onPin
}: ConversationItemProps) {
  
  const getConversationTitle = () => {
    if (conversation.title) return conversation.title;
    if (conversation.type === 'group') return 'Grupo';
    if (conversation.type === 'prayer_circle') return 'Círculo de Oração';
    return 'Conversa Direta';
  };

  const getConversationSubtitle = () => {
    if (conversation.metadata?.prayerTopic) {
      return `Oração: ${conversation.metadata.prayerTopic}`;
    }
    if (conversation.metadata?.denomination) {
      return conversation.metadata.denomination;
    }
    return `${conversation.participants.length} participantes`;
  };

  const getLastMessagePreview = () => {
    if (isTyping) return 'digitando...';
    if (!conversation.lastMessage) return 'Nenhuma mensagem';
    
    const message = conversation.lastMessage;
    
    switch (message.type) {
      case 'verse':
        return '📖 Versículo compartilhado';
      case 'prayer':
        return '🙏 Pedido de oração';
      case 'voice':
        return '🎤 Mensagem de voz';
      case 'image':
        return '📷 Imagem';
      case 'sticker':
        return '😊 Figurinha';
      case 'location':
        return '📍 Localização';
      default:
        return message.content;
    }
  };

  const getConversationIcon = () => {
    switch (conversation.type) {
      case 'prayer_circle':
        return <PrayingHands size={20} color={Theme.colors.primary.blue} />;
      case 'group':
        return <Users size={20} color={Theme.colors.primary.pink} />;
      default:
        return <MessageSquare size={20} color={Theme.colors.text.medium} />;
    }
  };

  const getStatusIndicators = () => {
    const indicators = [];
    
    if (conversation.isMuted) {
      indicators.push(
        <VolumeX key="muted" size={14} color={Theme.colors.text.light} />
      );
    }
    
    if (conversation.isArchived) {
      indicators.push(
        <Archive key="archived" size={14} color={Theme.colors.text.light} />
      );
    }
    
    if (conversation.metadata?.isBlessed) {
      indicators.push(
        <Text key="blessed" style={styles.blessedIndicator}>✨</Text>
      );
    }
    
    return indicators;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatarContainer}>
        {conversation.avatar ? (
          <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: Theme.colors.primary.lilac }]}>
            {getConversationIcon()}
          </View>
        )}
        
        {isOnline && conversation.type === 'direct' && (
          <View style={styles.onlineIndicator} />
        )}
        
        {conversation.type === 'prayer_circle' && (
          <View style={styles.prayerBadge}>
            <PrayingHands size={12} color={Theme.colors.background.white} />
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {getConversationTitle()}
          </Text>
          
          <View style={styles.headerRight}>
            <View style={styles.statusIndicators}>
              {getStatusIndicators()}
            </View>
            
            {conversation.lastMessage && (
              <Text style={styles.timestamp}>
                {CommunicationSystem.formatMessageTime(conversation.lastMessage.timestamp)}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.messageRow}>
          <Text 
            style={[
              styles.lastMessage,
              conversation.unreadCount > 0 && styles.unreadMessage,
              isTyping && styles.typingMessage
            ]} 
            numberOfLines={1}
          >
            {getLastMessagePreview()}
          </Text>
          
          {conversation.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadCount}>
                {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
              </Text>
            </View>
          )}
        </View>

        {conversation.type !== 'group' && (
          <Text style={styles.subtitle} numberOfLines={1}>
            {getConversationSubtitle()}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        {onVoiceCall && (
          <TouchableOpacity style={styles.actionButton} onPress={onVoiceCall}>
            <Phone size={18} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
        )}
        
        {onVideoCall && (
          <TouchableOpacity style={styles.actionButton} onPress={onVideoCall}>
            <Video size={18} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    marginRight: Theme.spacing.md,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.success,
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  prayerBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicators: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.xs,
  },
  blessedIndicator: {
    fontSize: 12,
    marginLeft: Theme.spacing.xs,
  },
  timestamp: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  lastMessage: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    flex: 1,
  },
  unreadMessage: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.text.dark,
  },
  typingMessage: {
    fontStyle: 'italic',
    color: Theme.colors.primary.blue,
  },
  unreadBadge: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.circle,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: Theme.spacing.sm,
  },
  unreadCount: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
  },
  subtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.xs,
  },
});