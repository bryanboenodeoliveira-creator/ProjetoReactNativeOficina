import DetailScreen from '../../components/DetailScreen';
import { clientes } from '../../entities';

export default function ClientesDetailScreen({ route }: any) {
  return <DetailScreen entity={clientes} id={route.params.id} />;
}
