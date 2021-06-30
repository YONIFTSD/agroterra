<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Entrada - Nuevo</strong>
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
                          <b-button class="form-control btn" variant="primary" @click="modalProducts" >Agregar Productos</b-button>
                        </b-form-group>
                      </b-col>

                      <b-col md="3">
                        <b-form-group label="Tipo de Comprobante :">
                          <b-form-select @change="ListSerie" ref="type_invoice" v-model="input.type_invoice" :options="type_invoices"></b-form-select>
                        </b-form-group>
                      </b-col>

                      <b-col md="3" v-if="input.type_invoice != 'NE'">
                        <b-form-group label="Serie :">
                          <b-form-input type="text" ref="serie" v-model="input.serie"></b-form-input>
                          <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                        </b-form-group>
                      </b-col>

                      <b-col md="3" v-if="input.type_invoice == 'NE'">
                        <b-form-group label="Serie :">
                          <b-form-select @change="GetNumberBySerie" ref="id_serie" v-model="input.id_serie" :options="series"></b-form-select>
                          <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                        </b-form-group>
                      </b-col>

                      <b-col md="3">
                        <b-form-group label="Numero :">
                          <b-form-input :readonly="input.type_invoice == 'NE'" type="text" ref="number" @change="NumberPadStart" v-model="input.number"></b-form-input>
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
                      <cInputDetail/>
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
                                  <th width="5%" class="text-center">Acciones</th>
                                </tr>
                              </thead>
                              <tbody v-for="(item, it) in linkages" :key="item.id_input">
                                <tr>
                                  <td class="text-center">{{ it + 1 }}</td>
                                  <td class="text-center"> {{ item.broadcast_date }}</td>
                                  <td class="text-center"> {{ item.module }}</td>
                                  <td class="text-center"> {{ item.reference }}</td>
                                  <td class="text-center">
                                    <b-button type="button" @click="mLoadDeleteLinkageInput(it)" variant="danger">
                                      <i class="fas fa-plus-square"></i>
                                    </b-button>
                                  </td>
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
                          <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="carrier_provider" @search="SearchCarrierProvider" :options="carrier_providers"></v-select>
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
                          <b-form-input type="text"  @change="NumberPadStartCarrier" v-model="input.carrier_number"></b-form-input>
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
                  <b-button type="button" @click="modalTransfers" class="form-control text-white" variant="dark" >TRANFERENCIAS</b-button>
                </b-col>
                <b-col md="3">
                  <b-button type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <ModalTransfers />

    <!-- Modal Clients -->
    <ModalProviders />
    <!-- Modal Clients -->
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
import ModalProviders from '@/views/components/ModalProvider'
import ModalProducts from './components/ModalProduct'
import ModalTransfers from './components/ModalTransfers'
import cInputDetail from './components/InputDetail'
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  components:{
      ModalProducts,
      cInputDetail,
      ModalTransfers,
      ModalProviders,
      vSelect,
      LoadingComponent,
  },
  data() {
    return {
      module: 'Input',
      isLoading:false,
      input: {
        id_input:'',
        id_serie:'',
        id_provider:'',
        id_warehouse:'',
        id_establishment:'',
        id_user:'',
        linkages:[],
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
 
      
      establishment: {},
      series: [],
      warehouses: [],
      providers: [],
      provider:null,
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
        {value: "00", text : "Otros"},
      ],
      
      //errors
      errors: {
        id_provider: false,
        id_serie: false,
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
    this.ViewEstablishment();
  },
  methods: {
    ListWarehouses,
    SearchProvider,
    SearchCarrierProvider,
    ViewEstablishment,
    modalProducts,
    modalTransfers,
    modalProviders,

    NumberPadStart,
    NumberPadStartCarrier,
    AddInput,
    Validate,

    ListSerie,
    GetNumberBySerie,
    ...mapActions('Input',['mLoadResetInputDetail','mLoadDeleteLinkageInput']),
  },

  computed: {
  
    ...mapState(["url_base"]),
    ...mapState('Input',['input_detail','linkages']),
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


//listar almacenes
function ListSerie() {
  if (this.input.type_invoice != 'NE') {
    return false;
  }
  let me = this;
  let url = this.url_base + "list-series/"+this.input.type_invoice+"/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.series = [];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.series.push( { value : data[index].id_serie , text: data[index].serie } );
          me.input.id_serie = data[index].id_serie;
        }
        if (response.data.result.length == 0)  {
          me.input.id_serie = '';
          me.input.number = '';
        }else{
          me.GetNumberBySerie();
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function GetNumberBySerie() {
   let me = this;
  let url = this.url_base + "serie/view/"+this.input.id_serie;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.input.number = response.data.result.number;
      } else {
        me.input.number = '';
      }
    })
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
//listar almacenes
function ListWarehouses() {

  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
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
//ver establcimiento
function ViewEstablishment() {
  let me = this;
  let url = this.url_base + "establishment/view/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {token: this.token, module: this.module,role: 2, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.establishment = response.data.result;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function modalProducts() {
  EventBus.$emit('ModalProductsShow',2);
}

function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}

function modalTransfers() {
  if (this.input.type_operation != 21) {
    Swal.fire({ icon: 'warning', text: 'Se requiere que el tipo de operación sea entrada por transferencia', timer: 3000, })
    return false;
  }
  EventBus.$emit('ModalTransfersShow',2);
}



function NumberPadStart() {
  var number = String(this.input.number);
  number = number.padStart(8,"0");
  this.input.number = number;
}

function NumberPadStartCarrier() {
  var number = String(this.input.carrier_number);
  number = number.padStart(8,"0");
  this.input.carrier_number = number;
}

function AddInput(mthis) {

  let me = mthis;
  me.isLoading = true;
  let url = me.url_base + "/input/add";
  me.input.id_provider = me.provider.id;
  me.input.id_establishment = me.id_establishment;
  me.input.input_detail = me.input_detail;
  me.input.linkages = me.linkages;
  me.input.id_user = me.user.id_user;
  me.input.carrier_id_provider = me.carrier_provider == null ? '' : me.carrier_provider.id;
  let data = me.input;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token,module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
            
              me.input.id_input = '';
              me.input.id_provider = '';
              me.input.id_warehouse = '';
              me.input.id_establishment = '';
              me.input.id_user = '';
              me.input.linkages = null;
              me.input.type_operation = '02';
              me.input.type_invoice = '09';
              me.input.serie = '';
              me.input.number = '';
              me.input.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
              me.input.arrival_date = moment(new Date()).local().format("YYYY-MM-DD");
              me.input.observation = '';
              me.input.state = '1';
              me.provider = null;
              me.carrier_provider = null;
              me.input.carrier_id_provider = '';
              me.input.carrier_type_invoice = '09';
              me.input.carrier_serie = '';
              me.input.carrier_number = '';
              me.input.carrier_observation = '';


              me.mLoadResetInputDetail();
              Swal.fire({ icon: 'success', text: 'Se ha registrado la nueva entrada', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', title: 'Oops...', text: response.data.response,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
        Swal.fire({ icon: 'error', title: 'Oops...', text: 'A ocurrido un error', })
        me.isLoading = false;
    });
}

function Validate() {

  this.validate = false;

  this.errors.id_provider = this.provider == null ? true : false;
  if (this.input.type_invoice == "NE") {
    this.errors.id_serie = this.input.id_serie.length == 4 ? true : false;
  }else{
      this.errors.serie = this.input.serie.length != 4 ? true : false;
  }

  this.errors.number = this.input.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.input.broadcast_date.length == 0 ? true : false;
  this.errors.arrival_date = this.input.arrival_date.length == 0 ? true : false;
  this.errors.id_warehouse = this.input.id_warehouse.length == 0 ? true : false;
  this.errors.input_detail = this.input_detail.length == 0 ? true : false;



  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.input.type_invoice == "NE") {
      if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  }else{
      if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  }
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
    title: 'Esta seguro de guardar la entrada?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddInput(me);
    }
  })


}



</script>
