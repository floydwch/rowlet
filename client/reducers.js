import {combineReducers} from 'redux'


function find_insert_index(array, value) {
  if (value >= array[0] || !array.length) {
    return 0
  }
  for (let i = 0; i < array.length - 1; ++i) {
    if (array[i] > value && value >= array[i + 1]) {
      return i + 1
    }
  }
  return array.length
}


export function alarms(state=[], action) {
  switch (action.type) {
    case 'RECEIVE_ALARM':
      const insert_index = find_insert_index(
        state.map(e => e.starting_timestamp),
        action.payload.starting_timestamp
      )
      return [
        ...state.slice(0, insert_index),
        action.payload,
        ...state.slice(insert_index)
      ]
    default:
      return state
  }
}


export default combineReducers({
  alarms
})
