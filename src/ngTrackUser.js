/**
 * Imported the required utilities.
 */
import {
  getFirstScrollableParent,
  getOffsetTop,
  isElementInView,
  visibility
} from "./utils";

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

export default NgTrackUser;