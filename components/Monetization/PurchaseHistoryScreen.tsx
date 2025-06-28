import { StyleSheet, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, CreditCard, Check, Clock, TriangleAlert as AlertTriangle, Info } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { useMonetization } from '@/hooks/useMonetization';

interface PurchaseHistoryScreenProps {
  onBack: () => void;
}

export default function PurchaseHistoryScreen({ onBack }: PurchaseHistoryScreenProps) {
  const { purchaseHistory, availablePurchases } = useMonetization();

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const getPurchaseName = (productId: string) => {
    const product = availablePurchases.find(p => p.id === productId);
    return product ? product.name : productId;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Check size={16} color={Theme.colors.status.success} />;
      case 'pending':
        return <Clock size={16} color={Theme.colors.status.warning} />;
      case 'refunded':
        return <AlertTriangle size={16} color={Theme.colors.status.error} />;
      default:
        return <Info size={16} color={Theme.colors.text.medium} />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Concluída';
      case 'pending':
        return 'Pendente';
      case 'refunded':
        return 'Reembolsada';
      default:
        return status;
    }
  };

  const renderPurchaseItem = ({ item }) => (
    <View style={styles.purchaseItem}>
      <View style={styles.purchaseHeader}>
        <CreditCard size={20} color={Theme.colors.primary.blue} />
        <Text style={styles.purchaseName}>{getPurchaseName(item.productId)}</Text>
        <View style={styles.statusContainer}>
          {getStatusIcon(item.status)}
          <Text style={[
            styles.statusText,
            item.status === 'completed' && styles.completedText,
            item.status === 'pending' && styles.pendingText,
            item.status === 'refunded' && styles.refundedText
          ]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>
      
      <View style={styles.purchaseDetails}>
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>ID da Compra:</Text>
          <Text style={styles.detailValue}>{item.id}</Text>
        </View>
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Data:</Text>
          <Text style={styles.detailValue}>{formatDate(item.purchaseDate)}</Text>
        </View>
        
        {item.expiryDate && (
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Validade:</Text>
            <Text style={styles.detailValue}>{formatDate(item.expiryDate)}</Text>
          </View>
        )}
        
        <View style={styles.detailItem}>
          <Text style={styles.detailLabel}>Plataforma:</Text>
          <Text style={styles.detailValue}>{item.platform}</Text>
        </View>
      </View>
    </View>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <CreditCard size={48} color={Theme.colors.text.light} />
      <Text style={styles.emptyTitle}>Nenhuma compra encontrada</Text>
      <Text style={styles.emptySubtitle}>
        Seu histórico de compras aparecerá aqui
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ChevronLeft size={24} color={Theme.colors.text.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Histórico de Compras</Text>
        <View style={styles.placeholder} />
      </View>
      
      <FlatList
        data={purchaseHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderPurchaseItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
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
  placeholder: {
    width: 24,
  },
  listContent: {
    padding: Theme.spacing.md,
    flexGrow: 1,
  },
  purchaseItem: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  purchaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  purchaseName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  statusText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  completedText: {
    color: Theme.colors.status.success,
  },
  pendingText: {
    color: Theme.colors.status.warning,
  },
  refundedText: {
    color: Theme.colors.status.error,
  },
  purchaseDetails: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
  },
  detailItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.sm,
  },
  detailLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    width: 100,
  },
  detailValue: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    minHeight: 300,
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
  },
});