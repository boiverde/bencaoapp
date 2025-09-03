import { StyleSheet, View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface StatCardProps {
  title: string;
  value: string;
  icon: any;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  isRank?: boolean;
}

export default function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend = 'neutral',
  trendValue,
  isRank = false
}: StatCardProps) {
  const getTrendIcon = () => {
    const iconProps = { size: 14, color: getTrendColor() };
    
    switch (trend) {
      case 'up':
        return <TrendingUp {...iconProps} />;
      case 'down':
        return <TrendingDown {...iconProps} />;
      default:
        return <Minus {...iconProps} />;
    }
  };

  const getTrendColor = () => {
    if (isRank) {
      return trend === 'up' ? Theme.colors.status.success : 
             trend === 'down' ? Theme.colors.status.error : 
             Theme.colors.text.medium;
    }
    
    return trend === 'up' ? Theme.colors.status.success : 
           trend === 'down' ? Theme.colors.status.error : 
           Theme.colors.text.medium;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{value}</Text>
      
      {trendValue && (
        <View style={styles.trendContainer}>
          {getTrendIcon()}
          <Text style={[styles.trendValue, { color: getTrendColor() }]}>
            {trendValue}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '48%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.spacing.sm,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
  },
  value: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    marginLeft: Theme.spacing.xs,
  },
});