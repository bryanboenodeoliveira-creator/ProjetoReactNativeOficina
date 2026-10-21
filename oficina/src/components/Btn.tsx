import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { IconName } from '../theme';

type Variant = 'primary' | 'secondary' | 'danger' | 'dangerOutline' | 'neutral';

const estilos: Record<Variant, { box: string; text: string; icon: string }> = {
  primary: { box: 'bg-brand-500', text: 'text-white', icon: '#FFFFFF' },
  secondary: { box: 'bg-white border border-brand-500', text: 'text-brand-700', icon: '#C94B2C' },
  danger: { box: 'bg-red-600', text: 'text-white', icon: '#FFFFFF' },
  dangerOutline: { box: 'bg-white border border-red-300', text: 'text-red-600', icon: '#DC2626' },
  neutral: { box: 'bg-stone-200', text: 'text-stone-700', icon: '#44403C' },
};

type Props = {
  title: string;
  onPress: () => void;
  variant?: Variant;
  icone?: IconName;
  disabled?: boolean;
};

export default function Btn({ title, onPress, variant = 'primary', icone, disabled }: Props) {
  const e = estilos[variant];
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      className={`${e.box} ${disabled ? 'opacity-50' : ''} flex-row items-center justify-center rounded-2xl py-4 px-5 mb-3`}
    >
      {icone && <Ionicons name={icone} size={20} color={e.icon} style={{ marginRight: 8 }} />}
      <Text className={`${e.text} font-bold text-base`}>{title}</Text>
    </TouchableOpacity>
  );
}
