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
        {
          event_id: action.payload.event_id,
          camera_id: action.payload.camera_id,
          prediction: action.payload.prediction,
          starting_timestamp: action.payload.starting_timestamp,
          image_url: action.payload.image_url
        },
        ...state.slice(insert_index)
      ]
    case 'CORRECT_PREDICTION':
      const index = state.findIndex(e => e.event_id === action.payload.event_id)
      const corrected_prediction_state = [...state]
      corrected_prediction_state[index] = {
        ...state[index],
        prediction: action.payload.prediction
      }
      return corrected_prediction_state
    default:
      return state
  }
}


export function records(state={}, action) {
  switch (action.type) {
    case 'READ_ALARM':
      return {
        ...state,
        [action.payload.event_id]: {
          ...state[action.payload.event_id],
          read: true
        }
      }
    case 'EXPAND_RECORD':
      return {
        ...state,
        [action.payload.event_id]: {
          ...state[action.payload.event_id],
          expanded: action.payload.expanded
        }
      }
    default:
      return state
  }
}


export default combineReducers({
  alarms,
  records
})
