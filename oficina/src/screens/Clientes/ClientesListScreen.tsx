import ListScreen from '../../components/ListScreen';
import { clientes } from '../../entities';

export default function ClientesListScreen() {
  return <ListScreen entity={clientes} />;
}
