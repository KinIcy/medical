<template>
  <div class="wrapper" :class="{'nav-open':sidebarStore.showSidebar}">
    <side-bar>
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/medical/agenda" v-if="!esPaciente">
        <i class="far fa-calendar"></i>
        <p>Agenda</p>
      </sidebar-link>
      <sidebar-link to="/medical/pacientes" v-if="!esPaciente">
        <i class="fa fa-users "></i>
        <p>Pacientes</p>
      </sidebar-link>
      <sidebar-link to="/medical/medicos" v-if="esAdmin">
        <i class="fas fa-user-md"></i>
        <p>Médicos</p>
      </sidebar-link>
      <sidebar-link to="/medical/citas" v-if="!esAdmin">
        <i class="far fa-calendar"></i>
        <p>Citas</p>
      </sidebar-link>
      <sidebar-link to="/medical/registrar-medico"  v-if="esAdmin">
        <i class="fa fa-user-plus"></i>  
        <p>Registrar Médico</p>
      </sidebar-link>
      <sidebar-link to="/medical/programar-cita">
        <i class="far fa-calendar-check"></i>
        <p>Programar Cita</p>
      </sidebar-link>
      <sidebar-link to="/medical/registrar-paciente" v-if="!esPaciente">
        <i class="fa fa-user-plus"></i>
        <p>Registrar Paciente</p>
      </sidebar-link>
    </side-bar>
    <div class="main-panel">
      <top-navbar />

      <dashboard-content @click="toggleSidebar" />

      <content-footer />
    </div>
    <notifications></notifications>
  </div>
</template>
<style lang="scss">
  body {
    background-image: none;
  }
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
    data() {
      return {
        esMedico: this.$auth.user.scope.indexOf('medico') >= 0,
        esPaciente: this.$auth.user.scope.indexOf('paciente') >= 0,
        esAdmin: this.$auth.user.scope.indexOf('admin') >= 0,
      };
    },
    methods: {
      toggleSidebar() {
        if (this.sidebarStore.showSidebar) {
          this.sidebarStore.displaySidebar(false);
        }
      },
    },
  };

</script>
