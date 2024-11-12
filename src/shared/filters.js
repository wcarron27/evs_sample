import moment from 'moment'
// TODO: MOVE TO LUXON DATE LIBRARY
// === Simple global filters ===

// Date
export function formatDate(value) {
  if (value) {
    return moment(String(value)).format('hh:mm MM/DD/YYYY')
  }
}

// Readable?
export function readable(date) {
  return moment(date).format('MM/DD/YYYY @ h:mm a')
}

export function dateNoTime(date) {
  return moment.utc(date).format('MM/DD/YYYY')
}

// Truncate text
export function truncate(value, length = 40) {
  if (!value) { return '' }
  value = value.toString()
  if(value.length > length){
    return value.substring(0, length) + "..."
  }else{
    return value
  }
}

// Duration Format
export function durationFormat(value) {
  let time = value
  let formattedString = ''
  let hours = Math.floor(time / 3600)
  time = time - hours * 3600
  let minutes = Math.floor(time / 60)
  let seconds = time - minutes * 60

  formattedString += `${padLeft(minutes, '0', 2)}:${padLeft(seconds, '0', 2)}s`

  return hours > 0
    ? `${padLeft(hours, '0', 2)}:${formattedString}`
    : formattedString
}

// Percent
export function percent(dec) {
  if (dec <= 1) {
    return `${(dec * 100).toFixed(1)}%`
  } else {
    return 'Please enter number less than or equal to 1'
  }
}

// Capitalize
export function capitalize(value) {
  if (!value) { return '' }
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
}

// UserDisplay
export function userDisplay(user) {
  return user.first_name ? `${user.first_name} ${user.last_name}`  : 'Anonymous'
}




// Non Exports ===============================
function padLeft(string,pad,length) {
  return (new Array(length+1).join(pad)+string).slice(-length);
}