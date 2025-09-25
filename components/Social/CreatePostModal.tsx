
import { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Image
} from 'react-native';
import { 
  X, 
  Image as ImageIcon, 
  MapPin, 
  Tag, 
  Book, 
  HandHelping as PrayingHands, 
  MessageSquare, 
  Calendar 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useAuth } from '@/hooks/useAuth';
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
  initialType = 'verse',
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
  const { user } = useAuth();

  const resetForm = useCallback(() => {
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
  }, [initialType]);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [resetForm, onClose]);

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão necessária', 'É necessário permitir o acesso à galeria para adicionar imagens.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled && result.assets) {
        setMediaUrls(prev => [...prev, result.assets[0].uri]);
    }
  };

  const handleAddTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para criar uma publicação.');
      return;
    }

    if (!postContent.trim() && mediaUrls.length === 0 && postType !== 'verse') {
        Alert.alert('Erro', 'Por favor, escreva algo ou adicione uma imagem para publicar.');
        return;
    }

    setIsSubmitting(true);
    try {
      const postData: Omit<SocialPost, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'prayerCount' | 'author_name'> = {
        userId: user.id,
        content: postContent,
        type: postType,
        visibility: visibility,
        tags: tags,
        mediaUrls: mediaUrls,
        ...(location.trim() && { location: { name: location } }),
        ...(postType === 'verse' && { verse: { text: verseText, reference: verseReference } }),
        ...(postType === 'event' && { eventDetails: {
            title: eventTitle,
            date: eventDate ? new Date(eventDate).getTime() : Date.now(),
            location: eventLocation,
            description: postContent
        }}),
        ...(groupId && { groupId: groupId })
      };
      
      await createPost(postData);
      resetForm();
      onPostCreated();
    } catch (error: any) {
      console.error('[CreatePostModal] Erro ao criar a publicação:', error);
      Alert.alert('Erro', `Ocorreu um erro ao criar a publicação: ${error.message}`)
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderTypeSelector = () => (
    <View style={styles.typeSelector}>
      <Text style={styles.sectionTitle}>Tipo de Publicação</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <TouchableOpacity style={[styles.typeButton, postType === 'verse' && styles.activeTypeButton]} onPress={() => setPostType('verse')}><Book size={20} color={postType === 'verse' ? 'white' : '#555'} /><Text style={[styles.typeButtonText, postType === 'verse' && styles.activeTypeButtonText]}>Versículo</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.typeButton, postType === 'prayer' && styles.activeTypeButton]} onPress={() => setPostType('prayer')}><PrayingHands size={20} color={postType === 'prayer' ? 'white' : '#555'} /><Text style={[styles.typeButtonText, postType === 'prayer' && styles.activeTypeButtonText]}>Oração</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.typeButton, postType === 'testimony' && styles.activeTypeButton]} onPress={() => setPostType('testimony')}><MessageSquare size={20} color={postType === 'testimony' ? 'white' : '#555'} /><Text style={[styles.typeButtonText, postType === 'testimony' && styles.activeTypeButtonText]}>Testemunho</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.typeButton, postType === 'event' && styles.activeTypeButton]} onPress={() => setPostType('event')}><Calendar size={20} color={postType === 'event' ? 'white' : '#555'} /><Text style={[styles.typeButtonText, postType === 'event' && styles.activeTypeButtonText]}>Evento</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );

  const renderVerseFields = () => (
    <View style={styles.extraFieldsContainer}><Text style={styles.sectionTitle}>Detalhes do Versículo</Text><TextInput style={styles.textInput} placeholder="Texto do versículo" value={verseText} onChangeText={setVerseText} multiline /><TextInput style={styles.textInput} placeholder="Referência (ex: João 3:16)" value={verseReference} onChangeText={setVerseReference} /></View>
  );

  const renderEventFields = () => (
    <View style={styles.extraFieldsContainer}><Text style={styles.sectionTitle}>Detalhes do Evento</Text><TextInput style={styles.textInput} placeholder="Título do evento" value={eventTitle} onChangeText={setEventTitle} /><TextInput style={styles.textInput} placeholder="Data (ex: 2024-12-31T19:00)" value={eventDate} onChangeText={setEventDate} /><TextInput style={styles.textInput} placeholder="Local" value={eventLocation} onChangeText={setEventLocation} /></View>
  );

  const renderAttachmentButtons = () => (
      <View style={styles.attachmentButtonsContainer}><TouchableOpacity style={styles.attachmentButton} onPress={handlePickImage}><ImageIcon size={22} color={Theme.colors.text.medium} /><Text style={styles.attachmentButtonText}>Foto/Vídeo</Text></TouchableOpacity><TouchableOpacity style={styles.attachmentButton}><MapPin size={22} color={Theme.colors.text.medium} /><Text style={styles.attachmentButtonText}>Localização</Text></TouchableOpacity></View>
  );

  const renderTagInput = () => (
      <View style={styles.tagContainer}><Text style={styles.sectionTitle}>Tags</Text><View style={styles.tagInputContainer}><TextInput style={styles.tagInput} placeholder="Adicionar tag..." value={tagInput} onChangeText={setTagInput} onSubmitEditing={handleAddTag} /><TouchableOpacity style={styles.addTagButton} onPress={handleAddTag}><Text style={styles.addTagButtonText}>Adicionar</Text></TouchableOpacity></View><ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsList}>{tags.map(tag => (<View key={tag} style={styles.tagPill}><Text style={styles.tagPillText}>{tag}</Text><TouchableOpacity onPress={() => handleRemoveTag(tag)}><X size={14} color={Theme.colors.primary.blue} /></TouchableOpacity></View>))}</ScrollView></View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={handleClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}><Text style={styles.headerTitle}>Criar Publicação</Text><TouchableOpacity style={styles.closeButton} onPress={handleClose}><X size={24} color={Theme.colors.text.dark} /></TouchableOpacity></View>
          <ScrollView style={styles.content}>
            <TextInput style={styles.postInput} placeholder={postType === 'verse' ? 'Adicione um comentário...' : 'O que você gostaria de compartilhar?'} multiline value={postContent} onChangeText={setPostContent} />
            <View style={styles.mediaPreviewContainer}>{mediaUrls.map((uri, index) => (<Image key={index} source={{ uri }} style={styles.mediaPreview} />))}</View>
            {renderAttachmentButtons()}
            {renderTypeSelector()}
            {postType === 'verse' && renderVerseFields()}
            {postType === 'event' && renderEventFields()}
            {renderTagInput()}
          </ScrollView>
          <View style={styles.footer}><TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={isSubmitting}>{isSubmitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitButtonText}>Publicar</Text>}</TouchableOpacity></View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },    modalContent: { backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '95%', minHeight: 400 },    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },    headerTitle: { fontSize: 18, fontWeight: 'bold', color: Theme.colors.text.dark },    closeButton: { padding: 4 },    content: { paddingHorizontal: 16, paddingBottom: 20 },    postInput: { fontSize: 18, color: Theme.colors.text.dark, minHeight: 100, textAlignVertical: 'top', paddingVertical: 10 },    mediaPreviewContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },    mediaPreview: { width: 80, height: 80, borderRadius: 8, marginRight: 10, marginBottom: 10 },    attachmentButtonsContainer: { flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#f0f0f0', paddingVertical: 8, marginVertical: 10 },    attachmentButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, marginRight: 10 },    attachmentButtonText: { marginLeft: 8, fontSize: 14, color: Theme.colors.text.medium, fontWeight: '500' },    typeSelector: { marginVertical: 10 },    sectionTitle: { fontSize: 16, fontWeight: '600', color: Theme.colors.text.dark, marginBottom: 12 },    extraFieldsContainer: { marginVertical: 10, borderTopWidth: 1, paddingTop: 12, borderColor: '#f0f0f0' },    textInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, marginBottom: 10 },    tagContainer: { marginVertical: 10, borderTopWidth: 1, paddingTop: 12, borderColor: '#f0f0f0' },    tagInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },    tagInput: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14 },    addTagButton: { marginLeft: 10, backgroundColor: Theme.colors.primary.light, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },    addTagButtonText: { color: Theme.colors.primary.blue, fontWeight: 'bold' },    tagsList: { flexDirection: 'row' },    tagPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: Theme.colors.primary.extralight, borderRadius: 15, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8 },    tagPillText: { color: Theme.colors.primary.blue, marginRight: 6 },    footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },    submitButton: { backgroundColor: Theme.colors.primary.blue, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },    submitButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },    typeButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },    activeTypeButton: { backgroundColor: Theme.colors.primary.blue },    typeButtonText: { marginLeft: 4, color: '#555' },    activeTypeButtonText: { color: 'white' },});
