import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Option } from '../options';

type Props = { options: Option[]; value: string; onChange: (v: string) => void };

export default function Select({ options, value, onChange }: Props) {
  if (options.length === 0) {
    return (
      <View className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-4">
        <Text className="text-amber-800">Nenhuma opção disponível. Cadastre antes de continuar.</Text>
      </View>
    );
  }
  return (
    <View className="flex-row flex-wrap mb-3">
      {options.map((o) => {
        const ativo = o.value === value;
        return (
          <TouchableOpacity
            key={o.value}
            activeOpacity={0.8}
            onPress={() => onChange(o.value)}
            className={`${ativo ? 'bg-brand-500 border-brand-500' : 'bg-white border-line'} flex-row items-center border rounded-full px-4 py-2.5 mr-2 mb-2`}
          >
            {ativo && <Ionicons name="checkmark" size={16} color="#FFFFFF" style={{ marginRight: 4 }} />}
            <Text className={ativo ? 'text-white font-bold' : 'text-ink'}>{o.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
