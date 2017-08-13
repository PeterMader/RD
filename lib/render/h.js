import Component, { cm } from '../component.js';
import { addObserver } from '../observe.js';

import { addAttributes, addStyle, addListeners } from './render.js';

export default function h (o = {}, parent = null) {
  if (typeof o !== 'object') {
    return document.createTextNode(o.toString());
  }

  if (o instanceof Component) {
    if (parent instanceof HTMLElement && parent !== o[cm.PARENT_ELEMENT]) {
      o[cm.UNMOUNT]();
      o[cm.MOUNT](parent);
    }
    o[cm.H_RENDER]();
    return o[cm.ELEMENT];
  }

  if (o instanceof HTMLElement) {
    return o;
  }

  const {
    type,
    events = {},
    style = {},
    attributes = {},
    children = [],
    observe: observeName,
    observer
  } = o;

  if (!type) {
    return document.createTextNode('');
  }

  const options = { style, events, attributes, children };
  if (type.prototype instanceof Component) {
    return Component.instantiate(type, options, parent);
  }
  if (Component.isRegistered(type)) {
    return Component.instantiate(type, options, parent);
  }

  const element = document.createElement(type);
  if (element instanceof HTMLUnknownElement) {
    return null;
  }

  if (o.hasOwnProperty('text')) {
    element.textContent = o.text.toString();
  } else if (o.hasOwnProperty('html')) {
    element.innerHTML = o.html.toString();
  } else {
    if (Array.isArray(children)) {
      children.map(child => h(child, element))
        .filter(Boolean)
        .forEach(child => element.appendChild(child));
    } else {
      element.appendChild(h(children, element));
    }
  }

  if (observeName) {
    element.setAttribute('rd-observe', observeName.toString());
    addObserver(element, observer);
  }

  addAttributes(element, attributes);
  addStyle(element, style);
  addListeners(element, events);

  return element;
}
