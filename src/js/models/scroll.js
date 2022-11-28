import ScrollSmoother from 'gsap/ScrollSmoother';

export function scrollToTop(smooth) {
    const previouslyCreatedSmoother = ScrollSmoother.get(); 
    previouslyCreatedSmoother.scrollTo(0, smooth, "top top");
}

export function scrollTo(element) {
    const previouslyCreatedSmoother = ScrollSmoother.get(); 

    if (element == null) {
        return;
    }

    previouslyCreatedSmoother.scrollTo(element, true, "top top");
}

