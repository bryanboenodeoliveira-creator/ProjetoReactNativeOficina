import DetailScreen from '../../components/DetailScreen';
import { ordens } from '../../entities';

export default function OrdensDetailScreen({ route }: any) {
  return <DetailScreen entity={ordens} id={route.params.id} />;
}
