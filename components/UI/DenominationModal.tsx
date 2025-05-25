import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import Theme from '@/constants/Theme';
import { X, Check } from 'lucide-react-native';

interface DenominationModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (denomination: string) => void;
  selectedDenomination?: string;
}

const DENOMINATIONS = [
  'Adventista do Sétimo dia',
  'Assembleia de Deus',
  'Avivamento da Fé',
  'Batista',
  'Bola de Neve Church',
  'Casa da Benção',
  'Católica',
  'Congregação Cristã no Brasil',
  'Congregacional',
  'Deus é Amor',
  'Fonte da Vida',
  'Igreja Adventista da Promessa',
  'Internacional da Graça de Deus',
  'Lagoinha',
  'Luterana',
  'Maranata',
  'Metodista',
  'Mundial do Poder de Deus',
  'O Brasil Para Cristo',
  'Paz e Vida',
  'Presbiteriana',
  'Quadrangular',
  'Renascer em Cristo',
  'Santos dos Últimos Dias',
  'Sara Nossa Terra',
  'Universal do Reino de Deus',
  'Outra'
].sort((a, b) => a.localeCompare(b));

export default function DenominationModal({ visible, onClose, onSelect, selectedDenomination }: DenominationModalProps) {
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
            <Text style={styles.headerTitle}>Denominação</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.denominationList}>
            {DENOMINATIONS.map((denomination) => (
              <TouchableOpacity
                key={denomination}
                style={styles.denominationItem}
                onPress={() => {
                  onSelect(denomination);
                  onClose();
                }}
              >
                <Text style={[
                  styles.denominationText,
                  selectedDenomination === denomination && styles.denominationTextSelected
                ]}>
                  {denomination}
                </Text>
                {selectedDenomination === denomination && (
                  <Check size={20} color={Theme.colors.primary.blue} />
                )}
              </TouchableOpacity>
            ))}
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
  denominationList: {
    padding: Theme.spacing.md,
  },
  denominationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  denominationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  denominationTextSelected: {
    color: Theme.colors.primary.blue,
    fontFamily: Theme.typography.fontFamily.subheading,
  },
});