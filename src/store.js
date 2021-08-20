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
}

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: true,
  //  url_base: 'https://agrofrontera.reyfact.com/api/',
    // url_base: 'https://agroplant.reyfact.com/api/',
   url_base: 'https://agroterra.reyfact.com/api/',
  //  url_base: 'https://andalucia.reyfact.com/api/',
  // url_base: 'https://doraditos.reyfact.com/api/',
  // url_base: 'https://kalyfarm.reyfact.com/api/',
  // url_base: 'https://demosisventav1.reyfact.com/api/',
  // url_base: 'https://sistema.comprasentacna.com/api/',
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