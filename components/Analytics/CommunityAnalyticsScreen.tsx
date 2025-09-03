import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ChevronLeft, 
  Users, 
  Calendar, 
  Clock, 
  HandHelping as PrayingHands,
  Book,
  Map,
  Church
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useAnalytics } from '@/hooks/useAnalytics';
import ChartCard from './ChartCard';

interface CommunityAnalyticsScreenProps {
  onBack: () => void;
}

export default function CommunityAnalyticsScreen({ onBack }: CommunityAnalyticsScreenProps) {
  const { communityAnalytics } = useAnalytics();

  if (!communityAnalytics) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={Theme.colors.text.dark} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Análise da Comunidade</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <Users size={48} color={Theme.colors.text.light} />
          <Text style={styles.loadingText}>Carregando análises da comunidade...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Análise da Comunidade</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.overviewCard}>
          <Text style={styles.overviewTitle}>Visão Geral da Comunidade</Text>
          <Text style={styles.totalUsers}>{communityAnalytics.totalUsers.toLocaleString()}</Text>
          <Text style={styles.totalUsersLabel}>Membros Totais</Text>
          
          <View style={styles.activeUsersContainer}>
            <View style={styles.activeUserItem}>
              <Text style={styles.activeUserValue}>
                {communityAnalytics.activeUsers.daily.toLocaleString()}
              </Text>
              <Text style={styles.activeUserLabel}>Diários</Text>
            </View>
            
            <View style={styles.activeUserItem}>
              <Text style={styles.activeUserValue}>
                {communityAnalytics.activeUsers.weekly.toLocaleString()}
              </Text>
              <Text style={styles.activeUserLabel}>Semanais</Text>
            </View>
            
            <View style={styles.activeUserItem}>
              <Text style={styles.activeUserValue}>
                {communityAnalytics.activeUsers.monthly.toLocaleString()}
              </Text>
              <Text style={styles.activeUserLabel}>Mensais</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dados Demográficos</Text>
        
        <ChartCard
          title="Faixas Etárias"
          type="pie"
          data={communityAnalytics.demographics.ageGroups.map(group => ({
            label: group.range,
            value: group.percentage
          }))}
          color={Theme.colors.primary.blue}
        />
        
        <ChartCard
          title="Distribuição por Gênero"
          type="bar"
          data={communityAnalytics.demographics.genderDistribution.map(item => ({
            label: item.gender,
            value: item.percentage
          }))}
          color={Theme.colors.primary.pink}
        />
        
        <ChartCard
          title="Principais Denominações"
          type="bar"
          data={communityAnalytics.demographics.topDenominations.map(item => ({
            label: item.name,
            value: item.percentage
          }))}
          color={Theme.colors.primary.lilac}
        />
        
        <ChartCard
          title="Principais Localizações"
          type="bar"
          data={communityAnalytics.demographics.topLocations.map(item => ({
            label: item.location,
            value: item.percentage
          }))}
          color={Theme.colors.primary.gold}
        />

        <Text style={styles.sectionTitle}>Engajamento</Text>
        
        <View style={styles.engagementGrid}>
          <View style={styles.engagementCard}>
            <Clock size={24} color={Theme.colors.primary.blue} />
            <Text style={styles.engagementValue}>
              {communityAnalytics.engagement.averageSessionDuration}min
            </Text>
            <Text style={styles.engagementLabel}>Tempo Médio por Sessão</Text>
          </View>
          
          <View style={styles.engagementCard}>
            <Calendar size={24} color={Theme.colors.primary.lilac} />
            <Text style={styles.engagementValue}>
              {communityAnalytics.engagement.averageSessionsPerUser}
            </Text>
            <Text style={styles.engagementLabel}>Sessões por Usuário</Text>
          </View>
          
          <View style={styles.engagementCard}>
            <Users size={24} color={Theme.colors.primary.pink} />
            <Text style={styles.engagementValue}>
              {communityAnalytics.engagement.retentionRate}%
            </Text>
            <Text style={styles.engagementLabel}>Taxa de Retenção</Text>
          </View>
          
          <View style={styles.engagementCard}>
            <Map size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.engagementValue}>
              {communityAnalytics.engagement.churnRate}%
            </Text>
            <Text style={styles.engagementLabel}>Taxa de Abandono</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Atividade Espiritual</Text>
        
        <View style={styles.spiritualGrid}>
          <View style={styles.spiritualCard}>
            <PrayingHands size={24} color={Theme.colors.primary.blue} />
            <Text style={styles.spiritualValue}>
              {communityAnalytics.spiritual.totalPrayerMinutes.toLocaleString()}
            </Text>
            <Text style={styles.spiritualLabel}>Minutos de Oração</Text>
          </View>
          
          <View style={styles.spiritualCard}>
            <PrayingHands size={24} color={Theme.colors.primary.lilac} />
            <Text style={styles.spiritualValue}>
              {communityAnalytics.spiritual.totalPrayerRequests.toLocaleString()}
            </Text>
            <Text style={styles.spiritualLabel}>Pedidos de Oração</Text>
          </View>
          
          <View style={styles.spiritualCard}>
            <Church size={24} color={Theme.colors.primary.pink} />
            <Text style={styles.spiritualValue}>
              {communityAnalytics.spiritual.answeredPrayerPercentage}%
            </Text>
            <Text style={styles.spiritualLabel}>Orações Respondidas</Text>
          </View>
          
          <View style={styles.spiritualCard}>
            <Book size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.spiritualValue}>
              {communityAnalytics.spiritual.averageDailyVerseReads}
            </Text>
            <Text style={styles.spiritualLabel}>Versículos por Dia</Text>
          </View>
        </View>

        <View style={styles.spiritualMessage}>
          <Text style={styles.spiritualText}>
            "Assim resplandeça a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem o vosso Pai, que está nos céus." - Mateus 5:16
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  backButton: {
    padding: Theme.spacing.xs,
  },
  headerTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  placeholder: {
    width: 24,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  loadingText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    marginTop: Theme.spacing.md,
  },
  content: {
    padding: Theme.spacing.md,
  },
  overviewCard: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
    alignItems: 'center',
    ...Theme.shadows.small,
  },
  overviewTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  totalUsers: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: 36,
    color: Theme.colors.primary.blue,
  },
  totalUsersLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
  },
  activeUsersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Theme.spacing.sm,
  },
  activeUserItem: {
    alignItems: 'center',
  },
  activeUserValue: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  activeUserLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  engagementGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  engagementCard: {
    width: '48%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  engagementValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginVertical: Theme.spacing.sm,
  },
  engagementLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
  spiritualGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  spiritualCard: {
    width: '48%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  spiritualValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginVertical: Theme.spacing.sm,
  },
  spiritualLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  spiritualText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    lineHeight: 20,
    textAlign: 'center',
  },
});