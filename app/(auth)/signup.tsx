import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, useColorScheme, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../../lib/db';
import { colors, spacing, typography, borderRadius } from '../../theme';

export default function SignUp() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? colors.dark : colors.light;
  const styles = makeStyles(theme);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      await db.auth.signUp(username, email, password);
      router.replace('/(tabs)/feed');
    } catch (_error) {
      Alert.alert('Sign Up Failed', 'Username or email may already be taken');
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Join Deep Cut</Text>
        <Text style={styles.subtitle}>Get early feedback on your beats</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={theme.textTertiary}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor={theme.textTertiary}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor={theme.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <TextInput
            style={styles.input}
            placeholder="Confirm Password"
            placeholderTextColor={theme.textTertiary}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Creating account...' : 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.back()}
            disabled={loading}
          >
            <Text style={styles.linkText}>
              Already have an account? <Text style={styles.linkTextBold}>Sign in</Text>
            </Text>
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
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xxl,
    },
    title: {
      fontSize: typography.fontSizes.xxl,
      fontWeight: typography.fontWeights.bold,
      color: theme.primary,
      textAlign: 'center',
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: typography.fontSizes.md,
      color: theme.textSecondary,
      textAlign: 'center',
      marginBottom: spacing.xxl,
    },
    form: {
      gap: spacing.md,
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
    linkText: {
      fontSize: typography.fontSizes.sm,
      color: theme.textSecondary,
      textAlign: 'center',
      marginTop: spacing.md,
    },
    linkTextBold: {
      color: theme.primary,
      fontWeight: typography.fontWeights.semibold,
    },
  });
}
