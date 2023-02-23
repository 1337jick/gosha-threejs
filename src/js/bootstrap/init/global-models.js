import { addGlobalEventListeners } from 'models/emit-debounced-events';
import { initBreakpointWatching } from 'models/breakpoints';
import { initOverlaySystem } from 'models/overlay';
import checkForTouch from 'models/check-for-touch';
import smoothScroll from 'models/smooth-scroll';
import inView from 'models/in-view';

addGlobalEventListeners();
initBreakpointWatching();
initOverlaySystem();
// smoothScroll();
checkForTouch();
inView();
