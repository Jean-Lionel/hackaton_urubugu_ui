import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
  state() {
    return {
      user: null,
      socket: null,
      wsUrl: `ws://192.168.1.186:8765/`,
      abandi: [],
      ibije: null,
      currentPlayer: {
        selecedPions: {},
        lastIndex: null,
      },
    }
  },
  mutations: {
    increment(state) {
      state.count++
    },
  },
})

export default store
