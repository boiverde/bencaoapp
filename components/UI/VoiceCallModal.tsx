import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, VolumeX, HandHelping as PrayingHands, Users, MoveVertical as MoreVertical } from 'lucide-react-native';
import Theme from '@/constants/Theme';
import { VoiceCall, CommunicationSystem } from '@/utils/communicationSystem';

interface VoiceCallModalProps {
  call: VoiceCall | null;
  visible: boolean;
  onAnswer?: () => void;
  onDecline?: () => void;
  onEnd?: () => void;
  onToggleVideo?: () => void;
  onToggleMute?: () => void;
  onToggleSpeaker?: () => void;
  onTogglePrayerMode?: () => void;
}

export default function VoiceCallModal({
  call,
  visible,
  onAnswer,
  onDecline,
  onEnd,
  onToggleVideo,
  onToggleMute,
  onToggleSpeaker,
  onTogglePrayerMode
}: VoiceCallModalProps) {
  const [duration, setDuration] = useState(0);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isPrayerMode, setIsPrayerMode] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (call && call.status === 'active') {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - call.startTime) / 1000);
        setDuration(elapsed);
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [call?.status, call?.startTime]);

  useEffect(() => {
    if (call) {
      setIsPrayerMode(call.prayerMode || false);
    }
  }, [call]);

  if (!call) return null;

  const handleAnswer = () => {
    if (onAnswer) onAnswer();
  };

  const handleDecline = () => {
    if (onDecline) onDecline();
  };

  const handleEnd = () => {
    if (onEnd) onEnd();
  };

  const handleToggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (onToggleVideo) onToggleVideo();
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (onToggleMute) onToggleMute();
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    if (onToggleSpeaker) onToggleSpeaker();
  };

  const handleTogglePrayerMode = () => {
    setIsPrayerMode(!isPrayerMode);
    if (onTogglePrayerMode) onTogglePrayerMode();
  };

  const getCallStatusText = () => {
    switch (call.status) {
      case 'ringing':
        return 'Chamando...';
      case 'active':
        return CommunicationSystem.formatCallDuration(duration);
      case 'ended':
        return 'Chamada encerrada';
      case 'missed':
        return 'Chamada perdida';
      case 'declined':
        return 'Chamada recusada';
      default:
        return '';
    }
  };

  const getCallTypeIcon = () => {
    if (isPrayerMode) {
      return <PrayingHands size={24} color={Theme.colors.primary.gold} />;
    }
    return call.type === 'video' ? (
      <Video size={24} color={Theme.colors.primary.blue} />
    ) : (
      <Phone size={24} color={Theme.colors.primary.blue} />
    );
  };

  const renderIncomingCall = () => (
    <View style={styles.incomingContainer}>
      <LinearGradient
        colors={[Theme.colors.primary.blue, Theme.colors.primary.lilac]}
        style={styles.incomingGradient}
      >
        <View style={styles.callerInfo}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }} 
            style={styles.callerAvatar} 
          />
          <Text style={styles.callerName}>Mariana</Text>
          <Text style={styles.callType}>
            {isPrayerMode ? 'Chamada de Oração' : call.type === 'video' ? 'Chamada de Vídeo' : 'Chamada de Voz'}
          </Text>
          {isPrayerMode && (
            <View style={styles.prayerModeIndicator}>
              <PrayingHands size={16} color={Theme.colors.primary.gold} />
              <Text style={styles.prayerModeText}>Modo Oração Ativado</Text>
            </View>
          )}
        </View>

        <View style={styles.incomingActions}>
          <TouchableOpacity style={styles.declineButton} onPress={handleDecline}>
            <PhoneOff size={28} color={Theme.colors.background.white} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.answerButton} onPress={handleAnswer}>
            <Phone size={28} color={Theme.colors.background.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );

  const renderActiveCall = () => (
    <View style={styles.activeContainer}>
      <LinearGradient
        colors={isPrayerMode 
          ? [Theme.colors.primary.gold + '40', Theme.colors.primary.gold + '20']
          : [Theme.colors.primary.blue + '40', Theme.colors.primary.blue + '20']
        }
        style={styles.activeGradient}
      >
        <View style={styles.activeHeader}>
          <View style={styles.callInfo}>
            <View style={styles.callTypeContainer}>
              {getCallTypeIcon()}
              <Text style={styles.callTypeText}>
                {isPrayerMode ? 'Oração' : call.type === 'video' ? 'Vídeo' : 'Voz'}
              </Text>
            </View>
            <Text style={styles.callDuration}>{getCallStatusText()}</Text>
          </View>
          
          <TouchableOpacity style={styles.moreButton}>
            <MoreVertical size={20} color={Theme.colors.text.dark} />
          </TouchableOpacity>
        </View>

        <View style={styles.participantContainer}>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg' }} 
            style={styles.participantAvatar} 
          />
          <Text style={styles.participantName}>Mariana</Text>
          
          {isPrayerMode && (
            <View style={styles.prayerModeActive}>
              <PrayingHands size={20} color={Theme.colors.primary.gold} />
              <Text style={styles.prayerModeActiveText}>
                Orando juntos em Cristo
              </Text>
            </View>
          )}
        </View>

        <View style={styles.callControls}>
          <TouchableOpacity 
            style={[styles.controlButton, isMuted && styles.controlButtonActive]}
            onPress={handleToggleMute}
          >
            {isMuted ? (
              <MicOff size={24} color={Theme.colors.background.white} />
            ) : (
              <Mic size={24} color={Theme.colors.text.dark} />
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.controlButton, isSpeakerOn && styles.controlButtonActive]}
            onPress={handleToggleSpeaker}
          >
            {isSpeakerOn ? (
              <Volume2 size={24} color={Theme.colors.background.white} />
            ) : (
              <VolumeX size={24} color={Theme.colors.text.dark} />
            )}
          </TouchableOpacity>

          {call.type === 'video' && (
            <TouchableOpacity 
              style={[styles.controlButton, !isVideoEnabled && styles.controlButtonActive]}
              onPress={handleToggleVideo}
            >
              {isVideoEnabled ? (
                <Video size={24} color={Theme.colors.text.dark} />
              ) : (
                <VideoOff size={24} color={Theme.colors.background.white} />
              )}
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={[styles.controlButton, isPrayerMode && styles.prayerModeButton]}
            onPress={handleTogglePrayerMode}
          >
            <PrayingHands 
              size={24} 
              color={isPrayerMode ? Theme.colors.background.white : Theme.colors.text.dark} 
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.endCallButton} onPress={handleEnd}>
            <PhoneOff size={24} color={Theme.colors.background.white} />
          </TouchableOpacity>
        </View>

        {isPrayerMode && (
          <View style={styles.prayerModeFooter}>
            <Text style={styles.prayerVerse}>
              "Porque onde estiverem dois ou três reunidos em meu nome, ali estou no meio deles."
            </Text>
            <Text style={styles.prayerVerseRef}>Mateus 18:20</Text>
          </View>
        )}
      </LinearGradient>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={call.status === 'ringing' ? handleDecline : handleEnd}
    >
      {call.status === 'ringing' ? renderIncomingCall() : renderActiveCall()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  incomingContainer: {
    flex: 1,
  },
  incomingGradient: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Theme.spacing.xxl,
  },
  callerInfo: {
    alignItems: 'center',
    marginTop: Theme.spacing.xxl,
  },
  callerAvatar: {
    width: 150,
    height: 150,
    borderRadius: Theme.borderRadius.circle,
    marginBottom: Theme.spacing.lg,
    borderWidth: 4,
    borderColor: Theme.colors.background.white,
  },
  callerName: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxxl,
    color: Theme.colors.background.white,
    marginBottom: Theme.spacing.sm,
  },
  callType: {
    fontFamily: Theme.typography.fontFamily.body,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.background.white + 'CC',
  },
  prayerModeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.gold + '30',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.md,
  },
  prayerModeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  incomingActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '60%',
  },
  declineButton: {
    width: 70,
    height: 70,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.large,
  },
  answerButton: {
    width: 70,
    height: 70,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.success,
    alignItems: 'center',
    justifyContent: 'center',
    ...Theme.shadows.large,
  },
  activeContainer: {
    flex: 1,
  },
  activeGradient: {
    flex: 1,
    paddingVertical: Theme.spacing.xl,
  },
  activeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.xl,
  },
  callInfo: {
    alignItems: 'center',
  },
  callTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.spacing.xs,
  },
  callTypeText: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    marginLeft: Theme.spacing.xs,
  },
  callDuration: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.lg,
    color: Theme.colors.text.dark,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white + '50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  participantContainer: {
    alignItems: 'center',
    marginBottom: Theme.spacing.xl,
  },
  participantAvatar: {
    width: 120,
    height: 120,
    borderRadius: Theme.borderRadius.circle,
    marginBottom: Theme.spacing.md,
    borderWidth: 3,
    borderColor: Theme.colors.background.white,
  },
  participantName: {
    fontFamily: Theme.typography.fontFamily.heading,
    fontSize: Theme.typography.fontSize.xxl,
    color: Theme.colors.text.dark,
  },
  prayerModeActive: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Theme.colors.primary.gold + '20',
    paddingHorizontal: Theme.spacing.md,
    paddingVertical: Theme.spacing.sm,
    borderRadius: Theme.borderRadius.md,
    marginTop: Theme.spacing.md,
  },
  prayerModeActiveText: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
    marginLeft: Theme.spacing.xs,
  },
  callControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Theme.spacing.lg,
    marginBottom: Theme.spacing.lg,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.background.white + '80',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.sm,
    ...Theme.shadows.small,
  },
  controlButtonActive: {
    backgroundColor: Theme.colors.status.error,
  },
  prayerModeButton: {
    backgroundColor: Theme.colors.primary.gold,
  },
  endCallButton: {
    width: 56,
    height: 56,
    borderRadius: Theme.borderRadius.circle,
    backgroundColor: Theme.colors.status.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Theme.spacing.sm,
    ...Theme.shadows.medium,
  },
  prayerModeFooter: {
    backgroundColor: Theme.colors.primary.gold + '20',
    marginHorizontal: Theme.spacing.lg,
    borderRadius: Theme.borderRadius.md,
    padding: Theme.spacing.md,
    alignItems: 'center',
  },
  prayerVerse: {
    fontFamily: Theme.typography.fontFamily.verse,
    fontSize: Theme.typography.fontSize.md,
    color: Theme.colors.text.dark,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Theme.spacing.xs,
  },
  prayerVerseRef: {
    fontFamily: Theme.typography.fontFamily.subheading,
    fontSize: Theme.typography.fontSize.sm,
    color: Theme.colors.primary.gold,
  },
});