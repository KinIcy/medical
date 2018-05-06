<template>
  <div>
    <card class="login-card">
      <h3 slot="header" class="title text-center">Ingresar</h3>
      <form @submit.prevent="OnSumbit">
        <div class="input-group">
          <radio v-model="tipo" label="paciente">Paciente</radio>
          <radio v-model="tipo" label="medico">Medico</radio>
        </div>
        <template v-if="tipo === 'paciente'">
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
        </template>
        <div class="input-group mb-2" v-if="tipo === 'medico'">
          <div class="input-group-prepend">
            <span class="input-group-text">
              <i class="fa fa-user"></i>
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
        <button class="btn btn-primary btn-block" type="submit">Iniciar Sesión</button>
      </form>
    </card>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';
import Radio from '~/components/Inputs/Radio.vue';

export default {
  layout: 'simple',
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
  body {
    background: url(/img/background.jpg);
    background-size: cover;
    background-attachment: fixed;
  }

  .login-card {
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
