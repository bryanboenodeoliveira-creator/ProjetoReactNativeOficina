// Troque pelo IPv4 do seu computador (o mesmo que funcionou no navegador do celular)
export const API_URL = 'http://172.20.40.135:3000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(API_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch {
    throw new Error('Não foi possível conectar à API. Verifique se ela está rodando e o IP em src/api.ts.');
  }
  if (res.status === 204) return undefined as T;
  const dados = await res.json().catch(() => null);
  if (!res.ok) throw new Error(dados?.erro ?? `Erro ${res.status}`);
  return dados as T;
}

export const api = {
  list: <T>(recurso: string) => request<T[]>(`/${recurso}`),
  get: <T>(recurso: string, id: string) => request<T>(`/${recurso}/${id}`),
  create: <T>(recurso: string, corpo: object) =>
    request<T>(`/${recurso}`, { method: 'POST', body: JSON.stringify(corpo) }),
  update: <T>(recurso: string, id: string, corpo: object) =>
    request<T>(`/${recurso}/${id}`, { method: 'PUT', body: JSON.stringify(corpo) }),
  remove: (recurso: string, id: string) =>
    request<void>(`/${recurso}/${id}`, { method: 'DELETE' }),
};
