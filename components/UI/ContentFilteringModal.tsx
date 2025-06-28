import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Switch
} from 'react-native';
import { X, Shield, MessageSquare, Eye, TriangleAlert as AlertTriangle, Book, Church, Heart } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSecurity } from '@/hooks/useSecurity';

interface ContentFilteringModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ContentFilteringModal({
  visible,
  onClose
}: ContentFilteringModalProps) {
  const { securityProfile, updatePrivacySettings } = useSecurity();
  
  const [filters, setFilters] = useState({
    profanity: true,
    inappropriateContent: true,
    spam: true,
    scam: true,
    falseDoctrine: true,
    harmfulContent: true
  });

  const [filterLevel, setFilterLevel] = useState<'none' | 'basic' | 'strict' | 'blessed_only'>(
    securityProfile?.privacySettings.messageFiltering || 'basic'
  );

  const handleFilterChange = (key: keyof typeof filters, value: boolean) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleFilterLevelChange = (level: typeof filterLevel) => {
    setFilterLevel(level);
    if (securityProfile) {
      updatePrivacySettings({ messageFiltering: level });
    }
  };

  const filterLevels = [
    {
      value: 'none' as const,
      title: 'Sem Filtro',
      description: 'Nenhum conteúdo será filtrado'
    },
    {
      value: 'basic' as const,
      title: 'Filtro Básico',
      description: 'Filtra conteúdo explícito e ofensivo'
    },
    {
      value: 'strict' as const,
      title: 'Filtro Rigoroso',
      description: 'Filtra todo conteúdo potencialmente inadequado'
    },
    {
      value: 'blessed_only' as const,
      title: 'Apenas Membros Abençoados',
      description: 'Receba mensagens apenas de membros verificados'
    }
  ];

  const contentCategories = [
    {
      key: 'profanity',
      title: 'Linguagem Imprópria',
      description: 'Palavrões e linguagem ofensiva',
      icon: MessageSquare,
      verse: 'Não saia da vossa boca nenhuma palavra torpe. Efésios 4:29'
    },
    {
      key: 'inappropriateContent',
      title: 'Conteúdo Inadequado',
      description: 'Imagens ou textos impróprios',
      icon: Eye,
      verse: 'Desviai os olhos de contemplar a vaidade. Salmos 119:37'
    },
    {
      key: 'spam',
      title: 'Spam',
      description: 'Mensagens não solicitadas e repetitivas',
      icon: MessageSquare
    },
    {
      key: 'scam',
      title: 'Golpes',
      description: 'Tentativas de fraude ou enganação',
      icon: AlertTriangle,
      verse: 'Acautelai-vos dos falsos profetas. Mateus 7:15'
    },
    {
      key: 'falseDoctrine',
      title: 'Falsa Doutrina',
      description: 'Ensinos contrários à Bíblia',
      icon: Book,
      verse: 'Examinai tudo. Retende o bem. 1 Tessalonicenses 5:21'
    },
    {
      key: 'harmfulContent',
      title: 'Conteúdo Prejudicial',
      description: 'Conteúdo que promove comportamentos nocivos',
      icon: Heart,
      verse: 'Tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai. Filipenses 4:8'
    }
  ];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Filtragem de Conteúdo</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <Text style={styles.description}>
              Configure como o conteúdo é filtrado para proteger sua experiência espiritual.
            </Text>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Nível de Filtragem</Text>
              <Text style={styles.sectionDescription}>
                Escolha o nível de proteção para suas mensagens e conteúdo
              </Text>

              {filterLevels.map((level) => (
                <TouchableOpacity
                  key={level.value}
                  style={[
                    styles.filterLevelItem,
                    filterLevel === level.value && styles.selectedFilterLevel
                  ]}
                  onPress={() => handleFilterLevelChange(level.value)}
                >
                  <View style={styles.filterLevelInfo}>
                    <Text style={[
                      styles.filterLevelTitle,
                      filterLevel === level.value && styles.selectedFilterLevelText
                    ]}>
                      {level.title}
                    </Text>
                    <Text style={styles.filterLevelDescription}>
                      {level.description}
                    </Text>
                  </View>
                  {filterLevel === level.value && (
                    <View style={styles.selectedIndicator}>
                      <Shield size={16} color={Theme.colors.primary.blue} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Categorias de Conteúdo</Text>
              <Text style={styles.sectionDescription}>
                Escolha quais tipos de conteúdo devem ser filtrados
              </Text>

              {contentCategories.map((category) => (
                <View key={category.key} style={styles.categoryItem}>
                  <View style={styles.categoryLeft}>
                    <View style={styles.categoryIcon}>
                      <category.icon size={20} color={Theme.colors.primary.blue} />
                    </View>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryTitle}>{category.title}</Text>
                      <Text style={styles.categoryDescription}>{category.description}</Text>
                      {category.verse && (
                        <Text style={styles.categoryVerse}>"{category.verse}"</Text>
                      )}
                    </View>
                  </View>
                  <Switch
                    value={filters[category.key as keyof typeof filters]}
                    onValueChange={(value) => handleFilterChange(category.key as keyof typeof filters, value)}
                    trackColor={{ 
                      false: Theme.colors.ui.disabled, 
                      true: Theme.colors.primary.blue + '40' 
                    }}
                    thumbColor={filters[category.key as keyof typeof filters] ? Theme.colors.primary.blue : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>

            <View style={styles.infoBox}>
              <Church size={16} color={Theme.colors.primary.blue} />
              <Text style={styles.infoText}>
                A filtragem de conteúdo ajuda a manter um ambiente saudável e edificante para todos os membros da comunidade cristã.
              </Text>
            </View>

            <View style={styles.spiritualMessage}>
              <Text style={styles.spiritualText}>
                "Finalmente, irmãos, tudo o que é verdadeiro, tudo o que é honesto, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se há alguma virtude, e se há algum louvor, nisso pensai." - Filipenses 4:8
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity style={styles.saveButton} onPress={onClose}>
              <Text style={styles.saveButtonText}>Salvar Configurações</Text>
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
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    lineHeight: 22,
    marginBottom: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  sectionDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
  },
  filterLevelItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  selectedFilterLevel: {
    backgroundColor: Theme.colors.primary.blue + '20',
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
  },
  filterLevelInfo: {
    flex: 1,
  },
  filterLevelTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  selectedFilterLevelText: {
    color: Theme.colors.primary.blue,
  },
  filterLevelDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  categoryLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
    marginRight: Theme.spacing.md,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  categoryDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
  },
  categoryVerse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.blue,
    fontStyle: 'italic',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue + '10',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    marginLeft: Theme.spacing.sm,
    flex: 1,
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
    lineHeight: 20,
    textAlign: 'center',
  },
  footer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  saveButton: {
    backgroundColor: Theme.colors.primary.blue,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
  },
  saveButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});