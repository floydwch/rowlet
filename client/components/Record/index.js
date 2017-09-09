import React, {Component} from 'react'
import classNames from 'classnames'

import './index.css'


export default class Record extends Component {
  render() {
    const {
      style,
      className,
      event_id,
      camera_id,
      prediction,
      starting_timestamp,
      image_url,
      read,
      expanded,
      expand_record,
      read_alarm,
      correct_prediction
    } = this.props

    const detail_component = (
      <div className='record-detail'>
        <ul>
          <li>Camera ID: {camera_id}</li>
          <li>Time: {
            new Date(starting_timestamp).toLocaleString()
          }</li>
        </ul>
        <div className='record-detail-prediction'>
          {prediction}
        </div>
      </div>
    )

    const btns = ['people', 'car', 'UFO'].map(type => (
      <button
        key={`${type}-btn`}
        className={
          classNames(
            'event-btn',
            {'event-btn--activated': type === prediction}
          )
        }
        onClick={() => {
          correct_prediction({event_id, prediction: type})
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
          expand_record({event_id, expanded: !expanded})
          if (!read) {
            read_alarm({event_id})
          }
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
