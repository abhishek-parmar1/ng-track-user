// TODO : add description here
import {
  getFirstScrollableParent,
  getOffsetTop,
  isElementInView,
  visibility
} from "./utils";

// TODO : add description here
const NgTrackU = () => {
  return {
    restrict: "A",
    link: function (scope, element) {
      // get the element
      const nativeEl = element[0];

      // get the scrollable parent of the element
      const scrollableParent = getFirstScrollableParent(nativeEl);

      //TODO: replace Scroll by set Interval and record the time for each individual id.

      let timer = 0, 
        isPaused = false;

      visibility();
        
      // on scroll event on parent
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
        if (isElementInView(fieldDimensions, viewPortDimensions) && !isPaused) {
          timer++;
          // TODO: remove this console log from here
          console.log(nativeEl.id, timer);
        }
      }, 1000
    );

    element.on('$destroy', () => {
      clearInterval(interval);
      if(timer) {
        // add mix panel call here
        console.log(nativeEl.id, timer);
      }
    });
    }
  }
};

NgTrackU.NAME = "ngTrackU";

export default NgTrackU;