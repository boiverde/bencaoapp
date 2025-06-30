import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Globe } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useTranslation, Language } from '@/utils/i18n';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { language, setLanguage } = useTranslation();

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'pt-BR', name: 'Português', flag: '🇧🇷' },
    { code: 'en-US', name: 'English', flag: '🇺🇸' },
    { code: 'es-ES', name: 'Español', flag: '🇪🇸' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        accessibilityLabel={`Mudar idioma. Idioma atual: ${currentLanguage?.name}`}
        accessibilityRole="button"
      >
        <Globe size={16} color={Theme.colors.primary.blue} />
        <Text style={styles.compactText}>{currentLanguage?.flag}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Globe size={20} color={Theme.colors.primary.blue} />
        <Text style={styles.title}>Idioma</Text>
      </View>
      
      <View style={styles.languageOptions}>
        {languages.map(lang => (
          <TouchableOpacity
            key={lang.code}
            style={[
              styles.languageOption,
              language === lang.code && styles.selectedLanguage
            ]}
            onPress={() => setLanguage(lang.code)}
            accessibilityLabel={`Selecionar idioma ${lang.name}`}
            accessibilityRole="radio"
            accessibilityState={{ checked: language === lang.code }}
          >
            <Text style={styles.languageFlag}>{lang.flag}</Text>
            <Text style={[
              styles.languageName,
              language === lang.code && styles.selectedLanguageName
            ]}>
              {lang.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  compactText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    marginLeft: Theme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginHorizontal: Theme.spacing.xs,
  },
  selectedLanguage: {
    backgroundColor: Theme.colors.primary.blue + '20',
  },
  languageFlag: {
    fontSize: 24,
    marginBottom: Theme.spacing.xs,
  },
  languageName: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  selectedLanguageName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
});