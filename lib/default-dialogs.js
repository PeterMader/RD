import h from './render/h.js';

import Dialog from './dialog.js';

const closeKeys = ['Enter', 'Escape'];

export default function createDialog (options = {}) {
  const getOption = k => util.getOption(options, k);

  if (typeof options === 'string') {
    return info(options);
  }

  let {buttons} = options;
  if (!buttons) {
    buttons = [{
      type: 'button',
      text: 'OK',
      value: 'OK'
    }];
  }

  buttons = buttons.map((button, index) => {
    let btn = button;
    if (typeof button !== 'object') {
      const text = button.toString();
      btn = {
        text,
        value: text
      };
    }
    btn.type = 'button';
    btn.value = btn.hasOwnProperty('value') ? btn.value : index;
    if (!btn.events) {
      btn.events = {};
    }
    const onClick = () => dialog.destroy(btn.value);
    if (typeof btn.events['click'] === 'function') {
      const old = btn.events['click'];
      btn.events['click'] = function (e) {
        old.call(this, e);
        onClick();
      };
    } else {
      btn.events['click'] = onClick;
    }
    return btn;
  });

  const element = h({
    type: 'div',
    attributes: {
      'class': 'rd-dialog',
      role: 'dialog'
    },
    children: [{
      // head section
      type: 'h1',
      children: getOption('title')
    }, {
      // content section
      type: 'div',
      children: getOption('content')
    }, {
      // buttons section
      type: 'div',
      children: buttons
    }]
  });

  if (options.html) {
    element.childNodes[1].innerHTML = options.html;
  }

  const dialogOptions = { closable: getOption('closable', false), validate: getOption('validate', null) };
  const dialog = new Dialog(element, dialogOptions);
  if (dialogOptions.closable) {
    let keysDown = {};
    element.addEventListener('keydown', e => {
      if (document.activeElement === element && closeKeys.indexOf(e.key) !== -1) {
        keysDown[e.key] = true;
      }
    });
    element.addEventListener('blur', _ => keysDown = {});
    element.addEventListener('keyup', e => {
      if (keysDown[e.key] && document.activeElement === element && closeKeys.indexOf(e.key) !== -1) {
        dialog.destroy(null);
        keysDown[e.key] = false;
      }
    });
  }
  dialog.open();

  return new Promise(resolve => {
    dialog.on('close', resolve);
  });
}

export function confirm (o) {
  o.buttons = [{
    text: o.confirm || 'Yes',
    value: true
  }, {
    text: o.cancel || 'No',
    value: false
  }];

  return createDialog(o).then(result => Promise.resolve(result.value));
}

export function info (content) {
  return createDialog({ content, closable: true });
}
