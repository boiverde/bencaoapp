
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import Theme from '@/constants/Theme';
import { LogOut, Church, Globe, Book, MapPin, Edit, Save, XCircle, Camera, Music, Weight, Ruler, Calendar, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { decode } from 'base64-arraybuffer';

interface Profile {
  id: string;
  updated_at: string;
  full_name: string;
  avatar_url: string | null;
  birth_date: string | null; // Stored as YYYY-MM-DD
  location: string | null;
  denomination: string | null;
  church: string | null;
  languages: string[] | null;
  verse: string | null;
  bio: string | null;
  photos: string[] | null;
  interests: string[] | null;
  height: number | null;
  weight: number | null;
}

// --- DATE FUNCTIONS ---
const formatDateForDisplay = (date: string | null): string => {
  if (!date || !/\d{4}-\d{2}-\d{2}/.test(date)) return '';
  const [year, month, day] = date.split('-');
  return `${day}/${month}/${year}`;
};

const formatDateForStorage = (date: string | null): string | null => {
  if (!date || !/\d{2}\/\d{2}\/\d{4}/.test(date)) return null;
  const [day, month, year] = date.split('/');
  return `${year}-${month}-${day}`;
};

const calculateAge = (birthDate: string | null): number | null => {
  if (!birthDate || !/\d{4}-\d{2}-\d{2}/.test(birthDate)) return null;
  const [year, month, day] = birthDate.split('-').map(Number);
  const today = new Date();
  const birth = new Date(year, month - 1, day);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};
// --- END DATE FUNCTIONS ---

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState<Partial<Profile>>({});
  const [isSaving, setIsSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      if (data) {
        setProfile(data);
        setEditableProfile({...data, birth_date: formatDateForDisplay(data.birth_date)});
      } else if (fetchError?.code === 'PGRST116') {
        const defaultName = user.email?.split('@')[0] || 'Novo Utilizador';
        const { data: newProfile, error: insertError } = await supabase.from('profiles').insert({ id: user.id, full_name: defaultName }).select().single();
        if (insertError) throw insertError;
        setProfile(newProfile);
        setEditableProfile(newProfile);
      } else if (fetchError) {
        throw fetchError;
      }
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  }, [user]);

  useFocusEffect(useCallback(() => { if (!isEditing) fetchProfile(); }, [fetchProfile, isEditing]));

  const handleUpdateProfile = async (overrides = {}) => {
    if (!user) return;
    setIsSaving(true);
    try {
      const updates = {
        ...editableProfile,
        ...overrides,
        updated_at: new Date().toISOString(),
        height: editableProfile.height ? parseInt(String(editableProfile.height), 10) : null,
        weight: editableProfile.weight ? parseInt(String(editableProfile.weight), 10) : null,
        birth_date: formatDateForStorage(editableProfile.birth_date),
      };

      const { data: updatedData, error } = await supabase.from('profiles').update(updates).eq('id', user.id).select().single();
      if (error) throw error;
      
      setProfile(updatedData);
      setEditableProfile({...updatedData, birth_date: formatDateForDisplay(updatedData.birth_date)});
      setIsEditing(false);
      Alert.alert("Sucesso", "O seu perfil foi atualizado.");
    } catch (e: any) {
      Alert.alert("Erro", "Não foi possível salvar as alterações: " + e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickAvatar = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Desculpe', 'Precisamos de permissão para aceder às suas fotos.');
        return;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const image = result.assets[0];
    const fileExt = image.uri.split('.').pop();
    const fileName = `${user!.id}_${new Date().getTime()}.${fileExt}`;
    const filePath = `${fileName}`;

    setIsSaving(true);
    try {
      let arrayBuffer: ArrayBuffer;
      let contentType = image.mimeType ?? `image/${fileExt}`;

      if (Platform.OS === 'web') {
        const response = await fetch(image.uri);
        const blob = await response.blob();
        if (blob.size > 5 * 1024 * 1024) {
          Alert.alert('Ficheiro Demasiado Grande', 'Por favor, escolha uma imagem com menos de 5MB.');
          setIsSaving(false);
          return;
        }
        arrayBuffer = await blob.arrayBuffer();
      } else {
        const fileInfo = await FileSystem.getInfoAsync(image.uri);
        if (fileInfo.size && fileInfo.size > 5 * 1024 * 1024) {
          Alert.alert('Ficheiro Demasiado Grande', 'Por favor, escolha uma imagem com menos de 5MB.');
          setIsSaving(false);
          return;
        }
        const base64 = await FileSystem.readAsStringAsync(image.uri, { encoding: FileSystem.EncodingType.Base64 });
        arrayBuffer = decode(base64);
      }

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, arrayBuffer, {
          contentType,
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      if (!urlData.publicUrl) throw new Error("Não foi possível obter a URL da imagem.");

      await handleUpdateProfile({ avatar_url: urlData.publicUrl });

    } catch (e: any) {
      Alert.alert('Erro de Upload', e.message || 'Ocorreu um problema ao enviar a sua foto.');
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof Profile, value: any) => {
    setEditableProfile(prev => ({ ...prev, [field]: value }));
  };

  const age = calculateAge(profile?.birth_date);

  if (loading || !profile) return <SafeAreaView style={styles.container}><ActivityIndicator style={{ flex: 1 }} size="large" color={Theme.colors.primary.blue} /></SafeAreaView>;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
           <View style={styles.headerActions}> 
             <TouchableOpacity style={styles.iconButton} onPress={() => {if (isEditing) setIsEditing(false)}}>
                {isEditing && <XCircle size={24} color={Theme.colors.text.dark}/>}
             </TouchableOpacity> 
             <TouchableOpacity onPress={signOut} style={styles.iconButton}><LogOut size={24} color={Theme.colors.text.dark} /></TouchableOpacity>
           </View>
          <View style={styles.profileHeader}>
            <TouchableOpacity onPress={() => isEditing ? handlePickAvatar() : {}} disabled={isSaving}>
                <View style={styles.profileImageContainer}>
                    {isSaving ? <ActivityIndicator size="large" color={Theme.colors.primary.blue} /> :
                      (profile.avatar_url ? 
                          <Image source={{ uri: profile.avatar_url }} style={styles.profileImage} />
                          : 
                          <View style={[styles.profileImage, styles.avatarPlaceholder]}><User size={40} color={Theme.colors.text.light} /></View>
                      )
                    }
                    {!isEditing && <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}><Edit size={16} color="#fff" /></TouchableOpacity>}
                    {isEditing && !isSaving && <View style={[styles.editButton, {backgroundColor: Theme.colors.primary.blue}]}><Camera size={16} color="#fff" /></View>}
                </View>
            </TouchableOpacity>
            
            {isEditing ? (
              <TextInput style={[styles.profileName, styles.input, styles.inputCenter]} value={editableProfile.full_name || ''} onChangeText={text => handleInputChange('full_name', text)} placeholder="Seu nome completo" />
            ) : (
              <Text style={styles.profileName}>{profile.full_name}{age ? `, ${age}` : ''}</Text>
            )}

            {isEditing ? (
                 <TextInput style={[styles.locationText, styles.input, styles.inputCenter, {marginTop: 4}]} value={editableProfile.location || ''} onChangeText={(text) => handleInputChange('location', text)} placeholder="Sua cidade e estado"/>
            ): (
                 profile.location && (
                  <View style={styles.locationContainer}>
                    <MapPin size={16} color={Theme.colors.text.medium} />
                    <Text style={styles.locationText}>{profile.location}</Text>
                  </View>
                )
            )}
          </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sobre Mim</Text>
            {isEditing ? (
                <TextInput style={[styles.bioText, styles.input, {height: 100, textAlignVertical: 'top'}]} value={editableProfile.bio || ''} onChangeText={(text) => handleInputChange('bio', text)} placeholder="Escreva um pouco sobre você..." multiline/>
            ) : (
                <Text style={styles.bioText}>{profile.bio || 'Adicione uma bio para que saibam mais sobre você.'}</Text>
            )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Pessoais</Text>
          <EditRow icon={Calendar} label="Data de Nascimento" isEditing={isEditing} value={editableProfile.birth_date} onChange={text => handleInputChange('birth_date', text)} placeholder="DD/MM/AAAA" />
          <EditRow icon={Ruler} label="Altura (cm)" isEditing={isEditing} value={editableProfile.height?.toString()} onChange={text => handleInputChange('height', text)} keyboardType="numeric" />
          <EditRow icon={Weight} label="Peso (kg)" isEditing={isEditing} value={editableProfile.weight?.toString()} onChange={text => handleInputChange('weight', text)} keyboardType="numeric" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informações Religiosas</Text>
          <EditRow icon={Church} label="Denominação" isEditing={isEditing} value={editableProfile.denomination} onChange={text => handleInputChange('denomination', text)} />
          <EditRow icon={MapPin} label="Igreja que frequenta" isEditing={isEditing} value={editableProfile.church} onChange={text => handleInputChange('church', text)} />
          <EditRow icon={Globe} label="Idiomas" isEditing={isEditing} value={editableProfile.languages?.join(', ')} onChange={text => handleInputChange('languages', text.split(',').map(s => s.trim()))} />
           <View style={styles.verseContainer}>
              <Book size={18} color={Theme.colors.primary.lilac} />
              {isEditing ? (
                  <TextInput style={[styles.verseText, styles.input, { flex: 1, marginLeft: Theme.spacing.md }]} value={editableProfile.verse || ''} onChangeText={(text) => handleInputChange('verse', text)} placeholder="Seu versículo favorito"/>
              ) : (
                 <Text style={styles.verseText}>"{profile.verse || 'Adicione seu versículo favorito.'}"</Text>
              )}
            </View>
        </View>
        
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Minhas Fotos</Text>
            <View style={styles.photosGrid}>
                <TouchableOpacity style={styles.photoPlaceholder}><Camera size={24} color={Theme.colors.text.light}/></TouchableOpacity>
                 <View style={styles.photoPlaceholder} />
                 <View style={styles.photoPlaceholder} />
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Interesses</Text>
             <EditRow icon={Music} label="Gostos Musicais" isEditing={isEditing} value={editableProfile.interests?.join(', ')} onChange={text => handleInputChange('interests', text.split(',').map(s => s.trim()))} placeholder="Ex: Hillsong, Elevation, etc." />
        </View>

        {isEditing && (
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity style={styles.saveButton} onPress={() => handleUpdateProfile()} disabled={isSaving}>
                    {isSaving ? <ActivityIndicator color="#fff" /> : <Save size={20} color="#fff" />}
                    <Text style={styles.saveButtonText}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const EditRow = ({ icon: Icon, label, value, isEditing, onChange, placeholder, keyboardType = 'default' }) => (
  <View style={styles.infoRow}>
    <Icon size={18} color={Theme.colors.primary.blue} />
    <View style={styles.infoRowContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        {isEditing ? (
            <TextInput style={[styles.infoValue, styles.input]} value={value || ''} onChangeText={onChange} placeholder={placeholder || `Digite ${label.toLowerCase()}`} keyboardType={keyboardType}/>
        ) : (
            <Text style={styles.infoValue}>{value || 'Não definido'}</Text>
        )}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Theme.colors.background.light },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: Theme.colors.background.white, borderBottomLeftRadius: Theme.borderRadius.lg, borderBottomRightRadius: Theme.borderRadius.lg, paddingBottom: Theme.spacing.lg, marginBottom: Theme.spacing.lg, ...Theme.shadows.small },
  headerActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Theme.spacing.md, paddingTop: Theme.spacing.md, minHeight: 40 },
  iconButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: Theme.colors.background.light, alignItems: 'center', justifyContent: 'center' },
  profileHeader: { alignItems: 'center', marginTop: -Theme.spacing.md },
  profileImageContainer: { width: 100, height: 100, borderRadius: 50, marginBottom: Theme.spacing.md, justifyContent: 'center', alignItems: 'center' },
  profileImage: { width: '100%', height: '100%', borderRadius: 50, borderWidth: 3, borderColor: Theme.colors.primary.blue },
  avatarPlaceholder: { backgroundColor: Theme.colors.ui.border, justifyContent: 'center', alignItems: 'center' },
  editButton: { position: 'absolute', right: 0, bottom: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: Theme.colors.primary.blue, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Theme.colors.background.white },
  profileName: { fontFamily: Theme.typography.fontFamily.heading, fontSize: Theme.typography.fontSize.xl, color: Theme.colors.text.dark, marginBottom: Theme.spacing.xs },
  locationContainer: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontFamily: Theme.typography.fontFamily.body, fontSize: Theme.typography.fontSize.sm, color: Theme.colors.text.medium, marginLeft: Theme.spacing.xs },
  section: { backgroundColor: Theme.colors.background.white, borderRadius: Theme.borderRadius.lg, padding: Theme.spacing.md, marginBottom: Theme.spacing.md, marginHorizontal: Theme.spacing.md, ...Theme.shadows.small },
  sectionTitle: { fontFamily: Theme.typography.fontFamily.subheading, fontSize: Theme.typography.fontSize.lg, color: Theme.colors.text.dark, marginBottom: Theme.spacing.md, },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Theme.spacing.md, },
  infoRowContent: { flex: 1, marginLeft: Theme.spacing.md, },
  infoLabel: { fontFamily: Theme.typography.fontFamily.body, fontSize: Theme.typography.fontSize.sm, color: Theme.colors.text.medium, },
  infoValue: { fontFamily: Theme.typography.fontFamily.subheading, fontSize: Theme.typography.fontSize.md, color: Theme.colors.text.dark, },
  bioText: { fontFamily: Theme.typography.fontFamily.body, fontSize: Theme.typography.fontSize.md, color: Theme.colors.text.dark, lineHeight: 24, },
  verseContainer: { flexDirection: 'row', backgroundColor: Theme.colors.background.lilac, padding: Theme.spacing.md, borderRadius: Theme.borderRadius.md, borderLeftWidth: 3, borderLeftColor: Theme.colors.primary.lilac, alignItems: 'center', marginTop: Theme.spacing.sm },
  verseText: { fontFamily: Theme.typography.fontFamily.verse, fontSize: Theme.typography.fontSize.md, color: Theme.colors.text.dark, flex: 1, },
  photosGrid: { flexDirection: 'row', gap: Theme.spacing.sm, },
  photoPlaceholder: { flex: 1, aspectRatio: 1, backgroundColor: Theme.colors.ui.border, borderRadius: Theme.borderRadius.md, justifyContent: 'center', alignItems: 'center'},
  saveButtonContainer: { paddingVertical: Theme.spacing.lg, paddingHorizontal: Theme.spacing.md },
  saveButton: { flexDirection: 'row', backgroundColor: Theme.colors.primary.blue, paddingVertical: Theme.spacing.lg, borderRadius: Theme.borderRadius.md, justifyContent: 'center', alignItems: 'center', gap: Theme.spacing.md, },
  saveButtonText: { fontFamily: Theme.typography.fontFamily.heading, color: '#fff', fontSize: Theme.typography.fontSize.lg, },
  input: { borderBottomWidth: 1, borderBottomColor: Theme.colors.ui.border, paddingVertical: Theme.spacing.xs, },
  inputCenter: { textAlign: 'center', }
});
