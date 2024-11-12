<template>
  <div class="pad-rem-2">
    <task-table
      :text-type="textType"
      :task-list="tasks"
      @emittedSnackbarMessage="catchEmittedSnackbar"
      @refreshTasks="refreshTasks"
    ></task-table>
    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarString }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import snackbars from '../../filepage_qanda/services/snackbars'
import TaskTable from './TaskTable.vue'

export default {
  components: {
    TaskTable
  },

  mixins: [snackbars],

  computed: {
    isAdmin() {
      return this.$store.getters.isAdmin
    },

    textType() {
      return this.isAdmin ? 'completedAdmin' : 'completed'
    },

    tasks() {
      return this.$store.getters['completedTasks']
    },

    workspaceId() {
      return this.$store.state.workspaceId
    }
  },

  methods: {
    catchEmittedSnackbar(e) {
      this.setSnackbar(e)
    },

    refreshTasks() {
      if (this.isAdmin) {
        TasksApi.getAllTasks(this.workspaceId)
        .then(response => {
          this.$log.debug(response)
          // 204 ternary prevents vuex getter errors
          const tasks = response.status == 204  ? [] : response.data.tasks
          this.$store.commit('setTasks', tasks)
        })
        .catch(err => {
          this.$log.error(err)
          this.setSnackbar('An error occurred and tasks could not be fetched. Please contact support.')
        })
      } else {
         TasksApi.getNonAdminTasks(this.workspaceId)
        .then(response => {
          this.$log.debug(response)
          const tasks = response.status == 204 ? [] : response.data.tasks
          this.$store.commit('setTasks', tasks)
        })
        .catch(err => {
          this.$log.error(err)
          this.setSnackbar('An error occurred and tasks could not be fetched. Please contact support.')
        })
      }
    }
  }
}
</script>
