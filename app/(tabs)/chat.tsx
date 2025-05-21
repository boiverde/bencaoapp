import { useState } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Send, Book, HandHelping as PrayingHands } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

// Mock data
const MESSAGES = [
  {
    id: '1',
    text: 'Olá! Vi que somos da mesma denominação. Que bom conhecer alguém que compartilha da mesma fé!',
    sender: 'other',
    timestamp: '10:30',
  },
  {
    id: '2',
    text: 'Oi Mariana! Sim, que benção encontrar alguém que compartilha dos mesmos valores!',
    sender: 'self',
    timestamp: '10:32',
  },
  {
    id: '3',
    text: 'Você frequenta alguma igreja específica?',
    sender: 'other',
    timestamp: '10:33',
  },
  {
    id: '4',
    text: 'Sim, frequento a Igreja Batista Central. E você?',
    sender: 'self',
    timestamp: '10:35',
  },
  {
    id: '5',
    text: 'Eu vou na Primeira Igreja Batista! Mas já visitei a Central algumas vezes, é muito boa!',
    sender: 'other',
    timestamp: '10:36',
  },
  {
    id: '6',
    type: 'verse',
    text: '"Porque onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles." Mateus 18:20',
    sender: 'other',
    timestamp: '10:38',
  },
];

const CHAT_USER = {
  name: 'Mariana',
  age: 28,
  image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
  online: true,
  lastActive: 'Agora',
};

export default function ChatScreen() {
  const [messageText, setMessageText] = useState('');
  
  const renderMessage = ({ item }) => {
    const isVerse = item.type === 'verse';
    
    return (
      <View style={[
        styles.messageContainer,
        item.sender === 'self' ? styles.selfMessageContainer : styles.otherMessageContainer
      ]}>
        {isVerse ? (
          <View style={styles.verseBubble}>
            <Book size={16} color={Theme.colors.primary.lilac} style={styles.verseIcon} />
            <Text style={styles.verseText}>{item.text}</Text>
            <Text style={styles.messageTime}>{item.timestamp}</Text>
          </View>
        ) : (
          <View style={[
            styles.messageBubble,
            item.sender === 'self' ? styles.selfMessageBubble : styles.otherMessageBubble
          ]}>
            <Text style={[
              styles.messageText,
              item.sender === 'self' ? styles.selfMessageText : styles.otherMessageText
            ]}>
              {item.text}
            </Text>
            <Text style={[
              styles.messageTime,
              item.sender === 'self' ? styles.selfMessageTime : styles.otherMessageTime
            ]}>
              {item.timestamp}
            </Text>
          </View>
        )}
      </View>
    );
  };
  
  const handleSendMessage = () => {
    if (messageText.trim()) {
      // In a real app, this would send the message to the backend
      setMessageText('');
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: CHAT_USER.image }} style={styles.avatar} />
            {CHAT_USER.online && <View style={styles.onlineIndicator} />}
          </View>
          <View>
            <Text style={styles.userName}>{CHAT_USER.name}, {CHAT_USER.age}</Text>
            <Text style={styles.userStatus}>{CHAT_USER.lastActive}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.prayButton}>
          <PrayingHands size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={MESSAGES}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        inverted={false}
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.inputContainer}
      >
        <View style={styles.inputRow}>
          <TouchableOpacity style={styles.specialButton}>
            <Book size={20} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Mensagem..."
              placeholderTextColor={Theme.colors.text.medium}
              value={messageText}
              onChangeText={setMessageText}
              multiline
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
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.circle,
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
    color: Theme.colors.text.medium,
  },
  prayButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.lilac,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messagesList: {
    padding: Theme.spacing.md,
  },
  messageContainer: {
    marginBottom: Theme.spacing.md,
    maxWidth: '80%',
  },
  selfMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  selfMessageBubble: {
    backgroundColor: Theme.colors.primary.blue,
  },
  otherMessageBubble: {
    backgroundColor: Theme.colors.background.white,
  },
  verseBubble: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.lg,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.lilac,
  },
  verseIcon: {
    marginBottom: Theme.spacing.xs,
  },
  messageText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    marginRight: Theme.spacing.lg,
  },
  selfMessageText: {
    color: Theme.colors.background.white,
  },
  otherMessageText: {
    color: Theme.colors.text.dark,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  messageTime: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.light,
    alignSelf: 'flex-end',
  },
  selfMessageTime: {
    color: Theme.colors.background.white + 'AA',
  },
  otherMessageTime: {
    color: Theme.colors.text.light,
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    padding: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Platform.OS === 'ios' ? Theme.spacing.sm : 0,
    marginHorizontal: Theme.spacing.sm,
    maxHeight: 100,
  },
  input: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    maxHeight: 100,
  },
  specialButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.lilac,
    alignItems: 'center',
    justifyContent: 'center',
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