import { dimPage, undimPage } from 'models/dimmer';
import { lockPage, unlockPage } from 'models/locker';
import { parse } from 'models/utils/app';
import gsap from 'gsap';
import { listen, unlisten } from 'models/utils/event-bus';
import generateIcon from 'models/icon';

let overlayEl;
let overlayOpen = false;
let overlayOpening = false;
let lastOverlayParameters = false;
const classes = {
    link: 'js-overlay__link',
    content: 'js-overlay__content',
    close: 'js-overlay__close',
};

const states = {
    visible: 'is-visible',
};

const elements = {
    links: document.querySelectorAll('a[target="_top"], .' + classes.link),
    closeButtons: document.querySelectorAll('.js-overlay__close'),
    menuItems: document.querySelectorAll('.js-contact__link'),
    footer: document.querySelector('.js-contact__footer'),
    bgs: document.querySelectorAll('.js-overlay__bg__item'),
};

export function initOverlaySystem() {
    addListeners();

    detectLinks();
}

function detectLinks() {
    var links = document.querySelectorAll('a[href]');
    var cbk = function (e) {
        if (e.currentTarget.href === window.location.href) {

            e.preventDefault();
            e.stopPropagation();

            closeOverlay();
        }
    };

    for (var i = 0; i < links.length; i++) {
        links[i].addEventListener('click', cbk);
    }
}

function addListeners() {
    elements.links.forEach((link) => {
        link.addEventListener('click', linkClickHandler);
    });
}

function removeListeners() {
    elements.links.forEach((link) => {
        link.removeEventListener('click', linkClickHandler);
    });
}

function addInnerListeners() {
    elements.closeButtons.forEach((button) =>
        button.addEventListener('click', closeButtonClickHandler)
    );
    document.addEventListener('keyup', innerDocumentKeypressHandler);
    listen('close-overlay', closeOverlayHandler);
}

function removeInnerListeners() {
    elements.closeButtons.forEach((button) =>
        button.removeEventListener('click', closeButtonClickHandler)
    );
    document.removeEventListener('keyup', innerDocumentKeypressHandler);
    unlisten('close-overlay', closeOverlayHandler);
}

function linkClickHandler(e) {
    e.preventDefault();
    const href = e.currentTarget.getAttribute('href');
    const contentWrapperParams = e.currentTarget.dataset.contentWrapperParams;
    openOverlay(href, false, contentWrapperParams);
}

function closeButtonClickHandler(e) {
    closeOverlay();
}

function innerDocumentKeypressHandler(e) {
    if (e.key === 'Escape') {
        closeOverlay();
    }
}

function closeOverlayHandler() {
    closeOverlay();
}

export function openOverlay(
    contentHolder,
    contentType = false,
    contentWrapperParams = false,
    callParameters = {}
) {
    if (overlayOpening) return false;
    if (overlayOpen) {
        // handle a case of opening new overlay while previous is still open
        closeOverlay({
            contentHolder,
            contentType,
            contentWrapperParams,
            callParameters,
        });
        return false;
    }
    overlayOpening = true;

    dimPage();
    lockPage();
    showOverlay(contentHolder);
    showBg();
    requestAnimationFrame(() => {
        addInnerListeners();
    });

    setTimeout(() => {
        overlayOpening = false;
        overlayOpen = true;
        focusOnContent();
    }, 300);
}

function showOverlay(overlay) {
    overlay = overlay.replace('#', '');
    overlayEl = document.querySelector(`[data-overlay="${overlay}"]`);

    overlayEl.classList.add(states.visible);

    // animate links
    gsap.to(elements.menuItems, {
        alpha: 1,
        stagger: 0.05,
        duration: 0.2,
        delay: 0.1,
        ease: 'power1.in',
    });

    gsap.fromTo(
        elements.menuItems,
        {
            yPercent: 100,
        },
        {
            yPercent: 0,
            stagger: 0.05,
            duration: 0.6,
            delay: 0.1,
            ease: 'expo.out',
        }
    );

    // show fooer
    gsap.to(elements.footer, {
        alpha: 1,
        yPercent: 0,
        duration: 0.3,
        delay: 0.4,
        ease: 'expo.out',
    });
}

function showBg() {
    const tl = gsap.timeline();
    tl.to(elements.bgs, {
        yPercent: -100,
        stagger: 0.05,
        duration: 0.6,
        ease: 'expo.out',
    });
}
function hideOverlay(delay) {
    overlayEl = document.querySelector(`[data-overlay].is-visible`);

    overlayEl.classList.remove(states.visible);

    // animate links
    gsap.to(elements.menuItems, {
        alpha: 0,
        yPercent: 100,
        stagger: -0.05,
        duration: 0.3,
        ease: 'expo.out',

        onComplete: () => {
            hideBg();
        },
    });

    // hide footer
    gsap.to(elements.footer, {
        alpha: 0,
        yPercent: 10,
        duration: 0.3,
        ease: 'expo.out',
    });
}

function focusOnContent() {
    const contentEl = overlayEl.firstElementChild;
    contentEl.setAttribute('tabindex', '-1');
    contentEl.setAttribute('aria-dialog', true);
    contentEl.setAttribute('role', 'dialog');
    // contentEl.focus();
    parse(contentEl);
    parseOverlayLinks();
}

export function closeOverlay(relaunchOverlayConfig = false, forceClose = false) {
    if (!overlayOpen && !forceClose) {
        return false;
    }
    removeInnerListeners();
    undimPage();
    unlockPage();
    hideOverlay();

    setTimeout(() => {
        overlayOpen = false;
    }, 300);
}

function hideBg() {
    const tl = gsap.timeline();

    tl.to(elements.bgs, {
        yPercent: 0,
        stagger: 0.05,
        duration: 0.6,
        ease: 'expo.out',
    });
}

export function parseOverlayLinks() {
    removeListeners();
    elements.links = document.querySelectorAll('a[target="_top"], .' + classes.link);
    addListeners();
}

export function reloadOverlay() {
    if (!lastOverlayParameters) {
        return false;
    }
    openOverlay(
        lastOverlayParameters.contentHolder,
        lastOverlayParameters.contentType,
        lastOverlayParameters.contentWrapperParams,
        lastOverlayParameters.callParameters
    );
}

export function wrapContentInContainer(content, options) {
    const markup = `<div class="overlay__content overlay__content--${
        options.size ? options.size : 'default'
    } js-overlay__content">
        ${
            options.closeIcon
                ? `<div class="overlay__close js-overlay__close">${generateIcon(
                      'close',
                      true
                  )}</div>`
                : ``
        }
            ${content}
        </div>`;
    return markup;
}
