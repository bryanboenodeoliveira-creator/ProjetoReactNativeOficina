import FormScreen from '../../components/FormScreen';
import { ordens } from '../../entities';

// Cadastrar (POST)
export default function OrdensFormScreen() {
  return <FormScreen entity={ordens} />;
}
