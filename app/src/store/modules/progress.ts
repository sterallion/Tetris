import { Module } from 'vuex'
import { Stat, Score } from '@/types'

export const progress: Module<Score, {}> = {
  namespaced: true,

  state: {
    listScore: [],
    indexScore: -1,
  },

  getters: {
    getScore: ({ listScore }): Score[] => (
      listScore.length ? listScore : JSON.parse(localStorage.getItem('score') || '[]')
    ),

    getProgress: (): object => JSON.parse(localStorage.getItem('progress') || '{}'),
  },

  actions: {
    setScore({ state, getters }, { score, lines }) {
      const itemScore = { score, lines }
      state.listScore = getters.getScore

      state.listScore.push(itemScore)
      state.listScore.sort((a: Stat, b: Stat): number => b.score - a.score).splice(5)
      state.indexScore = state.listScore.indexOf(itemScore)

      localStorage.setItem('score', JSON.stringify(state.listScore))
    },

    setProgress({ commit, state, getters }, progress) {
      localStorage.setItem('progress', JSON.stringify(progress))
    },
  },
}