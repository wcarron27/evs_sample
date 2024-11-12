<script>
import snackbars from './../shared/mixins/snackbars'
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
  <main>
    <router-view @emittedSnackbarMessage="catchEmittedSnackbar"></router-view>
    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarString }}</span>
    </md-snackbar>
  </main>
</template>
