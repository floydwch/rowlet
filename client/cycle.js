import {adapt} from '@cycle/run/lib/adapt'
import xs from 'xstream'

import * as actions from './actions.js'


export default function sync_with_server(source) {
  const sse$ = source.SSE
  const request$ = sse$
    .map(data => ({
      url: `http://localhost:3000/event-viewed/${data.event_id}`
    }))
  const action$ = sse$
    .map(actions.receive_alarm)

  return {
    HTTP: request$,
    ACTION: action$
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
