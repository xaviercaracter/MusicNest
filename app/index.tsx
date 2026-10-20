import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { db } from '../lib/db';
import { colors } from '../theme';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    if (db.auth.isAuthenticated) {
      router.replace('/(tabs)/feed');
    } else {
      router.replace('/(auth)/signin');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.dark.background }}>
      <ActivityIndicator size="large" color={colors.dark.primary} />
    </View>
  );
}
