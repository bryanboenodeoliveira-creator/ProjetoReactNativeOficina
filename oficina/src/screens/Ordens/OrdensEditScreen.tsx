import FormScreen from '../../components/FormScreen';
import { ordens } from '../../entities';

// Atualizar (PUT)
export default function OrdensEditScreen({ route }: any) {
  return <FormScreen entity={ordens} id={route.params.id} />;
}
