import { dimPage, undimPage } from 'models/dimmer';
import { lockPage, unlockPage } from 'models/locker';
import { parse } from 'models/utils/app';
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
};

export function initOverlaySystem() {
    addListeners();
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
}
function hideOverlay(overlay) {
    overlayEl = document.querySelector(`[data-overlay].is-visible`);

    overlayEl.classList.remove(states.visible);
}

function getContentType(href) {
    if (href.charAt(0) === '#') {
        return 'element';
    } else {
        return 'url';
    }
}

function getContentFromElement(selector) {
    const targetEl = document.querySelector(selector);
    return targetEl.innerHTML;
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
