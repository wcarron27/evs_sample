<template>
  <div class="pad-rem-2">
    <h1 class="md-title">New Task</h1>
    <ValidationObserver v-slot="{ handleSubmit, reset }">
      <form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="reset">
        <ValidationProvider v-slot="{ errors }" name="Title" rules="required|min:5|max:100">
          <md-field md-clearable>
            <label>Title</label>
            <md-input v-model="taskData.title" class="no-shadow" name="Title" type="text" placeholder="Title" md-counter="100"></md-input>
          </md-field>
          <span class="md-caption error-red">{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="Description" rules="required|min:5|max:1000">
          <md-field>
            <label>Description</label>
            <md-textarea v-model="taskData.description" class="no-shadow" placeholder="Description... " md-counter="1000"></md-textarea>
          </md-field>
          <span class="md-caption error-red">{{ errors[0] }}</span>
        </ValidationProvider>


        <br />
        <ValidationProvider v-slot="{ errors }" name="DueDate" rules="required|date_format:YYYY-MM-DD">
          <label>Due Date</label>
          <VueDatePicker v-model="taskData.due_date" type="date" :min-date="minimumDate" :visible-years-number="10" no-header></VueDatePicker>
          <span class="md-caption error-red">{{ errors[0] }}</span>
        </ValidationProvider>
        <br />

        <!-- Cannot validate, i.e. Not Applicable -->
        <label>Priority</label>
        <md-radio v-model="taskData.priority" :value="0">Low</md-radio>
        <md-radio v-model="taskData.priority" :value="1">Medium</md-radio>
        <md-radio v-model="taskData.priority" :value="2">High</md-radio>

        <br />

        <!-- Cannot validate, i.e. Complexity -->
        <div class="md-layout">
          <div class="md-layout-item">
            <ValidationProvider v-slot="{ errors }" name="searchTerm" rules="min:1|max:100">
              <md-field>
                <label>Search Assignable Users</label>
                <md-input v-model="searchTerm" class="no-shadow" type="text" placeholder="Search workspace members (displayed in dropdown)" @change="setUserList"></md-input>
              </md-field>
              <span class="md-caption error-red">{{ errors[0] }}</span>
            </ValidationProvider>

          </div>
          <div class="md-layout-item">
            <md-field>
              <label>Assigned To</label>
              <md-select v-model="taskData.assigned_id" class="no-shadow">
                <md-option v-for="user in userList" :key="user.id" :value="user.id" class="no-shadow">
                  {{ user.email }}
                </md-option>
              </md-select>
            </md-field>
          </div>
        </div>

        <br />
        <md-button type="submit" class="md-primary md-raised">Submit</md-button>
        <!-- <md-button type="reset" @click="setUserList(true)">Reset</md-button> -->
        <md-button class="md-accent md-raised" @click="$router.push('/')">Cancel</md-button>
      </form>
    </ValidationObserver>
    <md-snackbar md-position="center" :md-duration="duration" :md-active.sync="showSnackbar" md-persistent>
      <span>{{ snackbarString }}</span>
    </md-snackbar>
  </div>
</template>

<script>
import TasksApi from './../../api/tasks'
import snackbars from '../../shared/mixins/snackbars'
import { mapState } from 'vuex'
export default {
  mixins: [snackbars],
  data() {
    return {
      taskData: {
        title: '',
        description: '',
        priority: 0,
        due_date: null,
        assigned_id: null,
        status: 'incomplete'
      },
      userList: [],
      searchTerm: ''
    }
  },

  computed: {
    ...mapState({
      'currentUser': 'currentUser',
      'workspaceId': 'workspaceId',
      'workspaceUsers': 'workspaceUsers'
    }),

    minimumDate() {
      return new Date() - 3000;
    },

    searchedFilesForUser(term) {
      if (term == '') {
        return this.filesForUser
      } else {
        return []
      }
    }
  },

  mounted() {
    this.userList = this.$store.state.workspaceUsers
  },

  methods: {
    refreshTasks() {
      TasksApi.getAllTasks(this.workspaceId)
      .then(response => {
        this.$log.debug(response)
        const tasks = response.status == 204 ? [] : response.data.tasks
        this.$store.commit('setTasks', tasks)
      })
      .catch(err => {
        this.$log.error(err)
      })
    },

    onSubmit() {
      // Substitute API call for Vuex store mutation
      this.$store.commit('createTask', this.taskData)
      this.$router.push('/')
      // TasksApi.createTask(this.workspaceId, this.taskData)
      // .then(response => {
      //   this.$log.debug(response)
      //   this.setSnackbar('Task created successfully. Redirecting in 3...')
      //   this.refreshTasks()
      //   setTimeout(() => {
      //     this.$router.go(-1)
      //   }, 3000)
      // })
      // .catch(err => {
      //   this.$log.error(err)
      //   if (err.response.status == 404) {
      //     this.setSnackbar('Tasks must be assigned to a user. Please fill out all fields before continuing.')
      //   } else {
      //     this.setSnackbar('Could not create task. Please contact support.')
      //   }
      // })


    },

    setUserList(reset) {
      if (reset === true) {
        this.userList = this.workspaceUsers
        return
      }

       const users = this.workspaceUsers.filter(user => {
        let checkEmail = user.email.includes(this.searchTerm)
        let checkLastName = user.last_name != null && user.last_name.includes(this.searchTerm)
        let checkFirstName = user.first_name != null && user.first_name.includes(this.searchTerm)

        return checkEmail || checkLastName || checkFirstName
      })
      this.userList = users.length > 0 ? users : [{ email: 'No users match', id: null }]
    }
  }

}
</script>

<style lang="scss">
  .error-red {
    color: #ff5252 !important;
  }
</style>
