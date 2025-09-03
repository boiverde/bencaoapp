import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { User, MapPin, Church, Book, Heart, Users, Calendar, CreditCard as Edit, UserPlus, UserMinus, MessageSquare, Shield } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SocialProfile } from '@/utils/socialSystem';

interface SocialProfileHeaderProps {
  profile: SocialProfile;
  isCurrentUser?: boolean;
  isFollowing?: boolean;
  onFollow?: () => void;
  onUnfollow?: () => void;
  onMessage?: () => void;
  onEdit?: () => void;
}

export default function SocialProfileHeader({
  profile,
  isCurrentUser = false,
  isFollowing = false,
  onFollow,
  onUnfollow,
  onMessage,
  onEdit
}: SocialProfileHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.coverContainer}>
        {profile.coverImage ? (
          <Image 
            source={{ uri: profile.coverImage }}
            style={styles.coverImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.coverPlaceholder} />
        )}
      </View>
      
      <View style={styles.profileContent}>
        <View style={styles.avatarContainer}>
          {profile.profilePicture ? (
            <Image 
              source={{ uri: profile.profilePicture }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <User size={40} color={Theme.colors.text.light} />
            </View>
          )}
          
          {profile.isVerified && (
            <View style={styles.verifiedBadge}>
              <Shield size={12} color={Theme.colors.background.white} />
            </View>
          )}
        </View>
        
        <View style={styles.nameContainer}>
          <Text style={styles.displayName}>{profile.displayName}</Text>
          
          <View style={styles.locationContainer}>
            <MapPin size={14} color={Theme.colors.text.medium} />
            <Text style={styles.locationText}>
              {profile.location.city}, {profile.location.state}
            </Text>
          </View>
          
          <View style={styles.denominationContainer}>
            <Church size={14} color={Theme.colors.primary.blue} />
            <Text style={styles.denominationText}>{profile.denomination}</Text>
          </View>
        </View>
        
        <View style={styles.actions}>
          {isCurrentUser ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={onEdit}
            >
              <Edit size={16} color={Theme.colors.primary.blue} />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.userActions}>
              {isFollowing ? (
                <TouchableOpacity 
                  style={styles.unfollowButton}
                  onPress={onUnfollow}
                >
                  <UserMinus size={16} color={Theme.colors.text.dark} />
                  <Text style={styles.unfollowButtonText}>Seguindo</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity 
                  style={styles.followButton}
                  onPress={onFollow}
                >
                  <UserPlus size={16} color={Theme.colors.background.white} />
                  <Text style={styles.followButtonText}>Seguir</Text>
                </TouchableOpacity>
              )}
              
              <TouchableOpacity 
                style={styles.messageButton}
                onPress={onMessage}
              >
                <MessageSquare size={16} color={Theme.colors.primary.blue} />
                <Text style={styles.messageButtonText}>Mensagem</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      
      {profile.favoriteVerse && (
        <View style={styles.verseContainer}>
          <Book size={16} color={Theme.colors.primary.lilac} />
          <View style={styles.verseContent}>
            <Text style={styles.verseText}>"{profile.favoriteVerse.text}"</Text>
            <Text style={styles.verseReference}>{profile.favoriteVerse.reference}</Text>
          </View>
        </View>
      )}
      
      <View style={styles.bioContainer}>
        <Text style={styles.bioText}>{profile.bio}</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.postsCount}</Text>
          <Text style={styles.statLabel}>Publicações</Text>
        </View>
        
        {profile.privacySettings.showFollowers && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.followersCount}</Text>
            <Text style={styles.statLabel}>Seguidores</Text>
          </View>
        )}
        
        {profile.privacySettings.showFollowing && (
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.followingCount}</Text>
            <Text style={styles.statLabel}>Seguindo</Text>
          </View>
        )}
        
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.prayerCount}</Text>
          <Text style={styles.statLabel}>Orações</Text>
        </View>
      </View>
      
      {profile.interests.length > 0 && (
        <View style={styles.interestsContainer}>
          <Text style={styles.interestsTitle}>Interesses</Text>
          <View style={styles.interestsList}>
            {profile.interests.map((interest, index) => (
              <View key={index} style={styles.interestTag}>
                <Heart size={12} color={Theme.colors.primary.pink} />
                <Text style={styles.interestText}>{interest}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <View style={styles.tabsContainer}>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <MessageSquare size={20} color={Theme.colors.primary.blue} />
          <Text style={[styles.tabText, styles.activeTabText]}>Publicações</Text>
        </TouchableOpacity>
        
        {profile.privacySettings.showGroups && (
          <TouchableOpacity style={styles.tab}>
            <Users size={20} color={Theme.colors.text.medium} />
            <Text style={styles.tabText}>Grupos</Text>
          </TouchableOpacity>
        )}
        
        {profile.privacySettings.showEvents && (
          <TouchableOpacity style={styles.tab}>
            <Calendar size={20} color={Theme.colors.text.medium} />
            <Text style={styles.tabText}>Eventos</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Theme.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
    marginBottom: Theme.spacing.md,
  },
  coverContainer: {
    height: 150,
    width: '100%',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Theme.colors.primary.blue + '30',
  },
  profileContent: {
    flexDirection: 'row',
    padding: Theme.spacing.md,
  },
  avatarContainer: {
    marginTop: -50,
    marginRight: Theme.spacing.md,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.circle,
    borderWidth: 4,
    borderColor: Theme.colors.background.white,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Theme.colors.background.white,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 24,
    height: 24,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.primary.blue,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Theme.colors.background.white,
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  displayName: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xl,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  locationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  denominationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  denominationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  actions: {
    marginTop: Theme.spacing.sm,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  editButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  userActions: {
    flexDirection: 'row',
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  followButtonText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
    marginLeft: Theme.spacing.xs,
  },
  unfollowButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    marginRight: Theme.spacing.sm,
  },
  unfollowButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.xs,
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
  },
  messageButtonText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.xs,
  },
  verseContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  verseContent: {
    flex: 1,
    marginLeft: Theme.spacing.sm,
  },
  verseText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    fontStyle: 'italic',
    marginBottom: Theme.spacing.xs,
  },
  verseReference: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.lilac,
    textAlign: 'right',
  },
  bioContainer: {
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  bioText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    borderBottomWidth: 1,
    borderBottomColor: Theme.colors.ui.border,
    marginBottom: Theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  statLabel: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  interestsContainer: {
    paddingHorizontal: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  interestsTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  interestsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  interestTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  interestText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.md,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Theme.colors.primary.blue,
  },
  tabText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  activeTabText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    color: Theme.colors.primary.blue,
  },
});