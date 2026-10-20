import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Slider } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../lib/player';
import { colors, spacing, typography, borderRadius } from '../theme';

export default function Player() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const {
    currentBeat,
    isPlaying,
    position,
    duration,
    queue,
    currentIndex,
    play,
    pause,
    seekTo,
    next,
    previous,
  } = usePlayerStore();

  if (!currentBeat) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
          <Ionicons name="chevron-down" size={28} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No beat playing</Text>
        </View>
      </View>
    );
  }

  function handlePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function formatTime(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const canGoPrevious = currentIndex > 0 || position > 3000;
  const canGoNext = currentIndex < queue.length - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={() => router.back()}>
        <Ionicons name="chevron-down" size={28} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.content}>
        <View style={styles.artwork}>
          <Ionicons name="musical-notes" size={80} color={theme.primary} />
        </View>

        <View style={styles.info}>
          <Text style={styles.title}>{currentBeat.title}</Text>
          <Text style={styles.artist}>
            {currentBeat.expand?.userId?.username || 'Unknown'}
          </Text>
          <View style={styles.tags}>
            {currentBeat.tags?.slice(0, 3).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.progressSection}>
          <Slider
            style={styles.slider}
            value={position}
            minimumValue={0}
            maximumValue={duration || 1}
            onSlidingComplete={seekTo}
            minimumTrackTintColor={theme.primary}
            maximumTrackTintColor={theme.border}
            thumbTintColor={theme.primary}
          />
          <View style={styles.timeRow}>
            <Text style={styles.timeText}>{formatTime(position)}</Text>
            <Text style={styles.timeText}>{formatTime(duration)}</Text>
          </View>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.controlButton, !canGoPrevious && styles.controlButtonDisabled]}
            onPress={previous}
            disabled={!canGoPrevious}
          >
            <Ionicons name="play-skip-back" size={32} color={canGoPrevious ? theme.text : theme.textTertiary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.playButtonLarge} onPress={handlePlayPause}>
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={48}
              color={theme.background}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, !canGoNext && styles.controlButtonDisabled]}
            onPress={next}
            disabled={!canGoNext}
          >
            <Ionicons name="play-skip-forward" size={32} color={canGoNext ? theme.text : theme.textTertiary} />
          </TouchableOpacity>
        </View>

        {queue.length > 1 && (
          <Text style={styles.queueInfo}>
            {currentIndex + 1} of {queue.length} in queue
          </Text>
        )}
      </View>
    </View>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    closeButton: {
      padding: spacing.md,
      alignSelf: 'flex-start',
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.xl,
      justifyContent: 'center',
    },
    artwork: {
      width: '100%',
      aspectRatio: 1,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.xl,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.xl,
    },
    info: {
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: theme.text,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    artist: {
      fontSize: typography.fontSizes.lg,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    tags: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: spacing.xs,
      flexWrap: 'wrap',
    },
    tag: {
      backgroundColor: theme.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    tagText: {
      fontSize: typography.fontSizes.xs,
      color: theme.primary,
    },
    progressSection: {
      marginBottom: spacing.xl,
    },
    slider: {
      width: '100%',
      height: 40,
    },
    timeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    timeText: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
    },
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.xl,
      marginBottom: spacing.md,
    },
    controlButton: {
      padding: spacing.sm,
    },
    controlButtonDisabled: {
      opacity: 0.3,
    },
    playButtonLarge: {
      backgroundColor: theme.primary,
      width: 80,
      height: 80,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
    queueInfo: {
      fontSize: typography.fontSizes.sm,
      color: theme.textTertiary,
      textAlign: 'center',
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    emptyText: {
      fontSize: typography.fontSizes.lg,
      color: theme.textSecondary,
    },
  });
}
