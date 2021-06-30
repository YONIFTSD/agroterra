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
}

const state = {
  sidebarShow: 'responsive',
  sidebarMinimize: true,
  // url_base: 'https://dev.sertaads.com/api/',
  //  url_base: 'https://agroterra.rlpfacts.com/api/',
  url_base: 'https://agroplant.rlpfacts.com/api/',
  // url_base: 'https://bertha.rlpfacts.com/api/',
  // url_base: 'https://dev.rlpfacts.com/api/',
  // url_base: 'http://localhost:8000/',
  //demo adasdasd asd adas
  
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