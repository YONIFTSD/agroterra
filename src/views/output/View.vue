<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Salida - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="6">
                  <b-form-group label="Proveedor :">
                   <b-form-input disabled type="text" :value="output.provider"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Tipo de Operación :">
                    <b-form-select disabled ref="type_operation" v-model="output.type_operation" :options="type_operations"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                   <b-form-group label=".">
                    <b-button disabled class="form-control btn" variant="primary" @click="modalProducts" ><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                   </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select disabled ref="type_invoice" v-model="output.type_invoice" :options="type_invoices"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-input disabled type="text" ref="serie" v-model="output.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input disabled type="text" ref="number" v-model="output.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input disabled type="date" ref="broadcast_date" v-model="output.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>


                <b-col md="3">
                  <b-form-group label="Almacen">
                    <b-form-select disabled ref="id_warehouse" v-model="output.id_warehouse" :options="warehouses"></b-form-select>
                    <small v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>
                

                <b-col md="3" v-if="output.type_operation == '11'">
                  <b-form-group label="Establecimiento de Destino">
                    <b-form-select disabled ref="id_establishment_destination" v-model="output.id_establishment_destination" :options="establishments_destination"></b-form-select>
                  </b-form-group>
                </b-col>
      
                <b-col md="6" v-if="output.type_operation == '11'">
                  <b-form-group label="Observación:">
                    <b-form-input disabled rows="1"  v-model="output.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="9" v-if="output.type_operation != '11'">
                  <b-form-group label="Observación:">
                    <b-form-input disabled rows="1"  v-model="output.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

               <div class="col-md-12">
                <div class="table-responsive mt-3">
                    <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                      <thead class="">
                        <tr>
                          <th width="5%" class="text-center">#</th>
                          <th width="8%" class="text-center">Codigo</th>
                          <th width="60%" class="text-center">Nombre</th>
                          <th width="7%" class="text-center">UM</th>
                          <th width="10%" class="text-center">Cantidad</th>
                        </tr>
                      </thead>
                      <tbody v-for="(item, it) in output_detail" :key="item.id_product">
                        <tr>
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-left">{{ item.code }}</td>
                            <td class="align-middle text-left">{{ item.name + " - " + item.presentation }}</td>
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
                      <tbody v-for="(item, it) in output.linkages" :key="item.id_input">
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

                <b-col md="4">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/salida/listar' }" append >REGRESAR</b-link>
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
import cOutputDetail from './components/OutputDetail'

export default {
  name: "InputEdit",
  props: ["id_output"],
  components:{
      ModalProducts,
      cOutputDetail,
      vSelect,
  },
  data() {
    return {
      module: 'Output',
      role: 5,
      output: {
        id_output:'',
        id_provider:'',
        id_warehouse:'',
        id_establishment:'',
        id_establishment_destination:'',
        id_user:'',
        linkages:null,
        type_operation:'02',
        type_invoice:'09',
        serie:'',
        number:'',
        broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        departure_date:moment(new Date()).local().format("YYYY-MM-DD"),
        observation:'',
        state:'1',
      },
 
      
      establishment: '',
      series: [],
      warehouses: [],
      establishments_destination: [],
      providers: [],
      output_detail: [],
      
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
    this.mLoadResetOutputDetail();
    this.ListWarehouses();
    this.ViewOutput();
    this.ListEstablishment();
    
  },
  methods: {
    ViewOutput,
    ListWarehouses,
    modalProducts,
    ListEstablishment,
    EditOutput,
    Validate,

    ...mapActions('Output',['mLoadResetOutputDetail']),
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

function ViewOutput() {
  let id_output = je.decrypt(this.id_output);
  let me = this;
  let url = this.url_base+"/output/view/"+id_output;
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
        me.output.id_output = response.data.result.output.id_output; 
        me.output.id_provider = response.data.result.output.id_provider; 
        me.output.id_warehouse = response.data.result.output.id_warehouse; 
        me.output.id_establishment = response.data.result.output.id_establishment; 
         me.output.id_establishment_destination = response.data.result.output.id_establishment_destination;
        me.output.id_user = response.data.result.output.id_user; 
        me.output.linkages = response.data.result.output.linkages; 
        me.output.type_operation = response.data.result.output.type_operation; 
        me.output.type_invoice = response.data.result.output.type_invoice; 
        me.output.serie = response.data.result.output.serie; 
        me.output.number = response.data.result.output.number; 
        me.output.broadcast_date = response.data.result.output.broadcast_date; 
        me.output.departure_date = response.data.result.output.departure_date; 
        me.output.observation = response.data.result.output.observation; 
        me.output.state = response.data.result.output.state; 

        me.output.provider = response.data.result.output.provider_name + ' - '+response.data.result.output.provider_document_number; 
        me.establishment = response.data.result.output.establishment_name;
        me.output.user = response.data.result.output.user_email;

        me.output_detail = response.data.result.output_detail;

        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
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
  let data = {
    role : 3,
    id_establishment : this.id_establishment,
  }
  EventBus.$emit('ModalProductsShow',data);
}

function EditOutput(mthis) {

  let me = mthis;
  let url = me.url_base + "/output/edit";
  me.output.output_detail = me.output_detail;

  let data = me.output;

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
                text: 'Se ha actualizado la salida',
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

  this.errors.id_warehouse = this.output.id_warehouse.length == 0 ? true : false;
  this.errors.serie = this.output.serie.length != 4 ? true : false;
  this.errors.number = this.output.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.output.broadcast_date.length == 0 ? true : false;
  this.errors.departure_date = this.output.departure_date.length == 0 ? true : false;
  this.errors.output_detail = this.output_detail.length == 0 ? true : false;

  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.departure_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.output_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

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
      EditOutput(me);
    }
  })


}

</script>
