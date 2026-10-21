import { useCallback, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import { EntityDef } from '../entities';
import { dataHora, moeda } from '../format';
import { carregarContexto, carregarOpcoes } from '../options';
import { Contexto } from '../types';
import Badge from './Badge';
import Btn from './Btn';
import ErroBox from './ErroBox';
import Loading from './Loading';

export default function DetailScreen({ entity, id }: { entity: EntityDef; id: string }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [item, setItem] = useState<any>(null);
  const [ctx, setCtx] = useState<Contexto>({ clientes: {}, veiculos: {} });
  const [rotulos, setRotulos] = useState<Record<string, string>>({});
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setErro('');
          const dados = await api.get<any>(entity.resource, id);
          const mapa: Record<string, string> = {};
          for (const f of entity.fields) {
            if (f.opcoes) {
              const ops = await carregarOpcoes(f.opcoes);
              mapa[f.name] = ops.find((o) => o.value === dados[f.name])?.label ?? String(dados[f.name] ?? '');
            }
          }
          setCtx(await carregarContexto(entity.precisa));
          setRotulos(mapa);
          setItem(dados);
        } catch (e: any) {
          setErro(e.message);
        } finally {
          setCarregando(false);
        }
      })();
    }, [entity, id]),
  );

  if (carregando) return <Loading />;

  function valorDe(f: (typeof entity.fields)[number]) {
    if (rotulos[f.name] !== undefined) return rotulos[f.name];
    const v = item[f.name];
    if (v === undefined || v === null || v === '') return '—';
    return f.tipo === 'moeda' ? moeda(v) : String(v);
  }

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 24 }}
    >
      <ErroBox mensagem={erro} />
      {item && (
        <>
          <View className="items-center bg-white rounded-3xl border border-line p-6 mb-4">
            <View className="w-20 h-20 rounded-full bg-brand-100 items-center justify-center mb-3">
              <Ionicons name={entity.icone} size={40} color="#EA6341" />
            </View>
            <Text className="text-xl font-extrabold text-ink text-center">{entity.titleOf(item, ctx)}</Text>
            <Text className="text-muted text-center mt-1 mb-1">{entity.subtitleOf(item, ctx)}</Text>
            {entity.comStatus && (
              <View className="mt-2">
                <Badge status={item.status} />
              </View>
            )}
          </View>

          <View className="bg-white rounded-3xl border border-line px-4 pt-4 mb-5">
            {entity.fields.map((f) => (
              <View key={f.name} className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-xl bg-brand-50 items-center justify-center mr-3">
                  <Ionicons name={f.icone} size={20} color="#EA6341" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs uppercase text-muted">{f.label}</Text>
                  <Text className="text-base text-ink font-semibold">{valorDe(f)}</Text>
                </View>
              </View>
            ))}
            {!!item.dataAbertura && (
              <View className="flex-row items-center mb-4">
                <View className="w-10 h-10 rounded-xl bg-brand-50 items-center justify-center mr-3">
                  <Ionicons name="time" size={20} color="#EA6341" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs uppercase text-muted">Aberta em</Text>
                  <Text className="text-base text-ink font-semibold">{dataHora(item.dataAbertura)}</Text>
                </View>
              </View>
            )}
          </View>

          <Btn title="Editar" icone="create" onPress={() => nav.navigate(`${entity.screen}Edit`, { id })} />
          <Btn title="Excluir" icone="trash" variant="dangerOutline" onPress={() => nav.navigate(`${entity.screen}Delete`, { id })} />
        </>
      )}
    </ScrollView>
  );
}
