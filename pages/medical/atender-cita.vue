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
              <input v-model="nombresApellidos" type="text" class="form-control" placeholder="Nombres o Apellidos" value=cita.nombre readonly>
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
              <input v-model="citaFechaHora" type="text" class="form-control" placeholder="Fecha y Hora" value=cita.fecha readonly>
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
                <select class="custom-select" v-model="tipoId" disabled="disabled" value=cita.tipoId>
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
                <input v-model="numId" type="text" class="form-control" placeholder="Número de identificación" value=cita.numId readonly>
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
              <textarea v-model="comentario" class="form-control textareaclass" placeholder="Comentario" value=cita.comentario readonly></textarea>
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
              <textarea v-model="comentario" class="form-control textareaclass" placeholder="Comentario"></textarea>
            </div>
            <button class="btn btn-primary mr-2"  @click="obtenerHistorial">Ver historial completo</button>
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
  async asyncData({ app }) {
    const { cita } = await app.$axios.$get('citas/');
    return { cita };
  },
  data: () => ({
    buscarPorNombre: '',
    nombresApellidos: '',
  }),
  methods: {
    obtenerHistorial() {
      alert('Para JSON');
    },

  },
};
</script>

<style>

  .textareaclass{
  height:100px;
  }
</style>
