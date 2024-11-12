import axios from 'axios'
import store from './../store'
import { data_analytics_headers, dataServiceURL } from './../shared/constants'

function mergedDataServiceHeaders() {
  return { ...data_analytics_headers, ACCESS_TOKEN: store.state.authHeader }
}

export default {

  deleteTask(workspaceId, id) {
    return axios.delete(`${dataServiceURL}/workspace/${workspaceId}/task/${id}`, { headers: mergedDataServiceHeaders() })
  },

  getAllTasks(workspaceId) {
    return axios.get(`${dataServiceURL}/workspace/${workspaceId}/tasks`, { headers: mergedDataServiceHeaders() })
  },

  getNonAdminTasks(workspaceId) {
    return axios.get(`${dataServiceURL}/workspace/${workspaceId}/user/${store.state.currentUser.id}/tasks`, { headers: mergedDataServiceHeaders() })
  },

  createTask(workspaceId, task) {
    return axios.post(`${dataServiceURL}/workspace/${workspaceId}/user/${task.assigned_id}`, { task }, { headers: mergedDataServiceHeaders() })
  },

  markTaskReady(workspaceId, id) {
    return axios.put(`${dataServiceURL}/workspace/${workspaceId}/task/${id}/ready`, {}, { headers: mergedDataServiceHeaders() })
  },

  updateTask(workspaceId, task) {
    return axios.put(`${dataServiceURL}/workspace/${workspaceId}/task/${task.id}`, { task }, { headers: mergedDataServiceHeaders() })
  }

}
