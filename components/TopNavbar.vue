<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container-fluid">
      <nuxt-link class="navbar-brand" to="/medical">Inicio</nuxt-link>
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: sidebarStore.showSidebar}"
              aria-controls="navigation-index"
              aria-expanded="false"
              aria-label="Toggle navigation"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end">
        <ul class="navbar-nav ml-auto">
          <drop-down :title="`${$auth.user.nombres} ${$auth.user.apellidos}`">
            <a class="dropdown-item" href="#" @click.prevent="$auth.logout">Salir</a>
          </drop-down>
        </ul>
      </div>
    </div>
  </nav>
</template>
<script>
  export default {
    computed: {
      routeName() {
        const { name } = this.$route;
        return this.capitalizeFirstLetter(name);
      },
    },
    data() {
      return {
        activeNotifications: false,
      };
    },
    methods: {
      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications;
      },
      closeDropDown() {
        this.activeNotifications = false;
      },
      toggleSidebar() {
        this.sidebarStore.displaySidebar(!this.sidebarStore.showSidebar);
      },
      hideSidebar() {
        this.sidebarStore.displaySidebar(false);
      },
    },
  };

</script>
<style>

</style>
