import FormScreen from '../../components/FormScreen';
import { veiculos } from '../../entities';

// Atualizar (PUT)
export default function VeiculosEditScreen({ route }: any) {
  return <FormScreen entity={veiculos} id={route.params.id} />;
}
