<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Salida - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
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
                    <b-form-select ref="type_operation" v-model="output.type_operation" :options="type_operations"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                   <b-form-group label=".">
                    <b-button class="form-control btn" variant="primary" @click="modalProducts" ><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                   </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Comprobante :">
                    <b-form-select @change="ListSerie" ref="type_invoice" v-model="output.type_invoice" :options="type_invoices"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-select @change="GetNumberBySerie" ref="id_serie" v-model="output.id_serie" :options="series"></b-form-select>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" readonly type="text" ref="number" @change="NumberPadStart" v-model="output.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="output.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>


                <b-col md="3">
                  <b-form-group label="Almacen">
                    <b-form-select ref="id_warehouse" v-model="output.id_warehouse" :options="warehouses"></b-form-select>
                    <small v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="3" v-if="output.type_operation == '11'">
                  <b-form-group label="Establecimiento de Destino">
                    <b-form-select ref="id_establishment_destination" v-model="output.id_establishment_destination" :options="establishments_destination"></b-form-select>
                    <small v-if="errors.id_establishment_destination"  class="form-text text-danger">Seleccione un establecimiento</small>
                  </b-form-group>
                </b-col>
      
                <b-col md="6" v-if="output.type_operation == '11'">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="output.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="9" v-if="output.type_operation != '11'">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="output.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

                <!-- Detalle Entrada -->
                <cOutputDetail/>
                <small v-if="errors.output_detail" class="col-md-12 form-text text-center text-danger">Agregue productos</small>
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
                            <b-button type="button" @click="mLoadDeleteLinkageOutput(it)" variant="danger">
                              <i class="fas fa-plus-square"></i>
                            </b-button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </b-col>

                <b-col md="12"></b-col>

                <b-col md="3"></b-col>
                <b-col md="3">
                  <b-button type="button" @click="modalRequirements" class="form-control text-white" variant="dark" >Requerimientos</b-button>
                </b-col>
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
    <ModalRequirements />

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
import ModalProviders from '@/views/components/ModalProvider'
import ModalProducts from './components/ModalProduct'
import ModalRequirements from './components/ModalRequirements'
import cOutputDetail from './components/OutputDetail'
import LoadingComponent from './../pages/Loading'


export default {
  name: "UsuarioAdd",
  components:{
      ModalProducts,
      ModalRequirements,
      cOutputDetail,
      ModalProviders,
      vSelect,
      LoadingComponent,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading:false,
      module: 'Output',
      output: {
        id_input:'',
        id_provider:'',
        id_warehouse:'',
        id_establishment:'',
        id_establishment_destination:'',
        id_user:'',
        linkages:null,
        type_operation:'01',
        type_invoice:'09',
        id_serie:'',
        serie:'',
        number:'',
        broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        departure_date:moment(new Date()).local().format("YYYY-MM-DD"),
        observation:'',
        state:'1',
      },
 
      
      establishment: {},
      establishments_destination: [],
      series: [],
      warehouses: [],
      providers: [],
      provider:null,

      type_operations:[
           { value :"01", text: 'VENTA NACIONAL'},
           { value :"04", text: 'CONSIGNACIÓN ENTREGADO'},
           { value :"06", text: 'DEVOLUCIÓN ENTREGADO'},
           { value :"07", text: 'BONIFICACIÓN'},
           { value :"08", text: 'PREMIO'},
           { value :"09", text: 'DONACIÓN'},
           { value :"10", text: 'SALIDA A PRODUCCIÓN'},
           { value :"11", text: 'SALIDA POR TRANSFERENCIA ENTRE ALMACENES'},
           { value :"12", text: 'RETIRO'},
           { value :"13", text: 'MERMA'},
           { value :"14", text: 'DESMEDRO'},
           { value :"15", text: 'DESTRUCCIÓN'},
           { value :"17", text: 'EXPORTACIÓN'},
           { value :"23", text: 'SALIDA POR IDENTIFICACIÓN ERRONEA'},
           { value :"25", text: 'SALIDA POR DEVOLUCIÓN AL PROVEEDOR'},
           { value :"27", text: 'SALIDA POR SERVICIO DE PRODUCCIÓN'},
           { value :"28", text: 'AJUSTE POR DIFERENCIA DE INVENTARIO'},
           { value :"30", text: 'SALIDA DE BIENES EN PRÉSTAMO'},
           { value :"32", text: 'SALIDA DE BIENES EN CUSTODIA'},
           { value :"34", text: 'PUBLICIDAD'},
           { value :"36", text: 'RETIRO PARA ENTREGA A TRABAJADORES'},
           { value :"37", text: 'RETIRO POR CONVENIO COLECTIVO'},
           { value :"38", text: 'RETIRO POR SUSTITUCIÓN DE BIEN SINIESTRADO'},
           { value :"94", text: 'OTROS'},         
      ],
      type_invoices:[
        {value: "09", text : "Guía de remisión - Remitente"},
        {value: "NS", text : "Nota de Salida"},
        {value: "GD", text : "Guía de Despacho"},
      ],
      
      //errors
      errors: {
        id_provider: false,
        id_warehouse: false,
        serie:false,
        number:false,
        broadcast_date:false,
        departure_date:false,
        output_detail:false,
      },
      validate: false,
    };
  },
  mounted() {
    EventBus.$on('Select_Establishment_Destination', (id_establishment_destination) => {
      this.output.id_establishment_destination = id_establishment_destination;
    });
    this.mLoadResetOutputDetail();
    this.ListSerie();
    this.ListEstablishment();
    this.ListWarehouses();
    this.ViewEstablishment();
  },
  methods: {
    ListWarehouses,
    ListEstablishment,
    ListSerie,
    GetNumberBySerie,
    SearchProvider,
    ViewEstablishment,
    modalProducts,
    modalProviders,
    modalRequirements,
    NumberPadStart,
    AddOutput,
    Validate,
    ...mapActions('Output',['mLoadResetOutputDetail','mLoadDeleteLinkageOutput']),
  },

  computed: {
  
    ...mapState(["url_base"]),
    ...mapState('Output',['output_detail','linkages']),
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


function ListEstablishment() {
  let me = this;
  let url = this.url_base + "active-establishments";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
    .then(function (response) {
      me.establishments_destination = [{value:'',text:'-- Seleccione un establecimiento --'}];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.establishments_destination.push( { value : data[index].id_establishment , text: data[index].name } );
        }
      }
    })
}
//listar almacenes
function ListSerie() {

  let me = this;
  let url = this.url_base + "list-series/"+this.output.type_invoice+"/"+this.id_establishment;

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
          me.output.id_serie = data[index].id_serie;
        }
        if (response.data.result.length == 0)  {
          me.output.id_serie = '';
          me.output.number = '';
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
  let url = this.url_base + "serie/view/"+this.output.id_serie;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.output.number = response.data.result.number;
      } else {
        me.output.number = '';
      }
    })
}

//listar almacenes
function ListWarehouses() {

  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {  token: this.token, },
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
    headers: {
      token: this.token,
      module: this.module,
      role: 2,
    },
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
  let data = {
    role : 2,
    id_establishment : this.id_establishment,
  }
  EventBus.$emit('ModalProductsShow',data);
}

function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}

function modalRequirements() {
  if (this.output.type_operation != 11) {
    Swal.fire({ icon: 'warning', text: 'Se requiere que el tipo de operación sea salida por transferencia', timer: 3000, })
    return false;
  }
  EventBus.$emit('ModalRequirementsShow',2);
}



function NumberPadStart() {
  var number = String(this.output.number);
  number = number.padStart(8,"0");
  this.output.number = number;
}

function AddOutput(mthis) {

  let me = mthis;
  me.isLoading = true;
  let url = me.url_base + "/output/add";
  me.output.id_provider = me.provider.id;
  me.output.id_establishment = me.id_establishment;
  me.output.output_detail = me.output_detail;
  me.output.id_user = me.user.id_user;
  me.output.linkages = me.linkages;
  let data = me.output;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module,role: 2},
  })
    .then(function (response) {
      if (response.data.status == 201) {
            
              me.output.id_input = '';
              me.output.id_provider = '';
              me.output.id_warehouse = '';
              me.output.id_establishment = '';
              me.output.id_establishment_destination = '';
              me.output.id_user = '';
              me.output.linkages = null;
              me.output.type_operation = '01';
              me.output.type_invoice = '09';
              me.output.serie = '';
              me.output.number = '';
              me.output.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
              me.output.departure_date = moment(new Date()).local().format("YYYY-MM-DD");
              me.output.observation = '';
              me.output.state = '1';

              me.provider = null;

              me.GetNumberBySerie();
              me.mLoadResetOutputDetail();
              Swal.fire({ icon: 'success', text: 'Se ha registrado la nueva salida', timer: 2000, })
      } else {
        Swal.fire({icon: 'error', title: 'Oops...',text: response.data.response,})
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
  this.errors.id_serie = this.output.id_serie.length == 0 ? true : false;
  this.errors.number = this.output.number.length == 0 ? true : false;
  this.errors.broadcast_date = this.output.broadcast_date.length == 0 ? true : false;
  this.errors.departure_date = this.output.departure_date.length == 0 ? true : false;
  this.errors.id_warehouse = this.output.id_warehouse.length == 0 ? true : false;
  this.errors.output_detail = this.output_detail.length == 0 ? true : false;
  this.errors.id_establishment_destination = this.output.type_operation == "11" && this.output.id_establishment_destination.length == 0 ? true : false;


  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.departure_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_establishment_destination == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.output_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  if (this.validate) {
    return false;
  }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de guardar la salida?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddOutput(me);
    }
  })


}

</script>
