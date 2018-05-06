<template>
  <div class="wrapper">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/medical">
        <i class="nc-icon nc-chart-pie-35"></i>
        <p>Inico</p>
      </sidebar-link>
      <sidebar-link to="/medical/agenda">
        <i class="nc-icon nc-circle-09"></i>
        <p>Agenda</p>
      </sidebar-link>
      <sidebar-link to="/medical/registrar-paciente">
        <i class="nc-icon nc-notes"></i>
        <p>Registrar Paciente</p>
      </sidebar-link>
      <sidebar-link to="/medical/programar-cita">
        <i class="nc-icon nc-paper-2"></i>
        <p>Programar Cita</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar />

      <dashboard-content @click="toggleSidebar" />

      <content-footer />
    </div>
  </div>
</template>
<style lang="scss">

</style>
<script>
  import TopNavbar from '~/components/TopNavbar.vue';
  import ContentFooter from '~/components/ContentFooter.vue';
  import DashboardContent from '~/components/Content.vue';
  import MobileMenu from '~/components/MobileMenu.vue';

  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu,
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
    },
  };

</script>
