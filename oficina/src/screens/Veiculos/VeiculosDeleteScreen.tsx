import DeleteScreen from '../../components/DeleteScreen';
import { veiculos } from '../../entities';

// Excluir (DELETE)
export default function VeiculosDeleteScreen({ route }: any) {
  return <DeleteScreen entity={veiculos} id={route.params.id} />;
}
