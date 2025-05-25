import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Theme from '@/constants/Theme';
import { X, Check, Search, MapPin } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { ESTADOS_CIDADES } from '@/constants/Location';

interface LocationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: { state: string; city: string }) => void;
  selectedState?: string;
  selectedCity?: string;
}

export default function LocationModal({ visible, onClose, onSelect, selectedState, selectedCity }: LocationModalProps) {
  const [activeTab, setActiveTab] = useState<'state' | 'city'>('state');
  const [searchQuery, setSearchQuery] = useState('');
  const [tempState, setTempState] = useState(selectedState);

  const filteredStates = useMemo(() => {
    return Object.keys(ESTADOS_CIDADES).filter(state =>
      state.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredCities = useMemo(() => {
    if (!tempState) return [];
    return ESTADOS_CIDADES[tempState].filter(city =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [tempState, searchQuery]);

  const handleStateSelect = (state: string) => {
    setTempState(state);
    setSearchQuery('');
    setActiveTab('city');
  };

  const handleCitySelect = (city: string) => {
    if (tempState) {
      onSelect({ state: tempState, city });
      onClose();
    }
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
            <Text style={styles.headerTitle}>
              {activeTab === 'state' ? 'Selecione o Estado' : 'Selecione a Cidade'}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.searchContainer}>
            <Search size={20} color={Theme.colors.text.medium} />
            <TextInput
              style={styles.searchInput}
              placeholder={`Buscar ${activeTab === 'state' ? 'estado' : 'cidade'}...`}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          {activeTab === 'city' && (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => {
                setActiveTab('state');
                setSearchQuery('');
              }}
            >
              <Text style={styles.backButtonText}>← Voltar para Estados</Text>
            </TouchableOpacity>
          )}

          <ScrollView style={styles.list}>
            {activeTab === 'state' ? (
              filteredStates.map((state) => (
                <TouchableOpacity
                  key={state}
                  style={styles.item}
                  onPress={() => handleStateSelect(state)}
                >
                  <Text style={[
                    styles.itemText,
                    selectedState === state && styles.itemTextSelected
                  ]}>
                    {state}
                  </Text>
                  {selectedState === state && (
                    <Check size={20} color={Theme.colors.primary.blue} />
                  )}
                </TouchableOpacity>
              ))
            ) : (
              filteredCities.map((city) => (
                <TouchableOpacity
                  key={city}
                  style={styles.item}
                  onPress={() => handleCitySelect(city)}
                >
                  <Text style={[
                    styles.itemText,
                    selectedCity === city && styles.itemTextSelected
                  ]}>
                    {city}
                  </Text>
                  {selectedCity === city && (
                    <Check size={20} color={Theme.colors.primary.blue} />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
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
  backButton: {
    padding: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  backButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
  },
  list: {
    padding: Theme.spacing.md,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  itemText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  itemTextSelected: {
    color: Theme.colors.primary.blue,
    fontFamily: Theme.typography.fontFamily.subheading,
  },
});