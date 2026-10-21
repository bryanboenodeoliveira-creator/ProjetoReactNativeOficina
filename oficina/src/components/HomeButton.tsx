import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { irParaHome } from '../nav';

// Botão fixo no cabeçalho de todas as telas: volta direto para o início
export default function HomeButton({ navigation }: { navigation: any }) {
  return (
    <TouchableOpacity
      onPress={() => irParaHome(navigation)}
      accessibilityLabel="Ir para o início"
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      style={{ padding: 4 }}
    >
      <Ionicons name="home" size={24} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
