import { api } from './api';
import { Cliente, Contexto, Veiculo } from './types';

export type Option = { value: string; label: string };
export type OptionSource = 'clientes' | 'veiculos' | 'status';

export const STATUS = ['Aberta', 'Em andamento', 'Concluída', 'Cancelada'];

export async function carregarOpcoes(origem: OptionSource): Promise<Option[]> {
  if (origem === 'status') return STATUS.map((s) => ({ value: s, label: s }));
  if (origem === 'clientes') {
    const lista = await api.list<Cliente>('clientes');
    return lista.map((c) => ({ value: c.id, label: c.nome }));
  }
  const lista = await api.list<Veiculo>('veiculos');
  return lista.map((v) => ({ value: v.id, label: `${v.modelo} (${v.placa})` }));
}

export async function carregarContexto(precisa: ('clientes' | 'veiculos')[] = []): Promise<Contexto> {
  const ctx: Contexto = { clientes: {}, veiculos: {} };
  if (precisa.includes('clientes')) {
    for (const c of await api.list<Cliente>('clientes')) ctx.clientes[c.id] = c.nome;
  }
  if (precisa.includes('veiculos')) {
    for (const v of await api.list<Veiculo>('veiculos')) ctx.veiculos[v.id] = `${v.modelo} (${v.placa})`;
  }
  return ctx;
}
