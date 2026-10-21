import FormScreen from '../../components/FormScreen';
import { clientes } from '../../entities';

// Atualizar (PUT)
export default function ClientesEditScreen({ route }: any) {
  return <FormScreen entity={clientes} id={route.params.id} />;
}
