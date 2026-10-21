export type Cliente = { id: string; nome: string; email: string; telefone?: string };
export type Veiculo = {
  id: string; clienteId: string; placa: string; modelo: string; marca?: string; ano?: string;
};
export type OrdemServico = {
  id: string; veiculoId: string; clienteId?: string; descricao: string;
  valor?: string; status: string; dataAbertura?: string;
};
// nomes para exibir no lugar dos ids (cliente do veículo, veículo da ordem)
export type Contexto = {
  clientes: Record<string, string>;
  veiculos: Record<string, string>;
};
