import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Image,
  TextInput,
  Alert
} from 'react-native';
import { X, Upload, Camera, CircleCheck as CheckCircle, Shield, User, Church, Users, Award, Info } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useSecurity } from '@/hooks/useSecurity';
import { VerificationRequest } from '@/utils/securitySystem';

interface SecurityVerificationModalProps {
  visible: boolean;
  onClose: () => void;
  verificationType: VerificationRequest['type'];
}

export default function SecurityVerificationModal({
  visible,
  onClose,
  verificationType
}: SecurityVerificationModalProps) {
  const [step, setStep] = useState(1);
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    email: '',
    phone: '',
    churchName: '',
    pastorName: '',
    pastorEmail: '',
    pastorPhone: ''
  });
  
  const { requestVerification } = useSecurity();

  const getVerificationTitle = () => {
    const titles = {
      identity: 'Verificação de Identidade',
      church: 'Verificação de Igreja',
      pastor: 'Referência Pastoral',
      community: 'Endosso da Comunidade'
    };
    return titles[verificationType] || 'Verificação';
  };

  const getVerificationDescription = () => {
    const descriptions = {
      identity: 'Confirme sua identidade para aumentar a confiança e segurança na plataforma.',
      church: 'Verifique sua participação em uma igreja para conectar-se com a comunidade cristã.',
      pastor: 'Obtenha uma referência do seu pastor para aumentar sua credibilidade.',
      community: 'Receba endosso de membros verificados da comunidade cristã.'
    };
    return descriptions[verificationType] || '';
  };

  const getVerificationRequirements = () => {
    const requirements = {
      identity: [
        'Documento de identidade oficial com foto (RG, CNH, Passaporte)',
        'Selfie segurando o documento',
        'Informações pessoais visíveis no documento'
      ],
      church: [
        'Carta de membro da igreja',
        'Contato do pastor para verificação',
        'Comprovante de frequência (opcional)'
      ],
      pastor: [
        'Certificado de ordenação',
        'Autorização da igreja',
        'Contato para verificação da denominação'
      ],
      community: [
        'Três referências de membros verificados',
        'Testemunho de conversão',
        'Participação ativa na comunidade'
      ]
    };
    return requirements[verificationType] || [];
  };

  const getVerificationIcon = () => {
    switch (verificationType) {
      case 'identity':
        return User;
      case 'church':
        return Church;
      case 'pastor':
        return Shield;
      case 'community':
        return Users;
      default:
        return Shield;
    }
  };

  const handleUploadDocument = () => {
    // Simulate document upload
    setIsUploading(true);
    setTimeout(() => {
      setDocuments([...documents, {
        id: Date.now().toString(),
        type: 'id_card',
        url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        verified: false,
        uploadedAt: Date.now()
      }]);
      setIsUploading(false);
    }, 2000);
  };

  const handleTakePhoto = () => {
    // Simulate taking a photo
    setIsUploading(true);
    setTimeout(() => {
      setDocuments([...documents, {
        id: Date.now().toString(),
        type: 'selfie',
        url: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
        verified: false,
        uploadedAt: Date.now()
      }]);
      setIsUploading(false);
    }, 2000);
  };

  const handleNextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmitVerification();
    }
  };

  const handlePreviousStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitVerification = async () => {
    try {
      await requestVerification(verificationType, documents);
      Alert.alert(
        'Verificação Enviada',
        'Sua solicitação de verificação foi enviada com sucesso e será analisada em breve.',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert(
        'Erro',
        'Não foi possível enviar sua solicitação. Por favor, tente novamente.',
        [{ text: 'OK' }]
      );
    }
  };

  const VerificationIcon = getVerificationIcon();

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconContainer}>
          <VerificationIcon size={24} color={Theme.colors.primary.blue} />
        </View>
        <Text style={styles.stepTitle}>Requisitos de Verificação</Text>
      </View>

      <Text style={styles.stepDescription}>
        Para completar a verificação de {getVerificationTitle().toLowerCase()}, 
        você precisará fornecer os seguintes documentos:
      </Text>

      <View style={styles.requirementsList}>
        {getVerificationRequirements().map((requirement, index) => (
          <View key={index} style={styles.requirementItem}>
            <CheckCircle size={16} color={Theme.colors.primary.blue} />
            <Text style={styles.requirementText}>{requirement}</Text>
          </View>
        ))}
      </View>

      <View style={styles.infoBox}>
        <Info size={16} color={Theme.colors.primary.blue} />
        <Text style={styles.infoText}>
          Seus documentos são tratados com segurança e usados apenas para verificação.
          Eles não serão compartilhados com outros usuários.
        </Text>
      </View>

      <View style={styles.spiritualMessage}>
        <Text style={styles.spiritualText}>
          "Tudo o que é verdadeiro, tudo o que é respeitável, tudo o que é justo, tudo o que é puro, tudo o que é amável, tudo o que é de boa fama, se alguma virtude há e se algum louvor existe, seja isso o que ocupe o vosso pensamento." - Filipenses 4:8
        </Text>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconContainer}>
          <Upload size={24} color={Theme.colors.primary.blue} />
        </View>
        <Text style={styles.stepTitle}>Envio de Documentos</Text>
      </View>

      <Text style={styles.stepDescription}>
        Envie os documentos necessários para a verificação. Você pode fazer upload de arquivos ou tirar fotos.
      </Text>

      <View style={styles.documentsList}>
        {documents.map((doc, index) => (
          <View key={doc.id} style={styles.documentItem}>
            <Image source={{ uri: doc.url }} style={styles.documentImage} />
            <View style={styles.documentInfo}>
              <Text style={styles.documentType}>
                {doc.type === 'id_card' ? 'Documento de Identidade' : 'Selfie'}
              </Text>
              <Text style={styles.documentDate}>
                {new Date(doc.uploadedAt).toLocaleDateString()}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.documentRemove}
              onPress={() => setDocuments(documents.filter((_, i) => i !== index))}
            >
              <X size={16} color={Theme.colors.status.error} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.uploadButtons}>
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleUploadDocument}
          disabled={isUploading}
        >
          <Upload size={20} color={Theme.colors.primary.blue} />
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.uploadButton}
          onPress={handleTakePhoto}
          disabled={isUploading}
        >
          <Camera size={20} color={Theme.colors.primary.blue} />
          <Text style={styles.uploadButtonText}>
            {isUploading ? 'Enviando...' : 'Tirar Foto'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Info size={16} color={Theme.colors.primary.blue} />
        <Text style={styles.infoText}>
          Certifique-se de que os documentos estão legíveis e todas as informações estão visíveis.
        </Text>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <View style={styles.stepHeader}>
        <View style={styles.stepIconContainer}>
          <Church size={24} color={Theme.colors.primary.blue} />
        </View>
        <Text style={styles.stepTitle}>Informações de Contato</Text>
      </View>

      <Text style={styles.stepDescription}>
        Forneça informações de contato para verificação. Estas informações serão usadas apenas para o processo de verificação.
      </Text>

      <View style={styles.formContainer}>
        {verificationType === 'identity' && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={contactInfo.email}
                onChangeText={(text) => setContactInfo({...contactInfo, email: text})}
                placeholder="Seu email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone</Text>
              <TextInput
                style={styles.input}
                value={contactInfo.phone}
                onChangeText={(text) => setContactInfo({...contactInfo, phone: text})}
                placeholder="Seu telefone"
                keyboardType="phone-pad"
              />
            </View>
          </>
        )}

        {(verificationType === 'church' || verificationType === 'pastor') && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome da Igreja</Text>
              <TextInput
                style={styles.input}
                value={contactInfo.churchName}
                onChangeText={(text) => setContactInfo({...contactInfo, churchName: text})}
                placeholder="Nome da sua igreja"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Nome do Pastor</Text>
              <TextInput
                style={styles.input}
                value={contactInfo.pastorName}
                onChangeText={(text) => setContactInfo({...contactInfo, pastorName: text})}
                placeholder="Nome do pastor"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email do Pastor</Text>
              <TextInput
                style={styles.input}
                value={contactInfo.pastorEmail}
                onChangeText={(text) => setContactInfo({...contactInfo, pastorEmail: text})}
                placeholder="Email do pastor"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Telefone do Pastor</Text>
              <TextInput
                style={styles.input}
                value={contactInfo.pastorPhone}
                onChangeText={(text) => setContactInfo({...contactInfo, pastorPhone: text})}
                placeholder="Telefone do pastor"
                keyboardType="phone-pad"
              />
            </View>
          </>
        )}

        {verificationType === 'community' && (
          <View style={styles.communityInfo}>
            <Text style={styles.communityText}>
              Para verificação da comunidade, você precisa ser endossado por pelo menos 3 membros já verificados. Enviaremos solicitações para os membros que você indicar.
            </Text>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Seu Testemunho (opcional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={4}
                placeholder="Compartilhe brevemente seu testemunho de fé..."
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.termsContainer}>
        <CheckCircle size={16} color={Theme.colors.primary.blue} />
        <Text style={styles.termsText}>
          Confirmo que todas as informações fornecidas são verdadeiras e precisas.
        </Text>
      </View>
    </View>
  );

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
            <Text style={styles.headerTitle}>{getVerificationTitle()}</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>{getVerificationDescription()}</Text>

          <View style={styles.stepsIndicator}>
            <View style={[styles.stepIndicator, step >= 1 && styles.activeStepIndicator]} />
            <View style={styles.stepConnector} />
            <View style={[styles.stepIndicator, step >= 2 && styles.activeStepIndicator]} />
            <View style={styles.stepConnector} />
            <View style={[styles.stepIndicator, step >= 3 && styles.activeStepIndicator]} />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </ScrollView>

          <View style={styles.footer}>
            {step > 1 && (
              <TouchableOpacity style={styles.backButton} onPress={handlePreviousStep}>
                <Text style={styles.backButtonText}>Voltar</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.nextButton,
                (step === 2 && documents.length === 0) && styles.disabledButton
              ]}
              onPress={handleNextStep}
              disabled={step === 2 && documents.length === 0}
            >
              <Text style={styles.nextButtonText}>
                {step === 3 ? 'Enviar Verificação' : 'Próximo'}
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
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
    paddingHorizontal: Theme.spacing.md,
    paddingTop: Theme.spacing.md,
  },
  stepsIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
  },
  stepIndicator: {
    width: 12,
    height: 12,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.ui.disabled,
  },
  activeStepIndicator: {
    backgroundColor: Theme.colors.primary.blue,
  },
  stepConnector: {
    width: 40,
    height: 2,
    backgroundColor: Theme.colors.ui.disabled,
  },
  content: {
    maxHeight: 500,
    paddingHorizontal: Theme.spacing.md,
  },
  stepContainer: {
    paddingVertical: Theme.spacing.md,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  stepIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  stepTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  stepDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    lineHeight: 22,
    marginBottom: Theme.spacing.lg,
  },
  requirementsList: {
    marginBottom: Theme.spacing.lg,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  requirementText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue + '10',
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
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
  documentsList: {
    marginBottom: Theme.spacing.lg,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
  },
  documentImage: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.md,
  },
  documentInfo: {
    flex: 1,
  },
  documentType: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  documentDate: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  documentRemove: {
    padding: Theme.spacing.xs,
  },
  uploadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Theme.colors.primary.blue + '20',
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    flex: 0.48,
  },
  uploadButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.sm,
  },
  formContainer: {
    marginBottom: Theme.spacing.lg,
  },
  inputGroup: {
    marginBottom: Theme.spacing.md,
  },
  inputLabel: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  input: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  communityInfo: {
    marginBottom: Theme.spacing.md,
  },
  communityText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
    marginBottom: Theme.spacing.md,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.lg,
  },
  termsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  backButton: {
    paddingVertical: Theme.spacing.md,
    paddingHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.primary.blue,
  },
  backButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
  },
  nextButton: {
    flex: 1,
    backgroundColor: Theme.colors.primary.blue,
    paddingVertical: Theme.spacing.md,
    borderRadius: Theme.borderRadius.md,
    alignItems: 'center',
    marginLeft: Theme.spacing.md,
  },
  nextButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
  },
  disabledButton: {
    backgroundColor: Theme.colors.ui.disabled,
  },
});