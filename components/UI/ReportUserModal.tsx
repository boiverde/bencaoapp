import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  Image,
  Alert
} from 'react-native';
import { X, TriangleAlert as AlertTriangle, Upload, Camera, CircleCheck as CheckCircle, Shield, MessageSquare, User, Church } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSecurity } from '@/hooks/useSecurity';
import { SecurityReport } from '@/utils/securitySystem';

interface ReportUserModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
  userImage?: string;
}

export default function ReportUserModal({
  visible,
  onClose,
  userId,
  userName,
  userImage
}: ReportUserModalProps) {
  const [reportType, setReportType] = useState<SecurityReport['type'] | null>(null);
  const [description, setDescription] = useState('');
  const [evidence, setEvidence] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { reportUser } = useSecurity();

  const reportTypes = [
    {
      type: 'fake_profile' as const,
      title: 'Perfil Falso',
      description: 'Este perfil não representa uma pessoa real',
      icon: User
    },
    {
      type: 'inappropriate_content' as const,
      title: 'Conteúdo Inadequado',
      description: 'Compartilhamento de conteúdo impróprio ou ofensivo',
      icon: AlertTriangle
    },
    {
      type: 'harassment' as const,
      title: 'Assédio',
      description: 'Comportamento abusivo ou intimidador',
      icon: MessageSquare
    },
    {
      type: 'scam' as const,
      title: 'Golpe',
      description: 'Tentativa de fraude ou enganação',
      icon: AlertTriangle
    },
    {
      type: 'false_testimony' as const,
      title: 'Falso Testemunho',
      description: 'Testemunho falso ou enganoso',
      icon: Church
    },
    {
      type: 'doctrinal_concern' as const,
      title: 'Preocupação Doutrinária',
      description: 'Ensino contrário às doutrinas cristãs fundamentais',
      icon: Church
    }
  ];

  const handleAddEvidence = () => {
    // Simulate adding evidence
    setEvidence([...evidence, {
      id: Date.now().toString(),
      type: 'screenshot',
      content: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      timestamp: Date.now(),
      verified: false
    }]);
  };

  const handleSubmitReport = async () => {
    if (!reportType) {
      Alert.alert('Erro', 'Por favor, selecione um tipo de denúncia');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Erro', 'Por favor, forneça uma descrição da denúncia');
      return;
    }

    setIsSubmitting(true);

    try {
      await reportUser(userId, reportType, description, evidence);
      
      Alert.alert(
        'Denúncia Enviada',
        'Sua denúncia foi enviada com sucesso e será analisada pela equipe de moderação.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível enviar sua denúncia. Por favor, tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setReportType(null);
    setDescription('');
    setEvidence([]);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
            <Text style={styles.headerTitle}>Denunciar Usuário</Text>
            <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.userInfo}>
              {userImage ? (
                <Image source={{ uri: userImage }} style={styles.userImage} />
              ) : (
                <View style={styles.userImagePlaceholder}>
                  <User size={24} color={Theme.colors.text.light} />
                </View>
              )}
              <Text style={styles.userName}>{userName}</Text>
            </View>

            <Text style={styles.sectionTitle}>Motivo da Denúncia</Text>
            <Text style={styles.sectionDescription}>
              Selecione o motivo que melhor descreve sua preocupação
            </Text>

            <View style={styles.reportTypesList}>
              {reportTypes.map((type) => (
                <TouchableOpacity
                  key={type.type}
                  style={[
                    styles.reportTypeItem,
                    reportType === type.type && styles.selectedReportType
                  ]}
                  onPress={() => setReportType(type.type)}
                >
                  <View style={[
                    styles.reportTypeIcon,
                    reportType === type.type && styles.selectedReportTypeIcon
                  ]}>
                    <type.icon 
                      size={20} 
                      color={reportType === type.type ? Theme.colors.background.white : Theme.colors.primary.blue} 
                    />
                  </View>
                  <View style={styles.reportTypeInfo}>
                    <Text style={[
                      styles.reportTypeTitle,
                      reportType === type.type && styles.selectedReportTypeText
                    ]}>
                      {type.title}
                    </Text>
                    <Text style={styles.reportTypeDescription}>
                      {type.description}
                    </Text>
                  </View>
                  {reportType === type.type && (
                    <CheckCircle size={20} color={Theme.colors.primary.blue} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Descrição</Text>
            <Text style={styles.sectionDescription}>
              Forneça detalhes sobre o problema
            </Text>

            <TextInput
              style={styles.descriptionInput}
              multiline
              numberOfLines={4}
              placeholder="Descreva o problema em detalhes..."
              value={description}
              onChangeText={setDescription}
              textAlignVertical="top"
            />

            <Text style={styles.sectionTitle}>Evidências (opcional)</Text>
            <Text style={styles.sectionDescription}>
              Adicione capturas de tela ou outras evidências
            </Text>

            <View style={styles.evidenceList}>
              {evidence.map((item, index) => (
                <View key={item.id} style={styles.evidenceItem}>
                  <Image source={{ uri: item.content }} style={styles.evidenceImage} />
                  <TouchableOpacity 
                    style={styles.evidenceRemove}
                    onPress={() => setEvidence(evidence.filter((_, i) => i !== index))}
                  >
                    <X size={16} color={Theme.colors.background.white} />
                  </TouchableOpacity>
                </View>
              ))}
              
              <TouchableOpacity style={styles.addEvidenceButton} onPress={handleAddEvidence}>
                <Upload size={24} color={Theme.colors.text.medium} />
                <Text style={styles.addEvidenceText}>Adicionar Evidência</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.infoBox}>
              <Shield size={16} color={Theme.colors.primary.blue} />
              <Text style={styles.infoText}>
                Todas as denúncias são tratadas com confidencialidade. Denúncias falsas podem resultar em restrições à sua conta.
              </Text>
            </View>

            <View style={styles.spiritualMessage}>
              <Text style={styles.spiritualText}>
                "Não julgueis, para que não sejais julgados. Porque com o juízo com que julgardes sereis julgados, e com a medida com que tiverdes medido vos hão de medir a vós." - Mateus 7:1-2
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!reportType || !description.trim()) && styles.disabledButton
              ]}
              onPress={handleSubmitReport}
              disabled={!reportType || !description.trim() || isSubmitting}
            >
              <Text style={styles.submitButtonText}>
                {isSubmitting ? 'Enviando...' : 'Enviar Denúncia'}
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
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
    backgroundColor: Theme.colors.background.light,
    padding: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
  },
  userImage: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    marginRight: Theme.spacing.md,
  },
  userImagePlaceholder: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.ui.disabled,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  userName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  sectionDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
  },
  reportTypesList: {
    marginBottom: Theme.spacing.lg,
  },
  reportTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  selectedReportType: {
    backgroundColor: Theme.colors.primary.blue + '20',
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
  },
  reportTypeIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  selectedReportTypeIcon: {
    backgroundColor: Theme.colors.primary.blue,
  },
  reportTypeInfo: {
    flex: 1,
  },
  reportTypeTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  selectedReportTypeText: {
    color: Theme.colors.primary.blue,
  },
  reportTypeDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  descriptionInput: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    height: 120,
    marginBottom: Theme.spacing.lg,
  },
  evidenceList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: Theme.spacing.lg,
  },
  evidenceItem: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    position: 'relative',
  },
  evidenceImage: {
    width: '100%',
    height: '100%',
    borderRadius: Theme.borderRadius.md,
  },
  evidenceRemove: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  addEvidenceButton: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Theme.colors.ui.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addEvidenceText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.xs,
    textAlign: 'center',
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
    flexDirection: 'row',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
    borderWidth: 1,
    borderColor: Theme.colors.ui.border,
    borderRadius: Theme.borderRadius.md,
  },
  cancelButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  submitButton: {
    flex: 2,
    backgroundColor: Theme.colors.status.error,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderRadius: Theme.borderRadius.md,
  },
  submitButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  disabledButton: {
    backgroundColor: Theme.colors.ui.disabled,
  },
});