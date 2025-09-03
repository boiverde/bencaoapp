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
import { 
  X, 
  FileSliders as Sliders, 
  MessageSquare, 
  HandHelping as PrayingHands, 
  Book, 
  Calendar, 
  Church, 
  RefreshCw 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SocialPost } from '@/utils/socialSystem';

interface FeedFilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: {
    contentType?: SocialPost['type'][];
    tags?: string[];
    denominationFilter?: string[];
  }) => void;
}

export default function FeedFilterModal({
  visible,
  onClose,
  onApplyFilters
}: FeedFilterModalProps) {
  const [contentTypeFilters, setContentTypeFilters] = useState<{
    general: boolean;
    prayer: boolean;
    verse: boolean;
    testimony: boolean;
    event: boolean;
  }>({
    general: true,
    prayer: true,
    verse: true,
    testimony: true,
    event: true
  });
  
  const [denominationFilters, setDenominationFilters] = useState<{
    [key: string]: boolean;
  }>({
    'Batista': true,
    'Católica': true,
    'Presbiteriana': true,
    'Pentecostal': true,
    'Adventista': true,
    'Outras': true
  });
  
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  const popularTags = [
    'oração', 'fé', 'bíblia', 'louvor', 'testemunho', 
    'família', 'juventude', 'evangelismo', 'missões'
  ];

  const handleReset = () => {
    setContentTypeFilters({
      general: true,
      prayer: true,
      verse: true,
      testimony: true,
      event: true
    });
    
    setDenominationFilters({
      'Batista': true,
      'Católica': true,
      'Presbiteriana': true,
      'Pentecostal': true,
      'Adventista': true,
      'Outras': true
    });
    
    setSelectedTags([]);
  };

  const handleApply = () => {
    const contentTypes: SocialPost['type'][] = [];
    if (contentTypeFilters.general) contentTypes.push('general');
    if (contentTypeFilters.prayer) contentTypes.push('prayer');
    if (contentTypeFilters.verse) contentTypes.push('verse');
    if (contentTypeFilters.testimony) contentTypes.push('testimony');
    if (contentTypeFilters.event) contentTypes.push('event');
    
    const denominations = Object.entries(denominationFilters)
      .filter(([_, isSelected]) => isSelected)
      .map(([name]) => name);
    
    onApplyFilters({
      contentType: contentTypes.length === 5 ? undefined : contentTypes,
      tags: selectedTags.length > 0 ? selectedTags : undefined,
      denominationFilter: denominations.length === 6 ? undefined : denominations
    });
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

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
            <View style={styles.headerTitleContainer}>
              <Sliders size={20} color={Theme.colors.text.dark} />
              <Text style={styles.headerTitle}>Filtros</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tipo de Conteúdo</Text>
              
              <View style={styles.filterItem}>
                <View style={styles.filterItemLeft}>
                  <MessageSquare size={20} color={Theme.colors.text.medium} />
                  <Text style={styles.filterItemText}>Publicações Gerais</Text>
                </View>
                <Switch
                  value={contentTypeFilters.general}
                  onValueChange={(value) => setContentTypeFilters({...contentTypeFilters, general: value})}
                  trackColor={{ 
                    false: Theme.colors.ui.disabled, 
                    true: Theme.colors.primary.blue + '40' 
                  }}
                  thumbColor={contentTypeFilters.general ? Theme.colors.primary.blue : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.filterItem}>
                <View style={styles.filterItemLeft}>
                  <PrayingHands size={20} color={Theme.colors.text.medium} />
                  <Text style={styles.filterItemText}>Pedidos de Oração</Text>
                </View>
                <Switch
                  value={contentTypeFilters.prayer}
                  onValueChange={(value) => setContentTypeFilters({...contentTypeFilters, prayer: value})}
                  trackColor={{ 
                    false: Theme.colors.ui.disabled, 
                    true: Theme.colors.primary.blue + '40' 
                  }}
                  thumbColor={contentTypeFilters.prayer ? Theme.colors.primary.blue : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.filterItem}>
                <View style={styles.filterItemLeft}>
                  <Book size={20} color={Theme.colors.text.medium} />
                  <Text style={styles.filterItemText}>Versículos</Text>
                </View>
                <Switch
                  value={contentTypeFilters.verse}
                  onValueChange={(value) => setContentTypeFilters({...contentTypeFilters, verse: value})}
                  trackColor={{ 
                    false: Theme.colors.ui.disabled, 
                    true: Theme.colors.primary.blue + '40' 
                  }}
                  thumbColor={contentTypeFilters.verse ? Theme.colors.primary.blue : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.filterItem}>
                <View style={styles.filterItemLeft}>
                  <MessageSquare size={20} color={Theme.colors.text.medium} />
                  <Text style={styles.filterItemText}>Testemunhos</Text>
                </View>
                <Switch
                  value={contentTypeFilters.testimony}
                  onValueChange={(value) => setContentTypeFilters({...contentTypeFilters, testimony: value})}
                  trackColor={{ 
                    false: Theme.colors.ui.disabled, 
                    true: Theme.colors.primary.blue + '40' 
                  }}
                  thumbColor={contentTypeFilters.testimony ? Theme.colors.primary.blue : '#f4f3f4'}
                />
              </View>
              
              <View style={styles.filterItem}>
                <View style={styles.filterItemLeft}>
                  <Calendar size={20} color={Theme.colors.text.medium} />
                  <Text style={styles.filterItemText}>Eventos</Text>
                </View>
                <Switch
                  value={contentTypeFilters.event}
                  onValueChange={(value) => setContentTypeFilters({...contentTypeFilters, event: value})}
                  trackColor={{ 
                    false: Theme.colors.ui.disabled, 
                    true: Theme.colors.primary.blue + '40' 
                  }}
                  thumbColor={contentTypeFilters.event ? Theme.colors.primary.blue : '#f4f3f4'}
                />
              </View>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Denominações</Text>
              
              {Object.entries(denominationFilters).map(([denomination, isSelected]) => (
                <View key={denomination} style={styles.filterItem}>
                  <View style={styles.filterItemLeft}>
                    <Church size={20} color={Theme.colors.text.medium} />
                    <Text style={styles.filterItemText}>{denomination}</Text>
                  </View>
                  <Switch
                    value={isSelected}
                    onValueChange={(value) => setDenominationFilters({
                      ...denominationFilters,
                      [denomination]: value
                    })}
                    trackColor={{ 
                      false: Theme.colors.ui.disabled, 
                      true: Theme.colors.primary.blue + '40' 
                    }}
                    thumbColor={isSelected ? Theme.colors.primary.blue : '#f4f3f4'}
                  />
                </View>
              ))}
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tags Populares</Text>
              <View style={styles.tagsContainer}>
                {popularTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    style={[
                      styles.tagButton,
                      selectedTags.includes(tag) && styles.selectedTagButton
                    ]}
                    onPress={() => toggleTag(tag)}
                  >
                    <Text style={[
                      styles.tagButtonText,
                      selectedTags.includes(tag) && styles.selectedTagButtonText
                    ]}>
                      #{tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.resetButton}
              onPress={handleReset}
            >
              <RefreshCw size={16} color={Theme.colors.primary.blue} />
              <Text style={styles.resetButtonText}>Redefinir</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton}
              onPress={handleApply}
            >
              <Text style={styles.applyButtonText}>Aplicar Filtros</Text>
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
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  content: {
    padding: Theme.spacing.md,
    maxHeight: 500,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  filterItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  filterItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterItemText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagButton: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  selectedTagButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  tagButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  selectedTagButtonText: {
    color: Theme.colors.background.white,
  },
  footer: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
  },
  resetButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});