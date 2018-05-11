<template>
  <div>
    <card class="login-card">
      <h3 slot="header" class="title text-center">Programar Cita</h3>
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
                <i class="fas fa-user-alt"></i>
              </span>
            </div>
            <input v-model="nombres" type="text" class="form-control" placeholder="Nombres" disabled>
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fas fa-user-alt"></i>
              </span>
            </div>
            <input v-model="apellidos" type="text" class="form-control" placeholder="Apellidos" disabled>
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <select class="custom-select" v-model="medicoId">
              <option value="" selected>Médico</option>
              <option value="rb1">Ruben Dario</option>
              <option value="pl1">Paloma Sambussi</option>
              <option value="it1">Igniz Tussty</option>
              <option value="lm1">Laura Mondoza</option>
              <option value="cn1">Cirus Nirus</option>
            </select>
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="fechaCita" type="date" class="form-control" placeholder="Fecha">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="horaCita" type="time" class="form-control" placeholder="Hora">
          </div>

          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <textarea v-model="comentarioCita" class="form-control textareaclass" placeholder="Comentario"></textarea>
          </div>



        </template>
        <button class="btn btn-primary btn-block" type="submit">Programar cita</button>
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
      contrasena: '',
      nombres: '',
      apellidos: '',
      fechaNacimiento: '',
      telefono: '',
      ciudad: '',
      direccion: '',
    };
  },
  methods: {
    async OnSumbit() {
      try {
        const response = await this.$axios.post('https://puj-medical.herokuapp.com/api/pacientes', {
          data: {
            tipoId: this.tipo,
            numId: this.numId,
            contrasena: this.contrasena,
            nombres: this.nombres,
            apellidos: this.apellidos,
            fechaNacimiento: this.fechaNacimiento,
            ciudad: this.ciudad,
            direccion: this.direccion,
          },
        });
        console.log(response);
        this.$router.replace({ path: '/medical/' });
      } catch (error) {
        const errorMessage = error.response ? error.response.data.error : error.message;
        console.log(errorMessage);
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

  .textareaclass{
  width:400px;
  height:100px;
  }


</style>
