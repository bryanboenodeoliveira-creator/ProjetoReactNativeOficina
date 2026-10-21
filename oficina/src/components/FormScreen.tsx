import { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { api } from '../api';
import { EntityDef } from '../entities';
import { Option, carregarOpcoes } from '../options';
import Btn from './Btn';
import ErroBox from './ErroBox';
import Loading from './Loading';
import Select from './Select';

// Sem "id" => cadastrar (POST). Com "id" => atualizar (PUT).
// Ao salvar, a tela é SUBSTITUÍDA pela tela de sucesso: voltar não retorna ao formulário.
export default function FormScreen({ entity, id }: { entity: EntityDef; id?: string }) {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const editando = !!id;
  const campos = entity.fields.filter((f) => !f.soEdicao || editando);

  const [valores, setValores] = useState<Record<string, string>>({});
  const [opcoes, setOpcoes] = useState<Record<string, Option[]>>({});
  const [foco, setFoco] = useState('');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const ops: Record<string, Option[]> = {};
        for (const f of campos) if (f.opcoes) ops[f.name] = await carregarOpcoes(f.opcoes);
        setOpcoes(ops);
        if (id) {
          const item = await api.get<any>(entity.resource, id);
          const v: Record<string, string> = {};
          for (const f of campos) {
            const bruto = item[f.name] == null ? '' : String(item[f.name]);
            v[f.name] = f.tipo === 'moeda' ? bruto.replace('.', ',') : bruto;
          }
          setValores(v);
        }
      } catch (e: any) {
        setErro(e.message);
      } finally {
        setCarregando(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, entity]);

  async function salvar() {
    for (const f of campos) {
      if (f.obrigatorio && !(valores[f.name] ?? '').trim()) {
        setErro(`Preencha o campo: ${f.label}`);
        return;
      }
    }
    const corpo: Record<string, string> = {};
    for (const f of campos) {
      let v = (valores[f.name] ?? '').trim();
      if (f.tipo === 'moeda') v = v.replace(',', '.');
      if (f.maiuscula) v = v.toUpperCase();
      if (v !== '' || editando) corpo[f.name] = v;
    }
    try {
      setSalvando(true);
      setErro('');
      const salvo = id
        ? await api.update<any>(entity.resource, id, corpo)
        : await api.create<any>(entity.resource, corpo);

      let titulo = entity.singular;
      try {
        titulo = entity.titleOf(salvo, { clientes: {}, veiculos: {} }) || entity.singular;
      } catch {}
      nav.replace('Sucesso', {
        screen: entity.screen,
        tipo: id ? 'editado' : 'criado',
        id: salvo.id,
        titulo,
      });
    } catch (e: any) {
      setErro(e.message);
      setSalvando(false);
    }
  }

  if (carregando) return <Loading />;

  return (
    <KeyboardAvoidingView className="flex-1 bg-canvas" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: insets.bottom + 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <ErroBox mensagem={erro} />
        {campos.map((f) => (
          <View key={f.name} className="mb-1">
            <Text className="text-sm font-bold text-ink mb-2">
              {f.label}
              {f.obrigatorio && <Text className="text-brand-600"> *</Text>}
            </Text>
            {f.opcoes ? (
              <Select
                options={opcoes[f.name] ?? []}
                value={valores[f.name] ?? ''}
                onChange={(v) => setValores({ ...valores, [f.name]: v })}
              />
            ) : (
              <View
                className={`${foco === f.name ? 'border-brand-500' : 'border-line'} flex-row items-center bg-white border-2 rounded-2xl px-4 mb-4`}
              >
                <Ionicons name={f.icone} size={20} color={foco === f.name ? '#EA6341' : '#B8A9A3'} />
                <TextInput
                  className="flex-1 py-3.5 px-3 text-base text-ink"
                  value={valores[f.name] ?? ''}
                  onChangeText={(t) => setValores({ ...valores, [f.name]: t })}
                  onFocus={() => setFoco(f.name)}
                  onBlur={() => setFoco('')}
                  keyboardType={f.teclado ?? 'default'}
                  autoCapitalize={f.teclado === 'email-address' ? 'none' : f.maiuscula ? 'characters' : 'sentences'}
                  placeholder={f.label}
                  placeholderTextColor="#B8A9A3"
                />
              </View>
            )}
          </View>
        ))}
        <View className="mt-2">
          <Btn
            title={salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar'}
            icone="save"
            onPress={salvar}
            disabled={salvando}
          />
          <Btn title="Cancelar" variant="neutral" onPress={() => nav.goBack()} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
