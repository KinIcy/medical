<template>
  <div class="content">
    <div class="container-fluid">
      <card class="registrar-medico-card">
        <h3 slot="header" class="title text-center">Registrar Médico</h3>
        <form @submit.prevent="OnSumbit">
          <template>
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="usuario" type="text" class="form-control" placeholder="Usuario">
            </div>

            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-key"></i>
                </span>
              </div>
              <input v-model="contrasena" type="password" class="form-control" placeholder="Contraseña" >
            </div>

            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-key"></i>
                </span>
              </div>
              <input v-model="confirmacion" type="password" class="form-control" placeholder="Confirmar contraseña" >
            </div>

            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="nombres" type="text" class="form-control" placeholder="Nombres">
            </div>

            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="apellidos" type="text" class="form-control" placeholder="Apellidos">
            </div>

            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="especialidad" type="text" class="form-control" placeholder="Especialidad">
            </div>

          </template>
          <button class="btn btn-primary mr-2" type="submit">Crear Médico</button>
          <button class="btn btn-secundary" @click="cancel" type="button">Cancelar</button>
        </form>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';
import Radio from '~/components/Inputs/Radio.vue';

export default {
  layout: 'default',
  components: { Card, Radio },
  data() {
    return {
      usuario: '',
      contrasena: '',
      confirmacion: '',
      nombres: '',
      apellidos: '',
      especialidad: '',
    };
  },
  methods: {
    async OnSumbit() {
      try {
        await this.$axios.$post('medicos/', {
          usuario: this.usuario,
          contrasena: this.contrasena,
          confirmacion: this.confirmacion,
          nombres: this.nombres,
          apellidos: this.apellidos,
          especialidad: this.especialidad,
        });
        this.$notify({
          message: 'Médico Registrado',
          icon: 'fa fa-check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success',
        });
        this.$router.replace({ path: '/medical/' });
      } catch (error) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        this.$notify({
          message: `${errorMessage}`,
          icon: 'fa fa-times',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'danger',
        });
      }
    },
    cancel() {
      this.$router.replace({ path: '/medical/' });
    },
  },
};
</script>

<style>

.registrar-medico-card {
  max-width: 500px;
  margin: 0 auto;
}
</style>
