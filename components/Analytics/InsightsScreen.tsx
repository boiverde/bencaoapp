import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Lightbulb, 
  ChevronLeft, 
  Heart, 
  Book, 
  MessageSquare, 
  Users, 
  Shield,
  CheckCheck
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useAnalytics } from '@/hooks/useAnalytics';
import InsightCard from './InsightCard';
import { UserInsight } from '@/utils/analyticsSystem';
import InsightDetailModal from './InsightDetailModal';

interface InsightsScreenProps {
  onBack: () => void;
}

export default function InsightsScreen({ onBack }: InsightsScreenProps) {
  const [activeFilter, setActiveFilter] = useState<'all' | UserInsight['type']>('all');
  const [selectedInsight, setSelectedInsight] = useState<UserInsight | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  
  const { 
    insights, 
    getUnreadInsightsCount, 
    markInsightAsRead, 
    markAllInsightsAsRead,
    refreshInsights
  } = useAnalytics();

  useEffect(() => {
    refreshInsights();
  }, []);

  const filteredInsights = activeFilter === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeFilter);

  const handleInsightPress = (insight: UserInsight) => {
    setSelectedInsight(insight);
    setDetailModalVisible(true);
    
    if (!insight.isRead) {
      markInsightAsRead(insight.id);
    }
  };

  const handleCloseModal = () => {
    setDetailModalVisible(false);
  };

  const renderFilterButton = (
    filter: 'all' | UserInsight['type'], 
    label: string, 
    icon: any,
    count?: number
  ) => {
    const Icon = icon;
    const isActive = activeFilter === filter;
    
    return (
      <TouchableOpacity
        style={[styles.filterButton, isActive && styles.activeFilterButton]}
        onPress={() => setActiveFilter(filter)}
      >
        <Icon 
          size={16} 
          color={isActive ? Theme.colors.background.white : Theme.colors.text.medium} 
        />
        <Text style={[
          styles.filterButtonText,
          isActive && styles.activeFilterButtonText
        ]}>
          {label}
          {count !== undefined && count > 0 && ` (${count})`}
        </Text>
      </TouchableOpacity>
    );
  };

  const getInsightCountByType = (type: UserInsight['type']): number => {
    return insights.filter(insight => insight.type === type).length;
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Lightbulb size={48} color={Theme.colors.text.light} />
      <Text style={styles.emptyTitle}>Nenhum insight disponível</Text>
      <Text style={styles.emptySubtitle}>
        Continue usando o aplicativo para receber insights personalizados sobre sua jornada.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Insights
          {getUnreadInsightsCount() > 0 && ` (${getUnreadInsightsCount()})`}
        </Text>
        {getUnreadInsightsCount() > 0 && (
          <TouchableOpacity 
            style={styles.markAllReadButton}
            onPress={markAllInsightsAsRead}
          >
            <CheckCheck size={20} color={Theme.colors.primary.blue} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFilterButton('all', 'Todos', Lightbulb, insights.length)}
          {renderFilterButton('compatibility', 'Compatibilidade', Heart, getInsightCountByType('compatibility'))}
          {renderFilterButton('spiritual', 'Espiritual', Book, getInsightCountByType('spiritual'))}
          {renderFilterButton('activity', 'Atividade', MessageSquare, getInsightCountByType('activity'))}
          {renderFilterButton('community', 'Comunidade', Users, getInsightCountByType('community'))}
          {renderFilterButton('security', 'Segurança', Shield, getInsightCountByType('security'))}
        </ScrollView>
      </View>

      {filteredInsights.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={filteredInsights}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <InsightCard
              insight={item}
              onPress={() => handleInsightPress(item)}
              onMarkAsRead={() => markInsightAsRead(item.id)}
            />
          )}
          contentContainerStyle={styles.insightsList}
        />
      )}

      <InsightDetailModal
        visible={detailModalVisible}
        insight={selectedInsight}
        onClose={handleCloseModal}
      />
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
  markAllReadButton: {
    padding: Theme.spacing.xs,
  },
  filtersContainer: {
    paddingVertical: Theme.spacing.sm,
    paddingHorizontal: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    marginRight: Theme.spacing.sm,
  },
  activeFilterButton: {
    backgroundColor: Theme.colors.primary.blue,
  },
  filterButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeFilterButtonText: {
    color: Theme.colors.background.white,
  },
  insightsList: {
    padding: Theme.spacing.md,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
  },
  emptyTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginTop: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  emptySubtitle: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
});