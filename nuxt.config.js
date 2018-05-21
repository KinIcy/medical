module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://fonts.googleapis.com/css?family=Roboto:400,700,300' },
      { rel: 'stylesheet', type: 'text/css', href: 'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css' },
    ],
  },
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        });
      }
    },
  },
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/moment',
    'bootstrap-vue/nuxt',
  ],
  css: [
    'vue-notifyjs/themes/default.scss',
    '~/assets/sass/light-bootstrap-dashboard.scss',
    '~/static/css/nucleo-icons.css',
  ],
  plugins: [
    '~/plugins/global-components',
    '~/plugins/global-directives',
    '~/plugins/sidebar',
    '~/plugins/light-bootstrap-main',
  ],
  auth: {
    rewriteRedirects: false,
    strategies: {
      local: {
        endpoints: {
          login: { url: 'auth/login', method: 'post', propertyName: 'token' },
          logout: { url: 'auth/logout', method: 'post' },
          user: { url: 'auth/user', method: 'get', propertyName: 'user' },
        },
      },
    },
    redirect: {
      login: '/medical/login',
      logout: '/medical/login',
    },
  },
  // Axios global configuration
  axios: {
    baseURL: process.env.API_URL || 'http://localhost:3000/api/',
  },
  router: {
    middleware: ['auth'],
  },
};
