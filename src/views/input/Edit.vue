<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Entrada - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-tabs content-class="mt-3" >
                <b-tab title="Datos de Entrada" active>
                  <b-row>

                    <b-col md="6">
                        <b-form-group>
                          <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                          <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                        </b-form-group>
                      </b-col>

                    <b-col md="3">
                      <b-form-group label="Tipo de Operación :">
                        <b-form-select ref="type_operation" v-model="input.type_operation" :options="type_operations"></b-form-select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label=".">
                        <b-button class="form-control btn" variant="primary" @click="modalProducts" ><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Comprobante :">
                        <b-form-select ref="type_invoice" v-model="input.type_invoice" :options="type_invoices"></b-form-select>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Serie :">
                        <b-form-input type="text" ref="serie" v-model="input.serie"></b-form-input>
                        <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Numero :">
                        <b-form-input type="text" ref="number" @change="NumberPadStart" v-model="input.number"></b-form-input>
                        <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Fecha Emision:">
                        <b-form-input type="date" ref="broadcast_date" v-model="input.broadcast_date"></b-form-input>
                        <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Almacen">
                        <b-form-select ref="id_warehouse" v-model="input.id_warehouse" :options="warehouses"></b-form-select>
                        <small v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                      </b-form-group>
                    </b-col>
                    
        

                    <b-col md="9">
                      <b-form-group label="Observación:">
                        <b-form-input rows="1"  v-model="input.observation" max-rows="3"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <!-- Detalle Entrada -->
                    <cInputDetail :type_operation="input.type_operation"/>
                    <small v-if="errors.input_detail" class="col-md-12 form-text text-center text-danger">Agregue productos</small>
                    <!-- Detalle Entrada -->

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

                    <b-col md="12" class="mt-3"></b-col>
                    <b-col md="4"></b-col>

                 
                  </b-row>
                </b-tab>

                <b-tab title="Datos de Guia de Transportista">

                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="carrier_provider" @search="SearchCarrierProvider" :options="carrier_providers"></v-select>
                          <small v-if="errors.carrier_id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                        </b-form-group>
                      </b-col>
                    
                      <b-col md="2">
                        <b-form-group label="Comprobante :">
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
                          <b-form-input type="text" @change="NumberPadStartCarrier" v-model="input.carrier_number"></b-form-input>
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

              <b-row  class="justify-content-md-center">
                <b-col md="3">
                  <b-button type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>

            </b-form>

              
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <ModalProviders />
    <!-- Modal Products -->
    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="113" @success="modalProducts" />
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />

    
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
import ModalProviders from '@/views/components/ModalProvider'
export default {
  name: "InputEdit",
  props: ["id_input"],
  components:{
      ModalProviders,
      ModalProducts,
      cInputDetail,
      vSelect,
      LoadingComponent,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading:false,
      module: 'Input',
      role: 3,
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

        carrier_id_provider: '',
        carrier_type_invoice: '09',
        carrier_serie: '',
        carrier_number: '',
        carrier_observation: '',
        state: 1,
      },
 
      
      establishment: '',
      series: [],
      warehouses: [],
      providers: [],
      provider: null,
      carrier_providers: [],
      carrier_provider:null,
      
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
        {value: "GD", text : "Guía de Despacho"},
        {value: "00", text : "Otros"},
      ],

      //errors
      errors: {
        id_provider: false,
        id_warehouse: false,
        type_operation:false,
        type_invoice:false,
        serie:false,
        number:false,
        broadcast_date:false,
        departure_date:false,
        input_detail:false,
      },
      validate: false,
    };
  },
  mounted() {
    this.mLoadResetInputDetail();
    this.ListWarehouses();
    this.ViewInput();
    
  },
  methods: {
    ViewInput,
    ListWarehouses,
    modalProducts,
    modalProviders,
    SearchProvider,
    SearchCarrierProvider,
NumberPadStartCarrier,
    NumberPadStart,
    InputDetail,
    EditInput,
    Validate,

     ...mapActions('Input',['mLoadResetInputDetail']),
     ...mapActions('Input',['mLoadAddInputDetail']),
  },

  computed: {
    ...mapState('Input',['input_detail']),
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

function SearchProvider(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.providers = response.data.result;
            loading(false);
      })
    }
    
}
function SearchCarrierProvider(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.carrier_providers = response.data.result;
            loading(false);
      })
    }
    
}

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
      role: 3,
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
        me.provider = {id:response.data.result.input.id_provider, name: response.data.result.input.provider_name + ' - '+response.data.result.input.provider_document_number}; 
        me.carrier_provider = response.data.result.input.carrier_id_provider == "0" ? null : {id:response.data.result.input.carrier_id_provider, name: response.data.result.input.carrier_name + ' - '+response.data.result.input.carrier_document_number};

        me.input.carrier_id_provider = response.data.result.input.carrier_id_provider;
        me.input.carrier_type_invoice = response.data.result.input.carrier_type_invoice;
        me.input.carrier_serie = response.data.result.input.carrier_serie;
        me.input.carrier_number = response.data.result.input.carrier_number;
        me.input.carrier_observation = response.data.result.input.carrier_observation;

        me.establishment = response.data.result.input.establishment_name;
        me.input.user = response.data.result.input.user_email;


        for (let index = 0; index < response.data.result.input_detail.length; index++) {
          const element = response.data.result.input_detail[index];
          me.mLoadAddInputDetail(element);
          
        }

        
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

function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}

function NumberPadStart() {
  if (this.input.number.length > 0) {
     var number = String(this.input.number);
    number = number.padStart(8,"0");
    this.input.number = number;
  }
 
}

function NumberPadStartCarrier() {
  if (this.input.carrier_number.length > 0) {
     var number = String(this.input.carrier_number);
      number = number.padStart(8,"0");
      this.input.carrier_number = number;
  }
 
}

function EditInput(mthis) {

  let me = mthis;
  me.isLoading = true;
  let url = me.url_base + "/input/edit";
  me.input.id_provider = me.provider.id;
  me.input.input_detail = me.input_detail;
  me.input.carrier_id_provider = me.carrier_provider == null ? '' : me.carrier_provider.id;
  let data = me.input;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module,role: 3,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha actualizado la entrada', timer: 2000, })
      } else {
        Swal.fire({ icon: 'error',title: 'Oops...', text: response.data.response,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',title: 'Oops...', text: 'A ocurrido un error',})
      me.isLoading = false;
    });
}


function Validate() {

  this.validate = false;
  
  this.errors.id_provider = this.provider == null ? true : false;
  this.errors.serie = this.input.serie.length != 4 ? true : false;
  this.errors.number = this.input.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.input.broadcast_date.length == 0 ? true : false;
  this.errors.arrival_date = this.input.arrival_date.length == 0 ? true : false;
  this.errors.id_warehouse = this.input.id_warehouse.length == 0 ? true : false;
  this.errors.input_detail = this.input_detail.length == 0 ? true : false;

  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.arrival_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.input_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  if (this.validate) {
    return false;
  }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de modifcar la entrada?',
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
