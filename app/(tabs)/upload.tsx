import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { db } from '../../lib/db';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function Upload() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const [title, setTitle] = useState('');
  const [bpm, setBpm] = useState('');
  const [key, setKey] = useState('');
  const [tags, setTags] = useState('');
  const [audioFile, setAudioFile] = useState<{ name: string; uri: string } | null>(null);
  const [loading, setLoading] = useState(false);

  async function pickAudioFile() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'audio/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setAudioFile({
          name: result.assets[0].name,
          uri: result.assets[0].uri,
        });
      }
    } catch (_error) {
      Alert.alert('Error', 'Failed to pick audio file');
    }
  }

  async function handleUpload() {
    if (!title || !audioFile) {
      Alert.alert('Error', 'Please provide a title and audio file');
      return;
    }

    setLoading(true);
    try {
      const tagList = tags
        .split(',')
        .map(t => t.trim())
        .filter(Boolean);

      await db.beats.create({
        title,
        audioUrl: audioFile.uri,
        bpm: bpm ? parseInt(bpm, 10) : undefined,
        key: key || undefined,
        tags: tagList.length > 0 ? tagList : undefined,
      });

      Alert.alert('Success', 'Beat uploaded!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (_error) {
      Alert.alert('Upload Failed', 'Please try again');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Upload Beat</Text>
        <Text style={styles.subtitle}>Share your latest creation</Text>

        <View style={styles.form}>
          <TouchableOpacity
            style={styles.filePicker}
            onPress={pickAudioFile}
            disabled={loading}
          >
            <Text style={styles.filePickerText}>
              {audioFile ? audioFile.name : 'Choose Audio File'}
            </Text>
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Beat Title"
            placeholderTextColor={theme.textTertiary}
            value={title}
            onChangeText={setTitle}
            editable={!loading}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="BPM"
              placeholderTextColor={theme.textTertiary}
              value={bpm}
              onChangeText={setBpm}
              keyboardType="number-pad"
              editable={!loading}
            />

            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="Key (e.g., Am)"
              placeholderTextColor={theme.textTertiary}
              value={key}
              onChangeText={setKey}
              autoCapitalize="characters"
              editable={!loading}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Tags (comma-separated)"
            placeholderTextColor={theme.textTertiary}
            value={tags}
            onChangeText={setTags}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={loading || !audioFile || !title}
          >
            <Text style={styles.buttonText}>{loading ? 'Uploading...' : 'Upload Beat'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

function makeStyles(theme: typeof colors.dark | typeof colors.light) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    content: {
      padding: spacing.lg,
    },
    title: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: theme.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      marginBottom: spacing.lg,
    },
    form: {
      gap: spacing.md,
    },
    filePicker: {
      backgroundColor: theme.surfaceElevated,
      borderWidth: 2,
      borderColor: theme.primary,
      borderStyle: 'dashed',
      borderRadius: borderRadius.md,
      padding: spacing.lg,
      alignItems: 'center',
    },
    filePickerText: {
      fontSize: typography.fontSizes.md,
      color: theme.primary,
      fontWeight: typography.fontWeights.medium,
    },
    input: {
      backgroundColor: theme.surface,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: borderRadius.md,
      padding: spacing.md,
      fontSize: typography.fontSizes.md,
      color: theme.text,
    },
    row: {
      flexDirection: 'row',
      gap: spacing.md,
    },
    halfInput: {
      flex: 1,
    },
    button: {
      backgroundColor: theme.primary,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      marginTop: spacing.sm,
    },
    buttonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: typography.fontSizes.md,
      fontWeight: typography.fontWeights.semibold,
      color: theme.background,
    },
  });
}
