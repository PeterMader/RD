import { removeChildren } from '../util/util.js';

import { addObserver, removeObserver } from '../observe.js';
import Component, { cm } from '../component.js';

import h from './h.js';
import render from './render.js';

function remount (component, target) {
  component[cm.UNMOUNT]();
  component[cm.MOUNT](target);
  component[cm.H_RENDER]();
}

function renderChildren (element, children) {
  removeChildren(element);
  children.map(child => h(child, element))
    .filter(Boolean)
    .forEach(child => element.appendChild(child));
}

function updateProperties (properties, oldProperties, setter, remover) {
  Object.entries(properties).forEach(([key, value]) => {
    if (oldProperties[key] !== value) {
      setter(key, value);
    }
  });
  Object.keys(oldProperties)
    .filter(key => !properties.hasOwnProperty(key))
    .forEach(remover);
}

export default function rerender (element, old, newTree) {
  if (typeof old !== typeof newTree) {
    // rerender completely
    element.parentNode.replaceChild(h(newTree, element.parentNode), element);
  }

  if (newTree instanceof HTMLElement) {
    return;
  }

  if (newTree instanceof Component) {
    newTree[cm.H_RENDER]();
    return;
  }

  const {
    type,
    children = [],
    events = {},
    style = {},
    attributes = {},
    observe: observeName,
    observer
  } = newTree;

  const {
    type: oldType,
    children: oldChildren = [],
    events: oldEvents = {},
    style: oldStyle = {},
    attributes: oldAttributes = {},
    observe: oldObserveName,
    observer: oldObserver
  } = old;

  if (!type || type !== oldType) {
    // the type changed, rerender completely
    element.parentNode.replaceChild(h(newTree), element);
    return;
  }

  if (newTree.hasOwnProperty('text')) {
    if (newTree.text !== old.text) {
      element.textContent = newTree.text.toString();
    }
  } else if (newTree.hasOwnProperty('html')) {
    if (newTree.html !== old.html) {
      element.innerHTML = newTree.html.toString();
    }
  } else {
    if (Array.isArray(children)) {
      if (!Array.isArray(oldChildren)) {
        // rerender completely
        renderChildren(element, children);
      } else {
        const childNodes = [...element.childNodes];
        if (childNodes.length > children.length) {
          childNodes.forEach(child => {
            const component = children.find(c => c[cm.ELEMENT] === child);
            if (component && component instanceof Component) {
              component[cm.UNMOUNT]();
            } else {
              element.removeChild(child);
            }
          });
          children.forEach(child => render(element, child));
        } else {
          childNodes.forEach((child, index) => {
            if (children[index] instanceof Component) {
              const component = children[index];
              if (component[cm.ELEMENT] === child) {
                component[cm.H_RENDER]();
              } else {
                element.replaceChild(component[cm.ELEMENT], child);
                component[cm.H_RENDER]();
              }
            } else {
              rerender(child, oldChildren[index], children[index]);
            }
          });
          children.slice(childNodes.length).forEach((child, index) => {
            if (child instanceof Component) {
              remount(child, element);
            } else {
              render(element, child);
            }
          });
        }
      }
    } else {
      rerender(element.firstChild, oldChildren, children);
    }
  }

  if (observeName && !oldObserveName) {
    element.setAttribute('rd-observe', observeName.toString());
    addObserver(element, observer);
  }
  if (!observeName && oldObserveName) {
    element.removeAttribute('rd-observe');
    removeObserver(element);
  }
  if (observeName && oldObserveName) {
    if (observeName !== oldObserveName) {
      element.setAttribute('rd-observe', observe.toString());
    }
    if (observer !== oldObserver) {
      removeObserver(element);
      addObserver(element, observer);
    }
  }

  updateProperties(
    attributes,
    oldAttributes,
    (key, value) => element.setAttribute(key, value), // setter function
    key => element.removeAttribute(key)               // remover function
  );

  updateProperties(
    style,
    oldStyle,
    (key, value) => element.style[key] = value,
    key => element.style[key] = ''
  );

  updateProperties(
    events,
    oldEvents,
    (key, value) => {
      element.removeEventListener(key, oldEvents[key]);
      element.addEventListener(key, value);
    },
    key => element.removeEventListener(key, oldEvents[key])
  );
}
