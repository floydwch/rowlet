const Koa = require('koa')
const KoaRouter = require('koa-router')
const koaStaticServer = require('koa-static-server')
const SSEBroadCast = require('sse-broadcast')
const poissonProcess = require('poisson-process')
const cartesianProduct = require('cartesian-product')
const pairingHeap = require('pairing-heap')
const uuid = require('uuid/v4')


class Event {
  constructor(camera_id, prediction, priority) {
    this.camera_id = camera_id
    this.prediction = prediction
    this.priority = priority
    this.event_id = uuid()
    this.starting_timestamp = Date.now()
  }

  compare(other_item) {
    return this.priority - other_item.priority
  }
}


class PriorityQueue {
  constructor() {
    this.heap = pairingHeap.NIL
    this.size = 0
  }

  push(item) {
    this.heap = pairingHeap.push(this.heap, item)
    this.size += 1
  }

  pop() {
    const top = this.top
    this.heap = pairingHeap.pop(this.heap)
    this.size -= 1
    return top
  }

  get top() {
    return this.heap.item
  }
}


class EventScheduler {
  constructor(event_queue, sink) {
    this.event_queue = event_queue
    this.sink = sink
    this.sending_events = new Map()
  }

  run() {
    setInterval(() => {
      if (this.event_queue.size) {
        const event = this.event_queue.pop()
        const {
          event_id,
          starting_timestamp,
          priority,
          camera_id,
          prediction
        } = event

        this.sink.publish('new-alarm-events', 'alarm', {
          event_id,
          starting_timestamp,
          priority,
          camera_id,
          prediction
        })
        this.sending_events.set(event.event_id, event)
      }
    }, 0)

    setInterval(() => {
      console.log('number of unconfirmed event:', this.sending_events.size)
      this.sending_events.forEach(event => {
        this.sink.publish('new-alarm-events', 'alarm', event)
      })
    }, 1000)
  }

  notify(event_id) {
    this.sending_events.delete(event_id)
  }
}


const app = new Koa
const router = new KoaRouter
const sse = new SSEBroadCast
const queue = new PriorityQueue
const scheduler = new EventScheduler(queue, sse)

const event_generators = cartesianProduct(
  [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9], ['people', 'car', 'UFO'], [0, 1, 2]]
).map(({0: camera_id, 1: prediction, 2: priority}) =>
  poissonProcess.create(60000, () => {
    const event = new Event(camera_id, prediction, priority)
    console.log(event)
    queue.push(event)
  })
)
event_generators.forEach(eg => {eg.start()})

router.get('/new-alarm-events/', ctx => {
  sse.subscribe('new-alarm-events', ctx.res)
  ctx.respond = false
})

router.get('/event-viewed/:event_id/', ctx => {
  scheduler.notify(ctx.params.event_id)
  ctx.body = 'done'
})

app.use(router.routes())
  .use(router.allowedMethods())
  .use(koaStaticServer({rootDir: 'client/dist', rootPath: '/'}))

app.listen(3000)
console.log('listening on port 3000')

scheduler.run()