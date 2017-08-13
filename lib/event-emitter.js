export default class EventEmitter {
  constructor () {
    this[EVENTS] = {};
  }
  on (channel, cb) {
    if (Array.isArray(this[EVENTS][channel])) {
      this[EVENTS][channel].push(cb);
    } else {
      this[EVENTS][channel] = [cb];
    }
  }
  emit (channel, ...args) {
    if (Array.isArray(this[EVENTS][channel])) {
      this[EVENTS][channel].forEach(cb => cb.apply(null, args));
    }
  }
}

const EVENTS = Symbol('events');
