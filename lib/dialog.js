import render from './render/render.js';

import EventEmitter from './event-emitter.js';
import { getObservedValue } from './observe.js';

let dialogs = [];
let wrapper = null;
let activeDialog = null;

function createWrapper () {
  wrapper = render(document.body, {
    type: 'div',
    attributes: {
      'class': 'rd-wrapper'
    },
    events: {
      click (e) {
        if (this === e.target) {
          if (activeDialog && activeDialog.closable) {
            activeDialog.destroy(null);
          }
        }
      }
    }
  });
}

function activateTop () {
  if (dialogs.length > 0) {
    dialogs[dialogs.length - 1].activate();
  }
}

export default class Dialog extends EventEmitter {
  constructor (element, { closable, validate }) {
    super();
    this.element = element;
    this.closable = closable;
    this.validate = typeof validate === 'function' ? validate : this.validate;
    dialogs.push(this);
  }
  open () {
    if (!wrapper) {
      createWrapper();
    }
    wrapper.appendChild(this.element);
    wrapper.style.display = 'block';
    dialogs.filter(d => d !== this).forEach(d => d.deactivate());
    this.activate();
  }
  deactivate () {
    const {element} = this;
    element.removeAttribute('tabindex');
    element.classList.remove('active');
  }
  activate () {
    const {element} = this;
    element.setAttribute('tabindex', '0');
    element.classList.add('active');
    element.focus();
    activeDialog = this;
  }
  validate () {
    return true;
  }
  getResult (reason) {
    const result = { value: reason };
    const observed = [...this.element.querySelectorAll('[rd-observe]')];
    observed.forEach(el => {
      const event = new Event('rd-observe');
      el.dispatchEvent(event);
      result[el.getAttribute('rd-observe')] = observe.getObservedValue();
    });
    if (!this.validate(result)) {
      return null;
    }
    return result;
  }
  destroy (reason) {
    const result = this.getResult(reason);
    if (!result) {
      return;
    }
    wrapper.removeChild(this.element);
    dialogs = dialogs.filter(d => d !== this);
    if (dialogs.length === 0) {
      wrapper.style.display = 'none';
    }
    activateTop();
    this.emit('close', result);
  }
}
