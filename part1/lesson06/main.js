const app = Vue.createApp({
  data() {
    return {
      cart: 0, // Task
      product: 'Socks',
      image: './assets/images/socks_blue.jpg',
      inStock: true,
      details: ['50% cotton', '30% wool', '20% polyester',],

      // Task
      variants: [
        { id: 2234, color: 'green', image: './assets/images/socks_green.jpg' },
        { id: 2235, color: 'blue', image: './assets/images/socks_blue.jpg' },
      ],

    };
  },

  // Task
  methods: {
    addToCart() {
      this.cart += 1
    },

    updateImage(variantImage) {
      this.image = variantImage
    },

    // Challenge
    removeFromCart() {
      if (this.cart >= 1) {
          this.cart -= 1
      }
    },
  },

});