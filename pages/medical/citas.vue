<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Citas</h4>
          <div class="table-responsive">
            <table class="table table-hover table-striped">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Medico</th>
                  <th>Comentario</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody id="myTable">
                <tr v-for="cita in citas" :key="cita.idCita">
                    <td>{{ formatearFecha(cita.fecha) }}</td>
                    <td>{{ formatearHora(cita.hora) }}</td>
                    <td>{{ `${cita.medico.nombres} ${cita.medico.apellidos}` }}</td>
                    <td>{{ cita.comentario }}</td>
                    <td>
                      <b-btn v-if="esAdmin" title="Editar" variant="primary" size="sm" class="btn-simple" type="button" @click="editarCita(cita.idCita)">
                        <i class="fa fa-edit"></i>
                        </b-btn>
                      <b-btn title="Cancelar" variant="danger" size="sm" class="btn-simple" type="button" @click="cancelarCita(cita.idCita)" :disabled="cita.estado !== 'reservada'">
                        <i class="fa fa-times"></i>
                      </b-btn>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
      </card>
    </div>
  </div>
</template>

<script>
import Card from '~/components/Cards/Card.vue';
import moment from 'moment';

export default {
  head: {
    title: 'Citas ~ Medical',
  },
  components: { Card },
  async asyncData({ app }) {
    const { citas } = await app.$axios.$get('citas/');
    return { citas };
  },
  data() {
    return {
      esAdmin: this.$auth.user.scope.indexOf('admin') >= 0,
    };
  },
  methods: {
    async cancelarCita(idCita) {
      await this.$axios.$delete(`citas/${idCita}`);
      this.$notify({
        message: 'Cita cancelada',
        icon: 'fa fa-check',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: 'success',
      });
      const { citas } = await this.$axios.$get('citas/');
      this.citas = citas;
    },
    formatearFecha(fecha) {
      return moment(fecha).format('DD-MM-YYYY');
    },
    formatearHora(hora) {
      return moment(hora, 'HH:mm:ss').format('HH:MM');
    },
  },
};
</script>

<style>
</style>
