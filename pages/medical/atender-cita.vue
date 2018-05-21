<template>
  <div class="content">
    <div class="container-fluid">
      <form @submit.prevent="OnSubmit">
        <card>
          <h4 slot="header" class="card-title">Información sobre la cita</h4>
            <div class="row">
              <div class="col">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fa fa-id-card"></i>
                    </span>
                  </div>
                  <input v-model="nombresApellidos" type="text" class="form-control" placeholder="Nombres o Apellidos"  readonly>
                </div>
              </div>
              <div class="col">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fa fa-id-card"></i>
                    </span>
                  </div>
                  <input v-model="citaFechaHora" type="text" class="form-control" placeholder="Fecha y Hora" readonly>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col" >
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fa fa-id-card"></i>
                    </span>
                  </div>
                  <select class="custom-select" v-model="tipoId" disabled="disabled">
                    <option value="" selected disabled>Tipo de Identificación</option>
                    <option value="CC">Cedula de Ciudadanía</option>
                    <option value="TI">Tarjeta de Identidad</option>
                    <option value="PP">Pasaporte</option>
                    <option value="RC">Registro Civil</option>
                    <option value="CE">Cedula Extranjera</option>
                  </select>
                </div>
              </div>
              <div class="col">
                <div class="input-group mb-2">
                  <div class="input-group-prepend">
                    <span class="input-group-text">
                      <i class="fa fa-id-card"></i>
                    </span>
                  </div>
                  <input v-model="numId" type="text" class="form-control" placeholder="Número de identificación" readonly>
                </div>
              </div>
            </div>
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <textarea v-model="comentario" class="form-control textareaclass" placeholder="Comentario" readonly></textarea>
            </div>
        </card>
        <card>
          <h4 slot="header" class="card-title">Historia médica</h4>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <textarea v-model="observaciones" class="form-control" style="height:150px" placeholder="Observaciones"></textarea>
          </div>
          <div class="input-group mb-2">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-id-card"></i>
              </span>
            </div>
            <textarea v-model="formulacion" class="form-control" style="height:150px" placeholder="Formulación"></textarea>
          </div>
          <div class="text-right">
            <button @click="mostrarHistorialCompleto" type="button" v-b-modal.historial-modal class="btn btn-fill btn-primary">Ver historial completo</button>
          </div>
         </card>
        <div class="inline-form text-right">
          <button @click="cancelar" class="btn btn-simple btn-link btn-danger" type="button">Cancelar</button>
          <button class="btn btn-primary btn-fill" type="submit">Confirmar asistencia y finalizar cita</button>
        </div>
      </form>
    </div>
    <b-modal id="historial-modal" title="Historial Medico" ok-only size="lg" ok-title="Cerrar">
      <b-list-group class="historial">
        <b-list-group-item v-for="entrada in historial" :key="entrada.idCita" class="flex-column align-items-start">
          <div class="d-flex w-100 justify-content-between">
            <h5 class="mb-1 font-weight-bold">{{ entrada.medico.nombres }} {{entrada.medico.apellidos}}</h5>
            <small>{{ formatearFecha(entrada.fecha) }}</small>
          </div>
          <p class="mb-1">
            {{ entrada.observaciones || 'Sin observaciones'}}
          </p>
        </b-list-group-item>
      </b-list-group>
    </b-modal>
  </div>

</template>

<script>
import Card from '~/components/Cards/Card.vue';
import moment from 'moment';

export default {
  head: {
    title: 'Atender Cita ~ Medical',
  },
  components: { Card },
  async asyncData({ app, query }) {
    const { cita } = await app.$axios.$get(`citas/${query.idCita}`);
    const nombresApellidos = `${cita.paciente.nombres} ${cita.paciente.apellidos}`;
    const citaFechaHora = `${cita.fecha} - ${cita.hora.substring(0, cita.hora.length - 3)}`;
    const comentario = `${cita.comentario}`;
    const tipoId = `${cita.paciente.tipoId}`;
    const numId = `${cita.paciente.numId}`;
    const queryParam = `${query.idCita}`;
    const { idPaciente } = cita;
    return {
      nombresApellidos,
      citaFechaHora,
      comentario,
      tipoId,
      numId,
      queryParam,
      idPaciente,
    };
  },
  data: () => ({
    nombresApellidos: '',
    citaFechaHora: '',
    comentario: '',
    numId: '',
    historiaMedica: '',
    queryParam: '',
    historial: [],
    observaciones: '',
    formulacion: '',
  }),
  methods: {
    async OnSubmit() {
      try {
        await this.$axios.put(`citas/${this.queryParam}`, {
          observaciones: this.observaciones,
          formulacion: this.formulacion,
        });
        this.$notify({
          message: 'Cita atendida exitosamente',
          icon: 'fa fa-check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success',
        });
        this.$router.replace({ path: '/medical/agenda' });
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
    async mostrarHistorialCompleto() {
      const { citas } = await this.$axios.$get(`/pacientes/${this.idPaciente}/historial`);
      this.historial = citas;
    },
    formatearFecha(fecha) {
      return moment(fecha).format('DD MMM YYYY');
    },
    cancelar() {
      this.$router.replace({ path: '/medical/agenda' });
    },
  },
};
</script>

<style scoped>
  .historial {
    max-height: 400px;
    overflow: auto;
  }
</style>
