import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Theme from '@/constants/Theme';
import { Users, MessageSquare, Shield, Settings, LogOut, Bell, ChartBar as BarChart2, Calendar, Flag, UserX, Lock } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { AdminAuth } from '@/utils/adminAuth';

export default function AdminDashboardScreen() {
  const [activeUsers, setActiveUsers] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [reportedContent, setReportedContent] = useState(0);
  const [pendingVerifications, setPendingVerifications] = useState(0);
  
  const router = useRouter();
  const { signOut } = useAuth();

  useEffect(() => {
    // In a real app, fetch these stats from an API
    setActiveUsers(1245);
    setTotalUsers(5842);
    setReportedContent(23);
    setPendingVerifications(47);
  }, []);

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da conta de administrador?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.prompt(
      'Alterar Senha',
      'Digite sua senha atual:',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Próximo', 
          onPress: (currentPassword) => {
            if (!currentPassword) return;
            
            Alert.prompt(
              'Alterar Senha',
              'Digite a nova senha:',
              [
                { text: 'Cancelar', style: 'cancel' },
                { 
                  text: 'Alterar', 
                  onPress: async (newPassword) => {
                    if (!newPassword) return;
                    
                    const success = await AdminAuth.changeAdminPassword(currentPassword, newPassword);
                    
                    if (success) {
                      Alert.alert('Sucesso', 'Senha alterada com sucesso!');
                    } else {
                      Alert.alert('Erro', 'Senha atual incorreta ou ocorreu um erro ao alterar a senha.');
                    }
                  }
                }
              ],
              'secure-text'
            );
          }
        }
      ],
      'secure-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Painel de Administrador</Text>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <LogOut size={24} color={Theme.colors.status.error} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Users size={24} color={Theme.colors.primary.blue} />
            <Text style={styles.statNumber}>{activeUsers}</Text>
            <Text style={styles.statLabel}>Usuários Ativos</Text>
          </View>
          
          <View style={styles.statCard}>
            <Users size={24} color={Theme.colors.primary.lilac} />
            <Text style={styles.statNumber}>{totalUsers}</Text>
            <Text style={styles.statLabel}>Total de Usuários</Text>
          </View>
          
          <View style={styles.statCard}>
            <Flag size={24} color={Theme.colors.status.error} />
            <Text style={styles.statNumber}>{reportedContent}</Text>
            <Text style={styles.statLabel}>Conteúdos Reportados</Text>
          </View>
          
          <View style={styles.statCard}>
            <Shield size={24} color={Theme.colors.primary.gold} />
            <Text style={styles.statNumber}>{pendingVerifications}</Text>
            <Text style={styles.statLabel}>Verificações Pendentes</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Ações Rápidas</Text>
          
          <TouchableOpacity style={styles.actionButton}>
            <Shield size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Verificar Usuários</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Flag size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Moderar Conteúdo Reportado</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <UserX size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Gerenciar Usuários Bloqueados</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Bell size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Enviar Notificações</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Gerenciar Eventos</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <BarChart2 size={20} color={Theme.colors.primary.blue} />
            <Text style={styles.actionButtonText}>Ver Estatísticas Detalhadas</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.settingsSection}>
          <Text style={styles.sectionTitle}>Configurações</Text>
          
          <TouchableOpacity 
            style={styles.settingButton}
            onPress={handleChangePassword}
          >
            <Lock size={20} color={Theme.colors.text.dark} />
            <Text style={styles.settingButtonText}>Alterar Senha de Administrador</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <Settings size={20} color={Theme.colors.text.dark} />
            <Text style={styles.settingButtonText}>Configurações do Aplicativo</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingButton}>
            <MessageSquare size={20} color={Theme.colors.text.dark} />
            <Text style={styles.settingButtonText}>Gerenciar Mensagens do Sistema</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Informações do Sistema</Text>
          <Text style={styles.infoText}>Versão: 1.0.0</Text>
          <Text style={styles.infoText}>Último backup: 30/06/2025</Text>
          <Text style={styles.infoText}>Status do servidor: Online</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.md,
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  title: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.primary.blue,
  },
  logoutButton: {
    padding: Theme.spacing.xs,
  },
  content: {
    flex: 1,
    padding: Theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
    marginBottom: Theme.spacing.md,
    ...Theme.shadows.small,
  },
  statNumber: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginVertical: Theme.spacing.xs,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
  },
  actionsSection: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  sectionTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.md,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.sm,
  },
  actionButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.md,
  },
  settingsSection: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.lg,
    ...Theme.shadows.small,
  },
  settingButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
  },
  settingButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.md,
  },
  infoBox: {
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.lg,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.xl,
  },
  infoTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  infoText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
});