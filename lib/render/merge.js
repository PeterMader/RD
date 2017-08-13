import { removeChildren } from '../util/util.js';

import { addObserver, removeObserver } from '../observe.js';
import Component, { cm } from '../component.js';

import h from './h.js';
import { addAttributes, addStyle, addListeners } from './render.js';

export default function merge (element, o) {
  if (element.nodeType === Node.TEXT_NODE) {
    element.textContent = o.toString();
    return;
  }

  if (typeof o !== 'object') {
    element.parentNode.replaceChild(document.createTextNode(o.toString()), element);
    return;
  }

  if (o instanceof HTMLElement) {
    element.parentNode.replaceChild(o, element);
    return;
  }

  if (o instanceof Component) {
    if (o[cm.ELEMENT] !== element) {
      o[cm.UNMOUNT]();
      o[cm.MOUNT](element.parentNode);
    }
    o[cm.H_RENDER]();
    return;
  }

  const {
    type,
    text,
    html,
    children = [],
    events = {},
    style = {},
    attributes = {},
    observe: observeName,
    observer
  } = o;

  if (type && type.toLowerCase() !== element.nodeName.toLowerCase()) {
    // the type changed, rerender completely
    element.parentNode.replaceChild(h(o), element);
    return;
  }

  if (typeof text === 'string') {
    if (text !== element.textContent) {
      element.textContent = text;
    }
  } else if (typeof html === 'string') {
    if (html !== element.innerHTML) {
      element.innerHTML = html;
    }
  } else {
    if (Array.isArray(children)) {
      children.forEach((child, index) => {
        merge(element.childNodes[index], child);
      });
    } else {
      merge(element.firstChild, children);
    }
  }

  if (observeName) {
    element.setAttribute('rd-observe', observeName.toString());
    addObserver(element, observer);
  }
  if (!observeName && element.hasAttribute('rd-observe')) {
    element.removeAttribute('rd-observe');
    removeObserver(element);
  }
  if (observeName && element.hasAttribute('rd-observe')) {
    if (observeName !== element.getAttribute('rd-observe')) {
      element.setAttribute('rd-observe', observeName.toString());
    }
    removeObserver(element);
    addObserver(element, observer);
  }

  addAttributes(element, attributes);
  addStyle(element, style);
  addListeners(element, events);
}
