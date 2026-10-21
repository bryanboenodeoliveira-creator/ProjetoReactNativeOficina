import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconName } from '../theme';

export default function Empty({ icone, titulo, texto }: { icone: IconName; titulo: string; texto?: string }) {
  return (
    <View className="items-center mt-14 px-8">
      <View className="w-20 h-20 rounded-full bg-brand-100 items-center justify-center mb-4">
        <Ionicons name={icone} size={38} color="#EA6341" />
      </View>
      <Text className="text-lg font-bold text-ink text-center">{titulo}</Text>
      {!!texto && <Text className="text-muted text-center mt-1">{texto}</Text>}
    </View>
  );
}
