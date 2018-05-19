<template>
  <div class="content">
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
            <select class="custom-select" v-model="tipoId" @change="buscarPaciente">
              <option value="" disabled>Tipo de Identificación</option>
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
            <input v-model="numId" type="text" class="form-control" placeholder="Numero de Identificacion" @change="buscarPaciente">
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <input v-model="nombres" type="text" class="form-control" placeholder="Nombres" readonly>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <input v-model="apellidos" type="text" class="form-control" placeholder="Apellidos" readonly>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <select class="custom-select" v-model="idMedico" @change="consultarDisponibilidad" :disabled="modoCita">
              <option value="" disabled>Médico</option>
              <option v-for="medico in medicos" :value="medico.idMedico" :key="medico.idMedico">
                {{medico.nombres}} {{medico.apellidos}}
              </option>
            </select>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-calendar-alt"></i>
              </span>
            </div>
            <select class="custom-select" v-model="fecha" :disabled="modoCita">
              <option value="" disabled>Fecha</option>
              <option v-for="dia in Object.keys(agenda)" :value="dia" :key="dia">
                {{formatearFecha(dia)}}
              </option>
            </select>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-clock"></i>
              </span>
            </div>
            <select class="custom-select" v-model="hora" :disabled="modoCita">
              <option value="" disabled>Hora</option>
              <option v-for="horario in agenda[fecha]" :value="horario.hora" :key="horario.hora">
                {{formatearHora(horario.hora)}}
              </option>
            </select>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <textarea v-model="comentario" class="form-control textareaclass" placeholder="Comentario"></textarea>
          </div>
        </template>
        <button class="btn btn-primary  " type="submit">Programar cita</button>
      </form>
    </card>
  </div>
</template>

<script>
import moment from 'moment';

import Card from '~/components/Cards/Card.vue';
import Radio from '~/components/Inputs/Radio.vue';

function defaultData() {
  return {
    tipoId: '',
    numId: '',
    nombres: '',
    apellidos: '',
    comentario: '',
    idMedico: '',
    idPaciente: '',
    medicos: [],
    fecha: '',
    hora: '',
    agenda: {},
    modoCita: false,
  };
}

export default {
  layout: 'default',
  components: { Card, Radio },
  async asyncData({ app, query }) {
    const data = {};
    if (query.idCita) {
      try {
        const { cita } = await app.$axios.$get(`citas/${query.idCita}`);
        const { idMedico } = cita;
        const { fecha } = cita;
        const { hora } = cita;
        data.modoCita = true;
        data.idMedico = idMedico;
        data.agenda = {};
        data.agenda[cita.fecha] = [];
        data.agenda[cita.fecha].push(cita);
        data.fecha = fecha;
        data.hora = hora;
        return data;
      } catch (error) {
        data.error = error.response ? error.response.data.error : error.message;
      }
    }
    return defaultData();
  },
  data: () => defaultData(),
  methods: {
    formatearHora(hora) {
      return moment(hora, 'HH:mm:ss').format('HH:mm');
    },
    formatearFecha(fecha) {
      return moment(fecha).format('D MMM');
    },
    async OnSumbit() {
      try {
        await this.$axios.$post('citas/', {
          idMedico: this.idMedico,
          idPaciente: this.idPaciente,
          fecha: this.fecha,
          hora: this.hora,
          comentario: this.comentario,
        });
        this.$notify({
          message: 'Cita Reservada',
          icon: 'fa fa-check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success',
        });
        this.$router.replace({ path: '/medical/agenda/' });
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
    async buscarPaciente() {
      if (this.numId.length && this.tipoId.length) {
        try {
          const { pacientes } = await this.$axios.$get(`pacientes/?numId=${this.numId}&tipoId=${this.tipoId}`);
          this.nombres = pacientes[0].nombres;
          this.apellidos = pacientes[0].apellidos;
          this.idPaciente = pacientes[0].idPaciente;
          this.listarMedicos();
        } catch (error) {
          this.nombres = '';
          this.apellidos = '';
          const errorMessage = error.response ? error.response.data.error : error.message;
          this.$notify({
            message: `${errorMessage}`,
            icon: 'fa fa-times',
            horizontalAlign: 'right',
            verticalAlign: 'top',
            type: 'danger',
          });
        }
      }
    },
    async listarMedicos() {
      const { medicos } = await this.$axios.$get('medicos');
      this.medicos = medicos;
    },
    async consultarDisponibilidad() {
      if (this.idMedico !== '') {
        const { disponibilidad } = await this.$axios.$get(`medicos/${this.idMedico}/agenda`);
        const agenda = {};
        disponibilidad.forEach((cita) => {
          if (!agenda[cita.fecha]) agenda[cita.fecha] = [];
          agenda[cita.fecha].push(cita);
        });
        this.agenda = agenda;
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
  height:100px;
  }


</style>
