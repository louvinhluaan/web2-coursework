const app = Vue.createApp({
  data() {
    return {
      cart: [], // Task
      premium: true,
    };
  },

  methods: { 
    // Task
    updateCart(id) {
      this.cart.push(id)
    },

    // Challenge
    removeCartById(id) {
    const index = this.cart.indexOf(id)
        if (index > -1) {
            this.cart.splice(index, 1)
        }
    },

  },
});