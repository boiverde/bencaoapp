import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform,
  TouchableOpacity,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { 
  Send, 
  Book, 
  HandHelping as PrayingHands, 
  Phone, 
  Video, 
  Smile,
  Plus,
  Mic,
  Camera,
  MapPin,
  Languages
} from 'lucide-react-native';
import NotificationBell from '@/components/UI/NotificationBell';
import NotificationModal from '@/components/UI/NotificationModal';
import MessageBubble from '@/components/UI/MessageBubble';
import VoiceCallModal from '@/components/UI/VoiceCallModal';
import { useNotifications } from '@/hooks/useNotifications';
import { useCommunication } from '@/hooks/useCommunication';
import { CommunicationSystem } from '@/utils/communicationSystem';

export default function ChatScreen() {
  const [messageText, setMessageText] = useState('');
  const [notificationModalVisible, setNotificationModalVisible] = useState(false);
  const [showSpiritualOptions, setShowSpiritualOptions] = useState(false);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  
  const { sendMessageNotification } = useNotifications();
  const {
    sendMessage,
    getConversationMessages,
    addReaction,
    editMessage,
    deleteMessage,
    translateMessage,
    startVoiceCall,
    endVoiceCall,
    answerCall,
    declineCall,
    activeCall,
    startTyping,
    stopTyping,
    sendVerse,
    createPrayerRequest
  } = useCommunication();

  // Mock conversation ID
  const conversationId = 'conv_1';
  const messages = getConversationMessages(conversationId);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = useCallback(async () => {
    if (messageText.trim()) {
      const content = messageText.trim();
      setMessageText('');
      stopTyping(conversationId);
      
      try {
        await sendMessage(conversationId, content);
        
        // Simulate receiving a response
        setTimeout(() => {
          const intent = CommunicationSystem.detectMessageIntent(content);
          if (intent.suggestedResponse) {
            sendMessage(conversationId, intent.suggestedResponse);
            sendMessageNotification('Mariana', intent.suggestedResponse);
          }
        }, 2000);
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
      }
    }
  }, [messageText, conversationId, sendMessage, stopTyping, sendMessageNotification]);

  const handleTextChange = useCallback((text: string) => {
    setMessageText(text);
    
    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      startTyping(conversationId);
    }
    
    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    // Set new timeout
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      stopTyping(conversationId);
    }, 1000);
  }, [isTyping, conversationId, startTyping, stopTyping]);

  const handleSendVerse = useCallback(async (category?: string) => {
    try {
      await sendVerse(conversationId, category);
      setShowSpiritualOptions(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível enviar o versículo.');
    }
  }, [conversationId, sendVerse]);

  const handleCreatePrayerRequest = useCallback(() => {
    Alert.prompt(
      'Pedido de Oração',
      'Descreva seu pedido de oração:',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Enviar',
          onPress: async (description) => {
            if (description && description.trim()) {
              try {
                const request = createPrayerRequest(
                  'Pedido de Oração',
                  description.trim(),
                  'personal'
                );
                
                await sendMessage(
                  conversationId, 
                  description.trim(), 
                  'prayer',
                  { prayerCategory: 'personal' }
                );
                
                setShowSpiritualOptions(false);
              } catch (error) {
                Alert.alert('Erro', 'Não foi possível enviar o pedido de oração.');
              }
            }
          }
        }
      ],
      'plain-text'
    );
  }, [conversationId, createPrayerRequest, sendMessage]);

  const handleVoiceCall = useCallback(() => {
    startVoiceCall(conversationId, 'voice');
  }, [conversationId, startVoiceCall]);

  const handleVideoCall = useCallback(() => {
    startVoiceCall(conversationId, 'video');
  }, [conversationId, startVoiceCall]);

  const handlePrayerCall = useCallback(() => {
    startVoiceCall(conversationId, 'voice', true);
  }, [conversationId, startVoiceCall]);

  const renderMessage = useCallback(({ item, index }) => {
    const isOwn = item.senderId === 'current_user';
    const showAvatar = !isOwn && (index === 0 || messages[index - 1]?.senderId !== item.senderId);
    
    return (
      <MessageBubble
        message={item}
        isOwn={isOwn}
        showAvatar={showAvatar}
        onReaction={addReaction}
        onEdit={editMessage}
        onDelete={deleteMessage}
        onTranslate={translateMessage}
      />
    );
  }, [messages, addReaction, editMessage, deleteMessage, translateMessage]);

  const renderSpiritualOptions = () => (
    <View style={styles.spiritualOptions}>
      <TouchableOpacity style={styles.spiritualOption} onPress={() => handleSendVerse('comfort')}>
        <Book size={20} color={Theme.colors.primary.lilac} />
        <Text style={styles.spiritualOptionText}>Versículo de Conforto</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.spiritualOption} onPress={() => handleSendVerse('strength')}>
        <Book size={20} color={Theme.colors.primary.blue} />
        <Text style={styles.spiritualOptionText}>Versículo de Força</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.spiritualOption} onPress={() => handleSendVerse()}>
        <Book size={20} color={Theme.colors.primary.pink} />
        <Text style={styles.spiritualOptionText}>Versículo Aleatório</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.spiritualOption} onPress={handleCreatePrayerRequest}>
        <PrayingHands size={20} color={Theme.colors.primary.gold} />
        <Text style={styles.spiritualOptionText}>Pedido de Oração</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.spiritualOption} onPress={handlePrayerCall}>
        <PrayingHands size={20} color={Theme.colors.primary.blue} />
        <Text style={styles.spiritualOptionText}>Chamada de Oração</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMoreOptions = () => (
    <View style={styles.moreOptions}>
      <TouchableOpacity style={styles.moreOption}>
        <Camera size={20} color={Theme.colors.text.dark} />
        <Text style={styles.moreOptionText}>Câmera</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreOption}>
        <Mic size={20} color={Theme.colors.text.dark} />
        <Text style={styles.moreOptionText}>Áudio</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreOption}>
        <MapPin size={20} color={Theme.colors.text.dark} />
        <Text style={styles.moreOptionText}>Localização</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.moreOption}>
        <Smile size={20} color={Theme.colors.text.dark} />
        <Text style={styles.moreOptionText}>Figurinhas</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar} />
            <View style={styles.onlineIndicator} />
          </View>
          <View>
            <Text style={styles.userName}>Mariana, 28</Text>
            <Text style={styles.userStatus}>online</Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton} onPress={handleVoiceCall}>
            <Phone size={20} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handleVideoCall}>
            <Video size={20} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.headerButton} onPress={handlePrayerCall}>
            <PrayingHands size={20} color={Theme.colors.primary.gold} />
          </TouchableOpacity>
          
          <NotificationBell 
            onPress={() => setNotificationModalVisible(true)}
            color={Theme.colors.primary.blue}
          />
        </View>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />
      
      {showSpiritualOptions && renderSpiritualOptions()}
      {showMoreOptions && renderMoreOptions()}
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity 
            style={styles.spiritualButton}
            onPress={() => {
              setShowSpiritualOptions(!showSpiritualOptions);
              setShowMoreOptions(false);
            }}
          >
            <Book size={20} color={Theme.colors.primary.lilac} />
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.moreButton}
            onPress={() => {
              setShowMoreOptions(!showMoreOptions);
              setShowSpiritualOptions(false);
            }}
          >
            <Plus size={20} color={Theme.colors.text.medium} />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mensagem..."
              placeholderTextColor={Theme.colors.text.medium}
              value={messageText}
              onChangeText={handleTextChange}
              multiline
              maxLength={1000}
            />
          </View>
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !messageText.trim() && styles.sendButtonDisabled
            ]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color={messageText.trim() ? '#fff' : Theme.colors.text.light} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <VoiceCallModal
        call={activeCall}
        visible={!!activeCall}
        onAnswer={answerCall}
        onDecline={declineCall}
        onEnd={endVoiceCall}
      />

      <NotificationModal
        visible={notificationModalVisible}
        onClose={() => setNotificationModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
    backgroundColor: Theme.colors.background.white,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    marginRight: Theme.spacing.md,
    position: 'relative',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.pink,
  },
  onlineIndicator: {
    width: 12,
    height: 12,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.success,
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  userName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  userStatus: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Theme.spacing.sm,
  },
  messagesList: {
    padding: Theme.spacing.md,
    paddingBottom: Theme.spacing.xl,
  },
  spiritualOptions: {
    backgroundColor: Theme.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    paddingVertical: Theme.spacing.md,
  },
  spiritualOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    paddingVertical: Theme.spacing.md,
  },
  spiritualOptionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
  },
  moreOptions: {
    backgroundColor: Theme.colors.background.white,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    paddingVertical: Theme.spacing.md,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  moreOption: {
    alignItems: 'center',
    width: '25%',
    paddingVertical: Theme.spacing.md,
  },
  moreOptionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.xs,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  spiritualButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.lilac,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Theme.spacing.sm : 0,
    marginRight: Theme.spacing.sm,
    maxHeight: 100,
  },
  input: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    maxHeight: 100,
    minHeight: 40,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: Theme.colors.ui.disabled,
  },
});