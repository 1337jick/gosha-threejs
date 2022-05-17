import domready from 'domready';
import { addListeners, init } from 'models/utils/app';
import { dispatch } from 'models/utils/event-bus';
import 'bootstrap';

domready(() => {
    dispatch('domready');
    init();
    addListeners();
});
