import SmoothScrollbar from 'smooth-scrollbar';
import ModalPlugin from 'models/scroll-modal-plugin';

SmoothScrollbar.use(ModalPlugin);

const states = {
    isLocked: 'is-locked',
};

const lockElement = document.querySelector('.page');
const documentElement = document.documentElement;

let locked = false;
let scrollPos = {
    x: 0,
    y: 0,
};

export function lockPage() {
    const scrollbar = SmoothScrollbar.getAll()[0];
    if (locked || !lockElement) {
        return false;
    }
    scrollPos = {
        x: window.scrollX,
        y: window.scrollY,
    };
    locked = true;
    lockElement.style.top = -scrollPos.y + 'px';
    documentElement.classList.add(states.isLocked);
    scrollbar.updatePluginOptions('Modal', { open: true });
}

export function unlockPage() {
    const scrollbar = SmoothScrollbar.getAll()[0];
    if (!locked) {
        return false;
    }
    documentElement.classList.remove(states.isLocked);
    window.scrollTo(scrollPos.x, scrollPos.y);
    lockElement.style.top = 'auto';
    locked = false;
    scrollbar.updatePluginOptions('Modal', { open: false });
}
