import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {List} from 'react-virtualized'

import Record from '../Record'
import * as actions from '../../actions'
import './index.css'


export function App({alarms, actions}) {
  function row_renderer({key, index, style}) {
    const {
      event_id,
      camera_id,
      prediction,
      starting_timestamp,
      image_url
    } = alarms[index]

    return (
      <Record
        key={key}
        style={style}
        event_id={event_id}
        camera_id={camera_id}
        prediction={prediction}
        starting_timestamp={starting_timestamp}
        image_url={image_url}
        read_alarm={actions.read_alarm}
      >
      </Record>
    )
  }

  return (
    <List
      width={600}
      height={600}
      rowCount={alarms.length}
      rowHeight={100}
      rowRenderer={row_renderer}
      style={{outline: 'none'}}
    />
  )
}

export default connect(
  state => ({alarms: state.alarms}),
  dispatch => ({actions: bindActionCreators(actions, dispatch)})
)(App)
