import {adapt} from '@cycle/run/lib/adapt'
import xs from 'xstream'
import {combineCycles} from 'redux-cycles'

import * as actions from './actions.js'


export function sync_with_server(source) {
  const request$ = source.ACTION
    .filter(action => action.type === 'READ_ALARM')
    .map(({payload: {event_id}}) => ({
      url: `http://localhost:3000/event-viewed/${event_id}`
    }))
  const action$ = source.SSE
    .map(actions.receive_alarm)

  return {
    HTTP: request$,
    ACTION: action$
  }
}


export function correct_prediction(source) {
  const request$ = source.ACTION
    .filter(action => action.type === 'CORRECT_PREDICTION')
    .map(({payload: {event_id}}) => ({
      url: `http://localhost:3000/events/${event_id}`,
      method: 'patch'
    }))

  return {
    HTTP: request$
  }
}


export function sse_driver() {
  const event_ids = {}
  const source = xs.create({
    start: listener => {
      this.event_source = new EventSource('http://localhost:3000/new-alarm-events/')
      this.event_source.addEventListener('alarm', e => {
        const data = JSON.parse(e.data)
        if (!event_ids[data.event_id]) {
          event_ids[data.event_id] = true
          listener.next(data)
        }
      })
    },
    stop: () => {
      this.event_source.close()
    }
  })
  return adapt(source)
}


export default combineCycles(sync_with_server, correct_prediction)
