import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VueLogger from 'vuejs-logger'
import App from './App.vue'
import router from './router/'
import store from './store'
import './assets/main.css'
import moment from 'moment'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

import { truncate, formatDate, dateNoTime, capitalize } from './shared/filters'

import { ValidationProvider, ValidationObserver, extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';
import { messages } from 'vee-validate/dist/locale/en.json';

Vue.prototype.moment = moment
Vue.use(VueMaterial)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueLogger)

// === Filters ===
Vue.filter('formatDate', formatDate)
Vue.filter('truncate', truncate)
Vue.filter('dateNoTime', dateNoTime)
Vue.filter('capitalize', capitalize)

import VueDatePicker from '@mathieustan/vue-datepicker';
import '@mathieustan/vue-datepicker/dist/vue-datepicker.min.css';
Vue.use(VueDatePicker)


// Add a rule.
Object.keys(rules).forEach(rule => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule] // assign message
  });
});

// Custom date_format validator
extend('date_format', {
  validate(value, args) {
    return moment(value, args.format, true).isValid()
  },
  params: ['format']
})

extend('required', {
  validate: value => value != null && value != undefined && value != '',
  message: 'This is a required field'
})

// Register it globally
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
