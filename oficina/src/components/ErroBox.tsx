import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ErroBox({ mensagem }: { mensagem: string }) {
  if (!mensagem) return null;
  return (
    <View className="flex-row items-start bg-red-50 border border-red-200 rounded-2xl p-3 mb-4">
      <Ionicons name="alert-circle" size={20} color="#DC2626" style={{ marginRight: 8, marginTop: 1 }} />
      <Text className="flex-1 text-red-700">{mensagem}</Text>
    </View>
  );
}
