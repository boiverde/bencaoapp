import { StyleSheet, View, Text, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { 
  X, 
  Heart, 
  Book, 
  MessageSquare, 
  Users, 
  Shield, 
  Lightbulb,
  ChevronRight,
  Share2
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { UserInsight } from '@/utils/analyticsSystem';

interface InsightDetailModalProps {
  visible: boolean;
  insight: UserInsight | null;
  onClose: () => void;
  onShare?: () => void;
  onApply?: () => void;
}

export default function InsightDetailModal({
  visible,
  insight,
  onClose,
  onShare,
  onApply
}: InsightDetailModalProps) {
  if (!insight) return null;

  const getInsightIcon = () => {
    const iconProps = { size: 24, color: getInsightColor() };
    
    switch (insight.type) {
      case 'compatibility':
        return <Heart {...iconProps} />;
      case 'spiritual':
        return <Book {...iconProps} />;
      case 'activity':
        return <MessageSquare {...iconProps} />;
      case 'community':
        return <Users {...iconProps} />;
      case 'security':
        return <Shield {...iconProps} />;
      default:
        return <Lightbulb {...iconProps} />;
    }
  };

  const getInsightColor = () => {
    switch (insight.type) {
      case 'compatibility':
        return Theme.colors.primary.pink;
      case 'spiritual':
        return Theme.colors.primary.lilac;
      case 'activity':
        return Theme.colors.primary.blue;
      case 'community':
        return Theme.colors.status.success;
      case 'security':
        return Theme.colors.status.warning;
      default:
        return Theme.colors.primary.gold;
    }
  };

  const getInsightTypeName = () => {
    switch (insight.type) {
      case 'compatibility':
        return 'Compatibilidade';
      case 'spiritual':
        return 'Espiritual';
      case 'activity':
        return 'Atividade';
      case 'community':
        return 'Comunidade';
      case 'security':
        return 'Segurança';
      default:
        return 'Geral';
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
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
            <View style={styles.headerLeft}>
              <View style={[styles.iconContainer, { backgroundColor: getInsightColor() }]}>
                {getInsightIcon()}
              </View>
              <Text style={styles.headerTitle}>{insight.title}</Text>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.metaInfo}>
              <Text style={styles.type}>{getInsightTypeName()}</Text>
              <Text style={styles.date}>{formatDate(insight.createdAt)}</Text>
            </View>

            <Text style={styles.description}>{insight.description}</Text>

            {insight.data && Object.keys(insight.data).length > 0 && (
              <View style={styles.dataContainer}>
                <Text style={styles.dataTitle}>Dados Relevantes:</Text>
                {Object.entries(insight.data).map(([key, value]) => (
                  <View key={key} style={styles.dataRow}>
                    <Text style={styles.dataKey}>
                      {key === 'compatibilityScore' ? 'Compatibilidade' :
                       key === 'messageCount' ? 'Mensagens' :
                       key === 'prayerMinutes' ? 'Minutos de Oração' :
                       key === 'connections' ? 'Conexões' :
                       key === 'trustScore' ? 'Score de Confiança' :
                       key}:
                    </Text>
                    <Text style={styles.dataValue}>
                      {key === 'compatibilityScore' || key === 'trustScore' ? `${value}%` : value}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {insight.recommendations && insight.recommendations.length > 0 && (
              <View style={styles.recommendationsContainer}>
                <Text style={styles.recommendationsTitle}>Recomendações:</Text>
                {insight.recommendations.map((recommendation, index) => (
                  <View key={index} style={styles.recommendationItem}>
                    <View style={[styles.recommendationDot, { backgroundColor: getInsightColor() }]} />
                    <Text style={styles.recommendationText}>{recommendation}</Text>
                  </View>
                ))}
              </View>
            )}

            {insight.verse && (
              <View style={styles.verseContainer}>
                <Text style={styles.verse}>"{insight.verse}"</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {onShare && (
              <TouchableOpacity style={styles.shareButton} onPress={onShare}>
                <Share2 size={20} color={Theme.colors.text.dark} />
                <Text style={styles.shareButtonText}>Compartilhar</Text>
              </TouchableOpacity>
            )}
            
            {onApply && (
              <TouchableOpacity style={styles.applyButton} onPress={onApply}>
                <Text style={styles.applyButtonText}>Aplicar Recomendações</Text>
                <ChevronRight size={20} color={Theme.colors.background.white} />
              </TouchableOpacity>
            )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    flex: 1,
  },
  closeButton: {
    padding: Theme.spacing.xs,
  },
  content: {
    padding: Theme.spacing.md,
    maxHeight: 500,
  },
  metaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.md,
  },
  type: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  date: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 24,
    marginBottom: Theme.spacing.lg,
  },
  dataContainer: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
  },
  dataTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.xs,
  },
  dataKey: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  dataValue: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  recommendationsContainer: {
    marginBottom: Theme.spacing.lg,
  },
  recommendationsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  recommendationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  recommendationDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  recommendationText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  verseContainer: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  verse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    borderWidth: 1,
    borderColor: Theme.colors.ui.border,
  },
  shareButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.xs,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
  },
  applyButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    marginRight: Theme.spacing.xs,
  },
});