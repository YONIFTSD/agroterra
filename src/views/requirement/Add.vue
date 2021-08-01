<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Requerimiento - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>


               <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select @change="ListSeries" v-model="requirement.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-select @change="GetNumberBySerie" v-model="requirement.id_serie" :options="series"></b-form-select>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" readonly type="text" ref="number"  v-model="requirement.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="requirement.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>


                 <b-col md="3">
                  <b-form-group label="Solicitar al establecimiento ? :">
                    <b-form-select v-model="requirement.id_establishment_request" :options="establishments"></b-form-select>
                    <small  v-if="errors.id_establishment_request"  class="form-text text-danger">Seleccione una establecimiento</small>
                  </b-form-group>
                </b-col>


                <b-col md="7">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="requirement.observation" max-rows="2"></b-form-input>
                  </b-form-group>
                </b-col>

                 <b-col md="2">
                  <b-form-group label=".">
                    <b-button class="form-control" variant="primary" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                  </b-form-group>
                </b-col>


                <!-- Detalle venta -->
                <RequirementDetail/>
                <b-col md="12" class="text-center">
                  <small  v-if="errors.requirement_detail"  class="form-text tex-center text-danger">Ingrese Productos</small>
                </b-col>
                
                
                <!-- Detalle venta -->

                <b-col md="12" class="mt-3"></b-col>

       
         

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button  type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <!-- Modal Products -->

    <!-- Modal Clients -->
    <ModalClients />
    <!-- Modal Clients -->
<LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="113" @success="modalProducts" />
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
  </div>
</template>

<style>

</style>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");
import EventBus from '@/assets/js/EventBus';
import converter from "@/assets/js/NumberToLetters";
import { mapState,mapActions } from "vuex";


// components
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import RequirementDetail from './components/RequirementDetail'
import LoadingComponent from './../pages/Loading'
export default {
  name: "UsuarioAdd",
  components:{
      vSelect,  
      ModalProducts,
      RequirementDetail,
      ModalClients,
      LoadingComponent,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading: false,
      module: 'Sale',
      role: 2,
      requirement: {
        id_requirement: "",
        id_establishment: "",
        id_establishment_request: "",
        id_user: 1,
        type_invoice: "NR",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        observation: "",
        state: '1',
      },

      series: null,
      establishments: [],
      type_invoice:[
        {value: "NR", text : "Nota de Requerimeinto"},
      ],
      //errors
      errors: {
        type_invoice: false,
        serie: false,
        number: false,
        requirement_detail: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.mLoadResetRequirementDetail();
    this.ListSeries();
    this.ListEstablishment();
  },
  methods: {
    ListSeries,
    GetNumberBySerie,
    ListEstablishment,
    modalProducts,
    AddRequirement,
    Validate,

    ...mapActions('Requirement',['mLoadResetRequirementDetail']),
  },

  computed: {
    ...mapState('Requirement',['requirement_detail']),
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
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function ListEstablishment() {
  let me = this;
  let url = this.url_base + "active-establishments";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
    .then(function (response) {
      me.establishments = [{value:'',text:'-- Seleccione un establecimiento --'}];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.establishments.push( { value : data[index].id_establishment , text: data[index].name } );
        }
      }
    })
}

//listar almacenes
function ListSeries() {

  let me = this;
  let url = this.url_base + "list-series/"+this.requirement.type_invoice+"/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
    .then(function (response) {
      me.series = [];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.series.push( { value : data[index].id_serie , text: data[index].serie } );
          me.requirement.id_serie = data[index].id_serie;
        }
        
         me.GetNumberBySerie();
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

function GetNumberBySerie() {
   let me = this;
  let url = this.url_base + "serie/view/"+this.requirement.id_serie;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.requirement.number = response.data.result.number;
      } else {
        me.requirement.number = '';
      }
    })
}

function modalProducts() {
  if (this.requirement.id_establishment_request.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Seleccione un establecimiento', timer: 2000,})
    return false;
  }
  EventBus.$emit('ModalProductsShow',this.role,this.requirement.id_establishment_request);
}


function AddRequirement(_this) {
  
  let me = _this;
  let url = me.url_base + "requirement/add";
  me.requirement.id_user = me.user.id_user;
  me.requirement.id_establishment = me.id_establishment;
  me.requirement.requirement_detail = me.requirement_detail;
  let data = me.requirement;
  me.isLoading = true;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.requirement.id_requirement = "",
        me.requirement.id_establishment = "";
        me.requirement.id_establishment_request = "";
        me.requirement.id_user = "";
        me.requirement.type_invoice = "NR";
        me.requirement.serie = "";
        me.requirement.number = "";
        me.requirement.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.requirement.observation = "";
        me.requirement.state = 1;
        me.ListSeries();
        me.mLoadResetRequirementDetail();
        Swal.fire({ icon: 'success', text: 'Se ha registrado correctamente el requerimiento', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function Validate() {
  
  this.errors.type_invoice = this.requirement.type_invoice == 0 ? true : false;
  this.errors.id_serie = this.requirement.id_serie == 0 ? true : false;
  this.errors.broadcast_date = this.requirement.broadcast_date == 0 ? true : false;
  this.errors.id_establishment_request = this.requirement.id_establishment_request == 0 ? true : false;
  this.errors.requirement_detail = this.requirement_detail.length == 0 ? true : false;
  
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_establishment_request == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.requirement_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar el requerimiento?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddRequirement(me);
    }
  })



}



</script>
