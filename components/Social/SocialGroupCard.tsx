import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { 
  Users, 
  Church, 
  Book, 
  Calendar, 
  Heart, 
  ChevronRight, 
  Globe, 
  Lock, 
  EyeOff 
} from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SocialGroup } from '@/utils/socialSystem';

interface SocialGroupCardProps {
  group: SocialGroup;
  onPress?: () => void;
  onJoin?: () => void;
  isMember?: boolean;
  compact?: boolean;
}

export default function SocialGroupCard({
  group,
  onPress,
  onJoin,
  isMember = false,
  compact = false
}: SocialGroupCardProps) {
  const getGroupTypeIcon = () => {
    const iconProps = { size: compact ? 16 : 20, color: getGroupTypeColor() };
    
    switch (group.type) {
      case 'prayer':
        return <Heart {...iconProps} />;
      case 'study':
        return <Book {...iconProps} />;
      case 'church':
        return <Church {...iconProps} />;
      case 'event':
        return <Calendar {...iconProps} />;
      default:
        return <Users {...iconProps} />;
    }
  };

  const getGroupTypeColor = () => {
    switch (group.type) {
      case 'prayer':
        return Theme.colors.primary.gold;
      case 'study':
        return Theme.colors.primary.lilac;
      case 'church':
        return Theme.colors.primary.blue;
      case 'event':
        return Theme.colors.primary.pink;
      default:
        return Theme.colors.status.success;
    }
  };

  const getGroupTypeName = () => {
    switch (group.type) {
      case 'prayer':
        return 'Oração';
      case 'study':
        return 'Estudo';
      case 'church':
        return 'Igreja';
      case 'event':
        return 'Evento';
      case 'interest':
        return 'Interesse';
      default:
        return 'Grupo';
    }
  };

  const getPrivacyIcon = () => {
    const iconProps = { size: 14, color: Theme.colors.text.medium };
    
    switch (group.privacy) {
      case 'public':
        return <Globe {...iconProps} />;
      case 'private':
        return <Lock {...iconProps} />;
      case 'secret':
        return <EyeOff {...iconProps} />;
      default:
        return <Globe {...iconProps} />;
    }
  };

  const getPrivacyText = () => {
    switch (group.privacy) {
      case 'public':
        return 'Público';
      case 'private':
        return 'Privado';
      case 'secret':
        return 'Secreto';
      default:
        return 'Público';
    }
  };

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={[
          styles.compactIconContainer,
          { backgroundColor: getGroupTypeColor() + '20' }
        ]}>
          {getGroupTypeIcon()}
        </View>
        
        <View style={styles.compactContent}>
          <Text style={styles.compactName} numberOfLines={1}>{group.name}</Text>
          <View style={styles.compactMeta}>
            <Text style={styles.compactMembers}>{group.memberIds.length} membros</Text>
            <View style={styles.compactPrivacy}>
              {getPrivacyIcon()}
              <Text style={styles.compactPrivacyText}>{getPrivacyText()}</Text>
            </View>
          </View>
        </View>
        
        <ChevronRight size={16} color={Theme.colors.text.medium} />
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.typeContainer}>
          <View style={[
            styles.typeIconContainer,
            { backgroundColor: getGroupTypeColor() }
          ]}>
            {getGroupTypeIcon()}
          </View>
          <Text style={styles.typeName}>{getGroupTypeName()}</Text>
        </View>
        
        <View style={styles.privacyContainer}>
          {getPrivacyIcon()}
          <Text style={styles.privacyText}>{getPrivacyText()}</Text>
        </View>
      </View>
      
      {group.coverImage && (
        <Image 
          source={{ uri: group.coverImage }}
          style={styles.coverImage}
          resizeMode="cover"
        />
      )}
      
      <View style={styles.content}>
        <Text style={styles.name}>{group.name}</Text>
        <Text style={styles.description} numberOfLines={2}>{group.description}</Text>
        
        <View style={styles.stats}>
          <View style={styles.statItem}>
            <Users size={16} color={Theme.colors.text.medium} />
            <Text style={styles.statText}>{group.memberIds.length} membros</Text>
          </View>
          
          {group.posts.length > 0 && (
            <View style={styles.statItem}>
              <Heart size={16} color={Theme.colors.text.medium} />
              <Text style={styles.statText}>{group.posts.length} publicações</Text>
            </View>
          )}
        </View>
        
        {group.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {group.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {group.tags.length > 3 && (
              <Text style={styles.moreTagsText}>+{group.tags.length - 3}</Text>
            )}
          </View>
        )}
      </View>
      
      <View style={styles.footer}>
        {isMember ? (
          <View style={styles.memberBadge}>
            <Users size={16} color={Theme.colors.status.success} />
            <Text style={styles.memberText}>Membro</Text>
          </View>
        ) : (
          <TouchableOpacity 
            style={styles.joinButton}
            onPress={onJoin}
          >
            <Text style={styles.joinButtonText}>Participar</Text>
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.viewButton}
          onPress={onPress}
        >
          <Text style={styles.viewButtonText}>Ver Grupo</Text>
          <ChevronRight size={16} color={Theme.colors.primary.blue} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.lg,
    marginBottom: Theme.spacing.md,
    overflow: 'hidden',
    ...Theme.shadows.small,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  compactIconContainer: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  compactContent: {
    flex: 1,
    marginRight: Theme.spacing.sm,
  },
  compactName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  compactMembers: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  compactPrivacy: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactPrivacyText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Theme.spacing.md,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typeIconContainer: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.circle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  typeName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  privacyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
  },
  privacyText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  coverImage: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: Theme.spacing.md,
  },
  name: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  description: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginBottom: Theme.spacing.md,
    lineHeight: 20,
  },
  stats: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.md,
  },
  statText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  tag: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
  },
  tagText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  moreTagsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.status.success + '20',
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  memberText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.status.success,
    marginLeft: Theme.spacing.xs,
  },
  joinButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  joinButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  viewButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginRight: Theme.spacing.xs,
  },
});