
let core_app_url_options = {
  'production': 'https://secure.caplinked.com',
  'staging': 'https://staging.caplinked.com',
  'testing': 'https://testing.caplinked.com',
  'test': 'https://testing.caplinked.com',
  'development': 'http://localhost:3000'
}

export const data_analytics_headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Api-Version": "data-analytics/vnd.caplinked.com; version=1"
};

export const auth_service_headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Api-Version": "authentication/vnd.caplinked.com; version=1"
};
export const invitation_service_headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Api-Version": "internal_api/vnd.caplinked.com; version=1"
};

export const qanda_service_headers = {
  "Content-Type": "application/json",
  "Accept": "application/json",
  "Api-Version": "qanda/vnd.caplinked.com; version=1"
};

export const notification_service_headers = {
  "Content-Type": "application/json",
  "Accept": "application/json"
};

export const workspace_settings_service_headers = {
  "Api-Version": "workspace-settings/vnd.caplinked.com; version=1"
}

let qanda_url_options = {
  'production': 'https://cl-prod-qanda.caplinked.com',
  'staging': 'https://cl-staging-qanda.caplinked.com',
  'testing': 'https://cl-testing-qanda.caplinked.com',
  'test': 'https://cl-test-qanda.caplinked.com',
  'development': 'http://localhost:3006',
};


let auth_url_options = {
  'production': 'https://cl-prod-auth.caplinked.com',
  'staging': 'https://cl-staging-auth.caplinked.com',
  'testing': 'https://cl-testing-auth.caplinked.com',
  'test': 'https://cl-testing-auth.caplinked.com',
  'development': 'http://localhost:3001'
};

let data_analytics_url_options = {
  'production': 'https://cl-prod-analytics.caplinked.com',
  'staging': 'https://cl-staging-analytics.caplinked.com',
  'testing': 'https://cl-testing-analytics.caplinked.com',
  'test': 'https://cl-testing-analytics.caplinked.com',
  'development': 'http://localhost:3002'
};

let invitation_url_options = {
  'production': 'https://cl-prod-api.caplinked.com',
  'staging': 'https://cl-staging-api.caplinked.com',
  'testing': 'https://cl-testing-api.caplinked.com',
  'test': 'https://cl-testing-api.caplinked.com',
  'development': 'http://localhost:3004'
};

let notification_url_options = {
  "production": "wss://prod-notif.caplinked.com",
  "staging": "wss://staging-notif.caplinked.com",
  "testing": "wss://testing-notif.caplinked.com",
  "test": "wss://testing-notif.caplinked.com",
  "development": "ws://localhost:3005"
};

let workspace_settings_service_url_options = {
  'production': 'https://cl-prod-settings.caplinked.com',
  'staging': 'https://cl-staging-settings.caplinked.com',
  'testing': 'https://cl-testing-settings.caplinked.com',
  'test': 'https://cl-testing-setttings.caplinked.com',
  'development': 'http://localhost:3008'
};

export const logOptions = {
  isEnabled: true,
  stringifyArguments : false,
  showLogLevel : true,
  showMethodName : true,
  separator: '|',
  showConsoleColors: true
};

export const alert_objects = {
  maximum_admins: {
    type: 'warning',
    heading: 'Not Allowed',
    message: 'You have reached your alloted number of admins'
  },
  fetch_data: {
    type: 'warning',
    heading: 'Warning',
    message: 'Could not fetch data'
  },
  invites_not_sent: {
    type: 'warning',
    heading: 'Warning',
    message: 'Invites failed to send. Please contact support@caplinked.com'
  },
  invites_sent: {
    type: 'success',
    heading: 'Invites Sent!',
    message: 'Your invites are on their way!'
  }
};

export async function getCookie(name) {
  const cookieValue = await document.cookie
  .split('; ')
  .find(row => row.startsWith(`${name}=`))
  .split('=')[1]

  return null || cookieValue
}


export const dataServiceURL = data_analytics_url_options['development'];
export const authServiceURL = auth_url_options['development'];
export const invitationServiceURL = invitation_url_options['development'];
export const qandaServiceURL = qanda_url_options['development'];
export const notificationURL = notification_url_options["development"];
export const coreAppURL = core_app_url_options["development"];
export const workspaceSettingsServiceURL = workspace_settings_service_url_options["development"];

export default {
  getCookie,
  auth_service_headers,
  data_analytics_headers,
  invitation_service_headers,
  qanda_service_headers,
  notification_service_headers,
  workspace_settings_service_headers,
  dataServiceURL,
  authServiceURL,
  invitationServiceURL,
  qandaServiceURL,
  notificationURL,
  workspaceSettingsServiceURL,
  coreAppURL,
  alert_objects,
  logOptions
};
