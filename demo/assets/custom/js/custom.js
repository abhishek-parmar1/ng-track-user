/**** DIRECTIVE CODE ****/
/* a constant for time interval limit*/
const globalWatcherLimit = 20;


/**
 * Angular directive (using ES-6)
 */
const NgTrackUser = () => {
  
  return {
    restrict: "A",
    link: function (scope, element) {

      // get the element
      const nativeEl = element[0];

      // get the scrollable parent of the element
      const scrollableParent = getFirstScrollableParent(nativeEl);

      let isPaused = false;
      // a global object which will track time of all sections
      if(!window.hasOwnProperty('timer')) {
        window.timer = {};
      }
      // a global variable which will track the overall all time spend 
      if(!window.hasOwnProperty('globalWatcher')) {
        window.globalWatcher = 0;
        setInterval(() => window.globalWatcher++, 1000);
      }
      // add a global method which will reset the time of all sections
      if(!window.hasOwnProperty('resetEventsTime')) {
        window.resetEventsTime = () => {
          Object.keys(window.timer).forEach(e => window.timer[e] = 0 );
        }
      }
      // add a global method which will call the trackings for all the methods
      if(!window.hasOwnProperty('trackingCalls')) {
        window.trackingCalls = () => {
          Object.keys(window.timer).forEach(e => {
            if(window.timer[e])
              // call here your custom data analytics method  
              yourCustomDataAnalyticsMethod(e.toUpperCase().replace(/-/g , "_"), {timeSpend: window.timer[e]}) 
          });
        }
      }

      visibility();
      
      // an interval of 1 second for each section to track
      let interval = setInterval( () => {

        // height of parent and element
        let viewPortHeight = scrollableParent.getBoundingClientRect().height,
          fieldHeight = nativeEl.getBoundingClientRect().height,

          // dimensions of parent and element  
          viewPortDimensions = {
            top: scrollableParent.scrollTop,
            bottom: scrollableParent.scrollTop + viewPortHeight,
            height: viewPortHeight
          },
          fieldDimensions = {
            top: getOffsetTop(nativeEl),
            bottom: getOffsetTop(nativeEl) + fieldHeight,
            height: fieldHeight,
            name: nativeEl.id
          };

        visibly.onHidden(function() {
          isPaused = true;
        });
    
        visibly.onVisible(function() {
          isPaused = false;
        });

        // check if element in view
        if (isElementInView(fieldDimensions, viewPortDimensions) && !isPaused && window.timer) {
          
          // add the event with start time to window.timer if not present
          if(!window.timer[nativeEl.id]) {
            window.timer = {
              ...window.timer,
              [nativeEl.id]: 0
            };
          }
          
          window.timer[nativeEl.id]++;
          
          // TODO: remove this console log before use          
          console.log(nativeEl.id, window.timer[nativeEl.id]);
        }

        if(window.globalWatcher && 
           window.globalWatcher === globalWatcherLimit && 
           window.timer && 
           window.trackingCalls && 
           window.resetEventsTime) {
          
          // TODO: remove this console log before use
          console.log(window.timer);
          window.trackingCalls();
          window.resetEventsTime();
          window.globalWatcher = 0;
        }

      }, 1000);

      element.on('$destroy', () => {
        clearInterval(interval);
        if(window.timer[nativeEl.id] || window.timer[nativeEl.id] === 0) {
          delete window.timer[nativeEl.id];
        }
        if(window.globalWatcher) {
          delete window.globalWatcher;
        }
      });
    }
  }
};

NgTrackUser.NAME = "ngTrackUser";


/**** UTILS CODE ****/
/**
 * Calculate and return the first scrollable parentof the node.
 * @param  {Object} node  
 * @return {Object}
 */
function getFirstScrollableParent(node) {
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
const getOffsetTop = (node) => {

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
const isElementInView = (field, viewport) => {
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
const visibility = () => {

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

// initialise ng-app
var demoApp = angular.module('demoApp',['ngRoute'])
  .directive(NgTrackUser.NAME, NgTrackUser);

// creating the urls
demoApp.config(function ($routeProvider){
        // html  url
        $routeProvider.when('/', {
            templateUrl : 'pages/home.html',
        });
        $routeProvider.when('/nextPage', {
            templateUrl : 'pages/nextPage.html',
        });
});

