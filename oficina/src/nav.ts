import { EntityDef } from './entities';

// Volta direto para o início, limpando o histórico
export function irParaHome(nav: any) {
  nav.reset({ index: 0, routes: [{ name: 'Home' }] });
}

// Vai para a lista da categoria (Início > Lista), sem deixar formulários no histórico
export function irParaLista(nav: any, entity: EntityDef) {
  nav.reset({ index: 1, routes: [{ name: 'Home' }, { name: `${entity.screen}List` }] });
}
