import { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChartBar as BarChart2, ChartPie as PieChart, TrendingUp, Heart, Book, MessageSquare, Users, ChevronLeft, Calendar, Clock, Eye, HandHelping as PrayingHands } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { AnalyticsDashboard as DashboardData } from '@/utils/analyticsSystem';
import { useAnalytics } from '@/hooks/useAnalytics';
import StatCard from './StatCard';
import ChartCard from './ChartCard';

interface AnalyticsDashboardProps {
  onBack?: () => void;
}

export default function AnalyticsDashboard({ onBack }: AnalyticsDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'connections' | 'spiritual' | 'activity'>('overview');
  const { dashboard, refreshDashboard, isLoading } = useAnalytics();

  if (!dashboard) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ChevronLeft size={24} color={Theme.colors.text.dark} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Análises</Text>
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.loadingContainer}>
          <BarChart2 size={48} color={Theme.colors.text.light} />
          <Text style={styles.loadingText}>Carregando análises...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Resumo</Text>
      
      <View style={styles.statsGrid}>
        <StatCard
          title="Conexões"
          value={dashboard.connectionStats.totalConnections.toString()}
          icon={Heart}
          color={Theme.colors.primary.pink}
          trend={dashboard.connectionStats.newConnectionsThisWeek > 0 ? 'up' : 'neutral'}
          trendValue={`${dashboard.connectionStats.newConnectionsThisWeek} novas`}
        />
        
        <StatCard
          title="Oração"
          value={`${dashboard.spiritualStats.prayerMinutes}min`}
          icon={PrayingHands}
          color={Theme.colors.primary.blue}
          trend="up"
          trendValue="Crescendo"
        />
        
        <StatCard
          title="Mensagens"
          value={dashboard.activityStats.messagesExchanged.toString()}
          icon={MessageSquare}
          color={Theme.colors.primary.lilac}
          trend={dashboard.activityStats.dailyActiveStreak > 3 ? 'up' : 'neutral'}
          trendValue={`${dashboard.activityStats.dailyActiveStreak} dias ativos`}
        />
        
        <StatCard
          title="Comunidade"
          value={dashboard.communityStats.communityRank.toString()}
          icon={Users}
          color={Theme.colors.status.success}
          trend="up"
          trendValue="Ranking"
          isRank
        />
      </View>

      <Text style={styles.sectionTitle}>Destaques</Text>
      
      <ChartCard
        title="Taxa de Conexão"
        value={`${dashboard.connectionStats.connectionRate}%`}
        type="progress"
        data={dashboard.connectionStats.connectionRate}
        color={Theme.colors.primary.pink}
      />
      
      <ChartCard
        title="Denominações Mais Compatíveis"
        type="bar"
        data={dashboard.connectionStats.topDenominations.map(d => ({
          label: d.name,
          value: d.count
        }))}
        color={Theme.colors.primary.blue}
      />
      
      <ChartCard
        title="Tempo de Resposta"
        value={`${dashboard.activityStats.averageResponseTime}min`}
        type="info"
        description="Tempo médio para responder mensagens"
        color={Theme.colors.primary.lilac}
        icon={Clock}
      />
    </ScrollView>
  );

  const renderConnectionsTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Estatísticas de Conexão</Text>
      
      <ChartCard
        title="Conexões por Idade"
        type="pie"
        data={dashboard.connectionStats.connectionsByAge.map(a => ({
          label: a.range,
          value: a.count
        }))}
        color={Theme.colors.primary.pink}
      />
      
      <ChartCard
        title="Taxa de Conexão"
        value={`${dashboard.connectionStats.connectionRate}%`}
        type="progress"
        data={dashboard.connectionStats.connectionRate}
        color={Theme.colors.primary.blue}
        description="Porcentagem de perfis que resultam em conexão"
      />
      
      <ChartCard
        title="Novas Conexões"
        value={dashboard.connectionStats.newConnectionsThisWeek.toString()}
        type="info"
        description="Conexões feitas nos últimos 7 dias"
        color={Theme.colors.primary.lilac}
        icon={Heart}
      />
      
      <ChartCard
        title="Denominações Mais Compatíveis"
        type="bar"
        data={dashboard.connectionStats.topDenominations.map(d => ({
          label: d.name,
          value: d.count
        }))}
        color={Theme.colors.status.success}
      />
    </ScrollView>
  );

  const renderSpiritualTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Jornada Espiritual</Text>
      
      <ChartCard
        title="Tempo de Oração"
        value={`${dashboard.spiritualStats.prayerMinutes}min`}
        type="info"
        description="Tempo total em oração"
        color={Theme.colors.primary.blue}
        icon={PrayingHands}
      />
      
      <ChartCard
        title="Versículos Lidos"
        value={dashboard.spiritualStats.versesRead.toString()}
        type="info"
        description="Versículos diários e compartilhados"
        color={Theme.colors.primary.lilac}
        icon={Book}
      />
      
      <ChartCard
        title="Pedidos de Oração"
        type="bar"
        data={[
          { label: 'Total', value: dashboard.spiritualStats.prayerRequests },
          { label: 'Respondidos', value: dashboard.spiritualStats.answeredPrayers }
        ]}
        color={Theme.colors.primary.gold}
      />
      
      <ChartCard
        title="Orações Comunitárias"
        value={dashboard.spiritualStats.communityPrayers.toString()}
        type="info"
        description="Orações por pedidos da comunidade"
        color={Theme.colors.status.success}
        icon={Users}
      />
    </ScrollView>
  );

  const renderActivityTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.sectionTitle}>Atividade</Text>
      
      <ChartCard
        title="Sequência Ativa"
        value={`${dashboard.activityStats.dailyActiveStreak} dias`}
        type="progress"
        data={Math.min(100, dashboard.activityStats.dailyActiveStreak * 10)}
        color={Theme.colors.primary.blue}
        description="Dias consecutivos de atividade"
      />
      
      <ChartCard
        title="Mensagens Trocadas"
        value={dashboard.activityStats.messagesExchanged.toString()}
        type="info"
        description="Total de mensagens enviadas e recebidas"
        color={Theme.colors.primary.lilac}
        icon={MessageSquare}
      />
      
      <ChartCard
        title="Eventos Participados"
        value={dashboard.activityStats.eventsAttended.toString()}
        type="info"
        description="Eventos cristãos que você participou"
        color={Theme.colors.primary.gold}
        icon={Calendar}
      />
      
      <ChartCard
        title="Visualizações de Perfil"
        value={dashboard.activityStats.profileViews.toString()}
        type="info"
        description="Quantas pessoas viram seu perfil"
        color={Theme.colors.status.success}
        icon={Eye}
      />
      
      <ChartCard
        title="Tempo de Resposta"
        value={`${dashboard.activityStats.averageResponseTime}min`}
        type="info"
        description="Tempo médio para responder mensagens"
        color={Theme.colors.primary.pink}
        icon={Clock}
      />
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {onBack && (
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <ChevronLeft size={24} color={Theme.colors.text.dark} />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>Análises</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshDashboard}>
          <TrendingUp size={20} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'overview' && styles.activeTab]}
          onPress={() => setActiveTab('overview')}
        >
          <Text style={[styles.tabText, activeTab === 'overview' && styles.activeTabText]}>
            Visão Geral
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'connections' && styles.activeTab]}
          onPress={() => setActiveTab('connections')}
        >
          <Text style={[styles.tabText, activeTab === 'connections' && styles.activeTabText]}>
            Conexões
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'spiritual' && styles.activeTab]}
          onPress={() => setActiveTab('spiritual')}
        >
          <Text style={[styles.tabText, activeTab === 'spiritual' && styles.activeTabText]}>
            Espiritual
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'activity' && styles.activeTab]}
          onPress={() => setActiveTab('activity')}
        >
          <Text style={[styles.tabText, activeTab === 'activity' && styles.activeTabText]}>
            Atividade
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'overview' && renderOverviewTab()}
      {activeTab === 'connections' && renderConnectionsTab()}
      {activeTab === 'spiritual' && renderSpiritualTab()}
      {activeTab === 'activity' && renderActivityTab()}
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
  refreshButton: {
    padding: Theme.spacing.xs,
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
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  tab: {
    flex: 1,
    paddingVertical: Theme.spacing.md,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
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
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
});