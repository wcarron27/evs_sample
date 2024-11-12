<template>
  <div class="md-elevation-3 pad-rem-1">
    <md-button to="/create" class="md-primary md-raised pull-right">Create New Task</md-button>
    <md-table
      v-model="paginatedData"
      md-sort="assigned_id"
      :md-sort-order="sortOrder"
      class="full-width-block"
    >
      <md-table-empty-state
        md-icon="list"
        md-label="No tasks to display"
        :md-description="textStringMap[textType]">
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }">
        <md-table-cell md-label="Title"><router-link :to="{ name: 'taskView', params: { id: item.id }}">{{ item.title | truncate(20) }}</router-link></md-table-cell>

        <md-table-cell md-label="Description">{{ item.description | truncate(20) }}</md-table-cell>

        <md-table-cell v-if="itemUser(item.id) && isAdmin" name="assigned_id" md-sort-by="assigned_id" md-label="Assigned To">
          {{ itemUser(item.id).email || 'Not Assigned' }}
        </md-table-cell>

        <md-table-cell v-else name="assigned_id" md-sort-by="assigned_id" md-label="Assigned To">
          {{ currentUser.email }}
        </md-table-cell>

        <md-table-cell md-label="Priority" :class="{ 'high': item.priority == 2}">
          {{ priorityStringMap[item.priority] | capitalize }}
        </md-table-cell>

        <md-table-cell name="status" md-sort-by="status" md-label="Status" :class="{ 'completed': item.status == 'complete', 'ready': item.status == 'ready'}">
          {{ item.status | capitalize }}
        </md-table-cell>

        <md-table-cell name="due_date" md-sort-by="due_date" md-label="Due Date">
          <span v-if="item.due_date">{{ item.due_date | dateNoTime }}</span>
          <span v-else>--/--/--</span>
        </md-table-cell>

        <md-table-cell md-label="Actions">
          <!-- TO DO: Create 'Action Map' for cleaner code and 'empty state'/'no available actions' state -->
          <div v-if="isAdmin">
            <md-button v-if="(item.status == 'incomplete' || item.status == 'ready')" class="md-icon-button md-raised md-green" @click="toggleCompleted(item)">
              <md-icon>assignment_turned_in</md-icon>
              <md-tooltip md-direction="left">Mark Complete</md-tooltip>
            </md-button>

            <md-button v-if="item.status == 'complete'" class="md-icon-button md-raised" @click="toggleCompleted(item)">
              <md-icon>assignment_return</md-icon>
              <md-tooltip md-direction="left">Mark Incomplete</md-tooltip>
            </md-button>

            <md-button class="md-icon-button md-raised" @click="deleteTask(item.id)">
              <md-icon>delete</md-icon>
              <md-tooltip md-direction="left">Delete</md-tooltip>
            </md-button>

            <md-button v-if="item.assigned_id == currentUser.id && item.status != 'completed' && item.status != 'ready'" class="md-icon-button  md-raised" @click="markTaskReady(item.id)">
              <md-icon>forward</md-icon>
              <md-tooltip md-direction="left">Mark Ready</md-tooltip>
            </md-button>
          </div>
          <div v-else>
            <md-button v-if="item.status != 'complete'" class="md-icon-button md-raised" @click="markTaskReady(item.id)">
              <md-icon>forward</md-icon>
              <md-tooltip md-direction="left">Mark Ready</md-tooltip>
            </md-button>
          </div>
        </md-table-cell>
      </md-table-row>
    </md-table>
    <div slot="md-data-pagination" class="md-table-pagination" :md-page-options="false">
      <!-- <md-field>
        <md-select v-model="currentPageSize" md-dense md-class="md-pagination-select">
          <md-option v-for="amount in mdPageOptions" :key="amount" :value="amount">{{ amount }}</md-option>
        </md-select>
      </md-field> -->

      <span>{{ (mdPage - 1) * currentPageSize + 1 }}–{{ Math.min(mdPage * currentPageSize, mdCount) }} of {{ mdCount }}</span>

      <md-button class="md-icon-button md-table-pagination-previous" @click="changePage(-1)" :disabled="mdPage === 1">
        <md-icon>keyboard_arrow_left</md-icon>
      </md-button>

      <md-button class="md-icon-button md-table-pagination-next" @click="changePage(+1)" :disabled="mdPage === pageCount">
        <md-icon>keyboard_arrow_right</md-icon>
      </md-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import TasksApi from './../api/tasks'
export default {
  props: {
    textType: String,
    taskList: {
      type: Array,
      default() {
        return []
      }
    }
  },

  data() {
    return {
      tasks: [],
      paginatedData: [],
      mdPage: 1,
      rowsPerPage: 10,
      currentPageSize: 10,
      mdPageOptions: [10,15,20,25,50],
      sortOrder: 'asc',
      priorityStringMap: [
        'Low',
        'Medium',
        'High'
      ],

      textStringMap: {
        'homeAdmin': 'No tasks have been created in this workspace.',
        'home': 'No tasks have been assigned to you.' ,
        'assignedAdmin': 'No tasks have been assigned to you.',
        'completedAdmin': 'No tasks have been completed.',
        'completed': 'You have not completed any tasks.'
      }
    }
  },

  computed: {

    isAdmin() {
      return this.$store.getters.isAdmin
    },

    pageCount() {
      return Math.ceil(this.tasks.length / this.rowsPerPage)
    },

    mdCount() {
      return this.tasks.length
    },

    ...mapState({
      'currentUser': 'currentUser',
      'workspaceId': 'workspaceId'
    }),
    ...mapGetters([
      'itemUser'
    ])
  },

  watch: {
    taskList: {
      handler(newValue = []) {
        this.tasks = [...newValue]
        this.updatePagination(this.mdPage, this.rowsPerPage)
      },
      immediate: true
    }
  },

  mounted() {
    this.tasks = [...this.taskList]
    this.updatePagination(this.mdPage, this.rowsPerPage, 'assigned_id', 'asc')
  },

  methods: {
    changePage(delta) {
      this.mdPage = this.mdPage + delta
      this.updatePagination(this.mdPage, this.rowsPerPage)
    },

    deleteTask(id) {
      this.$store.commit('deleteTask', id)
      this.$emit('emittedSnackbarMessage', 'Task successfully deleted.')
      // TasksApi.deleteTask(this.workspaceId, id)
      // .then(response => {
      //   this.$log.debug(response)
      //   this.$emit('emittedSnackbarMessage', 'Task successfully deleted')
      //   this.$emit('refreshTasks')
      // })
      // .catch(err => {
      //   this.$log.error(err)
      //   this.$emit('emittedSnackbarMessage', 'An error occurred and the task was not deleted. Please contact support.')
      // })
    },

    markTaskReady(id) {
      TasksApi.markTaskReady(this.workspaceId, id)
      .then(response => {
        this.$log.debug(response)
        this.$emit('emittedSnackbarMessage', 'Task successfully marked ready')
        this.$emit('refreshTasks')
      })
      .catch(err => {
        this.$log.error(err)
        this.$emit('emittedSnackbarMessage', 'An error occurred and the task could not be updated. Please contact support.')
      })
    },

    toggleCompleted(task) {
      task.completed = !task.completed
      if (task.status == 'ready' || task.status == 'incomplete') {
        task.status = 'complete'
      } else {
        task.status = 'incomplete'
      }

      TasksApi.updateTask(this.workspaceId, task)
      .then(response => {
        this.$log.debug(response)
        this.$emit('emittedSnackbarMessage', 'Task updated successfully')
        this.$emit('refreshTasks')
      })
      .catch(err => {
        this.$log.error(err)
        this.$emit('emittedSnackbarMessage', 'Could not update task. Please contact support.')
      })
    },

    updatePagination(page, pageSize, sort, sortOrder) {
      this.paginatedData = this.tasks.slice((page - 1) * pageSize, ((page - 1) * pageSize) + pageSize)
    }
  }
}

</script>
<style lang="scss">
  .pull-right {
    float: right;
  }

  .full-width-block {
    display: block;
    width: 100%;
  }

  .md-table-cell.completed {
    color: #43a047;
    font-weight: bold;
  }

  .md-table-cell.ready {
    color: #fb8c00;
    font-weight: bold;
  }

  .md-table-cell.high {
    color: #ff5252;
    font-weight: bold;
  }

  .md-pagination {
    height: 56px;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: flex-end;
    border-top: 1px solid;
    font-size: 12px;
  }

  .md-table-pagination-previous {
    margin-right: 2px;
    margin-left: 18px;
  }

</style>