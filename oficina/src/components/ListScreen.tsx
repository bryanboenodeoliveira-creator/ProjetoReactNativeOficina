import { useCallback, useMemo, useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import { EntityDef } from '../entities';
import { moeda } from '../format';
import { carregarContexto, STATUS } from '../options';
import { Contexto } from '../types';
import Badge from './Badge';
import Empty from './Empty';
import ErroBox from './ErroBox';
import Loading from './Loading';

export default function ListScreen({ entity }: { entity: EntityDef }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [itens, setItens] = useState<any[]>([]);
  const [ctx, setCtx] = useState<Contexto>({ clientes: {}, veiculos: {} });
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const [erro, setErro] = useState('');
  const [busca, setBusca] = useState('');
  const [filtro, setFiltro] = useState('Todas');

  const carregar = useCallback(async () => {
    try {
      setErro('');
      const [lista, contexto] = await Promise.all([
        api.list<any>(entity.resource),
        carregarContexto(entity.precisa),
      ]);
      setItens(lista);
      setCtx(contexto);
    } catch (e: any) {
      setErro(e.message);
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [entity]);

  // recarrega sempre que a tela volta a ficar visível
  useFocusEffect(useCallback(() => { carregar(); }, [carregar]));

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return itens.filter((i) => {
      if (entity.comStatus && filtro !== 'Todas' && i.status !== filtro) return false;
      if (!termo) return true;
      const texto = [entity.titleOf(i, ctx), entity.subtitleOf(i, ctx), ...Object.values(i)].join(' ').toLowerCase();
      return texto.includes(termo);
    });
  }, [itens, ctx, busca, filtro, entity]);

  if (carregando) return <Loading />;

  return (
    <View className="flex-1 bg-canvas">
      <View className="px-4 pt-4">
        <View className="flex-row items-center bg-white border border-line rounded-2xl px-4 mb-3">
          <Ionicons name="search" size={20} color="#8A7A74" />
          <TextInput
            className="flex-1 py-3 px-2 text-base text-ink"
            placeholder={`Buscar em ${entity.plural.toLowerCase()}`}
            placeholderTextColor="#B8A9A3"
            value={busca}
            onChangeText={setBusca}
          />
          {busca.length > 0 && (
            <TouchableOpacity onPress={() => setBusca('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Ionicons name="close-circle" size={20} color="#B8A9A3" />
            </TouchableOpacity>
          )}
        </View>

        {entity.comStatus && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3 flex-grow-0">
            {['Todas', ...STATUS].map((s) => {
              const ativo = filtro === s;
              return (
                <TouchableOpacity
                  key={s}
                  onPress={() => setFiltro(s)}
                  className={`${ativo ? 'bg-brand-500 border-brand-500' : 'bg-white border-line'} border rounded-full px-4 py-2 mr-2`}
                >
                  <Text className={ativo ? 'text-white font-bold' : 'text-ink'}>{s}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
        <ErroBox mensagem={erro} />
      </View>

      <FlatList
        data={visiveis}
        keyExtractor={(i) => i.id}
        onRefresh={() => { setAtualizando(true); carregar(); }}
        refreshing={atualizando}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 110 }}
        ListEmptyComponent={
          itens.length === 0 ? (
            <Empty icone={entity.icone} titulo="Nada cadastrado ainda" texto="Toque no botão + para adicionar o primeiro." />
          ) : (
            <Empty icone="search" titulo="Nada encontrado" texto="Tente outro termo ou limpe os filtros." />
          )
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => nav.navigate(`${entity.screen}Detail`, { id: item.id })}
            className="flex-row items-center bg-white rounded-3xl p-4 mb-3 border border-line"
          >
            <View className="w-12 h-12 rounded-2xl bg-brand-100 items-center justify-center mr-3">
              <Ionicons name={entity.icone} size={24} color="#EA6341" />
            </View>
            <View className="flex-1 mr-2">
              <Text numberOfLines={1} className="text-base font-bold text-ink">{entity.titleOf(item, ctx)}</Text>
              <Text numberOfLines={1} className="text-sm text-muted mt-0.5">{entity.subtitleOf(item, ctx)}</Text>
            </View>
            {entity.comStatus ? (
              <View className="items-end">
                <Badge status={item.status} />
                {!!item.valor && <Text className="text-sm font-bold text-ink mt-1.5">{moeda(item.valor)}</Text>}
              </View>
            ) : (
              <Ionicons name="chevron-forward" size={20} color="#C9B8B0" />
            )}
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        activeOpacity={0.85}
        accessibilityLabel={entity.novo}
        onPress={() => nav.navigate(`${entity.screen}Form`)}
        style={{ position: 'absolute', right: 20, bottom: insets.bottom + 20, elevation: 6 }}
        className="flex-row items-center bg-brand-500 rounded-full pl-4 pr-5 py-4 shadow-lg"
      >
        <Ionicons name="add" size={26} color="#FFFFFF" />
        <Text className="text-white font-bold text-base ml-1">{entity.novo}</Text>
      </TouchableOpacity>
    </View>
  );
}
