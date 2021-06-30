<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Mantenimiento - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>

               <b-col md="3">
                  <b-form-group>
                    <label>Habitacion: </label>
                    <b-form-input class="text-center" type="text" v-model="maintenance.room_number" readonly></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Inicio :">
                    <b-form-input class="text-center" type="text" v-model="maintenance.start_date" readonly></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Final :">
                    <b-form-input class="text-center" type="text" v-model="maintenance.end_date" readonly></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Usuario :">
                    <b-form-input class="text-left" type="text" ref="number" v-model="maintenance.email" readonly></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Observación:">
                    <b-form-input disabled type="text" v-model="maintenance.observation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/mantenimiento/listar' }" append >REGRESAR</b-link>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "CategoriaView",
  props: ["id_maintenance"],
  data() {
    return {
      module: 'Maintenance',
      role: 3,
      maintenance: {
          id_maintenance:'',
          id_user:'',
          id_room_control:'',
          start_date: '',
          end_date:'',
          observation:'',
          state:1,
          room_number:'',
          email:'',

      },
    };
  },
  mounted() {
    this.ViewMaintenance();
  },
  methods: {
    ViewMaintenance,

  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};


//ver usuario
function ViewMaintenance() {
  let id_maintenance = je.decrypt(this.id_maintenance);
  let me = this;
  let url = this.url_base + "maintenance/view/" + id_maintenance;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.maintenance.id_maintenance = response.data.result.id_maintenance;
        me.maintenance.id_user = response.data.result.id_user;
        me.maintenance.id_room_control = response.data.result.id_room_control;
        me.maintenance.start_date = response.data.result.start_date;
        me.maintenance.end_date = response.data.result.end_date;
        me.maintenance.observation = response.data.result.observation;
        me.maintenance.state = response.data.result.state;
        me.maintenance.room_number = response.data.result.room_number;
        me.maintenance.email = response.data.result.email;
      }else{
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire("Sistema", "A Ocurrido un error", "error");
    });
}

</script>
