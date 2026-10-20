import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePlayerStore } from '../lib/player';
import { colors, spacing, typography, borderRadius } from '../theme';

export function MiniPlayer() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const { currentBeat, isPlaying, position, duration, play, pause } = usePlayerStore();

  if (!currentBeat) return null;

  const progress = duration > 0 ? position / duration : 0;

  function handlePlayPause() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  function handlePress() {
    router.push('/player');
  }

  return (
    <Pressable style={styles.container} onPress={handlePress}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      <View style={styles.content}>
        <View style={styles.artPlaceholder}>
          <Ionicons name="musical-notes" size={20} color={theme.text} />
        </View>

        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {currentBeat.title}
          </Text>
          <Text style={styles.artist} numberOfLines={1}>
            {currentBeat.expand?.userId?.username || 'Unknown'}
          </Text>
        </View>

        <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={theme.background}
          />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
    },
    progressBar: {
      height: 2,
      backgroundColor: theme.border,
    },
    progressFill: {
      height: '100%',
      backgroundColor: theme.primary,
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: spacing.sm,
      gap: spacing.sm,
    },
    artPlaceholder: {
      width: 48,
      height: 48,
      borderRadius: borderRadius.sm,
      backgroundColor: theme.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    info: {
      flex: 1,
      marginRight: spacing.sm,
    },
    title: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: 2,
    },
    artist: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
    },
    playButton: {
      backgroundColor: theme.primary,
      width: 40,
      height: 40,
      borderRadius: borderRadius.full,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
}
