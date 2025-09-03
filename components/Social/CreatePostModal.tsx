import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Tag, 
  Globe, 
  Lock, 
  Users, 
  Book, 
  HandHelping as PrayingHands, 
  MessageSquare, 
  Calendar 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSocial } from '@/hooks/useSocial';
import { SocialPost } from '@/utils/socialSystem';
import * as ImagePicker from 'expo-image-picker';

interface CreatePostModalProps {
  visible: boolean;
  onClose: () => void;
  onPostCreated: () => void;
  initialType?: SocialPost['type'];
  groupId?: string;
}

export default function CreatePostModal({
  visible,
  onClose,
  onPostCreated,
  initialType = 'general',
  groupId
}: CreatePostModalProps) {
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<SocialPost['type']>(initialType);
  const [visibility, setVisibility] = useState<SocialPost['visibility']>('public');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [verseText, setVerseText] = useState('');
  const [verseReference, setVerseReference] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { createPost } = useSocial();

  const resetForm = () => {
    setPostContent('');
    setPostType(initialType);
    setVisibility('public');
    setTags([]);
    setTagInput('');
    setMediaUrls([]);
    setLocation('');
    setVerseText('');
    setVerseReference('');
    setEventTitle('');
    setEventDate('');
    setEventLocation('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setMediaUrls([...mediaUrls, result.assets[0].uri]);
    }
  };

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      Alert.alert('Erro', 'Por favor, escreva algo para publicar.');
      return;
    }

    if (postType === 'verse' && (!verseText.trim() || !verseReference.trim())) {
      Alert.alert('Erro', 'Por favor, preencha o texto e a referência do versículo.');
      return;
    }

    if (postType === 'event' && (!eventTitle.trim() || !eventDate.trim() || !eventLocation.trim())) {
      Alert.alert('Erro', 'Por favor, preencha todos os detalhes do evento.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare verse data if needed
      const verse = postType === 'verse' ? {
        text: verseText,
        reference: verseReference
      } : undefined;

      // Prepare event data if needed
      const eventDetails = postType === 'event' ? {
        title: eventTitle,
        date: new Date(eventDate).getTime() || Date.now(),
        location: eventLocation,
        description: postContent
      } : undefined;

      // Prepare location data if provided
      const locationData = location.trim() ? {
        name: location
      } : undefined;

      // Create the post
      const newPost = await createPost(
        postContent,
        postType,
        visibility,
        tags,
        mediaUrls,
        locationData,
        verse,
        eventDetails
      );

      if (newPost) {
        resetForm();
        onPostCreated();
      } else {
        Alert.alert('Erro', 'Não foi possível criar a publicação. Tente novamente.');
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Erro', 'Ocorreu um erro ao criar a publicação.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.sectionTitle}>Tipo de Publicação</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[styles.typeButton, postType === 'general' && styles.activeTypeButton]}
          onPress={() => setPostType('general')}
        >
          <MessageSquare 
            size={20} 
            color={postType === 'general' ? Theme.colors.background.white : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.typeButtonText,
            postType === 'general' && styles.activeTypeButtonText
          ]}>
            Geral
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, postType === 'prayer' && styles.activeTypeButton]}
          onPress={() => setPostType('prayer')}
        >
          <PrayingHands 
            size={20} 
            color={postType === 'prayer' ? Theme.colors.background.white : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.typeButtonText,
            postType === 'prayer' && styles.activeTypeButtonText
          ]}>
            Oração
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, postType === 'verse' && styles.activeTypeButton]}
          onPress={() => setPostType('verse')}
        >
          <Book 
            size={20} 
            color={postType === 'verse' ? Theme.colors.background.white : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.typeButtonText,
            postType === 'verse' && styles.activeTypeButtonText
          ]}>
            Versículo
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, postType === 'testimony' && styles.activeTypeButton]}
          onPress={() => setPostType('testimony')}
        >
          <MessageSquare 
            size={20} 
            color={postType === 'testimony' ? Theme.colors.background.white : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.typeButtonText,
            postType === 'testimony' && styles.activeTypeButtonText
          ]}>
            Testemunho
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.typeButton, postType === 'event' && styles.activeTypeButton]}
          onPress={() => setPostType('event')}
        >
          <Calendar 
            size={20} 
            color={postType === 'event' ? Theme.colors.background.white : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.typeButtonText,
            postType === 'event' && styles.activeTypeButtonText
          ]}>
            Evento
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderVisibilitySelector = () => (
    <View style={styles.visibilitySelector}>
      <Text style={styles.sectionTitle}>Visibilidade</Text>
      <View style={styles.visibilityButtons}>
        <TouchableOpacity
          style={[styles.visibilityButton, visibility === 'public' && styles.activeVisibilityButton]}
          onPress={() => setVisibility('public')}
        >
          <Globe 
            size={20} 
            color={visibility === 'public' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.visibilityButtonText,
            visibility === 'public' && styles.activeVisibilityButtonText
          ]}>
            Público
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.visibilityButton, visibility === 'connections' && styles.activeVisibilityButton]}
          onPress={() => setVisibility('connections')}
        >
          <Users 
            size={20} 
            color={visibility === 'connections' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.visibilityButtonText,
            visibility === 'connections' && styles.activeVisibilityButtonText
          ]}>
            Conexões
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.visibilityButton, visibility === 'private' && styles.activeVisibilityButton]}
          onPress={() => setVisibility('private')}
        >
          <Lock 
            size={20} 
            color={visibility === 'private' ? Theme.colors.primary.blue : Theme.colors.text.medium} 
          />
          <Text style={[
            styles.visibilityButtonText,
            visibility === 'private' && styles.activeVisibilityButtonText
          ]}>
            Privado
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderVerseFields = () => (
    <View style={styles.verseFields}>
      <Text style={styles.sectionTitle}>Detalhes do Versículo</Text>
      <TextInput
        style={styles.verseInput}
        placeholder="Texto do versículo"
        placeholderTextColor={Theme.colors.text.medium}
        value={verseText}
        onChangeText={setVerseText}
        multiline
      />
      <TextInput
        style={styles.verseReferenceInput}
        placeholder="Referência (ex: João 3:16)"
        placeholderTextColor={Theme.colors.text.medium}
        value={verseReference}
        onChangeText={setVerseReference}
      />
    </View>
  );

  const renderEventFields = () => (
    <View style={styles.eventFields}>
      <Text style={styles.sectionTitle}>Detalhes do Evento</Text>
      <TextInput
        style={styles.eventInput}
        placeholder="Título do evento"
        placeholderTextColor={Theme.colors.text.medium}
        value={eventTitle}
        onChangeText={setEventTitle}
      />
      <TextInput
        style={styles.eventInput}
        placeholder="Data (ex: 15/05/2025 19:00)"
        placeholderTextColor={Theme.colors.text.medium}
        value={eventDate}
        onChangeText={setEventDate}
      />
      <TextInput
        style={styles.eventInput}
        placeholder="Local"
        placeholderTextColor={Theme.colors.text.medium}
        value={eventLocation}
        onChangeText={setEventLocation}
      />
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Criar Publicação</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <TextInput
              style={styles.postInput}
              placeholder={
                postType === 'prayer' ? 'Compartilhe seu pedido de oração...' :
                postType === 'testimony' ? 'Compartilhe seu testemunho...' :
                postType === 'verse' ? 'Adicione um comentário sobre este versículo...' :
                postType === 'event' ? 'Descreva o evento...' :
                'O que você gostaria de compartilhar?'
              }
              placeholderTextColor={Theme.colors.text.medium}
              multiline
              value={postContent}
              onChangeText={setPostContent}
              textAlignVertical="top"
            />

            {renderTypeSelector()}
            
            {postType === 'verse' && renderVerseFields()}
            {postType === 'event' && renderEventFields()}

            <View style={styles.mediaSection}>
              <Text style={styles.sectionTitle}>Adicionar Mídia</Text>
              <TouchableOpacity 
                style={styles.mediaButton}
                onPress={handlePickImage}
              >
                <ImageIcon size={20} color={Theme.colors.text.medium} />
                <Text style={styles.mediaButtonText}>Adicionar Foto</Text>
              </TouchableOpacity>
              
              {mediaUrls.length > 0 && (
                <Text style={styles.mediaCount}>{mediaUrls.length} imagens selecionadas</Text>
              )}
            </View>

            <View style={styles.tagsSection}>
              <Text style={styles.sectionTitle}>Tags</Text>
              <View style={styles.tagInputContainer}>
                <Tag size={20} color={Theme.colors.text.medium} />
                <TextInput
                  style={styles.tagInput}
                  placeholder="Adicionar tag"
                  placeholderTextColor={Theme.colors.text.medium}
                  value={tagInput}
                  onChangeText={setTagInput}
                  onSubmitEditing={handleAddTag}
                />
                <TouchableOpacity 
                  style={styles.addTagButton}
                  onPress={handleAddTag}
                  disabled={!tagInput.trim()}
                >
                  <Text style={styles.addTagText}>Adicionar</Text>
                </TouchableOpacity>
              </View>
              
              {tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>#{tag}</Text>
                      <TouchableOpacity 
                        style={styles.removeTagButton}
                        onPress={() => handleRemoveTag(tag)}
                      >
                        <X size={12} color={Theme.colors.text.medium} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View style={styles.locationSection}>
              <Text style={styles.sectionTitle}>Localização</Text>
              <View style={styles.locationInputContainer}>
                <MapPin size={20} color={Theme.colors.text.medium} />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Adicionar localização"
                  placeholderTextColor={Theme.colors.text.medium}
                  value={location}
                  onChangeText={setLocation}
                />
              </View>
            </View>

            {renderVisibilitySelector()}

            <View style={styles.spiritualMessage}>
              <Text style={styles.spiritualText}>
                "Que as palavras da minha boca e a meditação do meu coração sejam agradáveis a ti, Senhor, minha Rocha e meu Resgatador." - Salmos 19:14
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (isSubmitting || !postContent.trim()) && styles.submitButtonDisabled
              ]}
              onPress={handleSubmit}
              disabled={isSubmitting || !postContent.trim()}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color={Theme.colors.background.white} />
              ) : (
                <Text style={styles.submitButtonText}>Publicar</Text>
              )}
            </TouchableOpacity>
          </View>
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
    maxHeight: '90%',
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
  content: {
    padding: Theme.spacing.md,
    maxHeight: 600,
  },
  postInput: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    height: 120,
    marginBottom: Theme.spacing.md,
    textAlignVertical: 'top',
  },
  typeSelector: {
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  activeTypeButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  typeButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeTypeButtonText: {
    color: Theme.colors.background.white,
  },
  verseFields: {
    marginBottom: Theme.spacing.md,
  },
  verseInput: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  verseReferenceInput: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  eventFields: {
    marginBottom: Theme.spacing.md,
  },
  eventInput: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  mediaSection: {
    marginBottom: Theme.spacing.md,
  },
  mediaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  mediaButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.sm,
  },
  mediaCount: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginTop: Theme.spacing.sm,
  },
  tagsSection: {
    marginBottom: Theme.spacing.md,
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  tagInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  addTagButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  addTagText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: Theme.spacing.sm,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  tagText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginRight: Theme.spacing.xs,
  },
  removeTagButton: {
    padding: 2,
  },
  locationSection: {
    marginBottom: Theme.spacing.md,
  },
  locationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  locationInput: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  visibilitySelector: {
    marginBottom: Theme.spacing.md,
  },
  visibilityButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visibilityButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.sm,
    marginHorizontal: Theme.spacing.xs,
  },
  activeVisibilityButton: {
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
  },
  visibilityButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeVisibilityButtonText: {
    color: Theme.colors.primary.blue,
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  spiritualText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  submitButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  submitButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});