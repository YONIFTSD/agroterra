<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Mantenimiento - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="EditMantenimiento">
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
                    <b-form-input type="text" v-model="maintenance.observation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control btn-primary" >TERMINAR MANTENIMIENTO</b-button>
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
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");

import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
// components
import ModalProviders from '@/views/components/ModalProvider'

export default {
  name: "MaintenanceEdit",
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

      //errors
      errors: {
        id_provider: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewMaintenance();
  },
  methods: {
    ViewMaintenance,
    EditMantenimiento,
    Validate,
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
        me.maintenance.end_date = 'PENDIENTE',
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

//editar usuario
function EditMantenimiento() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  if (this.maintenance.state != 1) {
    Swal.fire("Sistema", "El Mantenimiento ya fue editado", "error");
    return false
  }
  let me = this;
  let url = this.url_base + "maintenance/edit";
  let data = this.maintenance;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire("Sistema", "Se ha modificado el mantenimiento correctamente", "success");
        me.$router.push({
          name: "MaintenanceView",
          params: { id_maintenance: je.encrypt(response.data.result.id_maintenance) },
        });
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//validacion de formulario
function Validate() {

  this.errors.id_maintenance = this.maintenance.id_maintenance.length == 0 ? true : false;
  // if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_maintenance == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  
}
</script>
