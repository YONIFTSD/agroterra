<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Mantenimiento - Nuevo</strong>
          </CCardHeader>
          <CCardBody>

              <b-row class="mt-1">
                  <b-col sm="4" md="3" lg="3"  xl="3" v-for="(item,index) in room_control" :key="index">
                    <b-form id="Form" autocomplete="off">
                      <b-card-body :class="BackgroundColor(item.state)+' '+'mb-2'">
                        <b-card-title class="text-center text-white">{{item.room_number}}</b-card-title>
                        <b-card-text class="text-white">
                          <b-button type="button" @click="Validate(item.id_room_control)" class="form-control btn-primary" ><i class="fas fa-broom"></i></b-button>
                        </b-card-text>
                      </b-card-body>
                    </b-form>
                  </b-col>
              </b-row>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalProviders />
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
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalProviders,
  },
  data() {
    return {
      module: 'Maintenance',
      role: 2,
      maintenance: {
          id_user:'',
          id_room_control:'',
          start_date: moment(new Date()).local().format("YYYY-MM-DD") + ' ' + moment(new Date()).local().format("HH-mm-ss"),
          end_date:'',
          observation:'',
          state:1,

      },
      room_control:[],
      //errors
      errors: {
        id_room_control: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewRoomControlMaintenance();
  },
  methods: {
    ViewRoomControlMaintenance,
    BackgroundColor,

    AddMaintenance,
    Validate,
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
  },
};

function ViewRoomControlMaintenance() {

  let me = this;
  let url = this.url_base + "room-control/get-room-maintenance";

  axios({
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
            me.room_control = response.data.result;
            // me.room_control.push({ value: '',text: 'Seleccione una habitacion'});

            // for (let index = 0; index < response.data.result.length; index++) {
            //   const element = response.data.result[index];
            //   me.room_control.push({ value: element.id_room_control,text: element.room_number});
              
            // }
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function AddMaintenance(_this,id_room_control) {

  let me = _this;
  let url = me.url_base + "maintenance/add";
  let data = {
    id_room_control: id_room_control,
    id_user: me.user.id_user,
  }


  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.$router.push({
            name: "MaintenanceEdit",
            params: { id_maintenance: je.encrypt(response.data.result.id_maintenance) },
          });
        Swal.fire("Sistema", "Se ha registrado el mantenimiento", "success");
      }else if (response.data.status == 400){
        Swal.fire("Sistema", "La habitacion selccionada ya se encuentra en mantenimiento", "error");
      }else{
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function BackgroundColor(state) {
    // 0 libre 
    // 1 ocupado 
    // 2 libre para mantenimiento 
    // 3 en mantenimiento 
    // 4 finalizado 
    // 5 reservado 
    // 6 anulado 
    // 9 eliminado 
  let BackgroundColor = 'bg-success';
  switch (state) {
    case 1: BackgroundColor = 'bg-danger'; break;
    case 2: BackgroundColor = 'bg-warning'; break;
    case 3: BackgroundColor = 'bg-info'; break;
    // case 4: BackgroundColor = 'bg-warning'; break;
    // case 5: BackgroundColor = 'bg-warning'; break;
    // case 6: BackgroundColor = 'bg-warning'; break;
    // case 7: BackgroundColor = 'bg-info'; break;
    default: break;
  }

  return BackgroundColor;
  
}

function Validate(id_room_control) {
let me = this;
Swal.fire({
    title: 'Esta seguro de realizar la limpieza ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddMaintenance(me,id_room_control);
    }
  })



}
</script>
