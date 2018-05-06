import Sidebar from '~/components/SideBar.vue';
import SidebarLink from '~/components/SidebarLink.vue';

import Vue from 'vue';

const SidebarStore = {
  showSidebar: false,
  sidebarLinks: [
    {
      name: 'Dashboard',
      icon: 'ti-panel',
      path: '/',
    },
  ],
  displaySidebar(value) {
    this.showSidebar = value;
  },
};

Vue.mixin({
  data() {
    return {
      sidebarStore: SidebarStore,
    };
  },
});

Vue.component('side-bar', Sidebar);
Vue.component('sidebar-link', SidebarLink);

export default ({ app, sidebarStore }) => {
  Object.defineProperty(app, '$sidebar', {
    get() {
      return sidebarStore;
    },
  });
};
