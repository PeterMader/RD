let observedValue = null;

function defaultObserver () {
  return this.textContent || this.value;
}

const observed = new WeakMap();

export function addObserver (element, cb) {
  const listener = typeof cb === 'function' ? cb : defaultObserver;
  const observer = createObserver(listener);
  observed.set(element, observer);
  element.addEventListener('rd-observe', observer, { passive: true });
}

export function removeObserver (element) {
  if (observed.has(element)) {
    element.removeEventListener('rd-observe', observed.get(element));
    observed.delete(element);
  }
}

export function getObservedValue () {
  return observedValue;
}
