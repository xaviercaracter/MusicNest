import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme, ScrollView, TextInput, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { db, Beat, Comment } from '../../lib/db';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function BeatDetail() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = params.id || '';
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const [beat, setBeat] = useState<Beat | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [commenting, setCommenting] = useState(false);

  useEffect(() => {
    loadBeat();
    loadComments();
    checkLiked();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function loadBeat() {
    try {
      const data = await db.beats.getById(id);
      setBeat(data);
    } catch (_error) {
      Alert.alert('Error', 'Failed to load beat');
      router.back();
    } finally {
      setLoading(false);
    }
  }

  async function loadComments() {
    try {
      const data = await db.comments.list(id);
      setComments(data);
    } catch (error) {
      console.error('Failed to load comments:', error);
    }
  }

  async function checkLiked() {
    const liked = await db.likes.check(id);
    setIsLiked(liked);
  }

  async function handleLike() {
    try {
      const liked = await db.likes.toggle(id);
      setIsLiked(liked);
    } catch (_error) {
      Alert.alert('Error', 'Please sign in to like beats');
    }
  }

  async function handleComment() {
    if (!newComment.trim()) return;

    setCommenting(true);
    try {
      await db.comments.create(id, newComment);
      setNewComment('');
      loadComments();
    } catch (_error) {
      Alert.alert('Error', 'Failed to post comment');
    } finally {
      setCommenting(false);
    }
  }

  async function handlePlay() {
    try {
      const { usePlayerStore } = await import('../../lib/player');
      const { loadBeat, play } = usePlayerStore.getState();
      await loadBeat(beat);
      await play();
    } catch (error) {
      console.error('Failed to play beat:', error);
    }
  }

  if (loading || !beat) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>{beat.title}</Text>
            <Text style={styles.author}>
              by {beat.expand?.userId?.username || 'Unknown'}
            </Text>
          </View>

          <View style={styles.metadata}>
            {beat.bpm && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>BPM</Text>
                <Text style={styles.metaValue}>{beat.bpm}</Text>
              </View>
            )}
            {beat.key && (
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Key</Text>
                <Text style={styles.metaValue}>{beat.key}</Text>
              </View>
            )}
          </View>

          {beat.tags && beat.tags.length > 0 && (
            <View style={styles.tags}>
              {beat.tags.map((tag, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.playButton}
              onPress={handlePlay}
            >
              <Ionicons name="play" size={24} color={theme.background} />
              <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleLike}
            >
              <Ionicons
                name={isLiked ? 'heart' : 'heart-outline'}
                size={24}
                color={isLiked ? theme.primary : theme.text}
              />
              <Text style={styles.actionText}>{beat.likes}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.sectionTitle}>Feedback ({comments.length})</Text>

          <View style={styles.commentInput}>
            <TextInput
              style={styles.input}
              placeholder="Share your feedback..."
              placeholderTextColor={theme.textTertiary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              editable={!commenting}
            />
            <TouchableOpacity
              style={[styles.commentButton, commenting && styles.commentButtonDisabled]}
              onPress={handleComment}
              disabled={commenting || !newComment.trim()}
            >
              <Ionicons name="send" size={20} color={theme.background} />
            </TouchableOpacity>
          </View>

          {comments.map((comment) => (
            <View key={comment.id} style={styles.comment}>
              <Text style={styles.commentAuthor}>
                {comment.expand?.userId?.username || 'Unknown'}
              </Text>
              <Text style={styles.commentContent}>{comment.content}</Text>
              <Text style={styles.commentTime}>
                {new Date(comment.created).toLocaleDateString()}
              </Text>
            </View>
          ))}

          {comments.length === 0 && (
            <Text style={styles.emptyText}>No feedback yet. Be the first!</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollView: {
      flex: 1,
    },
    centered: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      padding: spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.border,
    },
    titleSection: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    author: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
    },
    metadata: {
      flexDirection: 'row',
      gap: spacing.lg,
      marginBottom: spacing.md,
    },
    metaItem: {
      alignItems: 'center',
    },
    metaLabel: {
      fontSize: typography.fontSizes.xs,
      color: theme.textTertiary,
      marginBottom: spacing.xs,
    },
    metaValue: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: theme.text,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.xs,
      marginBottom: spacing.md,
    },
    tag: {
      backgroundColor: theme.surface,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tagText: {
      fontSize: typography.fontSizes.xs,
      color: theme.primary,
    },
    actions: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    playButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      backgroundColor: theme.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
    },
    playButtonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: theme.background,
    },
    actionButton: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: spacing.md,
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      minWidth: 60,
    },
    actionText: {
      fontSize: typography.fontSizes.sm,
      color: theme.text,
      marginTop: spacing.xs,
    },
    commentsSection: {
      padding: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.fontSizes.lg,
      fontWeight: typography.fontWeights.semibold,
      color: theme.text,
      marginBottom: spacing.md,
    },
    commentInput: {
      flexDirection: 'row',
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    input: {
      flex: 1,
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: typography.fontSizes.md,
      color: theme.text,
      minHeight: 60,
      maxHeight: 120,
    },
    commentButton: {
      backgroundColor: theme.primary,
      width: 48,
      height: 48,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      justifyContent: 'center',
    },
    commentButtonDisabled: {
      opacity: 0.5,
    },
    comment: {
      backgroundColor: theme.surface,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      marginBottom: spacing.sm,
      borderWidth: 1,
      borderColor: theme.border,
    },
    commentAuthor: {
      fontSize: typography.fontSizes.sm,
      fontWeight: typography.fontWeights.semibold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    commentContent: {
      fontSize: typography.fontSizes.md,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    commentTime: {
      fontSize: typography.fontSizes.xs,
      color: theme.textTertiary,
    },
    emptyText: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      paddingVertical: spacing.lg,
    },
  });
}
