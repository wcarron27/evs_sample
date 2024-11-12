<script>
import './../src/assets/task_management.scss'
import snackbars from './shared/mixins/snackbars'
export default {
  mixins: [snackbars],
  methods: {
    catchEmittedSnackbar(e) {
      this.setSnackbar(e)
    }
  }
}
</script>

<template>
  <div id="app">
    <router-view
      @emittedSnackbarMessage="catchEmittedSnackbar"
      class="mx-rem-5 pad-rem-t-5"
    ></router-view>
    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarString }}</span>
    </md-snackbar>
  </div>
</template>

<style scoped>
</style>