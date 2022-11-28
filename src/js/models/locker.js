import ScrollSmoother from 'gsap/ScrollSmoother';

const states = {
    isLocked: 'is-locked',
};

const lockElement = document.querySelector('.page');
const documentElement = document.documentElement;


let locked = false;


export function lockPage() {
    const previouslyCreatedSmoother = ScrollSmoother.get(); 
    if (locked || !lockElement) {
        return false;
    }

    locked = true;
    // lockElement.style.top = -scrollPos.y + 'px';
    documentElement.classList.add(states.isLocked);
    previouslyCreatedSmoother.paused(true);
}

export function unlockPage() {
    const previouslyCreatedSmoother = ScrollSmoother.get(); 
    if (!locked) {
        return false;
    }
    documentElement.classList.remove(states.isLocked);
    // lockElement.style.top = 'auto';
    locked = false;
    previouslyCreatedSmoother.paused(false);
}
