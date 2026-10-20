import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from '../theme';

interface MiniPlayerProps {
  title: string;
  artist: string;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export function MiniPlayer({
  title,
  artist,
  isPlaying,
  onPlayPause,
  onNext,
  onPrevious,
}: MiniPlayerProps) {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <Text style={styles.artist} numberOfLines={1}>
          {artist}
        </Text>
      </View>

      <View style={styles.controls}>
        {onPrevious && (
          <TouchableOpacity onPress={onPrevious} style={styles.controlButton}>
            <Ionicons name="play-skip-back" size={20} color={theme.text} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={onPlayPause} style={styles.playButton}>
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={24}
            color={theme.background}
          />
        </TouchableOpacity>

        {onNext && (
          <TouchableOpacity onPress={onNext} style={styles.controlButton}>
            <Ionicons name="play-skip-forward" size={20} color={theme.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      minHeight: 64,
    },
    info: {
      flex: 1,
      marginRight: spacing.md,
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
    controls: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    controlButton: {
      padding: spacing.xs,
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
