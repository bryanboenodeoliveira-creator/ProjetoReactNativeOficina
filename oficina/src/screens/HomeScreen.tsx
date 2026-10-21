import { useCallback, useState } from 'react';
import { Image, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import Btn from '../components/Btn';
import ErroBox from '../components/ErroBox';
import { clientes, ordens, veiculos } from '../entities';
import { IconName } from '../theme';

type Resumo = { clientes: number; veiculos: number; ordens: number; abertas: number };

const atalhos: { titulo: string; icone: IconName; rota: string }[] = [
  { titulo: 'Cliente', icone: 'person-add', rota: 'ClientesForm' },
  { titulo: 'Veículo', icone: 'car-sport', rota: 'VeiculosForm' },
  { titulo: 'Ordem', icone: 'construct', rota: 'OrdensForm' },
];

// proporção da ilustração (assets/hero.png)
const IMG_W = 1200;
const IMG_H = 860;

// Tela inicial SEM rolagem: o topo (ilustração) ocupa o espaço que sobra
// e os cards ficam fixos embaixo, sempre visíveis.
export default function HomeScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [heroH, setHeroH] = useState(0);
  const [resumo, setResumo] = useState<Resumo | null>(null);
  const [erro, setErro] = useState('');

  const carregar = useCallback(async () => {
    try {
      setErro('');
      const [c, v, o] = await Promise.all([
        api.list<any>('clientes'),
        api.list<any>('veiculos'),
        api.list<any>('ordens-servico'),
      ]);
      setResumo({
        clientes: c.length,
        veiculos: v.length,
        ordens: o.length,
        abertas: o.filter((x) => x.status === 'Aberta' || x.status === 'Em andamento').length,
      });
    } catch (e: any) {
      setResumo(null);
      setErro(e.message);
    }
  }, []);

  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const cards = [
    { entity: clientes, rota: 'ClientesList', texto: resumo ? `${resumo.clientes} cadastrado(s)` : 'Cadastro de clientes' },
    { entity: veiculos, rota: 'VeiculosList', texto: resumo ? `${resumo.veiculos} cadastrado(s)` : 'Carros dos clientes' },
    {
      entity: ordens,
      rota: 'OrdensList',
      texto: resumo ? `${resumo.abertas} em aberto • ${resumo.ordens} no total` : 'Serviços da oficina',
    },
  ];

  // ilustração cobre o topo sem distorcer, encostada à direita/embaixo (o carro sempre aparece)
  const escala = Math.max(heroH / IMG_H, width / IMG_W);

  return (
    <View className="flex-1 bg-canvas">
      {/* topo: ocupa todo o espaço livre */}
      <View
        style={{ flex: 1, minHeight: 200 }}
        className="overflow-hidden rounded-b-3xl bg-brand-400"
        onLayout={(e) => setHeroH(e.nativeEvent.layout.height)}
      >
        {heroH > 0 && (
          <Image
            source={require('../../assets/hero.png')}
            resizeMode="cover"
            style={{ position: 'absolute', right: 0, bottom: 0, width: IMG_W * escala, height: IMG_H * escala }}
          />
        )}
        <View style={{ paddingTop: insets.top + 20, paddingHorizontal: 24 }}>
          <Text className="text-white/90 text-base font-semibold">Bem-vindo(a) à</Text>
          <Text className="text-white text-4xl font-extrabold leading-tight">Oficina{'\n'}Mecânica</Text>
          <Text className="text-white/90 mt-2 max-w-[230px]">Clientes, veículos e ordens de serviço em um só lugar.</Text>
        </View>
      </View>

      {/* base: tamanho fixo, nunca rola */}
      <View style={{ paddingBottom: insets.bottom + 12 }} className="px-4 pt-4">
        <ErroBox mensagem={erro} />
        {!!erro && <Btn title="Tentar novamente" icone="refresh" variant="secondary" onPress={carregar} />}

        {cards.map(({ entity, rota, texto }) => (
          <TouchableOpacity
            key={rota}
            activeOpacity={0.85}
            onPress={() => nav.navigate(rota)}
            className="flex-row items-center bg-white rounded-3xl p-3 mb-2.5 border border-line"
          >
            <View className="w-12 h-12 rounded-2xl bg-brand-100 items-center justify-center mr-3">
              <Ionicons name={entity.icone} size={26} color="#EA6341" />
            </View>
            <View className="flex-1">
              <Text className="text-base font-extrabold text-ink">{entity.plural}</Text>
              <Text className="text-sm text-muted">{texto}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#C9B8B0" />
          </TouchableOpacity>
        ))}

        <View className="flex-row mt-1">
          {atalhos.map((a, i) => (
            <TouchableOpacity
              key={a.rota}
              activeOpacity={0.85}
              onPress={() => nav.navigate(a.rota)}
              className={`flex-1 flex-row items-center justify-center bg-brand-500 rounded-2xl py-3.5 ${i < atalhos.length - 1 ? 'mr-2' : ''}`}
            >
              <Ionicons name={a.icone} size={20} color="#FFFFFF" />
              <Text className="text-white font-bold ml-1.5">{a.titulo}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
