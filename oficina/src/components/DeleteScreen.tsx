import { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import { EntityDef } from '../entities';
import { carregarContexto } from '../options';
import { Contexto } from '../types';
import Btn from './Btn';
import ErroBox from './ErroBox';
import Loading from './Loading';

export default function DeleteScreen({ entity, id }: { entity: EntityDef; id: string }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<any>(null);
  const [ctx, setCtx] = useState<Contexto>({ clientes: {}, veiculos: {} });
  const [carregando, setCarregando] = useState(true);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        setItem(await api.get<any>(entity.resource, id));
        setCtx(await carregarContexto(entity.precisa));
      } catch (e: any) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    })();
  }, [entity, id]);

  async function excluir() {
    try {
      setExcluindo(true);
      setErro('');
      await api.remove(entity.resource, id);
      // histórico limpo: Início > Lista > Sucesso (voltar nunca cai em registro excluído)
      nav.reset({
        index: 2,
        routes: [
          { name: 'Home' },
          { name: `${entity.screen}List` },
          { name: 'Sucesso', params: { screen: entity.screen, tipo: 'excluido', titulo: entity.titleOf(item, ctx) } },
        ],
      });
    } catch (e: any) {
      setErro(e.message); // ex.: 409 quando há registros vinculados
      setExcluindo(false);
    }
  }

  if (carregando) return <Loading />;

  return (
    <ScrollView className="flex-1 bg-canvas" contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}>
      <ErroBox mensagem={erro} />
      {item && (
        <View className="items-center bg-white rounded-3xl border border-line p-6 mb-5">
          <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-3">
            <Ionicons name="trash" size={38} color="#DC2626" />
          </View>
          <Text className="text-muted text-center">Tem certeza que deseja excluir?</Text>
          <Text className="text-xl font-extrabold text-ink text-center mt-1">{entity.titleOf(item, ctx)}</Text>
          <Text className="text-red-600 text-center mt-3">Essa ação não pode ser desfeita.</Text>
        </View>
      )}
      {item && (
        <Btn title={excluindo ? 'Excluindo...' : 'Sim, excluir'} icone="trash" variant="danger" onPress={excluir} disabled={excluindo} />
      )}
      <Btn title="Cancelar" variant="neutral" onPress={() => nav.goBack()} />
    </ScrollView>
  );
}
