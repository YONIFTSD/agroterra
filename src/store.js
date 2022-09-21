import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import RoomControl from './modules/RoomControl'
import Shopping from './modules/Shopping'
import Costing from './modules/Costing'
import Input from './modules/Input'
import Output from './modules/Output'
import Sale from './modules/Sale'
import Requirement from './modules/Requirement'
import Transform from './modules/Transform'
import InitialKardex from './modules/InitialKardex'
import ReferralGuide from './modules/ReferralGuide'
import ExchangeDocument from './modules/ExchangeDocument'
import SettlementPayment from './modules/SettlementPayment'
import SettlementCollection from './modules/SettlementCollection'
import CreditDebitNote from './modules/CreditDebitNote'
import SalePOS from './modules/SalePOS'
import Quotation from './modules/Quotation'
import PurchaseOrder from './modules/PurchaseOrder'

const modules = {
  RoomControl,
  Shopping,
  Costing,
  Input,
  Output,
  Sale,
  Requirement,
  Transform,
  InitialKardex,
  ReferralGuide,
  ExchangeDocument,
  SettlementPayment,
  SettlementCollection,
  CreditDebitNote,
  SalePOS,
  Quotation,
  PurchaseOrder,
}

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: true,
  url_get_ip: 'https://api.ipify.org/?format=json',
  // url_base: 'https://agrofrontera.reyfact.com/api/',
  // url_base: 'https://agroplant.reyfact.com/api/',
  url_base: 'https://agroterra.reyfact.com/api/',
  // url_base: 'https://andalucia.reyfact.com/api/',
  // url_base: 'https://doraditos.reyfact.com/api/',
  // url_base: 'https://doraditos1.reyfact.com/api/',
  // url_base: 'https://hinojosa.reyfact.com/api/',
  // url_base: 'https://kalyfarm.reyfact.com/api/',
  // url_base: 'https://demosisventav1.reyfact.com/api/',
  // url_base: 'https://sistema.comprasentacna.com/api/',
  // url_base: 'https://2sistema.comprasentacna.com/api/',
  // url_base: 'https://jdhv2.reyfact.com/api/',
  // url_base: 'https://sistema.aevlospalos.com/api/',
  // url_base: 'https://disvit.reyfact.com/api/',
  // url_base: 'https://sistema.sangucarlitos.com/api/',
  // url_base: 'https://krismarv2.reyfact.com/api/',
  // url_base: 'https://esergen.reyfact.com/api/',
  // url_base: 'https://sertaads.reyfact.com/api/',
  // url_base: 'https://insergav2.reyfact.com/api/',
  // url_base: 'https://agroptacna.reyfact.com/api/',
  // url_base: 'https://jorgev2.reyfact.com/api/',
  // url_base: 'https://yudithv2.reyfact.com/api/',
  // url_base: 'https://sistema.aevlospalos.com/api/',
  // url_base: 'https://americas.reyfact.com/api/',
  // url_base: 'https://agroinversiones.aevlospalos.com/api/',
  // url_base: 'https://vidagro.reyfact.com/api/',
  // url_base: 'https://palaciodelamujer.reyfact.com/api/',
  // url_base: 'https://palaciodelvestir.reyfact.com/api/',
  // url_base: 'https://emco.reyfact.com/api/',
  // url_base: 'https://genova.reyfact.com/api/',
  // url_base: 'https://hennorganic.reyfact.com/api/',
  // url_base: 'https://sistema.polleria-tradicion.com/api/',
  // url_base: 'https://balby.yonathansoft.com/api/',
  // url_base: 'https://balbys.yonathansoft.com/api/',
  // url_base: 'https://juniorexchange.yonathansoft.com/api/',
  // url_base: 'https://cambiostacna.yonathansoft.com/api/',
  // url_base: 'https://cambiostacna2.yonathansoft.com/api/',
  // url_base: 'https://canesto.yonathansoft.com/api/',
  // url_base: 'https://royalclass.yonathansoft.com/api/',
  // url_base: 'https://jdh.yonathansoft.com/api/',
  // url_base: 'https://nadicenter.yonathansoft.com/api/',
  // url_base: 'https://hym.yonathansoft.com/api/',
  // url_base: 'https://sistema.polleria-tradicion.com/api/',
  // url_base: 'https://sistema2.polleria-tradicion.com/api/',
  // url_base: 'http://localhost:8000/',

}
const mutations = {
  toggleSidebarDesktop (state) {
    const sidebarOpened = [true, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarOpened ? false : 'responsive'
  },
  toggleSidebarMobile (state) {
    const sidebarClosed = [false, 'responsive'].includes(state.sidebarShow)
    state.sidebarShow = sidebarClosed ? true : 'responsive'
  },
  set (state, [variable, value]) {
    state[variable] = value
  }
}



export default new Vuex.Store({
  state,
  mutations,
  modules
})