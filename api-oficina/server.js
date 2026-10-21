const express = require('express');
const cors = require('cors');
const { randomUUID } = require('crypto');

const app = express();
app.use(express.json());
app.use(cors());

// Bancos de dados simulados em memória
let clientes = [];
let veiculos = [];
let ordensServico = [];

const STATUS_VALIDOS = ['Aberta', 'Em andamento', 'Concluída', 'Cancelada'];

const novoId = () => randomUUID();
const vazio = (v) => v === undefined || v === null || String(v).trim() === '';
const faltando = (obj, campos) => campos.filter((c) => vazio(obj[c]));

// =====================================================
// CLIENTES
// =====================================================
app.get('/clientes', (req, res) => res.json(clientes));

app.get('/clientes/:id', (req, res) => {
  const cliente = clientes.find((c) => c.id == req.params.id);
  if (!cliente) return res.status(404).json({ erro: 'Cliente não encontrado' });
  res.json(cliente);
});

app.post('/clientes', (req, res) => {
  const f = faltando(req.body, ['nome', 'email']);
  if (f.length) return res.status(400).json({ erro: `Campos obrigatórios: ${f.join(', ')}` });

  const novo = { ...req.body, id: novoId() };
  clientes.push(novo);
  res.status(201).json(novo);
});

app.put('/clientes/:id', (req, res) => {
  const index = clientes.findIndex((c) => c.id == req.params.id);
  if (index < 0) return res.status(404).json({ erro: 'Cliente não encontrado' });

  const atualizado = { ...clientes[index], ...req.body, id: clientes[index].id };
  const f = faltando(atualizado, ['nome', 'email']);
  if (f.length) return res.status(400).json({ erro: `Campos obrigatórios: ${f.join(', ')}` });

  clientes[index] = atualizado;
  res.json(atualizado);
});

app.delete('/clientes/:id', (req, res) => {
  const index = clientes.findIndex((c) => c.id == req.params.id);
  if (index < 0) return res.status(404).json({ erro: 'Cliente não encontrado' });

  if (veiculos.some((v) => v.clienteId == req.params.id)) {
    return res.status(409).json({ erro: 'Cliente possui veículos cadastrados. Exclua-os antes.' });
  }
  if (ordensServico.some((o) => o.clienteId == req.params.id)) {
    return res.status(409).json({ erro: 'Cliente possui ordens de serviço. Exclua-as antes.' });
  }

  clientes.splice(index, 1);
  res.status(204).send();
});

// =====================================================
// VEÍCULOS
// =====================================================
app.get('/veiculos', (req, res) => res.json(veiculos));

app.get('/veiculos/:id', (req, res) => {
  const veiculo = veiculos.find((v) => v.id == req.params.id);
  if (!veiculo) return res.status(404).json({ erro: 'Veículo não encontrado' });
  res.json(veiculo);
});

app.post('/veiculos', (req, res) => {
  const f = faltando(req.body, ['clienteId', 'placa', 'modelo']);
  if (f.length) return res.status(400).json({ erro: `Campos obrigatórios: ${f.join(', ')}` });

  if (!clientes.some((c) => c.id == req.body.clienteId)) {
    return res.status(400).json({ erro: 'Cliente associado inexistente!' });
  }

  const novo = { ...req.body, id: novoId() };
  veiculos.push(novo);
  res.status(201).json(novo);
});

app.put('/veiculos/:id', (req, res) => {
  const index = veiculos.findIndex((v) => v.id == req.params.id);
  if (index < 0) return res.status(404).json({ erro: 'Veículo não encontrado' });

  const atualizado = { ...veiculos[index], ...req.body, id: veiculos[index].id };
  const f = faltando(atualizado, ['clienteId', 'placa', 'modelo']);
  if (f.length) return res.status(400).json({ erro: `Campos obrigatórios: ${f.join(', ')}` });

  if (!clientes.some((c) => c.id == atualizado.clienteId)) {
    return res.status(400).json({ erro: 'Cliente associado inexistente!' });
  }

  veiculos[index] = atualizado;
  res.json(atualizado);
});

app.delete('/veiculos/:id', (req, res) => {
  const index = veiculos.findIndex((v) => v.id == req.params.id);
  if (index < 0) return res.status(404).json({ erro: 'Veículo não encontrado' });

  if (ordensServico.some((o) => o.veiculoId == req.params.id)) {
    return res.status(409).json({ erro: 'Veículo possui ordens de serviço. Exclua-as antes.' });
  }

  veiculos.splice(index, 1);
  res.status(204).send();
});

// =====================================================
// ORDENS DE SERVIÇO
// =====================================================
app.get('/ordens-servico', (req, res) => res.json(ordensServico));

app.get('/ordens-servico/:id', (req, res) => {
  const os = ordensServico.find((o) => o.id == req.params.id);
  if (!os) return res.status(404).json({ erro: 'Ordem de serviço não encontrada' });
  res.json(os);
});

app.post('/ordens-servico', (req, res) => {
  const f = faltando(req.body, ['veiculoId', 'descricao']);
  if (f.length) return res.status(400).json({ erro: `Campos obrigatórios: ${f.join(', ')}` });

  const veiculo = veiculos.find((v) => v.id == req.body.veiculoId);
  if (!veiculo) return res.status(400).json({ erro: 'Veículo associado inexistente!' });

  if (!vazio(req.body.status) && !STATUS_VALIDOS.includes(req.body.status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
  }

  const novo = {
    ...req.body,
    id: novoId(),
    clienteId: veiculo.clienteId, // derivado do veículo, evita inconsistência
    status: vazio(req.body.status) ? 'Aberta' : req.body.status,
    dataAbertura: new Date().toISOString(),
  };
  ordensServico.push(novo);
  res.status(201).json(novo);
});

app.put('/ordens-servico/:id', (req, res) => {
  const index = ordensServico.findIndex((o) => o.id == req.params.id);
  if (index < 0) return res.status(404).json({ erro: 'Ordem de serviço não encontrada' });

  const atualizado = { ...ordensServico[index], ...req.body, id: ordensServico[index].id };

  const veiculo = veiculos.find((v) => v.id == atualizado.veiculoId);
  if (!veiculo) return res.status(400).json({ erro: 'Veículo associado inexistente!' });
  atualizado.clienteId = veiculo.clienteId;

  if (!STATUS_VALIDOS.includes(atualizado.status)) {
    return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
  }
  if (vazio(atualizado.descricao)) {
    return res.status(400).json({ erro: 'Campos obrigatórios: descricao' });
  }

  ordensServico[index] = atualizado;
  res.json(atualizado);
});

app.delete('/ordens-servico/:id', (req, res) => {
  const index = ordensServico.findIndex((o) => o.id == req.params.id);
  if (index < 0) return res.status(404).json({ erro: 'Ordem de serviço não encontrada' });

  ordensServico.splice(index, 1);
  res.status(204).send();
});

// JSON malformado
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ erro: 'JSON inválido' });
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

const PORT = process.env.PORT || 3000;
if (require.main === module) {
  app.listen(PORT, () => console.log(`API rodando na porta ${PORT} 🚀`));
}
module.exports = app;
