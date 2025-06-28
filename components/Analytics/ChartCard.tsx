import { StyleSheet, View, Text } from 'react-native';
import { Video as LucideIcon } from 'lucide-react-native';
import Theme from '@/constants/Theme';

interface ChartCardProps {
  title: string;
  type: 'bar' | 'pie' | 'line' | 'progress' | 'info';
  data?: number | Array<{label: string, value: number}>;
  color: string;
  value?: string;
  description?: string;
  icon?: LucideIcon;
}

export default function ChartCard({
  title,
  type,
  data,
  color,
  value,
  description,
  icon: Icon
}: ChartCardProps) {
  const renderBarChart = () => {
    if (!Array.isArray(data)) return null;
    
    const maxValue = Math.max(...data.map(item => item.value));
    
    return (
      <View style={styles.barChartContainer}>
        {data.map((item, index) => (
          <View key={index} style={styles.barItem}>
            <Text style={styles.barLabel}>{item.label}</Text>
            <View style={styles.barContainer}>
              <View 
                style={[
                  styles.bar, 
                  { 
                    width: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: color
                  }
                ]} 
              />
            </View>
            <Text style={styles.barValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderPieChart = () => {
    if (!Array.isArray(data)) return null;
    
    const total = data.reduce((sum, item) => sum + item.value, 0);
    
    return (
      <View style={styles.pieChartContainer}>
        <View style={styles.pieChart}>
          {/* This is a simplified representation of a pie chart */}
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const rotate = index * 36; // Simplified rotation
            
            return (
              <View 
                key={index}
                style={[
                  styles.pieSlice,
                  { 
                    backgroundColor: `${color}${80 - index * 10}`,
                    width: `${Math.max(20, percentage)}%`,
                    height: `${Math.max(20, percentage)}%`,
                    transform: [{ rotate: `${rotate}deg` }]
                  }
                ]}
              />
            );
          })}
        </View>
        
        <View style={styles.pieLegend}>
          {data.map((item, index) => (
            <View key={index} style={styles.legendItem}>
              <View 
                style={[
                  styles.legendColor, 
                  { backgroundColor: `${color}${80 - index * 10}` }
                ]} 
              />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderProgressBar = () => {
    if (typeof data !== 'number') return null;
    
    return (
      <View style={styles.progressContainer}>
        {value && (
          <Text style={styles.progressValue}>{value}</Text>
        )}
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${Math.min(100, data)}%`, backgroundColor: color }
            ]} 
          />
        </View>
        {description && (
          <Text style={styles.progressDescription}>{description}</Text>
        )}
      </View>
    );
  };

  const renderInfoCard = () => {
    return (
      <View style={styles.infoContainer}>
        <View style={styles.infoHeader}>
          {Icon && (
            <View style={[styles.infoIconContainer, { backgroundColor: color + '20' }]}>
              <Icon size={24} color={color} />
            </View>
          )}
          {value && (
            <Text style={[styles.infoValue, { color }]}>{value}</Text>
          )}
        </View>
        {description && (
          <Text style={styles.infoDescription}>{description}</Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {type === 'bar' && renderBarChart()}
      {type === 'pie' && renderPieChart()}
      {type === 'progress' && renderProgressBar()}
      {type === 'info' && renderInfoCard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  barChartContainer: {
    marginTop: Theme.spacing.sm,
  },
  barItem: {
    marginBottom: Theme.spacing.sm,
  },
  barLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.xs,
  },
  barContainer: {
    height: 12,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: Theme.spacing.xs,
  },
  bar: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  barValue: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    textAlign: 'right',
  },
  pieChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pieChart: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pieSlice: {
    position: 'absolute',
    borderRadius: Theme.borderRadius.circle,
  },
  pieLegend: {
    flex: 1,
    marginLeft: Theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: Theme.borderRadius.sm,
    marginRight: Theme.spacing.sm,
  },
  legendLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    flex: 1,
  },
  legendValue: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.dark,
  },
  progressContainer: {
    marginTop: Theme.spacing.sm,
  },
  progressValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    overflow: 'hidden',
    marginBottom: Theme.spacing.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: Theme.borderRadius.sm,
  },
  progressDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
  infoContainer: {
    marginTop: Theme.spacing.sm,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  infoIconContainer: {
    width: 48,
    height: 48,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  infoValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
  },
  infoDescription: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
  },
});