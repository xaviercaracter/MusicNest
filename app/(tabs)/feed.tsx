import { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, useColorScheme, TouchableOpacity, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, Beat } from '../../lib/db';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function Feed() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const [beats, setBeats] = useState<Beat[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loadBeats() {
    try {
      const data = await db.beats.list();
      setBeats(data);
    } catch (error) {
      console.error('Failed to load beats:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadBeats();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    loadBeats();
  }

  function renderBeat({ item }: { item: Beat }) {
    return (
      <TouchableOpacity
        style={styles.beatCard}
        onPress={() => router.push(`/beat/${item.id}`)}
      >
        <View style={styles.beatHeader}>
          <View>
            <Text style={styles.beatTitle}>{item.title}</Text>
            <Text style={styles.beatAuthor}>
              {item.expand?.userId?.username || 'Unknown'}
            </Text>
          </View>
          <View style={styles.beatMeta}>
            {item.bpm && <Text style={styles.beatMetaText}>{item.bpm} BPM</Text>}
            {item.key && <Text style={styles.beatMetaText}>{item.key}</Text>}
          </View>
        </View>

        {item.tags && item.tags.length > 0 && (
          <View style={styles.tags}>
            {item.tags.slice(0, 3).map((tag, idx) => (
              <View key={idx} style={styles.tag}>
                <Text style={styles.tagText}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.beatStats}>
          <View style={styles.stat}>
            <Ionicons name="play" size={16} color={theme.textSecondary} />
            <Text style={styles.statText}>{item.plays}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="heart" size={16} color={theme.textSecondary} />
            <Text style={styles.statText}>{item.likes}</Text>
          </View>
          <View style={styles.stat}>
            <Ionicons name="chatbubble" size={16} color={theme.textSecondary} />
            <Text style={styles.statText}>{item.comments}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Loading beats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={beats}
        renderItem={renderBeat}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={theme.primary} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No beats yet. Be the first to upload!</Text>
          </View>
        }
      />
    </View>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    list: {
      padding: spacing.md,
      gap: spacing.md,
    },
    beatCard: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.border,
    },
    beatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: spacing.sm,
    },
    beatTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    beatAuthor: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
    },
    beatMeta: {
      gap: spacing.xs,
      alignItems: 'flex-end',
    },
    beatMetaText: {
      fontSize: typography.fontSizes.xs,
      color: theme.textTertiary,
    },
    tags: {
      flexDirection: 'row',
      gap: spacing.xs,
      marginBottom: spacing.sm,
    },
    tag: {
      backgroundColor: theme.surfaceElevated,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    tagText: {
      fontSize: typography.fontSizes.xs,
      color: theme.primary,
    },
    beatStats: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    stat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    statText: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
    },
    empty: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyText: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
    },
  });
}
