import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { statusCores } from '../theme';

export default function Badge({ status }: { status: string }) {
  const c = statusCores[status] ?? { bg: '#E7E5E4', fg: '#44403C', icone: 'ellipse' as const };
  return (
    <View style={{ backgroundColor: c.bg }} className="flex-row items-center self-start rounded-full px-3 py-1">
      <Ionicons name={c.icone} size={13} color={c.fg} />
      <Text style={{ color: c.fg }} className="text-xs font-bold ml-1">{status}</Text>
    </View>
  );
}
