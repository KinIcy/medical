<template>
  <div class="content">
    <div class="container-fluid">
      <card>
        <h4 slot="header" class="card-title">Información sobre la cita</h4>

      <form class="form-inline" >
          <div class="col-sm">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="nombresApellidos" type="text" class="form-control" placeholder="Nombres o Apellidos"  readonly>
            </div>
            <br>
          </div>

          <div class="col-sm">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <input v-model="citaFechaHora" type="text" class="form-control" placeholder="Fecha y Hora" readonly>
            </div>
            <br>
          </div>
        </form>

        <form class="form-inline">
            <div class="col-sm" >
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

            <div class="col-sm">
              <div class="input-group mb-2">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-id-card"></i>
                  </span>
                </div>
                <input v-model="numId" type="text" class="form-control" placeholder="Número de identificación" readonly>
              </div>
            </div>
          </form>

          <form>
            <div class="col-sm">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <textarea v-model="comentario" class="form-control textareaclass" placeholder="Comentario" readonly></textarea>
            </div>
            </div>
          </form>
      </card>


      <card>
        <h4 slot="header" class="card-title">Historia médica</h4>

        <form>
          <div class="col-sm">
            <div class="input-group mb-2">
              <div class="input-group-prepend">
                <span class="input-group-text">
                  <i class="fa fa-id-card"></i>
                </span>
              </div>
              <textarea v-model="historiaMedica" class="form-control textareaclass2" placeholder="Comentario"></textarea>
            </div>
            <button class="btn btn-primary mr-2"  @click="finalizarCita(queryParam)">Confirmar asistencia y finalizar cita</button>
          </div>
        </form>
      </card>


    </div>
  </div>

</template>

<script>
import Card from '~/components/Cards/Card.vue';

export default {
  layout: 'default',
  components: { Card },
  async asyncData({ app, query }) {
    const { cita } = await app.$axios.$get(`citas/${query.citaId}`);
    const nombresApellidos = `${cita.paciente.nombres} ${cita.paciente.apellidos}`;
    const citaFechaHora = `${cita.fecha} - ${cita.hora.substring(0, cita.hora.length - 3)}`;
    const comentario = `${cita.comentario}`;
    const tipoId = `${cita.paciente.tipoId}`;
    const numId = `${cita.paciente.numId}`;
    const queryParam = `${query.citaId}`;
    return {
      nombresApellidos,
      citaFechaHora,
      comentario,
      tipoId,
      numId,
      queryParam,
      // historiaMedica,
    };
  },
  data: () => ({
    nombresApellidos: '',
    citaFechaHora: '',
    comentario: '',
    numId: '',
    historiaMedica: '',
    queryParam: '',
  }),
  methods: {
    async finalizarCita(queryParam) {
      const { actualizarCita } = {
        noAsistida: false,
        comentario: '',
        formulacion: '',
        estado: 'reservada',
      };
      try {
        await this.$axios.put(`citas/${queryParam}`, actualizarCita);
        this.$router.replace({ path: '/medical/' });
        this.$notify({
          message: 'Cita atendida exitosamente',
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

  },
};
</script>

<style>

  .textareaclass{
  height:100px;
  }

  .textareaclass2{
  height:400px;
  }
</style>
