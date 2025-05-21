import { useState } from 'react';
import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Theme from '@/constants/Theme';
import { X, FileSliders as Sliders } from 'lucide-react-native';
import { Slider } from 'react-native-gesture-handler';

interface FilterProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: any) => void;
}

export default function Filter({ visible, onClose, onApply }: FilterProps) {
  const [ageRange, setAgeRange] = useState([18, 40]);
  const [distance, setDistance] = useState(50);
  const [selectedDenominations, setSelectedDenominations] = useState(['Todas']);
  
  const denominations = [
    'Todas',
    'Batista',
    'Católica',
    'Presbiteriana',
    'Metodista',
    'Pentecostal',
    'Adventista',
    'Luterana',
    'Anglicana',
  ];
  
  const handleDenominationSelect = (denomination: string) => {
    if (denomination === 'Todas') {
      setSelectedDenominations(['Todas']);
      return;
    }
    
    let updated = [...selectedDenominations];
    
    if (updated.includes(denomination)) {
      updated = updated.filter(item => item !== denomination);
    } else {
      updated = updated.filter(item => item !== 'Todas');
      updated.push(denomination);
    }
    
    if (updated.length === 0) {
      updated = ['Todas'];
    } else if (updated.length === denominations.length - 1) {
      updated = ['Todas'];
    }
    
    setSelectedDenominations(updated);
  };
  
  const handleApply = () => {
    onApply({
      ageRange,
      distance,
      denominations: selectedDenominations,
    });
    onClose();
  };
  
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.header}>
            <View style={styles.headerTitleContainer}>
              <Sliders size={20} color={Theme.colors.text.dark} />
              <Text style={styles.headerTitle}>Filtros</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Faixa etária</Text>
              <View style={styles.ageContainer}>
                <Text style={styles.ageText}>{ageRange[0]} anos</Text>
                <Text style={styles.ageText}>{ageRange[1]} anos</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={70}
                step={1}
                value={ageRange[0]}
                minimumTrackTintColor={Theme.colors.primary.blue}
                maximumTrackTintColor={Theme.colors.ui.disabled}
                thumbTintColor={Theme.colors.primary.blue}
                onValueChange={(value) => setAgeRange([value, ageRange[1]])}
              />
              <Slider
                style={styles.slider}
                minimumValue={18}
                maximumValue={70}
                step={1}
                value={ageRange[1]}
                minimumTrackTintColor={Theme.colors.primary.blue}
                maximumTrackTintColor={Theme.colors.ui.disabled}
                thumbTintColor={Theme.colors.primary.blue}
                onValueChange={(value) => setAgeRange([ageRange[0], value])}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Distância máxima</Text>
              <View style={styles.distanceContainer}>
                <Text style={styles.distanceText}>{distance} km</Text>
              </View>
              <Slider
                style={styles.slider}
                minimumValue={1}
                maximumValue={100}
                step={1}
                value={distance}
                minimumTrackTintColor={Theme.colors.primary.blue}
                maximumTrackTintColor={Theme.colors.ui.disabled}
                thumbTintColor={Theme.colors.primary.blue}
                onValueChange={setDistance}
              />
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Denominações</Text>
              <View style={styles.denominationsContainer}>
                {denominations.map((denomination) => (
                  <TouchableOpacity
                    key={denomination}
                    style={[
                      styles.denominationButton,
                      selectedDenominations.includes(denomination) && styles.denominationButtonSelected
                    ]}
                    onPress={() => handleDenominationSelect(denomination)}
                  >
                    <Text
                      style={[
                        styles.denominationText,
                        selectedDenominations.includes(denomination) && styles.denominationTextSelected
                      ]}
                    >
                      {denomination}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.footer}>
            <TouchableOpacity style={styles.resetButton} onPress={() => {
              setAgeRange([18, 40]);
              setDistance(50);
              setSelectedDenominations(['Todas']);
            }}>
              <Text style={styles.resetButtonText}>Limpar Filtros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  content: {
    backgroundColor: Theme.colors.background.white,
    borderTopLeftRadius: Theme.borderRadius.lg,
    borderTopRightRadius: Theme.borderRadius.lg,
    paddingBottom: Theme.spacing.lg,
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
  scrollContent: {
    padding: Theme.spacing.md,
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
  ageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.sm,
  },
  ageText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  distanceContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: Theme.spacing.sm,
  },
  distanceText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
  },
  denominationsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  denominationButton: {
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    backgroundColor: Theme.colors.background.light,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  denominationButtonSelected: {
    backgroundColor: Theme.colors.primary.blue,
  },
  denominationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  denominationTextSelected: {
    color: Theme.colors.background.white,
  },
  footer: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  resetButton: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
  },
  resetButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
  },
  applyButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary.blue,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  applyButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
});