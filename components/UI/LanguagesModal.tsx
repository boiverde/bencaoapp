import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Theme from '@/constants/Theme';
import { X, Check, Search } from 'lucide-react-native';
import { useState, useMemo } from 'react';

interface LanguagesModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (languages: string[]) => void;
  selectedLanguages: string[];
}

const LANGUAGES = [
  'Alemão',
  'Árabe',
  'Bengali',
  'Chinês (Mandarim)',
  'Chinês (Cantonês)',
  'Coreano',
  'Espanhol',
  'Francês',
  'Hindi',
  'Holandês',
  'Inglês',
  'Italiano',
  'Japonês',
  'Português',
  'Russo',
  'Sueco',
  'Tailandês',
  'Turco',
  'Urdu',
  'Vietnamita'
].sort((a, b) => a.localeCompare(b));

export default function LanguagesModal({ visible, onClose, onSelect, selectedLanguages }: LanguagesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLanguages = useMemo(() => {
    return LANGUAGES.filter(language =>
      language.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const toggleLanguage = (language: string) => {
    const newSelection = selectedLanguages.includes(language)
      ? selectedLanguages.filter(l => l !== language)
      : [...selectedLanguages, language];
    onSelect(newSelection);
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Línguas faladas</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar idioma..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.languagesList}>
            {filteredLanguages.map((language) => (
              <TouchableOpacity
                key={language}
                style={styles.languageItem}
                onPress={() => toggleLanguage(language)}
              >
                <Text style={[
                  styles.languageText,
                  selectedLanguages.includes(language) && styles.languageTextSelected
                ]}>
                  {language}
                </Text>
                {selectedLanguages.includes(language) && (
                  <Check size={20} color={Theme.colors.primary.blue} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={onClose}
            >
              <Text style={styles.doneButtonText}>
                Concluído ({selectedLanguages.length} selecionados)
              </Text>
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
    maxHeight: '80%',
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  searchInput: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  languagesList: {
    padding: Theme.spacing.md,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  languageText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  languageTextSelected: {
    color: Theme.colors.primary.blue,
    fontFamily: Theme.typography.fontFamily.subheading,
  },
  footer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  doneButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  doneButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});