import { useEffect } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '@/lib/theme';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.systemGroupedBackground }}>
        <ActivityIndicator size="large" color={Colors.brand} />
      </View>
    );
  }

  return <Redirect href={user ? '/(tabs)/search' : '/login'} />;
}
