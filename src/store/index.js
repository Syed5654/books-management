import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      books: [],
    };
  },
  mutations: {
    setBooks(state, data) {
      state.books = data;
    },
  },
});

export default store;
