import React from 'react'
import {connect} from 'react-redux'
import {List} from 'react-virtualized'

require('./index.css')


export function App({alarms}) {
  function row_renderer({key, index, style}) {
    const {
      camera_id,
      prediction,
      starting_timestamp,
      priority
    } = alarms[index]

    return (
      <div key={key} style={style}>
        {camera_id}, {prediction}, {new Date(starting_timestamp).toUTCString()}, {priority}
      </div>
    )
  }

  return (
    <List
      width={400}
      height={600}
      rowCount={alarms.length}
      rowHeight={20}
      rowRenderer={row_renderer}
    />
  )
}

export default connect(state => ({alarms: state.alarms}))(App)
