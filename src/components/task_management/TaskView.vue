<template>
  <div class="pad-rem-2">
    <div v-if="!loading">
      <ValidationObserver v-if="isAdmin" v-slot="{ handleSubmit }">
        <h1 class="md-title">Update Task</h1>
        <form @submit.prevent="handleSubmit(onSubmit)">
          <ValidationProvider v-slot="{ errors }" name="Title" rules="required|min:5|max:100">
            <md-field md-clearable>
              <label>Title</label>
              <md-input v-model="taskData.title" class="no-shadow" name="Title" type="text" placeholder="Title" md-counter="100"></md-input>
            </md-field>
            <span class="md-caption error-red">{{ errors[0] }}</span>
          </ValidationProvider>

          <ValidationProvider v-slot="{ errors }" name="Description" rules="min:5|max:1000">
            <md-field>
              <label>Description</label>
              <md-textarea v-model="taskData.description" class="no-shadow" placeholder="Description... " md-counter="1000"></md-textarea>
            </md-field>
            <span class="md-caption error-red">{{ errors[0] }}</span>
          </ValidationProvider>

          <br />
          <ValidationProvider v-slot="{ errors }" name="DueDate" rules="date_format:YYYY-MM-DD">
            <label>Due Date</label>
            <VueDatePicker v-model="taskData.due_date" type="date" :min-date="minimumDate" :visible-years-number="10" no-header />
            <span class="md-caption error-red">{{ errors[0] }}</span>
          </ValidationProvider>

          <br />

          <label>Priority</label>
          <md-radio v-model="taskData.priority" :value="0">Low</md-radio>
          <md-radio v-model="taskData.priority" :value="1">Medium</md-radio>
          <md-radio v-model="taskData.priority" :value="2">High</md-radio>

          <br />

          <!-- <span class="md-caption">Task assignees cannot be changed.</span> -->
          <md-field>
            <label>Assigned To</label>
            <md-select v-model="taskData.assigned_id" :disabled="true">
              <md-option v-for="user in workspaceUsers" :key="user.id" :value="user.id">
                {{ user.email }}
              </md-option>
            </md-select>
          </md-field>

          <br />

          <md-button type="submit" class="md-primary md-raised">Save</md-button>
          <md-button class="md-accent" @click="$router.go(-1)">Cancel</md-button>
        </form>
      </ValidationObserver>

      <div v-else>
        <h1 class="md-title">Task: {{ taskData.title }}</h1>
        <hr />
        <p class="md-subheading" :class="{ 'error-red': overdue && taskData.status != 'complete' }">
          Due On:
          <span v-if="taskData.due_date">{{ taskData.due_date | dateNoTime }}</span>
          <span v-else>--/--/--</span>
        </p>
        <p class="md-body-2" :class="{ 'completed': taskData.status == 'complete'}">Status: {{ taskData.status | capitalize }}</p>
        <p class="md-body-1">Description: {{ taskData.description }}</p>

        <md-button v-if="taskData.status == 'incomplete'" class="md-raised" @click="markTaskReady(taskData.id)">
          Mark Ready
          <md-tooltip md-direction="right">Alert the admin this task is ready for review</md-tooltip>
        </md-button>
      </div>
    </div>

    <div v-else>
      <md-progress-spinner :md-diameter="100" :md-stroke="10" md-mode="indeterminate"></md-progress-spinner>
    </div>

    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarString }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import TasksApi from './../../api/tasks'
import snackbars from './../../shared/mixins/snackbars'
import { mapState } from 'vuex'
export default {
  mixins: [snackbars],
  data() {
    return {
      loading: true,
      taskData: {
        title: '',
        description: '',
        status: null,
        priority: null,
        due_date: null,
        assigned_id: null
      },
      searchTerm: ''
    }
  },

  computed: {
    ...mapState({
      'currentUser': 'currentUser',
      'workspaceId': 'workspaceId',
      'workspaceUsers': 'workspaceUsers'
    }),

    isAdmin() {
      return this.$store.getters.isAdmin
    },

    minimumDate() {
      return new Date() - 3000;
    },

    overdue() {
      if (this.taskData.due_date == null || this.taskData.due_date == undefined) {
        return false
      } else {
        return new Date(this.taskData.due_date - new Date() >= 0)
      }
    },

    searchedFilesForUser(term) {
      if (term == '') {
        return this.filesForUser
      } else {
        return []
      }
    }
  },

  beforeMount() {
    this.taskData = this.$store.getters.singleTask(this.$route.params.id)
  },

  mounted() {
    if (this.taskData.title != '') {
      this.loading = false
    }
  },

  methods: {
    onSubmit() {
      
      this.$store.commit('updateTask', this.taskData)
      this.$emit('emittedSnackbarMessage', 'Task Successfully Updated.')
      this.$router.push('/')
      // TasksApi.updateTask(this.workspaceId, this.taskData)
      // .then(response => {
      //   this.$log.debug(response)
      //   this.setSnackbar('Task updated successfully')
      // })
      // .catch(err => {
      //   this.$log.error(err)
      //   this.setSnackbar('Could not update task. Please contact support.')
      // })
    },

    markTaskReady(id) {
      TasksApi.markTaskReady(this.workspaceId, id)
      .then(response => {
        this.$log.debug(response)
        this.setSnackbar('Task successfully marked ready')
      })
      .catch(err => {
        this.$log.error(err)
        this.setSnackbar('An error occurred and the task could not be updated. Please contact support.')
      })
    },
  }

}
</script>

<style lang="scss">
  .error-red {
    color: #ff5252 !important;
  }

  .completed {
    color: #43a047;
  }
</style>
