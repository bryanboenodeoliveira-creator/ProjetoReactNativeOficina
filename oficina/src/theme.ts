import { Ionicons } from '@expo/vector-icons';

export type IconName = keyof typeof Ionicons.glyphMap;

export const cores = {
  brand500: '#F97E5B',
  brand600: '#EA6341',
  brand700: '#C94B2C',
  brand100: '#FFE8E0',
  canvas: '#FFF8F5',
  ink: '#3B2A25',
  muted: '#8A7A74',
  line: '#F1DDD5',
};

// cores dos status das ordens de serviço
export const statusCores: Record<string, { bg: string; fg: string; icone: IconName }> = {
  Aberta: { bg: '#FEF3C7', fg: '#B45309', icone: 'time' },
  'Em andamento': { bg: '#DBEAFE', fg: '#1D4ED8', icone: 'construct' },
  Concluída: { bg: '#DCFCE7', fg: '#15803D', icone: 'checkmark-circle' },
  Cancelada: { bg: '#FEE2E2', fg: '#B91C1C', icone: 'close-circle' },
};
