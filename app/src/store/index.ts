import Vue from 'vue'
import Vuex from 'vuex'
import { progress } from './modules/progress'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    progress,
  },
})