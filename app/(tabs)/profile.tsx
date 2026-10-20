import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, Beat } from '../../lib/db';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function Profile() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const [beats, setBeats] = useState<Beat[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = db.auth.currentUser;

  useEffect(() => {
    (async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const data = await db.beats.getUserBeats(currentUser.id);
        setBeats(data);
      } catch (error) {
        console.error('Failed to load beats:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentUser]);

  function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => {
            db.auth.signOut();
            router.replace('/(auth)/signin');
          },
        },
      ]
    );
  }

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>Please sign in</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color={theme.text} />
        </View>
        <Text style={styles.username}>{currentUser.username}</Text>
        {currentUser.bio && <Text style={styles.bio}>{currentUser.bio}</Text>}

        <View style={styles.creditsCard}>
          <Text style={styles.creditsLabel}>Feedback Credits</Text>
          <Text style={styles.creditsValue}>{currentUser.feedbackCredits}</Text>
          <Text style={styles.creditsInfo}>
            Earn credits by giving feedback on others&apos; beats
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Beats ({beats.length})</Text>
        {loading ? (
          <Text style={styles.emptyText}>Loading...</Text>
        ) : beats.length === 0 ? (
          <Text style={styles.emptyText}>You haven&apos;t uploaded any beats yet</Text>
        ) : (
          beats.map((beat) => (
            <TouchableOpacity
              key={beat.id}
              style={styles.beatItem}
              onPress={() => router.push(`/beat/${beat.id}`)}
            >
              <View style={styles.beatInfo}>
                <Text style={styles.beatTitle}>{beat.title}</Text>
                <View style={styles.beatStats}>
                  <View style={styles.stat}>
                    <Ionicons name="play" size={14} color={theme.textSecondary} />
                    <Text style={styles.statText}>{beat.plays}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="heart" size={14} color={theme.textSecondary} />
                    <Text style={styles.statText}>{beat.likes}</Text>
                  </View>
                  <View style={styles.stat}>
                    <Ionicons name="chatbubble" size={14} color={theme.textSecondary} />
                    <Text style={styles.statText}>{beat.comments}</Text>
                  </View>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color={theme.textTertiary} />
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      padding: spacing.lg,
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: borderRadius.full,
      backgroundColor: theme.surface,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: spacing.md,
    },
    username: {
      fontSize: typography.fontSizes.xl,
      fontWeight: typography.fontWeights.bold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    bio: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.md,
    },
    creditsCard: {
      backgroundColor: theme.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.md,
      width: '100%',
    },
    creditsLabel: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      marginBottom: spacing.xs,
    },
    creditsValue: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: theme.primary,
      marginBottom: spacing.xs,
    },
    creditsInfo: {
      fontSize: typography.fontSizes.xs,
      color: theme.textTertiary,
      textAlign: 'center',
    },
    section: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.bold,
      color: theme.text,
      marginBottom: spacing.md,
    },
    beatItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: theme.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      marginBottom: spacing.sm,
    },
    beatInfo: {
      flex: 1,
    },
    beatTitle: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
      color: theme.text,
      marginBottom: spacing.xs,
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
    signOutButton: {
      margin: spacing.lg,
      padding: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.error,
    },
    signOutText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.medium,
      color: theme.error,
    },
    emptyText: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.xl,
    },
  });
}
