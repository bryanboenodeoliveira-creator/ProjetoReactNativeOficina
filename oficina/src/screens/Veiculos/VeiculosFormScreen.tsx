import FormScreen from '../../components/FormScreen';
import { veiculos } from '../../entities';

// Cadastrar (POST)
export default function VeiculosFormScreen() {
  return <FormScreen entity={veiculos} />;
}
