import { OptionSource } from './options';
import { IconName } from './theme';
import { Contexto } from './types';

export type FieldDef = {
  name: string;
  label: string;
  icone: IconName;
  obrigatorio?: boolean;
  teclado?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'decimal-pad';
  opcoes?: OptionSource; // vira um seletor
  soEdicao?: boolean; // só aparece ao editar
  tipo?: 'moeda';
  maiuscula?: boolean;
};

export type EntityDef = {
  screen: string; // prefixo das rotas: ClientesList, ClientesDetail...
  resource: string; // caminho na API
  singular: string;
  plural: string;
  novo: string; // texto do botão de cadastrar
  icone: IconName;
  fields: FieldDef[];
  precisa?: ('clientes' | 'veiculos')[]; // dados extras para mostrar nomes
  comStatus?: boolean;
  titleOf: (i: any, ctx: Contexto) => string;
  subtitleOf: (i: any, ctx: Contexto) => string;
};

export const clientes: EntityDef = {
  screen: 'Clientes',
  resource: 'clientes',
  singular: 'cliente',
  plural: 'Clientes',
  novo: 'Novo cliente',
  icone: 'people',
  fields: [
    { name: 'nome', label: 'Nome', icone: 'person', obrigatorio: true },
    { name: 'email', label: 'E-mail', icone: 'mail', obrigatorio: true, teclado: 'email-address' },
    { name: 'telefone', label: 'Telefone', icone: 'call', teclado: 'phone-pad' },
  ],
  titleOf: (i) => i.nome,
  subtitleOf: (i) => i.email,
};

export const veiculos: EntityDef = {
  screen: 'Veiculos',
  resource: 'veiculos',
  singular: 'veículo',
  plural: 'Veículos',
  novo: 'Novo veículo',
  icone: 'car-sport',
  precisa: ['clientes'],
  fields: [
    { name: 'clienteId', label: 'Cliente (dono)', icone: 'person', obrigatorio: true, opcoes: 'clientes' },
    { name: 'placa', label: 'Placa', icone: 'card', obrigatorio: true, maiuscula: true },
    { name: 'modelo', label: 'Modelo', icone: 'car', obrigatorio: true },
    { name: 'marca', label: 'Marca', icone: 'pricetag' },
    { name: 'ano', label: 'Ano', icone: 'calendar', teclado: 'numeric' },
  ],
  titleOf: (i) => [i.marca, i.modelo].filter(Boolean).join(' '),
  subtitleOf: (i, ctx) => `${i.placa} • ${ctx.clientes[i.clienteId] ?? 'cliente removido'}`,
};

export const ordens: EntityDef = {
  screen: 'Ordens',
  resource: 'ordens-servico',
  singular: 'ordem de serviço',
  plural: 'Ordens de Serviço',
  novo: 'Nova ordem de serviço',
  icone: 'construct',
  precisa: ['veiculos'],
  comStatus: true,
  fields: [
    { name: 'veiculoId', label: 'Veículo', icone: 'car-sport', obrigatorio: true, opcoes: 'veiculos' },
    { name: 'descricao', label: 'Descrição do serviço', icone: 'document-text', obrigatorio: true },
    { name: 'valor', label: 'Valor (R$)', icone: 'cash', teclado: 'decimal-pad', tipo: 'moeda' },
    { name: 'status', label: 'Status', icone: 'flag', obrigatorio: true, opcoes: 'status', soEdicao: true },
  ],
  titleOf: (i) => i.descricao,
  subtitleOf: (i, ctx) => ctx.veiculos[i.veiculoId] ?? 'veículo removido',
};

export const entidadesPorTela: Record<string, EntityDef> = {
  Clientes: clientes,
  Veiculos: veiculos,
  Ordens: ordens,
};
