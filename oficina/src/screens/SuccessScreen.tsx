import { useEffect, useRef } from 'react';
import { Animated, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Btn from '../components/Btn';
import { entidadesPorTela } from '../entities';
import { irParaLista } from '../nav';

const textos = {
  criado: { titulo: 'Cadastro concluído!', sub: 'Registro salvo com sucesso.' },
  editado: { titulo: 'Alterações salvas!', sub: 'Registro atualizado com sucesso.' },
  excluido: { titulo: 'Exclusão concluída!', sub: 'Registro excluído com sucesso.' },
} as const;

// Tela mostrada depois de cadastrar, editar ou excluir.
// "Concluído" -> lista da categoria | "Editar" -> volta ao formulário já preenchido
export default function SuccessScreen({ route }: any) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { screen, tipo, id, titulo } = route.params as {
    screen: string; tipo: keyof typeof textos; id?: string; titulo: string;
  };
  const entity = entidadesPorTela[screen];
  const t = textos[tipo];
  const escala = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(escala, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }).start();
  }, [escala]);

  return (
    <ScrollView
      className="flex-1 bg-canvas"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24, paddingBottom: insets.bottom + 24 }}
    >
      <View className="items-center mb-8">
        <Animated.View
          style={{ transform: [{ scale: escala }] }}
          className={`${tipo === 'excluido' ? 'bg-stone-200' : 'bg-green-100'} w-32 h-32 rounded-full items-center justify-center mb-6`}
        >
          <Ionicons
            name={tipo === 'excluido' ? 'trash' : 'checkmark-circle'}
            size={78}
            color={tipo === 'excluido' ? '#57534E' : '#16A34A'}
          />
        </Animated.View>
        <Text className="text-2xl font-extrabold text-ink text-center">{t.titulo}</Text>
        <Text className="text-muted text-center mt-1">{t.sub}</Text>

        <View className="flex-row items-center bg-white border border-line rounded-2xl px-4 py-3 mt-5">
          <Ionicons name={entity.icone} size={22} color="#EA6341" />
          <View className="ml-3">
            <Text className="text-xs uppercase text-muted">{entity.singular}</Text>
            <Text numberOfLines={1} className="text-base font-bold text-ink max-w-[240px]">{titulo}</Text>
          </View>
        </View>
      </View>

      {tipo === 'excluido' ? (
        <Btn title="Voltar para a lista" icone="list" onPress={() => irParaLista(nav, entity)} />
      ) : (
        <>
          <Btn title="Concluído" icone="checkmark" onPress={() => irParaLista(nav, entity)} />
          <Btn
            title="Editar"
            icone="create"
            variant="secondary"
            onPress={() => nav.replace(`${entity.screen}Edit`, { id })}
          />
        </>
      )}
    </ScrollView>
  );
}
