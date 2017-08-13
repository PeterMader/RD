import RDDefaultCSS from './css/rd.css.js';

import util from './util/util.js';
import loadDOM from './util/load-dom.js';

import h from './render/h.js';
import render from './render/render.js';
import rerender from './render/rerender.js';
import merge from './render/merge.js';

import EventEmitter from './event-emitter.js';
import Component from './component.js';
import Dialog from './dialog.js';

import createDialog , { info, confirm } from './default-dialogs.js';

loadDOM().then(function () {
  const style = h({
    type: 'style',
    text: RDDefaultCSS
  });
  document.head.insertBefore(style, document.head.firstChild);
});

const RD = createDialog;

export default createDialog;
window.RD = RD;

export {
  EventEmitter,
  loadDOM,
  Component,
  h,
  render,
  rerender,
  merge,
  Dialog,
  info,
  confirm
};

RD.EventEmitter = EventEmitter;
RD.loadDOM = loadDOM;
RD.Component = Component;
RD.h = h;
RD.render = render;
RD.rerender = rerender;
RD.merge = merge;
RD.Dialog = Dialog;
RD.info = info;
RD.confirm = confirm;
