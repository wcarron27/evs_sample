import axios from 'axios'
import store from './../store'
import { data_analytics_headers, dataServiceURL, qanda_service_headers, qandaServiceURL } from '../../shared/constants'

function mergedDataServiceHeaders() {
  return { ...data_analytics_headers, ACCESS_TOKEN: store.state.authHeader }
}

function mergedQandaServiceHeaders() {
  return { ...qanda_service_headers, ACCESS_TOKEN: store.state.authHeader }
}

export default {

  getUsers(id) {
    return axios.get(`${dataServiceURL}/workspace/${id}/users`, { headers: mergedDataServiceHeaders() })
  },

  checkAdminStatus(id) {
    return axios.get(`${qandaServiceURL}/user/admin?workspace_id=${id}`, { headers: mergedQandaServiceHeaders() })
  },

  getFilesForUser(id, userId) {
    return axios.get(`${dataServiceURL}/workspace/${id}/user/${userId}/files`, { headers: mergedDataServiceHeaders() })
  }

}
