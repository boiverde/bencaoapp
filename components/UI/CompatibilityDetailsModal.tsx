import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Heart, Users, Church, Star, Chrome as Home, Settings, TrendingUp, TriangleAlert as AlertTriangle, Lightbulb, MessageSquare } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { UserProfile, CompatibilityScore, CompatibilityAlgorithm } from '@/utils/compatibilityAlgorithm';

interface CompatibilityDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  user: UserProfile;
  score: CompatibilityScore;
  onSendMessage?: () => void;
}

const { width } = Dimensions.get('window');

export default function CompatibilityDetailsModal({ 
  visible, 
  onClose, 
  user, 
  score,
  onSendMessage 
}: CompatibilityDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'breakdown' | 'insights'>('overview');
  
  const compatibilityLevel = CompatibilityAlgorithm.getCompatibilityLevel(score.overall);
  const compatibilityColor = CompatibilityAlgorithm.getCompatibilityColor(score.overall);

  const categoryIcons = {
    demographic: Home,
    religious: Church,
    personality: Star,
    values: Heart,
    lifestyle: Settings,
    preferences: Users,
  };

  const categoryNames = {
    demographic: 'Demografia',
    religious: 'Religioso',
    personality: 'Personalidade',
    values: 'Valores',
    lifestyle: 'Estilo de Vida',
    preferences: 'Preferências',
  };

  const categoryDescriptions = {
    demographic: 'Idade, localização, educação e idiomas',
    religious: 'Denominação, frequência na igreja e importância da fé',
    personality: 'Traços de personalidade e características comportamentais',
    values: 'Prioridades de vida e valores fundamentais',
    lifestyle: 'Hábitos, exercícios e preferências sociais',
    preferences: 'Critérios de busca e compatibilidade desejada',
  };

  const renderProgressCircle = (value: number, size: number = 80, strokeWidth: number = 8) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (value / 100) * circumference;
    const color = CompatibilityAlgorithm.getCompatibilityColor(value);

    return (
      <View style={[styles.progressCircle, { width: size, height: size }]}>
        <svg width={size} height={size} style={styles.svg}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Theme.colors.ui.disabled}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </svg>
        <View style={styles.progressCircleContent}>
          <Text style={[styles.progressCircleValue, { color }]}>
            {value}%
          </Text>
        </View>
      </View>
    );
  };

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.userHeader}>
        <Image source={{ uri: user.photos[0] }} style={styles.userImage} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}, {user.age}</Text>
          <Text style={styles.userLocation}>{user.location.city}, {user.location.state}</Text>
          <Text style={styles.userDenomination}>{user.denomination}</Text>
        </View>
      </View>

      <View style={styles.overallScoreSection}>
        <LinearGradient
          colors={[compatibilityColor + '20', compatibilityColor + '10']}
          style={styles.scoreGradient}
        >
          <View style={styles.scoreContent}>
            {renderProgressCircle(score.overall, 120, 12)}
            <View style={styles.scoreText}>
              <Text style={styles.scoreLevel}>{compatibilityLevel}</Text>
              <Text style={styles.scoreDescription}>Compatibilidade</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      {score.reasons.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={20} color={Theme.colors.status.success} />
            <Text style={styles.sectionTitle}>Pontos Fortes</Text>
          </View>
          {score.reasons.map((reason, index) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.listDot, { backgroundColor: Theme.colors.status.success }]} />
              <Text style={styles.listText}>{reason}</Text>
            </View>
          ))}
        </View>
      )}

      {score.concerns.length > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertTriangle size={20} color={Theme.colors.status.warning} />
            <Text style={styles.sectionTitle}>Pontos de Atenção</Text>
          </View>
          {score.concerns.map((concern, index) => (
            <View key={index} style={styles.listItem}>
              <View style={[styles.listDot, { backgroundColor: Theme.colors.status.warning }]} />
              <Text style={styles.listText}>{concern}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );

  const renderBreakdownTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.tabDescription}>
        Análise detalhada de cada categoria de compatibilidade
      </Text>
      
      {Object.entries(score.breakdown).map(([category, value]) => {
        const IconComponent = categoryIcons[category];
        const categoryColor = CompatibilityAlgorithm.getCompatibilityColor(value);
        
        return (
          <View key={category} style={styles.categoryCard}>
            <View style={styles.categoryCardHeader}>
              <View style={[styles.categoryCardIcon, { backgroundColor: categoryColor + '20' }]}>
                <IconComponent size={24} color={categoryColor} />
              </View>
              <View style={styles.categoryCardInfo}>
                <Text style={styles.categoryCardName}>
                  {categoryNames[category]}
                </Text>
                <Text style={styles.categoryCardDescription}>
                  {categoryDescriptions[category]}
                </Text>
              </View>
              {renderProgressCircle(value, 60, 6)}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );

  const renderInsightsTab = () => {
    const bestCategory = Object.entries(score.breakdown)
      .sort(([,a], [,b]) => b - a)[0];
    const worstCategory = Object.entries(score.breakdown)
      .sort(([,a], [,b]) => a - b)[0];

    return (
      <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.tabDescription}>
          Insights personalizados baseados na análise de compatibilidade
        </Text>

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <TrendingUp size={20} color={Theme.colors.status.success} />
            <Text style={styles.insightTitle}>Maior Compatibilidade</Text>
          </View>
          <Text style={styles.insightText}>
            Vocês têm maior afinidade em <Text style={styles.insightHighlight}>
            {categoryNames[bestCategory[0]].toLowerCase()}</Text> ({bestCategory[1]}%). 
            Isso indica uma base sólida para construir uma conexão duradoura.
          </Text>
        </View>

        {worstCategory[1] < 70 && (
          <View style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <AlertTriangle size={20} color={Theme.colors.status.warning} />
              <Text style={styles.insightTitle}>Área de Atenção</Text>
            </View>
            <Text style={styles.insightText}>
              A categoria <Text style={styles.insightHighlight}>
              {categoryNames[worstCategory[0]].toLowerCase()}</Text> ({worstCategory[1]}%) 
              pode precisar de mais diálogo e compreensão mútua.
            </Text>
          </View>
        )}

        <View style={styles.insightCard}>
          <View style={styles.insightHeader}>
            <Lightbulb size={20} color={Theme.colors.primary.gold} />
            <Text style={styles.insightTitle}>Dica de Conexão</Text>
          </View>
          <Text style={styles.insightText}>
            {score.overall >= 80 
              ? 'Vocês têm uma compatibilidade excepcional! Considerem marcar um encontro em um ambiente que reflita seus valores compartilhados.'
              : score.overall >= 70
              ? 'Há um bom potencial de conexão. Conversem sobre seus valores e objetivos de vida para fortalecer a compatibilidade.'
              : 'Embora existam diferenças, elas podem ser complementares. Foquem no que têm em comum e sejam abertos ao diálogo.'
            }
          </Text>
        </View>

        <View style={styles.verseCard}>
          <Text style={styles.verseText}>
            "Melhor é serem dois do que um, porque têm melhor paga do seu trabalho. 
            Porque se um cair, o outro levanta o seu companheiro."
          </Text>
          <Text style={styles.verseReference}>Eclesiastes 4:9-10</Text>
        </View>
      </ScrollView>
    );
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
            <Text style={styles.headerTitle}>Análise de Compatibilidade</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          </View>

          <View style={styles.tabBar}>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
              onPress={() => setActiveTab('overview')}
            >
              <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
                Visão Geral
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'breakdown' && styles.activeTab]}
              onPress={() => setActiveTab('breakdown')}
            >
              <Text style={[styles.tabText, activeTab === 'breakdown' && styles.activeTabText]}>
                Detalhes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === 'insights' && styles.activeTab]}
              onPress={() => setActiveTab('insights')}
            >
              <Text style={[styles.tabText, activeTab === 'insights' && styles.activeTabText]}>
                Insights
              </Text>
            </TouchableOpacity>
          </View>

          {activeTab === 'overview' && renderOverviewTab()}
          {activeTab === 'breakdown' && renderBreakdownTab()}
          {activeTab === 'insights' && renderInsightsTab()}

          {onSendMessage && (
            <View style={styles.footer}>
              <TouchableOpacity style={styles.messageButton} onPress={onSendMessage}>
                <MessageSquare size={20} color="#fff" />
                <Text style={styles.messageButtonText}>Enviar Mensagem</Text>
              </TouchableOpacity>
            </View>
          )}
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
    minHeight: '70%',
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
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary.blue,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  activeTabText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
  tabContent: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  tabDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.lg,
    textAlign: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.lg,
  },
  userImage: {
    width: 60,
    height: 60,
    borderRadius: Theme.borderRadius.circle,
    marginRight: Theme.spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  userLocation: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  userDenomination: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
  },
  overallScoreSection: {
    marginBottom: Theme.spacing.lg,
  },
  scoreGradient: {
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreText: {
    alignItems: 'flex-end',
  },
  scoreLevel: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
  },
  scoreDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  progressCircle: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  svg: {
    position: 'absolute',
  },
  progressCircleContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircleValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.md,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  listDot: {
    width: 6,
    height: 6,
    borderRadius: Theme.borderRadius.circle,
    marginTop: 6,
    marginRight: Theme.spacing.sm,
  },
  listText: {
    flex: 1,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 18,
  },
  categoryCard: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  categoryCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryCardIcon: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  categoryCardInfo: {
    flex: 1,
  },
  categoryCardName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  categoryCardDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 16,
  },
  insightCard: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  insightTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  insightText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
  },
  insightHighlight: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
  verseCard: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Theme.colors.primary.lilac,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    marginBottom: Theme.spacing.sm,
  },
  verseReference: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.lilac,
    textAlign: 'right',
  },
  footer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  messageButton: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  messageButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.sm,
  },
});