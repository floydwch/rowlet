import React from 'react'
import {connect} from 'react-redux'

require('./index.css')


export function App({alarms}) {
  const items = alarms.map(
    x => (
      <li key={x.event_id} className='fade'>
        {x.camera_id}, {x.prediction}, {new Date(x.starting_timestamp).toUTCString()}, {x.priority}
      </li>
    )
  )
  return (
    <ul>{items}</ul>
  )
}

export default connect(state => ({alarms: state.alarms}))(App)
