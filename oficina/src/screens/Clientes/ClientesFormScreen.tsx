import FormScreen from '../../components/FormScreen';
import { clientes } from '../../entities';

// Cadastrar (POST)
export default function ClientesFormScreen() {
  return <FormScreen entity={clientes} />;
}
