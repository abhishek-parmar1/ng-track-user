/**
 * Imported the required utilities.
 */
import {
  getFirstScrollableParent,
  getOffsetTop,
  isElementInView,
  visibility
} from "./utils";


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

      // set the timer to 0
      let timer = 0, 
        isPaused = false;
      
      // bind the visibly to window
      visibility();
        
      let interval = setInterval( () => {

        // height of parent and element
        let viewPortHeight = scrollableParent.getBoundingClientRect().height,
          fieldHeight = nativeEl.getBoundingClientRect().height,

          // dimensions of parent and element  
          // TODO: use this property and test
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

        // on tab change
        visibly.onHidden(function() {
          isPaused = true;
        });
    
        // on current tab
        visibly.onVisible(function() {
          isPaused = false;
        });      

        // check if element in view
        if (isElementInView(fieldDimensions, viewPortDimensions) && !isPaused) {
          
          // incerment the time
          timer++;
          
          // log the time for section
          console.log(nativeEl.id, timer);
        }
      }, 1000
    );

    // on destroy of directive
    element.on('$destroy', () => {

      // clear the interval to prevent memory leak
      clearInterval(interval);
      if(timer) {
        
        // log the final time for the element
        console.log(nativeEl.id, timer);

        /* Call your trackings here.*/
      }
    });
    
    }
  }
};

NgTrackU.NAME = "ngTrackUser";

export default NgTrackU;