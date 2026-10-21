import DetailScreen from '../../components/DetailScreen';
import { veiculos } from '../../entities';

export default function VeiculosDetailScreen({ route }: any) {
  return <DetailScreen entity={veiculos} id={route.params.id} />;
}
