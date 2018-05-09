<template>
  <div>
    <card class="login-card">
      <h3 slot="header" class="title text-center">Registrar Médico</h3>
      <form @submit.prevent="OnSumbit">
        <template>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <select class="custom-select" v-model="tipoId">
              <option value="" selected>Tipo de Identificación</option>
              <option value="CC">Cedula de Ciudadanía</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PP">Pasaporte</option>
              <option value="RC">Registro Civil</option>
              <option value="CE">Cedula Extranjera</option>
            </select>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="numId" type="text" class="form-control" placeholder="Numero de Identificacion">
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
            <select class="custom-select" v-model="especialidad">
              <option value="" selected>Especialidad</option>
              <option value="GEN">Generál</option>
              <option value="CAR">Cardiólogo</option>
              <option value="PSI">Psicólogo</option>
              <option value="NEU">Neumólogo</option>
              <option value="URO">Urólogo</option>
              <option value="CIR">Cirujano</option>
            </select>
          </div>

          <div class="input-group">
            <radio v-model="estado" label="activo">Activo</radio>
            <radio v-model="estado" label="inactivo">Inactivo</radio>
          </div>

        </template>
        <button class="btn btn-primary btn-block" type="submit">Crear Médico</button>
      </form>
    </card>
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
      tipo: 'paciente',
      tipoId: '',
      numId: '',
      usuario: '',
      contrasena: '',
    };
  },
  methods: {
    async OnSumbit() {
      try {
        await this.$auth.loginWith('local', {
          data: {
            tipo: this.tipo,
            usuario: this.tipo === 'medico' ? this.usuario : `${this.tipoId}${this.numId}`,
            contrasena: this.contrasena,
          },
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
  },
};
</script>

<style>

  .login-card {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
