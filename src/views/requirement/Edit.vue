<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Requerimiento - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>


               <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select disabled v-model="requirement.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                   <b-form-input class="text-center" disabled type="text" ref="serie"  v-model="requirement.serie"></b-form-input>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" disabled type="text" ref="number"  v-model="requirement.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input class="text-center" disabled type="date" ref="broadcast_date" v-model="requirement.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>


                 <b-col md="3">
                  <b-form-group label="Solicitar al establecimiento ? :">
                    <b-form-select disabled v-model="requirement.id_establishment_request" :options="establishments"></b-form-select>
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
                    <b-button class="form-control" variant="primary" @click="modalProducts">Agregar Productos</b-button>
                  </b-form-group>
                </b-col>


                <!-- Detalle venta -->
                <RequirementDetail/>
                <b-col md="12" class="text-center">
                  <small  v-if="errors.requirement_detail"  class="form-text tex-center text-danger">Ingrese Productos</small>
                </b-col>
                
                
                <!-- Detalle venta -->

                <b-col md="12" class="mt-3"></b-col>

       
         

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button  type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button>
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

export default {
  name: "UsuarioAdd",
  props: ["id_requirement"],
  components:{
      vSelect,  
      ModalProducts,
      RequirementDetail,
      ModalClients,
  },
  data() {
    return {
      module: 'Sale',
      role: 3,
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
    this.ViewRequirement();
    this.ListEstablishment();
  },
  methods: {
    ViewRequirement,
    ListEstablishment,
    modalProducts,
    EditRequirement,
    Validate,

    ...mapActions('Requirement',['mLoadResetRequirementDetail','mLoadAddRequirementDetail']),
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

function ViewRequirement() {

  let id_requirement = je.decrypt(this.id_requirement);
  let me = this;
  let url = this.url_base + "requirement/view/" + id_requirement;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.requirement.id_requirement = response.data.result.requirement.id_requirement;
          me.requirement.id_establishment = response.data.result.requirement.id_establishment;
          me.requirement.id_establishment_request = response.data.result.requirement.id_establishment_request;
          me.requirement.id_user = response.data.result.requirement.id_user;
          me.requirement.type_invoice = response.data.result.requirement.type_invoice;
          me.requirement.serie = response.data.result.requirement.serie;
          me.requirement.number = response.data.result.requirement.number;
          me.requirement.broadcast_date = response.data.result.requirement.broadcast_date;
          me.requirement.observation = response.data.result.requirement.observation;
          me.requirement.state = response.data.result.requirement.state;
 
          let details = response.data.result.requirement_detail; 
          for (let index = 0; index < details.length; index++) {
              let detail = {
                    id_product: details[index].id_product,
                    code: details[index].code,
                    name: details[index].name,
                    presentation: details[index].presentation,
                    unit_measure: details[index].unit_measure,
                    igv: details[index].igv,
                    existence_type: details[index].existence_type,
                    quantity: parseFloat(details[index].quantity)
                }
                me.mLoadAddRequirementDetail(detail);
          }
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
}

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



function modalProducts() {
  if (this.requirement.id_establishment_request.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Seleccione un establecimiento', timer: 2000,})
    return false;
  }
  EventBus.$emit('ModalProductsShow',this.role,this.requirement.id_establishment_request);
}


function EditRequirement(_this) {
  
  let me = _this;
  let url = me.url_base + "requirement/edit";
  me.requirement.requirement_detail = me.requirement_detail;
  let data = me.requirement;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente el requerimiento', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  this.errors.type_invoice = this.requirement.type_invoice == 0 ? true : false;
  this.errors.broadcast_date = this.requirement.broadcast_date == 0 ? true : false;
  this.errors.id_establishment_request = this.requirement.id_establishment_request == 0 ? true : false;
  this.errors.requirement_detail = this.requirement_detail.length == 0 ? true : false;
  
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_establishment_request == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.requirement_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar el requerimiento?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditRequirement(me);
    }
  })



}



</script>
