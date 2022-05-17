import debounce from 'lodash/debounce';
import { dispatch } from 'models/utils/event-bus';

export function addGlobalEventListeners() {
    window.addEventListener(
        'resize',
        debounce(() => {
            dispatch('window-resized', { width: window.innerWidth });
        }, 200)
    );
}
