export function getOption (options, key, defaults = '') {
  return options.hasOwnProperty(key) ? options[key] : defaults;
}

export function isObject (obj) {
  return obj && typeof obj === 'object';
}

export function copy (object) {
  if (!isObject(object)) {
    return value;
  }
  if (Array.isArray(object)) {
    return object.map(copy);
  }
  return Object.entries(object).reduce((acc, [key, value]) => {
    acc[key] = isObject(value) ? copy(value) : value;
    return acc;
  }, {});
}

export function removeChildren (element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}
