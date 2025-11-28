import React from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button } from '@iconicedu/ui-native';

export default function Home() {
  return (
    <SafeAreaView className="flex-1 bg-slate-950">
      <View className="flex-1 px-4 pt-10 gap-4">
        <Text className="text-xl font-semibold text-white">ICONIC EDU</Text>
        <Text className="text-sm text-slate-300">
          Parent and student companion app. Wire Supabase auth to enable sign-in.
        </Text>
        <View className="flex-row gap-3 mt-4">
          <Button label="Sign in as Parent" />
          <Button label="Student" variant="secondary" />
        </View>
      </View>
    </SafeAreaView>
  );
}
