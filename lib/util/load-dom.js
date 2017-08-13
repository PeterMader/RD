export function onDOMLoad (cb) {
  if (document.readyState === 'interactive' || document.readyState === 'complete') {
    cb();
  } else {
    document.addEventListener('DOMContentLoaded', cb);
  }
}

export default function loadDOM () {
  return new Promise(resolve => onDOMLoad(resolve));
};
