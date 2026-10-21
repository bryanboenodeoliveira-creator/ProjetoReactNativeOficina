import DeleteScreen from '../../components/DeleteScreen';
import { clientes } from '../../entities';

// Excluir (DELETE)
export default function ClientesDeleteScreen({ route }: any) {
  return <DeleteScreen entity={clientes} id={route.params.id} />;
}
