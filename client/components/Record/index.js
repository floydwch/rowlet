import React, {Component} from 'react'
import classNames from 'classnames'

import './index.css'


export default class Record extends Component {
  constructor(props) {
    super(props)
    this.state = {
      chosen_event: props.prediction,
      read: false,
      expanded: false
    }
  }

  render() {
    const {
      style,
      className,
      event_id,
      camera_id,
      prediction,
      starting_timestamp,
      image_url,
      read_alarm
    } = this.props

    const {
      chosen_event,
      read,
      expanded
    } = this.state

    const detail_component = (
      <div className='record-detail'>
        <ul>
          <li>Camera ID: {camera_id}</li>
          <li>Time: {
            new Date(starting_timestamp).toUTCString()
          }</li>
        </ul>
        <div className='record-detail-prediction'>
          {chosen_event}
        </div>
      </div>
    )

    const btns = ['People', 'Car', 'UFO'].map(type => (
      <button
        key={`${type}-btn`}
        className={classNames('event-btn', {activated: chosen_event})}
        onClick={() => {
          this.setState(prev_state => {
            return {...prev_state, chosen_event: type}
          })
        }}
      >
        {type}
      </button>
    ))

    const btn_group_component = (
      <div className='record-btn-group'>
        {btns}
      </div>
    )

    const displayed_component = (
      expanded ? btn_group_component : detail_component
    )

    return (
      <div
        className={classNames('record', className)}
        style={style}
        onClick={() => {
          this.setState(prev_state => {
            return {...prev_state, expanded: !prev_state.expanded, read: true}
          })
          read_alarm({event_id})
        }}
      >
        <div className='record-read' style={{visibility: read ? 'hidden': 'visible'}}/>
        <div className='record-box'>
          <img className='record-img' src={image_url}/>
          {displayed_component}
        </div>
      </div>
    )
  }
}
