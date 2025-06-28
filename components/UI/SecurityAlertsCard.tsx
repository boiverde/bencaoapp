import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { TriangleAlert as AlertTriangle, Shield, Info, CircleCheck as CheckCircle, X, Smartphone, MapPin, Clock, Eye } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SecurityAlert } from '@/utils/securitySystem';
import { useSecurity } from '@/hooks/useSecurity';

interface SecurityAlertsCardProps {
  alerts: SecurityAlert[];
}

export default function SecurityAlertsCard({ alerts }: SecurityAlertsCardProps) {
  const { resolveSecurityAlert, clearSecurityAlerts } = useSecurity();

  const getAlertIcon = (type: SecurityAlert['type']) => {
    const iconProps = { size: 20, color: Theme.colors.background.white };
    
    switch (type) {
      case 'login_attempt':
        return <Smartphone {...iconProps} />;
      case 'password_change':
        return <Shield {...iconProps} />;
      case 'profile_access':
        return <Eye {...iconProps} />;
      case 'suspicious_activity':
        return <AlertTriangle {...iconProps} />;
      case 'security_breach':
        return <Shield {...iconProps} />;
      default:
        return <Info {...iconProps} />;
    }
  };

  const getAlertColor = (severity: SecurityAlert['severity']) => {
    switch (severity) {
      case 'critical':
        return Theme.colors.status.error;
      case 'warning':
        return Theme.colors.status.warning;
      case 'info':
        return Theme.colors.primary.blue;
      default:
        return Theme.colors.text.medium;
    }
  };

  const getSeverityLabel = (severity: SecurityAlert['severity']) => {
    const labels = {
      info: 'Informação',
      warning: 'Atenção',
      critical: 'Crítico'
    };
    return labels[severity];
  };

  const formatAlertTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) return `${days}d atrás`;
    if (hours > 0) return `${hours}h atrás`;
    return 'Agora';
  };

  const handleResolveAlert = (alertId: string) => {
    resolveSecurityAlert(alertId);
  };

  const unreadAlerts = alerts.filter(alert => !alert.resolved);
  const resolvedAlerts = alerts.filter(alert => alert.resolved);

  if (alerts.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Shield size={48} color={Theme.colors.text.light} />
        <Text style={styles.emptyTitle}>Nenhum Alerta de Segurança</Text>
        <Text style={styles.emptySubtitle}>
          Sua conta está segura. Alertas de segurança aparecerão aqui quando necessário.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <AlertTriangle size={24} color={Theme.colors.status.warning} />
          <Text style={styles.title}>Alertas de Segurança</Text>
        </View>
        {alerts.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSecurityAlerts}>
            <Text style={styles.clearButtonText}>Limpar Todos</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.alertsList} showsVerticalScrollIndicator={false}>
        {unreadAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Não Resolvidos ({unreadAlerts.length})
            </Text>
            {unreadAlerts.map((alert) => (
              <View key={alert.id} style={[
                styles.alertItem,
                { borderLeftColor: getAlertColor(alert.severity) }
              ]}>
                <View style={styles.alertHeader}>
                  <View style={[
                    styles.alertIcon,
                    { backgroundColor: getAlertColor(alert.severity) }
                  ]}>
                    {getAlertIcon(alert.type)}
                  </View>
                  <View style={styles.alertInfo}>
                    <View style={styles.alertTitleRow}>
                      <Text style={styles.alertTitle}>{alert.message}</Text>
                      <View style={[
                        styles.severityBadge,
                        { backgroundColor: getAlertColor(alert.severity) }
                      ]}>
                        <Text style={styles.severityText}>
                          {getSeverityLabel(alert.severity)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.alertMeta}>
                      <Clock size={14} color={Theme.colors.text.medium} />
                      <Text style={styles.alertTime}>
                        {formatAlertTime(alert.timestamp)}
                      </Text>
                      {alert.location && (
                        <>
                          <MapPin size={14} color={Theme.colors.text.medium} />
                          <Text style={styles.alertLocation}>{alert.location}</Text>
                        </>
                      )}
                      {alert.device && (
                        <>
                          <Smartphone size={14} color={Theme.colors.text.medium} />
                          <Text style={styles.alertDevice}>{alert.device}</Text>
                        </>
                      )}
                    </View>
                  </View>
                </View>
                
                <View style={styles.alertActions}>
                  <TouchableOpacity
                    style={styles.resolveButton}
                    onPress={() => handleResolveAlert(alert.id)}
                  >
                    <CheckCircle size={16} color={Theme.colors.status.success} />
                    <Text style={styles.resolveButtonText}>Resolver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {resolvedAlerts.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Resolvidos ({resolvedAlerts.length})
            </Text>
            {resolvedAlerts.map((alert) => (
              <View key={alert.id} style={[
                styles.alertItem,
                styles.resolvedAlert,
                { borderLeftColor: Theme.colors.status.success }
              ]}>
                <View style={styles.alertHeader}>
                  <View style={[
                    styles.alertIcon,
                    { backgroundColor: Theme.colors.status.success }
                  ]}>
                    <CheckCircle size={20} color={Theme.colors.background.white} />
                  </View>
                  <View style={styles.alertInfo}>
                    <Text style={[styles.alertTitle, styles.resolvedAlertTitle]}>
                      {alert.message}
                    </Text>
                    <View style={styles.alertMeta}>
                      <Clock size={14} color={Theme.colors.text.light} />
                      <Text style={styles.alertTime}>
                        {formatAlertTime(alert.timestamp)}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.securityTips}>
        <Text style={styles.tipsTitle}>Dicas de Segurança</Text>
        <View style={styles.tipsList}>
          <Text style={styles.tipItem}>
            • Monitore regularmente os alertas de segurança
          </Text>
          <Text style={styles.tipItem}>
            • Ative notificações para atividades suspeitas
          </Text>
          <Text style={styles.tipItem}>
            • Use senhas fortes e autenticação de dois fatores
          </Text>
          <Text style={styles.tipItem}>
            • Mantenha seus dispositivos atualizados
          </Text>
        </View>
      </View>

      <View style={styles.spiritualMessage}>
        <Text style={styles.spiritualText}>
          "Vigiai e orai, para que não entreis em tentação." - Mateus 26:41
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Theme.spacing.xl,
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    ...Theme.shadows.small,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.sm,
  },
  clearButton: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.status.error + '20',
  },
  clearButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.error,
  },
  alertsList: {
    maxHeight: 400,
    marginBottom: Theme.spacing.lg,
  },
  section: {
    marginBottom: Theme.spacing.lg,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  alertItem: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
    borderLeftWidth: 4,
  },
  resolvedAlert: {
    opacity: 0.7,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.sm,
  },
  alertIcon: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.md,
  },
  alertInfo: {
    flex: 1,
  },
  alertTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Theme.spacing.xs,
  },
  alertTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  resolvedAlertTitle: {
    color: Theme.colors.text.medium,
  },
  severityBadge: {
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
  },
  severityText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.background.white,
  },
  alertMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  alertTime: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
    marginRight: Theme.spacing.md,
  },
  alertLocation: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
    marginRight: Theme.spacing.md,
  },
  alertDevice: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  alertActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  resolveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.status.success + '20',
  },
  resolveButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
    marginLeft: Theme.spacing.xs,
  },
  securityTips: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  tipsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  tipsList: {
    marginLeft: Theme.spacing.sm,
  },
  tipItem: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    lineHeight: 20,
    marginBottom: Theme.spacing.xs,
  },
  spiritualMessage: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  spiritualText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 18,
  },
});