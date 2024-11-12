import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Home from './../components/task_management/Home.vue'
Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'Task Management',
          component: Home
        },
        {
          path: '/assigned',
          name: 'Assigned',
          component: () => import('../components/task_management/Assigned.vue')
        },
        {
          path: '/create',
          name: 'Create',
          component: () => import('../components/task_management/CreateTask.vue')
        },
        {
          path: '/completed',
          name: 'Completed',
          component: () => import('../components/task_management/Completed.vue')
        },
        {
          path: '/task/:id',
          name: 'taskView',
          component: () => import('../components/task_management/TaskView.vue')
        }
      ]
    }
  ]
})

export default router
