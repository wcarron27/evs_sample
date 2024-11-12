let alertMixin = {
  computed: {
    alert_obj() {
      return this.$store.state.alert_obj
    }
  },
  methods: {
    buildAlert(response, timeout) {
      this.$store.dispatch("setAlertObject", response, timeout)
    },
    clearAlert() {
      this.$store.commit("clearAlertObject")
    }
  }
}

export default alertMixin;