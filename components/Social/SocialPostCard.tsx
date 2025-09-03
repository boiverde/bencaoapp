import { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { Heart, MessageSquare, Share2, HandHelping as PrayingHands, MoveVertical as MoreVertical, Calendar, MapPin, Book, User } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { SocialPost, SocialComment } from '@/utils/socialSystem';
import { useSocial } from '@/hooks/useSocial';

interface SocialPostCardProps {
  post: SocialPost;
  onPress?: () => void;
  compact?: boolean;
}

export default function SocialPostCard({ 
  post, 
  onPress,
  compact = false
}: SocialPostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  
  const { likePost, commentOnPost, prayForPost, sharePost } = useSocial();

  const formatTimestamp = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    
    return new Date(timestamp).toLocaleDateString();
  };

  const handleLike = async () => {
    await likePost(post.id);
  };

  const handleComment = async () => {
    if (showComments) {
      setShowComments(false);
    } else {
      setShowComments(true);
    }
  };

  const handlePray = async () => {
    await prayForPost(post.id);
  };

  const handleShare = async () => {
    Alert.alert(
      'Compartilhar',
      'Deseja compartilhar esta publicação?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Compartilhar', 
          onPress: async () => {
            await sharePost(post.id);
          }
        }
      ]
    );
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) return;
    
    setIsSubmittingComment(true);
    try {
      await commentOnPost(post.id, commentText);
      setCommentText('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Erro', 'Não foi possível enviar o comentário. Tente novamente.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const renderPostHeader = () => (
    <View style={styles.header}>
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <User size={20} color={Theme.colors.text.light} />
        </View>
        <View>
          <Text style={styles.userName}>Usuário {post.userId.split('_')[1]}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(post.createdAt)}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <MoreVertical size={20} color={Theme.colors.text.medium} />
      </TouchableOpacity>
    </View>
  );

  const renderPostContent = () => (
    <View style={styles.content}>
      <Text style={styles.postText}>{post.content}</Text>
      
      {post.verse && (
        <View style={styles.verseContainer}>
          <Book size={16} color={Theme.colors.primary.lilac} />
          <View style={styles.verseContent}>
            <Text style={styles.verseText}>"{post.verse.text}"</Text>
            <Text style={styles.verseReference}>{post.verse.reference}</Text>
          </View>
        </View>
      )}
      
      {post.eventDetails && (
        <View style={styles.eventContainer}>
          <View style={styles.eventHeader}>
            <Calendar size={16} color={Theme.colors.primary.blue} />
            <Text style={styles.eventTitle}>{post.eventDetails.title}</Text>
          </View>
          <Text style={styles.eventDate}>
            {new Date(post.eventDetails.date).toLocaleDateString()} às {new Date(post.eventDetails.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
          <View style={styles.eventLocation}>
            <MapPin size={14} color={Theme.colors.text.medium} />
            <Text style={styles.eventLocationText}>{post.eventDetails.location}</Text>
          </View>
        </View>
      )}
      
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <View style={styles.mediaContainer}>
          <Image 
            source={{ uri: post.mediaUrls[0] }} 
            style={styles.mediaImage}
            resizeMode="cover"
          />
        </View>
      )}
      
      {post.tags && post.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {post.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const renderPostStats = () => (
    <View style={styles.stats}>
      {post.likes.length > 0 && (
        <View style={styles.statItem}>
          <Heart size={14} color={Theme.colors.primary.pink} />
          <Text style={styles.statText}>{post.likes.length}</Text>
        </View>
      )}
      
      {post.comments.length > 0 && (
        <View style={styles.statItem}>
          <MessageSquare size={14} color={Theme.colors.primary.blue} />
          <Text style={styles.statText}>{post.comments.length}</Text>
        </View>
      )}
      
      {post.prayerCount > 0 && (
        <View style={styles.statItem}>
          <PrayingHands size={14} color={Theme.colors.primary.gold} />
          <Text style={styles.statText}>{post.prayerCount}</Text>
        </View>
      )}
      
      {post.shares > 0 && (
        <View style={styles.statItem}>
          <Share2 size={14} color={Theme.colors.primary.lilac} />
          <Text style={styles.statText}>{post.shares}</Text>
        </View>
      )}
    </View>
  );

  const renderPostActions = () => (
    <View style={styles.actions}>
      <TouchableOpacity 
        style={[
          styles.actionButton, 
          post.likes.includes('current_user') && styles.actionButtonActive
        ]}
        onPress={handleLike}
      >
        <Heart 
          size={20} 
          color={post.likes.includes('current_user') ? Theme.colors.primary.pink : Theme.colors.text.medium}
          fill={post.likes.includes('current_user') ? Theme.colors.primary.pink : 'transparent'}
        />
        <Text style={[
          styles.actionText,
          post.likes.includes('current_user') && { color: Theme.colors.primary.pink }
        ]}>
          Curtir
        </Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleComment}
      >
        <MessageSquare size={20} color={Theme.colors.text.medium} />
        <Text style={styles.actionText}>Comentar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handlePray}
      >
        <PrayingHands size={20} color={Theme.colors.text.medium} />
        <Text style={styles.actionText}>Orar</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.actionButton}
        onPress={handleShare}
      >
        <Share2 size={20} color={Theme.colors.text.medium} />
        <Text style={styles.actionText}>Compartilhar</Text>
      </TouchableOpacity>
    </View>
  );

  const renderComments = () => (
    <View style={styles.commentsContainer}>
      <View style={styles.commentInputContainer}>
        <TextInput
          style={styles.commentInput}
          placeholder="Escreva um comentário..."
          placeholderTextColor={Theme.colors.text.medium}
          value={commentText}
          onChangeText={setCommentText}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.commentSubmitButton,
            (!commentText.trim() || isSubmittingComment) && styles.commentSubmitButtonDisabled
          ]}
          onPress={handleSubmitComment}
          disabled={!commentText.trim() || isSubmittingComment}
        >
          <Text style={styles.commentSubmitText}>Enviar</Text>
        </TouchableOpacity>
      </View>
      
      {post.comments.length > 0 ? (
        <View style={styles.commentsList}>
          {post.comments.map((comment, index) => (
            <View key={comment.id} style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                <User size={16} color={Theme.colors.text.light} />
              </View>
              <View style={styles.commentContent}>
                <Text style={styles.commentUserName}>Usuário {comment.userId.split('_')[1]}</Text>
                <Text style={styles.commentText}>{comment.content}</Text>
                <View style={styles.commentActions}>
                  <Text style={styles.commentTime}>{formatTimestamp(comment.createdAt)}</Text>
                  <TouchableOpacity>
                    <Text style={styles.commentReply}>Responder</Text>
                  </TouchableOpacity>
                  {comment.isBlessed && (
                    <View style={styles.blessedBadge}>
                      <Text style={styles.blessedText}>Abençoado</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text style={styles.noCommentsText}>Seja o primeiro a comentar</Text>
      )}
    </View>
  );

  if (compact) {
    return (
      <TouchableOpacity 
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.compactHeader}>
          <View style={styles.compactAvatar}>
            <User size={16} color={Theme.colors.text.light} />
          </View>
          <View style={styles.compactUserInfo}>
            <Text style={styles.compactUserName}>Usuário {post.userId.split('_')[1]}</Text>
            <Text style={styles.compactTimestamp}>{formatTimestamp(post.createdAt)}</Text>
          </View>
        </View>
        
        <Text style={styles.compactContent} numberOfLines={2}>
          {post.content}
        </Text>
        
        <View style={styles.compactFooter}>
          <View style={styles.compactStats}>
            {post.likes.length > 0 && (
              <View style={styles.compactStatItem}>
                <Heart size={12} color={Theme.colors.primary.pink} />
                <Text style={styles.compactStatText}>{post.likes.length}</Text>
              </View>
            )}
            
            {post.comments.length > 0 && (
              <View style={styles.compactStatItem}>
                <MessageSquare size={12} color={Theme.colors.primary.blue} />
                <Text style={styles.compactStatText}>{post.comments.length}</Text>
              </View>
            )}
            
            {post.prayerCount > 0 && (
              <View style={styles.compactStatItem}>
                <PrayingHands size={12} color={Theme.colors.primary.gold} />
                <Text style={styles.compactStatText}>{post.prayerCount}</Text>
              </View>
            )}
          </View>
          
          {post.type !== 'general' && (
            <View style={[
              styles.compactTypeBadge,
              post.type === 'prayer' && styles.prayerBadge,
              post.type === 'verse' && styles.verseBadge,
              post.type === 'testimony' && styles.testimonyBadge,
              post.type === 'event' && styles.eventBadge
            ]}>
              <Text style={styles.compactTypeText}>
                {post.type === 'prayer' ? 'Oração' :
                 post.type === 'verse' ? 'Versículo' :
                 post.type === 'testimony' ? 'Testemunho' :
                 post.type === 'event' ? 'Evento' : 'Geral'}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      {renderPostHeader()}
      {renderPostContent()}
      {renderPostStats()}
      {renderPostActions()}
      {showComments && renderComments()}
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
    backgroundColor: Theme.colors.background.white,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
    marginBottom: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Theme.spacing.md,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  userName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
  },
  timestamp: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  moreButton: {
    padding: Theme.spacing.xs,
  },
  content: {
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.md,
  },
  postText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    lineHeight: 22,
    marginBottom: Theme.spacing.md,
  },
  verseContainer: {
    flexDirection: 'row',
    backgroundColor: Theme.colors.background.lilac,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
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
  eventContainer: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    marginBottom: Theme.spacing.md,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  eventTitle: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.primary.blue,
    marginLeft: Theme.spacing.sm,
  },
  eventDate: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  eventLocation: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocationText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  mediaContainer: {
    marginBottom: Theme.spacing.md,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: Theme.borderRadius.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: Theme.spacing.xs,
    marginRight: Theme.spacing.xs,
    marginBottom: Theme.spacing.xs,
  },
  tagText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  stats: {
    flexDirection: 'row',
    paddingHorizontal: Theme.spacing.md,
    paddingBottom: Theme.spacing.sm,
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
  actions: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
    paddingVertical: Theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Theme.spacing.sm,
  },
  actionButtonActive: {
    backgroundColor: Theme.colors.background.light,
  },
  actionText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  commentsContainer: {
    padding: Theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: Theme.colors.ui.border,
  },
  commentInputContainer: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  commentInput: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginRight: Theme.spacing.sm,
    minHeight: 40,
  },
  commentSubmitButton: {
    backgroundColor: Theme.colors.primary.blue,
    borderRadius: Theme.borderRadius.md,
    paddingHorizontal: Theme.spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  commentSubmitButtonDisabled: {
    backgroundColor: Theme.colors.ui.disabled,
  },
  commentSubmitText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.background.white,
  },
  commentsList: {
    marginTop: Theme.spacing.sm,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: Theme.spacing.md,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  commentContent: {
    flex: 1,
    backgroundColor: Theme.colors.background.light,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.sm,
  },
  commentUserName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  commentText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.xs,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTime: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginRight: Theme.spacing.sm,
  },
  commentReply: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.primary.blue,
  },
  blessedBadge: {
    backgroundColor: Theme.colors.primary.gold + '30',
    borderRadius: Theme.borderRadius.sm,
    paddingHorizontal: Theme.spacing.xs,
    paddingVertical: 2,
    marginLeft: Theme.spacing.sm,
  },
  blessedText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 10,
    color: Theme.colors.primary.gold,
  },
  noCommentsText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.medium,
    textAlign: 'center',
    marginTop: Theme.spacing.md,
  },
  compactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.sm,
  },
  compactAvatar: {
    width: 32,
    height: 32,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Theme.spacing.sm,
  },
  compactUserInfo: {
    flex: 1,
  },
  compactUserName: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
  },
  compactTimestamp: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
  },
  compactContent: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.text.dark,
    marginBottom: Theme.spacing.sm,
  },
  compactFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  compactStats: {
    flexDirection: 'row',
  },
  compactStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Theme.spacing.sm,
  },
  compactStatText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.xs,
    color: Theme.colors.text.medium,
    marginLeft: Theme.spacing.xs,
  },
  compactTypeBadge: {
    paddingHorizontal: Theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: Theme.borderRadius.sm,
    backgroundColor: Theme.colors.background.light,
  },
  prayerBadge: {
    backgroundColor: Theme.colors.primary.gold + '30',
  },
  verseBadge: {
    backgroundColor: Theme.colors.primary.lilac + '30',
  },
  testimonyBadge: {
    backgroundColor: Theme.colors.primary.pink + '30',
  },
  eventBadge: {
    backgroundColor: Theme.colors.primary.blue + '30',
  },
  compactTypeText: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: 10,
    color: Theme.colors.text.medium,
  },
});