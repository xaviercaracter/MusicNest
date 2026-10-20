import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, FlatList, RefreshControl } from 'react-native';
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

  async function loadBeats() {
    try {
      const data = await db.beats.list();
      setBeats(data);
    } catch (error) {
      console.error('Failed to load beats:', error);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const data = await db.beats.list();
        setBeats(data);
      } catch (error) {
        console.error('Failed to load beats:', error);
      }
    })();
  }, []);

  function handleRefresh() {
    setRefreshing(true);
    loadBeats();
  }

  function renderBeat({ item: beat }: { item: Beat }) {
    return (
      <TouchableOpacity
        style={styles.beatCard}
        onPress={() => router.push(`/beat/${beat.id}`)}
      >
        <View style={styles.beatHeader}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={20} color={theme.primary} />
            </View>
            <Text style={styles.username}>
              {beat.expand?.userId?.username || 'Unknown'}
            </Text>
          </View>
        </View>

        <View style={styles.beatContent}>
          <View style={styles.artwork}>
            <Ionicons name="musical-notes" size={32} color={theme.primary} />
          </View>
          <View style={styles.beatInfo}>
            <Text style={styles.beatTitle}>{beat.title}</Text>
            {beat.tags && beat.tags.length > 0 && (
              <View style={styles.tags}>
                {beat.tags.slice(0, 3).map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        <View style={styles.beatFooter}>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Ionicons name="play" size={16} color={theme.textSecondary} />
              <Text style={styles.statText}>{beat.plays}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="heart" size={16} color={theme.textSecondary} />
              <Text style={styles.statText}>{beat.likes}</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="chatbubble" size={16} color={theme.textSecondary} />
              <Text style={styles.statText}>{beat.comments}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={theme.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="musical-notes" size={48} color={theme.textTertiary} />
            <Text style={styles.emptyText}>No beats yet</Text>
            <Text style={styles.emptySubtext}>Upload the first beat!</Text>
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
    },
    beatCard: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.lg,
      marginBottom: spacing.md,
      overflow: 'hidden',
    },
    beatHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.md,
    },
    userInfo: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    avatar: {
      width: 32,
      height: 32,
      borderRadius: borderRadius.full,
      backgroundColor: theme.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    username: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
    },
    beatContent: {
      flexDirection: 'row',
      padding: spacing.md,
      paddingTop: 0,
      gap: spacing.md,
    },
    artwork: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.md,
      backgroundColor: theme.surfaceElevated,
      alignItems: 'center',
      justifyContent: 'center',
    },
    beatInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    beatTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
    },
    tag: {
      backgroundColor: theme.surfaceElevated,
      paddingHorizontal: spacing.sm,
      paddingVertical: 2,
      borderRadius: borderRadius.sm,
    },
    tagText: {
      fontSize: typography.fontSizes.xs,
      color: theme.primary,
    },
    beatFooter: {
      padding: spacing.md,
      paddingTop: 0,
    },
    stats: {
      flexDirection: 'row',
      gap: spacing.lg,
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
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxl,
    },
    emptyText: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.medium,
      color: theme.textSecondary,
      marginTop: spacing.md,
    },
    emptySubtext: {
      fontSize: typography.fontSizes.md,
      color: theme.textTertiary,
      marginTop: spacing.xs,
    },
  });
}
