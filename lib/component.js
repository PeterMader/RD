import h from './render/h.js';
import render from './render/render.js';
import rerender from './render/rerender.js';

import EventEmitter from './event-emitter.js';

const cm = {
  CONSTRUCT: Symbol('construct'),
  MOUNT: Symbol('mount'),
  UNMOUNT: Symbol('unmount'),
  H_RENDER: Symbol('h-render'),
  CACHE: Symbol('cache'),
  ELEMENT: Symbol('element'),
  PARENT_ELEMENT: Symbol('parent-element'),
  INITIALIZED: Symbol('initialized')
};

export default class Component extends EventEmitter {
  constructor () {
    super();
    this[cm.INITIALIZED] = false;
  }
  [cm.CONSTRUCT] (options) {
    this.children = options.children;
    this.attributes = options.attributes;
    this[cm.PARENT_ELEMENT] = null;
  }
  [cm.MOUNT] (parent) {
    this[cm.PARENT_ELEMENT] = parent;
    const element = this[cm.ELEMENT];
    if (element) {
      parent.appendChild(element);
    }
    if (!this[cm.INITIALIZED]) {
      this[cm.INITIALIZED] = true;
      this.init();
    }
  }
  [cm.UNMOUNT] () {
    const parent = this[cm.PARENT_ELEMENT];
    const element = this[cm.ELEMENT];
    if (!parent) {
      return;
    }
    if ([...parent.childNodes].indexOf(element) !== -1) {
      parent.removeChild(element);
    }
    this[cm.PARENT_ELEMENT] = null;
  }
  [cm.H_RENDER] () {
    const result = this.render();
    if (this[cm.ELEMENT] instanceof HTMLElement) {
      rerender(this[cm.ELEMENT], this[cm.CACHE], result);
    } else {
      this[cm.ELEMENT] = render(this[cm.PARENT_ELEMENT], result);
    }
    this[cm.CACHE] = result;
  }
  init () {}
  render () {
    return '';
  }
  update () {
    window.requestAnimationFrame(this[cm.H_RENDER].bind(this));
  }
}

export { cm };

const registeredComponents = {};
Component.isRegistered = function (type) {
  return registeredComponents.hasOwnProperty(type);
};

Component.register = function (type, component) {
  return registeredComponents[type] = component;
};

Component.instantiate = function (type, options, parent) {
  // find out the component
  let cls = null;
  if (typeof type !== 'function') {
    if (Component.isRegistered(type)) {
      cls = registeredComponents[type];
    } else {
      throw new ReferenceError(`Unknown component ${type}`);
    }
  } else {
    cls = type;
  }

  //  construct the component
  const component = new cls();
  component[cm.CONSTRUCT](options);

  // mount the component
  const parentElement = parent || h({
    type: 'div',
    style: options.style
  });
  component[cm.MOUNT](parentElement);

  // render the component for the first time, creating its element
  component[cm.H_RENDER]();

  // insert the element into the DOM
  const element = component[cm.ELEMENT];
  parent.appendChild(element);
  return element;
};
