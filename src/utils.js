/**
 * Calculate and return the first scrollable parentof the node.
 * @param  {Object} node  
 * @return {Object}
 */
export function getFirstScrollableParent(node) {
  let isScrollable;

  if (node == null) {
    return null;
  }

  if (node.nodeName === "BODY") {
    return window;
  }

  isScrollable = /(auto|scroll)/.test(
    window.getComputedStyle(node)['overflow'] +
    window.getComputedStyle(node)['overflow-y'] +
    window.getComputedStyle(node)['overflow-x']
  );

  if (isScrollable) {
    return node;
  } else {
    return getFirstScrollableParent(node.parentNode);
  }
}

/**
 * Calculate and return the offsetTop of node from its root parent.
 * @param  {Object} node  
 * @return {Number}
 */
export const getOffsetTop = (node) => {

  if(node.offsetParent === undefined)
    return 0;

  let top = 0;
  if(node.offsetParent)
    top = node.offsetTop + getOffsetTop(node.offsetParent);
  return top >= 0 ? top : 0;
}

/**
 * True when the given field is in viewport and satisfies the conditions to be in view.
 * @param  {Object} field  
 * @param  {Object} viewport 
 * @return {Boolean}
 */
export const isElementInView = (field, viewport) => {
  let cond, buffered, partialView;

  // Field entirely within viewport
  if ((field.bottom <= viewport.bottom) && (field.top >= viewport.top)) {
    return true;
  }

   // Field bigger than viewport
   // viewport.height / 2 because below that field is considered in partial view case
  if (field.height > viewport.height) {
    cond = (viewport.bottom - field.top) > (viewport.height / 2) && (field.bottom - viewport.top) > (viewport.height / 2);
    if (cond) {
      return true;
    }
  }

  // Partially in view (50%) for elements which have height greater than 3/4 of viewport
  buffered = (field.height * (50/100));
  partialView = ((viewport.bottom - buffered) >= field.top && (field.bottom - buffered) > viewport.top);

  return partialView && field.height > 3* (viewport.height/4);
}

/*!
 * visibly - v0.6 Aug 2011 - Page Visibility API Polyfill
 * http://github.com/addyosmani
 * Copyright (c) 2011 Addy Osmani
 * Dual licensed under the MIT and GPL licenses.
 */
export const visibility = () => {

  window.visibly = {
    b: null,
    q: document,
    p: undefined,
    prefixes: ['webkit', 'ms'],
    props: ['VisibilityState', 'visibilitychange', 'Hidden'],
    m: ['focus', 'blur'],
    visibleCallbacks: [],
    hiddenCallbacks: [],
    _callbacks: [],

    onVisible: function ( _callback ) {
      this.visibleCallbacks.push(_callback);
    },
    onHidden: function ( _callback ) {
      this.hiddenCallbacks.push(_callback);
    },
    isSupported: function () {
      return (this._supports(0) || this._supports(1));
    },
    _supports: function ( index ) {
      return ((this.prefixes[index] + this.props[2]) in this.q);
    },
    runCallbacks: function ( index ) {
      if ( index ) {
        this._callbacks = (index == 1) ? this.visibleCallbacks : this.hiddenCallbacks;
        for (var i = 0; i < this._callbacks.length; i++) {
          this._callbacks[i]();
        }
      }
    },
    _visible: function () {
      window.visibly.runCallbacks(1);
    },
    _hidden: function () {
      window.visibly.runCallbacks(2);
    },
    _nativeSwitch: function () {
      ((this.q[this.b + this.props[2]]) === true) ? this._hidden() : this._visible();
    },
    listen: function () {

      try { 
        /*if no native page visibility support found..*/
        if (!(this.isSupported())) {
          if (document.addEventListener) { 
            /*for browsers without focusin/out support eg. firefox, opera use focus/blur*/
            /*window used instead of doc as Opera complains otherwise*/
            window.addEventListener(this.m[0], this._visible, 1);
            window.addEventListener(this.m[1], this._hidden, 1);
          } else { 
            /*IE <10s most reliable focus events are onfocusin/onfocusout*/
            this.q.attachEvent('onfocusin', this._visible);
            this.q.attachEvent('onfocusout', this._hidden);
          }
        } else { 
          /*switch support based on prefix*/
          this.b =  (this._supports(0) == this.p) ? this.prefixes[1] : this.prefixes[0];
          this.q.addEventListener(this.b + this.props[1], function () {
            window.visibly._nativeSwitch.apply(window.visibly, arguments);
          }, 1);
        }
      } catch (e) {}
    },
    init: function () {
      this.listen();
    }
  };

  // for handling use strict case
  window.visibly.init();
};