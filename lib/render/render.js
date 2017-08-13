import h from './h.js';

export default function render (wrapper, o) {
  const element = h(o, wrapper);
  wrapper.appendChild(element);
  return element;
}

export function addAttributes (element, attributes) {
  Object.entries(attributes).forEach(([key, value]) => {
    if (element.getAttribute(key) !== value) {
      element.setAttribute(key, value);
    }
  });
}

export function addStyle (element, style) {
  Object.entries(style).forEach(([key, value]) => {
    if (element.style[key] !== value) {
      element.style[key] = value;
    }
  });
}

export function addListeners (element, events) {
  Object.entries(events).forEach(([key, value]) => {
    element.addEventListener(key, value);
  });
}
