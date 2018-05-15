<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Agenda</h4>
        <h4 class="h4 text-center my-auto clearfix">
          Semana {{semana}} del {{ano}}
          <b-button v-b-modal.disponibilidad-modal variant="success" class="btn-fill float-md-right">Ver Disponibilidad</b-button>
        </h4>
        <div class="container-fluid">
          <div class="row no-gutters">
            <div class="d-md-block d-none " >
              <table class="table table-sm">
                <thead>
                  <tr><th>&nbsp;</th></tr>
                </thead>
                <tbody>
                  <tr v-for="hora in 15" :key="hora" style="height:100px">
                    <td class="text-right">{{hora + 6}}h</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="col-sm" v-for="(dia, diaI) in dias" :key="diaI">
              <table class="table table-hover">
                <thead>
                  <tr><th>{{dia}}</th></tr>
                </thead>
                <tbody>
                  <tr v-for="hora in 15" :key="hora" style="height:100px">
                    <td>
                      <span class="d-sm-none">{{hora + 6}}h</span>
                      <template v-if="agenda[diaI][hora + 6].length">
                        <b-dropdown v-for="cita in agenda[diaI][hora + 6]"
                                    :variant="estiloCita(cita)"
                                    :key="cita.idCita"
                                    size="xs"
                                    toggle-class="btn-fill btn-block text-left"
                                    :text="textoCita(cita)"
                                    class="d-block"
                                    no-caret>
                          <b-dropdown-item v-if="cita.estado !== 'disponible'">Ver</b-dropdown-item>
                          <b-dropdown-item v-if="cita.estado === 'disponible'">Reservar</b-dropdown-item>
                          <b-dropdown-item v-if="cita.estado === 'reservada'" @click="atenderCita">Atender</b-dropdown-item>
                          <b-dropdown-item v-if="cita.estado !== 'atendida' ">Cancelar</b-dropdown-item>
                        </b-dropdown>
                      </template>
                      <span v-else></span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </card>
    </div>
    <b-modal  ref="disponibilidadModal" size="lg" id="disponibilidad-modal" title="Ajustes de Disponibilidad">
      <b-form inline @submit.prevent="anadirHorario">
        <b-form-select v-model="disponibilidad.dia" class="mr-2" required>
          <option :value="null">Día</option>
          <option value="1">Lunes</option>
          <option value="2">Martes</option>
          <option value="3">Miércoles</option>
          <option value="4">Jueves</option>
          <option value="5">Viernes</option>
          <option value="6">Sábado</option>
          <option value="7">Domingo</option>
        </b-form-select>
        <b-input type="time" v-model="disponibilidad.horaInicio" required />
        <b-input type="time" v-model="disponibilidad.horaFin" required />
        <b-button variant="success" type="submit" class="btn-fill ml-2">Añadir Horario</b-button>
      </b-form>
      <b-badge v-for="horario in disponibilidad.horarios" :key="horario.idHorario" variant="primary" class="pl-4 m-2">
        {{ dias[horario.dia - 1] }} {{formatearHora(horario.horaInicio)}} - {{formatearHora(horario.horaFin)}}
        <b-button type="button" @click="eliminarHorario(horario)" class="btn-simple btn-sm text-light" variant="primary">&times;</b-button>
      </b-badge>
      <div slot="modal-footer">
        <b-button class="mr-2" vaiant="primary" @click="$refs.disponibilidadModal.hide()">Volver a la Agenda</b-button>
        <b-button variant="primary" @click="habilitarCitas">Habilitar Citas</b-button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card';
import moment from 'moment';
import '~/utils/times';

function construirMatrizCitas(citas) {
  const agenda = [];
  (7).times(() => agenda.push([]));
  agenda.forEach(dia => (24).times(() => dia.push([])));
  citas.forEach((cita) => {
    const dia = moment(cita.fecha).day() - 1;
    const hora = moment(cita.hora, 'HH:mm:ss').hour();
    agenda[dia][hora].push(cita);
  });
  return agenda;
}

export default {
  data: () => ({
    dias: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo'],
  }),
  async asyncData({ app }) {
    const semana = moment().week();
    const ano = moment().year();
    const { citas } = await app.$axios.$get(`citas/?semana=${semana}&ano=${ano}`);
    const { horarios } = await app.$axios.$get('medicos/horarios/');
    const agenda = construirMatrizCitas(citas);
    return {
      agenda,
      semana,
      ano,
      disponibilidad: {
        horarios,
        dia: null,
        horaInicio: '',
        horaFin: '',
      },
    };
  },
  components: {
    Card,
  },
  methods: {
    estiloCita(cita) {
      const estilos = {
        disponible: 'success',
        reservada: 'primary',
        atendida: 'secondary',
        cancelada: 'danger',
        'no asistida': 'warning',
      };
      return estilos[cita.estado];
    },
    textoCita(cita) {
      if (cita.estado === 'disponible') return `${this.formatearHora(cita.hora)} Disponible`;
      return `${this.formatearHora(cita.hora)} ${cita.paciente.nombres} ${cita.paciente.apellidos}`;
    },
    formatearHora(hora) {
      return moment(hora, 'HH:mm:ss').format('HH:mm');
    },
    async actualizarAgenda() {
      const { citas } = await this.$axios.$get(`citas/?semana=${this.semana}&ano=${this.ano}`);
      this.agenda = construirMatrizCitas(citas);
    },
    async habilitarCitas() {
      await this.$axios.$post(`medicos/${this.$auth.user.idMedico}/agenda`);
      await this.actualizarAgenda();
      this.$notify({
        message: 'Citas Habilitadas',
        icon: 'fa fa-check',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'success',
      });
    },
    async actualizarHorarios() {
      const { horarios } = await this.$axios.$get('medicos/horarios/');
      this.disponibilidad.horarios = horarios;
    },
    async anadirHorario() {
      try {
        await this.$axios.$post('medicos/horarios', this.disponibilidad);
        await this.actualizarHorarios();
        this.$notify({
          message: 'Horario Agregado',
          icon: 'fa fa-check',
          horizontalAlign: 'right',
          verticalAlign: 'top',
          type: 'success',
        });
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
    async eliminarHorario(horario) {
      await this.$axios.$delete(`medicos/horarios/${horario.idHorario}`);
      await this.actualizarHorarios();
      this.$notify({
        message: 'Horario Eliminado',
        icon: 'fa fa-check',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'success',
      });
    },

    atenderCita() {
      this.$router.replace({ path: '/medical/atender-cita' });
    },
  },
};
</script>

<style scoped>
</style>
