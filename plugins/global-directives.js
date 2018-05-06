import { directive as vClickOutside } from 'vue-clickaway';
import Vue from 'vue';

/**
 * You can register global directives here and use them as a plugin in your main Vue instance
 */

Vue.directive('click-outside', vClickOutside);
