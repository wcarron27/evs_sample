import Vue from 'vue'
import Vuex from 'vuex'
import moment from 'moment'
Vue.use(Vuex)
export default new Vuex.Store({
  state: {
    authHeader: '',
    currentUser: {
      admin: true,
      id: 1,
      name: 'King Arthur',
      email: 'kinga@camelot.com'
    },
    currentWorkspace: {
      id: 1,
      name: 'Knights of the Round Table'
    },
    workspaceId: 1,
    workspaceUsers: [
      {
        admin: true,
        id: 1,
        name: 'King Arthur',
        email: 'kinga@camelot.com'
      },
      {
        admin: false,
        id: 2,
        name: 'Sir Lancelot',
        email: 'lancelot@camelot.com'
      },
      {
        admin: false,
        id: 3,
        name: 'Sir Robin',
        email: 'robin@camelot.com'
      },
      {
        admin: false,
        id: 4,
        name: 'Sir Gawain',
        email: 'gawain@camelot.com'
      }
    ],
    allTasks: [
      {
        id: 1,
        title: 'Seek the Holy Grail',
        description: 'We need to find the holy grail. For... reasons.',
        priority: 2,
        status: 'In Progress',
        due_date: moment('11-21-2024'),
        assigned_id: 3
      },
      {
        id: 2,
        title: 'Cut down the mightiest tree in the forest',
        description: 'Apparently we can only use a herring, as well?',
        priority: 1,
        status: 'Not Started',
        due_date: moment('01-13-2025'),
        assigned_id: 3
      },
      {
        id: 3,
        title: 'Fetch a shrubbery',
        description: 'We must fetch a shrubbery for the Knights of Ni',
        priority: 1,
        status: 'In Progress',
        due_date: moment('12-05-2024'),
        assigned_id: 4
      },
      {
        id: 4,
        title: 'Slay the rabbit of Caerbannog',
        description: "It's got a vicious streak a mile wide. Look at the bones!",
        priority: 1,
        status: 'Not started',
        due_date: moment('12-21-2024'),
        assigned_id: 2
      }
    ],
    filesForUser: []
  },

  getters: {
    isAdmin: state => {
      if (state.currentUser) {
        return state.currentUser.admin
      } else {
        return false
      }
    },

    itemUser: (state) => (id) => {
      let task = state.allTasks.find(task => task.id == id)
      let user = null
      if (task) {
        user = state.workspaceUsers.find(user => user.id == task.assigned_id)
      }
      return user
    },

    homeTasks: state => {
      if (state.currentUser && state.currentUser.admin) {
        return state.allTasks
      } else if(state.currentUser && state.currentUser.admin == false) {
        return state.allTasks.filter(task => {
          return task.assigned_id == state.currentUser.id
        })
      }
    },

    tasksAssignedToMe: state => {
      if (state.currentUser.id) {
        return state.allTasks.filter(task => {
          return task.assigned_id == state.currentUser.id
        })
      } else {
        return []
      }

    },

    completedTasks: state => {
      if (state.currentUser && state.currentUser.admin) {
        return state.allTasks.filter(task => {
          return task.status == 'complete'
        })
      } else {
        return state.allTasks.filter(task => {
          return task.status == 'complete' && task.assigned_id == state.currentUser.id
        })
      }
    },

    singleTask: (state) => (id) => {
      return state.allTasks.filter(task => {
        return task.id == id
      })[0]
    }
  },

  mutations: {
    setAuthHeader(state, token) {
      state.authHeader = token
    },

    clearAuthHeader(state) {
      state.authHeader = ''
    },

    clearCurrentUser(state) {
      state.currentUser = {}
    },

    createTask(state, task) {
      state.allTasks.push(task)
    },

    deleteTask(state, id) {
      state.allTasks = state.allTasks.filter(task => {
        return task.id != id
      })
    },

    updateTask(state, task) {
      state.allTasks = [
        ...state.allTasks.filter(el => el.id != task.id),
        task
      ]
    },
    setCurrentUser(state, user) {
      state.currentUser = user
    },

    setCurrentWorkspace(state, workspace) {
      state.currentWorkspace = workspace
    },

    setWorkspaceId(state, id) {
      state.workspaceId = id
    },

    clearWorkspaceId(state) {
      state.workspaceId = null
    },

    setTasks(state, tasks) {
      state.allTasks = tasks
    },

    setWorkspaceUsers(state, users) {
      state.workspaceUsers = users
    },

    clearWorkspaceUsers(state) {
      state.workspaceUsers = []
    },

    setFilesForUser(state, files) {
      state.filesForUser = files
    },

    clearFilesForUser(state) {
      state.filesForUser = []
    }
  }
})