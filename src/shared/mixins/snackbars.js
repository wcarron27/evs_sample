let snackbars = {
  data() {
    return {
      snackbarString: '',
      showSnackbar: false,
      duration: 3000
    }
  },

  methods: {
    setSnackbar(string) {
      this.snackbarString = string
      this.showSnackbar = true
    }
  }
}

export default snackbars
