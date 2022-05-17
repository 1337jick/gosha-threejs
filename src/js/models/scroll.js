import SmoothScrollbar from 'smooth-scrollbar';

export function scrollToTop(smooth = false) {
    const scrollbar = SmoothScrollbar.getAll()[0];
    scrollbar.scrollTo(0, 0, 600);
}
