<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Registrar Paciente</h4>
        <form @submit.prevent="OnSumbit">
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
            <input v-model="fechaNacimiento" type="date" class="form-control" placeholder="Fecha de Nacimeinto">
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="telefono" type="text" class="form-control" placeholder="Teléfono">
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="Ciudad" type="text" class="form-control" placeholder="Ciudad">
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <input v-model="direccion" type="text" class="form-control" placeholder="Dirección">
          </div>
          <button class="btn btn-primary btn-block" type="submit">Crear Paciente</button>
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
        await this.$axios.post('https://puj-medical.herokuapp.com/api/pacientes', {
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