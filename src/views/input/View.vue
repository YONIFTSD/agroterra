<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Entrada - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-tabs content-class="mt-3" >
                <b-tab title="Datos de Entrada" active>
                  <b-row>

                    <b-col md="6">
                      <b-form-group label="Proveedor :">
                      <b-form-input disabled type="text" :value="input.provider"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Tipo de Operación :">
                        <b-form-select disabled ref="type_operation" v-model="input.type_operation" :options="type_operations"></b-form-select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label=".">
                        <b-button disabled class="form-control btn" variant="primary" @click="modalProducts" ><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Tipo de Comprobante :">
                        <b-form-select disabled ref="type_invoice" v-model="input.type_invoice" :options="type_invoices"></b-form-select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Serie :">
                        <b-form-input disabled type="text" ref="serie" v-model="input.serie"></b-form-input>
                        <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Numero :">
                        <b-form-input disabled type="text" ref="number" @change="NumberPadStart" v-model="input.number"></b-form-input>
                        <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Fecha Emision:">
                        <b-form-input disabled type="date" ref="broadcast_date" v-model="input.broadcast_date"></b-form-input>
                        <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Almacen">
                        <b-form-select disabled ref="id_warehouse" v-model="input.id_warehouse" :options="warehouses"></b-form-select>
                        <small v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                      </b-form-group>
                    </b-col>
                    
                    <b-col md="9">
                      <b-form-group label="Observación:">
                        <b-form-input disabled rows="1"  v-model="input.observation" max-rows="3"></b-form-input>
                      </b-form-group>
                    </b-col>

                      <div class="col-md-12">
                        <div class="table-responsive mt-3">
                          <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                            <thead class="">
                              <tr>
                                <th width="5%" class="text-center">#</th>
                                <th width="8%" class="text-center">Codigo</th>
                                <th width="50%" class="text-center">Nombre</th>
                                <th width="7%" class="text-center">UM</th>
                                <th width="10%" class="text-center">Cantidad</th>
                        
                              </tr>
                            </thead>
                            <tbody v-for="(item, it) in input_detail" :key="item.id_product">
                              <tr>
                                  <td class="align-middle text-center">{{ it + 1 }}</td>
                                  <td class="align-middle text-left">{{ item.code }}</td>
                                  <td class="align-middle text-left">{{ item.name + " - "+ item.presentation }}</td>
                                  <td class="align-middle text-center">{{ item.unit_measure }}</td>
                                  <td class="align-middle text-center">{{ item.quantity }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <b-col md="5" class="mt-3">
                      <div class="table-responsive mt-3">
                        <table class="table table-hover table-bordered">
                          <thead>
                            <tr>
                              <th width="5%" class="text-center">#</th>
                              <th width="15%" class="text-center">Fecha</th>
                              <th width="20%" class="text-center">Concepto</th>
                              <th width="55%" class="text-center">Referencia</th>
                            </tr>
                          </thead>
                          <tbody v-for="(item, it) in input.linkages" :key="it">
                            <tr>
                              <td class="text-center">{{ it + 1 }}</td>
                              <td class="text-center"> {{ item.broadcast_date }}</td>
                              <td class="text-center"> {{ item.module }}</td>
                              <td class="text-center"> {{ item.reference }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </b-col>
                  </b-row>
                </b-tab>
                <b-tab title="Datos de Guia de Transportista">

                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label>Proveedor: </label>
                          <b-form-input type="text" v-model="input.carrier_provider"></b-form-input>
                          <small v-if="errors.carrier_id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                        </b-form-group>
                      </b-col>
                    
                      <b-col md="2">
                        <b-form-group label="Tipo de Comprobante :">
                          <b-form-select v-model="input.carrier_type_invoice" :options="type_invoices"></b-form-select>
                          <small v-if="errors.carrier_type_invoice"  class="form-text text-danger" >Seleccione un tipo de comprobante</small>
                        </b-form-group>
                      </b-col>

                      <b-col md="2">
                        <b-form-group label="Serie :">
                          <b-form-input type="text" v-model="input.carrier_serie"></b-form-input>
                          <small v-if="errors.carrier_serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                        </b-form-group>
                      </b-col>

                      <b-col md="2">
                        <b-form-group label="Numero :">
                          <b-form-input type="text" v-model="input.carrier_number"></b-form-input>
                          <small v-if="errors.carrier_number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                        </b-form-group>
                      </b-col>


                      <b-col md="12">
                        <b-form-group label="Observación:">
                          <b-form-textarea rows="1"  v-model="input.carrier_observation" max-rows="3"></b-form-textarea>
                        </b-form-group>
                      </b-col>
                      
                    </b-row>
                </b-tab>
              </b-tabs>

              <b-row  class="justify-content-md-center mt-3">
                <b-col md="3">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/entrada/listar' }" append >REGRESAR</b-link>
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
    <LoadingComponent :is-visible="isLoading"/>

    
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
import EventBus from '@/assets/js/EventBus';
import converter from "@/assets/js/NumberToLetters";
import { mapState,mapActions } from "vuex";


// components
import ModalProducts from './components/ModalProduct'
import cInputDetail from './components/InputDetail'
import LoadingComponent from './../pages/Loading'
export default {
  name: "InputEdit",
  props: ["id_input"],
  components:{
      ModalProducts,
      cInputDetail,
      vSelect,
      LoadingComponent
  },
  data() {
    return {
      isLoading:false,
      module: 'Input',
      role: 5,
      input: {
        id_input:'',
        id_provider:'',
        id_warehouse:'',
        id_establishment:'',
        id_user:'',
        linkages:null,
        type_operation:'02',
        type_invoice:'09',
        serie:'',
        number:'',
        broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        arrival_date:moment(new Date()).local().format("YYYY-MM-DD"),
        observation:'',
        state:'1',
      },
 
      
      establishment: '',
      series: [],
      warehouses: [],
      providers: [],
      input_detail:[],
      
      type_operations:[
            {value :"02", text :"COMPRA NACIONAL"},
            {value :"03", text :"CONSIGNACIÓN RECIBIDA"},
            {value :"07", text :"BONIFICACIÓN"},
            {value :"08", text :"PREMIO"},
            {value :"09", text :"DONACIÓN"},
            {value :"18", text :"IMPORTACIÓN"},
            {value :"28", text :"AJUSTE POR DIFERENCIA DE INVENTARIO"},
            {value :"19", text :"ENTRADA DE PRODUCCIÓN"},
            {value :"21", text :"ENTRADA POR TRANSFERENCIA ENTRE ALMACENES"},
            {value :"16", text :"SALDO INICIAL"},
      ],

      type_invoices:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "04", text : "Liquidación de compra"},
        {value: "07", text : "Nota de crédito"},
        {value: "08", text : "Nota de débito"},
        {value: "09", text : "Guía de remisión - Remitente"},
        {value: "12", text : "Ticket o cinta emitido por máquina registradora"},
        {value: "22", text : "Comprobante por Operaciones No Habituales"},
        {value: "31", text : "Guía de Remisión - Transportista"},
        {value: "50", text : "Declaración Única de Aduanas - Importación definitiva"},
        {value: "52", text : "Despacho Simplificado - Importación Simplificada"},
        {value: "91", text : "Comprobante de No Domiciliado"},
        {value: "NE", text : "Nota de Entrada"},
        {value: "00", text : "Otros"},
      ],

      //errors
      errors: {
        id_provider: false,
        id_warehouse: false,
        serie:false,
        number:false,
        broadcast_date:false,
        arrival_date:false,
        input_detail:false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListWarehouses();
    this.ViewInput();
    
  },
  methods: {
    ViewInput,
    ListWarehouses,
    modalProducts,

    NumberPadStart,
    InputDetail,
    EditInput,
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
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function ViewInput() {
  let id_input = je.decrypt(this.id_input);
  let me = this;
  let url = this.url_base+"/input/view/"+id_input;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 5,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.input.id_input = response.data.result.input.id_input; 
        me.input.id_provider = response.data.result.input.id_provider; 
        me.input.id_warehouse = response.data.result.input.id_warehouse; 
        me.input.id_establishment = response.data.result.input.id_establishment; 
        me.input.id_user = response.data.result.input.id_user; 
        me.input.linkages = response.data.result.input.linkages; 
        me.input.type_operation = response.data.result.input.type_operation; 
        me.input.type_invoice = response.data.result.input.type_invoice; 
        me.input.serie = response.data.result.input.serie; 
        me.input.number = response.data.result.input.number; 
        me.input.broadcast_date = response.data.result.input.broadcast_date; 
        me.input.arrival_date = response.data.result.input.arrival_date; 
        me.input.observation = response.data.result.input.observation; 
        me.input.state = response.data.result.input.state; 

        me.input.provider = response.data.result.input.provider_name + ' - '+response.data.result.input.provider_document_number; 
        me.establishment = response.data.result.input.establishment_name;
        me.input.user = response.data.result.input.user_email;

        me.input_detail = response.data.result.input_detail;

        // me.input = carrier_provider = response.data.result.input.provider_name + ' - '+response.data.result.input.provider_document_number;
        me.input.carrier_id_provider = response.data.result.input.carrier_id_provider;
        me.input.carrier_type_invoice = response.data.result.input.carrier_type_invoice;
        me.input.carrier_serie = response.data.result.input.carrier_serie;
        me.input.carrier_number = response.data.result.input.carrier_number;
        me.input.carrier_observation = response.data.result.input.carrier_observation;

  
    
        
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

//listar almacenes
function ListWarehouses() {

  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.warehouses.push({value : '', text: '-- Seleccione un almacen --'});
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.warehouses.push( { value : data[index].id_warehouse , text: data[index].name } );
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function modalProducts() {
  EventBus.$emit('ModalProductsShow',3);
}

function InputDetail(detail) {
  this.input_detail = detail;
}

function NumberPadStart() {
  var number = String(this.input.number);
  number = number.padStart(8,"0");
  this.input.number = number;
}

function EditInput(mthis) {

  let me = mthis;
  let url = me.url_base + "/input/edit";
  let data = {
        id_input:me.input.id_input,
        id_provider:me.input.id_provider,
        id_warehouse:me.input.id_warehouse,
        id_establishment:me.id_establishment,
        id_user:me.user.id_user,
        linkages:me.input.linkages,
        type_operation:me.input.type_operation,
        type_invoice:me.input.type_invoice,
        serie:me.input.serie,
        number:me.input.number,
        broadcast_date:me.input.broadcast_date,
        arrival_date:me.input.arrival_date,
        observation:me.input.observation,
        state:me.input.state,
        input_detail : me.input_detail,
  };

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          
              Swal.fire({
                icon: 'success',
                text: 'Se ha actualizado la entrada',
                timer: 2000,
              })

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.response,
        })
      }
    })
    .catch((error) => {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'A ocurrido un error',
        })
    });
}


function Validate() {

  this.errors.id_warehouse = this.input.id_warehouse.length == 0 ? true : false;
  this.errors.serie = this.input.serie.length != 4 ? true : false;
  this.errors.number = this.input.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.input.broadcast_date.length == 0 ? true : false;
  this.errors.arrival_date = this.input.arrival_date.length == 0 ? true : false;
  this.errors.input_detail = this.input_detail.length == 0 ? true : false;


  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.arrival_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.input_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  this.validate = false;


  if (this.validate) {
    return false;
  }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de guardar el registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditInput(me);
    }
  })


}

</script>
