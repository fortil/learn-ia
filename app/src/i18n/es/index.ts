import common from './common';
import nav from './nav';
import footer from './footer';
import home from './home';
import mapa from './mapa';
import entrenar from './entrenar';
import ejemplos from './ejemplos';
import mitos from './mitos';
import quiz from './quiz';

/**
 * Spanish dictionary (source of truth). One module per namespace;
 * page agents add their own `<namespace>.ts` here and register it below.
 */
export default {
  common,
  nav,
  footer,
  home,
  mapa,
  entrenar,
  ejemplos,
  mitos,
  quiz,
};
