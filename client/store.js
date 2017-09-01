import {createStore, applyMiddleware} from 'redux'
import {createCycleMiddleware} from 'redux-cycles'
import {run} from '@cycle/run'
import {makeHTTPDriver} from '@cycle/http'

import root_reducer from './reducers'
import main_cycle, {sse_driver} from './cycle'


const cycleMiddleware = createCycleMiddleware()
const {makeActionDriver} = cycleMiddleware
const store = createStore(root_reducer, applyMiddleware(cycleMiddleware))

run(main_cycle, {
  ACTION: makeActionDriver(),
  HTTP: makeHTTPDriver(),
  SSE: sse_driver
})

export default store
