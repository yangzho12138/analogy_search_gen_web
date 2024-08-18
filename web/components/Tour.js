import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

export const setupTour = (page) => {
    const tour = new Shepherd.Tour({
        defaultStepOptions: {
          classes: 'shepherd-theme-arrows',
          scrollTo: true,
          modalOverlayOpeningPadding: 5,
        },
        useModalOverlay: true,
      });

      const skipButton = {
        text: 'Skip',
        action: tour.complete,
        classes: 'shepherd-button-secondary'
      };

      if(page === 'search') {
        tour.addStep({
          id: 'intro',
          text: '<h3 className="shepherd-title">Search Bar</h3> <p className="shepherd-text">To find a suitable analogy from our database, enter your search query, you can filter results based on the configuration used to generate the analogy!</p>',
          attachTo: {
            element: '.search-bar',
            on: 'bottom',
          },
          buttons: [
            skipButton,
            {
              text: 'Next',
              action: tour.next,
            },
          ],
        });
      
        tour.addStep({
          id: 'second-step',
          text: '<h3 className="shepherd-title">Search Results</h3> <p className="shepherd-text">This is the search results, you can provide feedback on the analogy in the form of likes and dislikes, you can also report an offensive or inappropriate analogy and start a conversation around the analogy with the broader community!</p>',
          attachTo: {
            element: '.search-result',
            on: 'top',
          },
          buttons: [
            skipButton,
            {
              text: 'Back',
              action: tour.back,
            },
            {
              text: 'Next',
              action: tour.next,
            },
          ],
        });
      }
      
      return tour;
}