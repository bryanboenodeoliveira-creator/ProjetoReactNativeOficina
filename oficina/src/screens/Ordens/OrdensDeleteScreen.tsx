import DeleteScreen from '../../components/DeleteScreen';
import { ordens } from '../../entities';

// Excluir (DELETE)
export default function OrdensDeleteScreen({ route }: any) {
  return <DeleteScreen entity={ordens} id={route.params.id} />;
}
