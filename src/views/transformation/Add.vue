<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Transformación - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
       
                <b-tabs  v-model="tabIndex" content-class="mt-3" justified>
                  <b-tab :disabled="first" title="Datos de Salida">
                      <b-row>
                        <b-col md="2">
                          <b-form-group label="Nro de Transformación :">
                              <b-form-input class="text-center" readonly type="text" ref="number"  v-model="transformation.number"></b-form-input>
                              <small v-if="errors.number"  class="form-text text-danger" >Ingrese un Nro de transformación</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Fecha Emision:">
                              <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="transformation.broadcast_date"></b-form-input>
                              <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                            </b-form-group>
                          </b-col>

                            <b-col md="5">
                            <b-form-group label="Observación:">
                              <b-form-input rows="1"  v-model="transformation.observation" max-rows="2"></b-form-input>
                            </b-form-group>
                          </b-col>


                          <b-col md="2">
                            <b-form-group label=".">
                              <b-button class="form-control" variant="primary" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Tipo de Comprobante :">
                              <b-form-select @change="ListSeries(1)" v-model="transformation.type_invoice_output" :options="type_invoice_output"></b-form-select>
                              <small v-if="errors.type_invoice_output"  class="form-text text-danger" >Seleccione un tipo de comprobante</small>
                            </b-form-group>
                          </b-col>
                            
                          <b-col md="3">
                            <b-form-group label="Serie :">
                              <b-form-select @change="GetNumberBySerie(1)" v-model="transformation.id_serie_output" :options="series_output"></b-form-select>
                              <small v-if="errors.id_serie_output"  class="form-text text-danger" >Seleccione una serie</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Numero :">
                              <b-form-input class="text-center" readonly type="text" ref="number"  v-model="transformation.number_output"></b-form-input>
                              <small v-if="errors.number_output" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Almacen ? :">
                              <b-form-select v-model="transformation.id_warehouse_output" :options="warehouses"></b-form-select>
                              <small  v-if="errors.id_warehouse_output"  class="form-text text-danger">Seleccione un almacen</small>
                            </b-form-group>
                          </b-col>

                          <TransformDetailOutput/>
                          <b-col md="12" class="text-center">
                            <small  v-if="errors.transform_output_detail"  class="form-text tex-center text-danger">Ingrese Productos</small>
                          </b-col>


                          <b-col md="5"></b-col>
                          <b-col md="2">
                            <b-form-group class="mt-2">
                              <b-button @click="toNext" variant="primary" class="form-control" type="button">SIGUIENTE <i class="fas fa-arrow-circle-right"></i></b-button>
                            </b-form-group>
                          </b-col>

                      </b-row>
                  </b-tab>
                  <b-tab :disabled="second" title="Datos de Entrada">
                      <b-row>
                          <b-col md="3">
                            <b-form-group label="Tipo de Comprobante :">
                              <b-form-select @change="ListSeries(2)" v-model="transformation.type_invoice_input" :options="type_invoice_input"></b-form-select>
                            </b-form-group>
                          </b-col>
                            
                          <b-col md="3">
                            <b-form-group label="Serie :">
                              <b-form-select @change="GetNumberBySerie(2)" v-model="transformation.id_serie_input" :options="series_input"></b-form-select>
                              <small v-if="errors.id_serie_input"  class="form-text text-danger" >Seleccione una serie</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Numero :">
                              <b-form-input class="text-center" readonly type="text" ref="number"  v-model="transformation.number_input"></b-form-input>
                              <small v-if="errors.number_input" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Almacen ? :">
                              <b-form-select v-model="transformation.id_warehouse_input" :options="warehouses"></b-form-select>
                              <small  v-if="errors.id_warehouse_input"  class="form-text text-danger">Seleccione una almacen</small>
                            </b-form-group>
                          </b-col>


                          

                          <div class="col-md-12">
                            <div class="table-responsive mt-3">
                              <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                                <thead class="">
                                  <tr>
                                    <th width="5%" class="text-center">#</th>
                                    <th width="8%" class="text-center">Codigo</th>
                                    <th width="40%" class="text-center">Nombre</th>
                                    <th width="5%" class="text-center">UM</th>
                                    <th width="8%" class="text-center">Cantidad</th>
                                    <th width="8%" class="text-center">Capacidad</th>
                                    <th width="7%" class="text-center">Cap. Total</th>
                                    <th width="7%" class="text-center">Cap. Restante</th>
                                    <th width="5%" class="text-center">Acciones</th>
                                  </tr>
                                </thead>
                                <tbody v-for="(item, it) in transform_output_detail" :key="item.id_product">
                                  <tr>
                                      <td class="align-middle text-center">{{ it + 1 }}</td>
                                      <td class="align-middle text-left">{{ item.code }}</td>
                                      <td class="align-middle text-left">{{ item.name + " - "+item.presentation }}</td>
                                      <td class="align-middle text-center">{{ item.unit_measure }}</td>
                                      <td class="align-middle text-center">{{ item.quantity }}</td>
                                      <td class="align-middle text-right">{{ item.capacity }}</td>
                                      <td class="align-middle text-right">{{ item.total_capacity }}</td>
                                      <td class="align-middle text-right">{{ item.remaining_capacity }}</td>
                                      <td class="align-middle text-center">
                                        <button type="button" @click="modalProductInput(it,item.id_product)" class="btn btn-primary"><i class="fas fa-eye"></i></button>  
                                      </td>

                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>


                          <TransformDetailInput/>
                          <b-col md="12" class="text-center">
                            <small  v-if="errors.transform_input_detail"  class="form-text tex-center text-danger">Ingrese Productos</small>
                          </b-col>


                          <b-col md="4"></b-col>
                          <b-col md="2">
                            <b-form-group class="mt-2">
                              <b-button @click="toBack" variant="primary" class="form-control" type="button"><i class="fas fa-arrow-alt-circle-left"></i> REGRESAR</b-button>
                            </b-form-group>
                          </b-col>
                          <b-col md="2">
                            <b-form-group class="mt-2">
                              <b-button  variant="primary" class="form-control" type="submit"><i class="fas fa-save"></i> Guardar (F4)</b-button>
                            </b-form-group>
                          </b-col>

                      </b-row>
                  </b-tab>
                </b-tabs>
              

      
     
              







              
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProductsOutput />
    <ModalProductsInput />
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
import ModalProductsOutput from './components/ModalProductOutput'
import ModalProductsInput from './components/ModalProductInput'
import TransformDetailOutput from './components/TransformDetailOutput'
import TransformDetailInput from './components/TransformDetailInput'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,  
      ModalProductsOutput,
      ModalProductsInput,
      TransformDetailOutput,
      TransformDetailInput,
      ModalClients,
  },
  data() {
    return {
      module: 'Transformation',
      tabIndex: 0,
      role: 1,
      first:false,
      second: true,
      transformation: {
        id_transformation: "",
        id_user: "",
        id_establishment: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        observation:'',

        id_serie_output: "",
        type_invoice_output: "NS",
        serie_output: "",
        number_output: "",
        id_warehouse_output: "",
        transform_output_detail: [],


        id_serie_input: "",
        type_invoice_input: "NE",
        serie_input: "",
        number_input: "",
        id_warehouse_input: "",
        transform_input_detail: [],


        state: '1',
      },

      type_invoice_output:[
        {value: "NS", text : "Nota de Salida"},
      ],
      series_output: [],
      warehouses: [],

      type_invoice_input:[
        {value: "NE", text : "Nota de Entrada"},
      ],
      series_input: [],
      warehouses: [],


      errors: {
        number: false,
        id_serie_output: false,
        type_invoice_output: false,
        serie_output: false,
        number_output: false,
        id_warehouse_output: false,
        transform_output_detail: false,

        id_serie_input: false,
        type_invoice_input: false,
        serie_input: false,
        number_input: false,
        id_warehouse_input: false,
        transform_input_detail: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.mLoadResetTransformOutputDetail();
    this.mLoadResetTransformInputDetail();
    this.GetCorrelative();
    this.ListSeries(1);
    this.ListSeries(2);
    this.ListWarehouses();

  },
  methods: {
    ListSeries,
    GetNumberBySerie,
    GetCorrelative,
    ListWarehouses,
    modalProducts,
    modalProductInput,
    toBack,
    toNext,
    AddTransformation,
    Validate,

    ...mapActions('Transform',['mLoadResetTransformOutputDetail','mLoadResetTransformInputDetail']),
  },

  computed: {
    ...mapState('Transform',['transform_output_detail','transform_input_detail']),
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

function GetCorrelative() {
  let me = this;
  let url = this.url_base + "get-correlative/Transformation";

  axios({
    method: "GET",
    url: url,
    headers: {token: this.token, module: this.module,role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.transformation.number = response.data.result.number;
      } 
    })
}

function ListWarehouses() {
  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
    .then(function (response) {
      me.warehouses = [{value:'',text:'-- Seleccione un almacen --'}];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.warehouses.push( { value : data[index].id_warehouse , text: data[index].name } );
        }
      }
    })
}

//listar almacenes
function ListSeries(type) {

  if (type == 1) {
      let me = this;
      let url = this.url_base + "list-series/"+this.transformation.type_invoice_output+"/"+this.id_establishment;
      axios({
        method: "GET",
        url: url,
        headers: { token: this.token,},
      })
        .then(function (response) {
          me.series_output = [];
          if (response.data.status == 200) {
            let data = response.data.result;
            for (let index = 0; index < data.length; index++) {
              me.series_output.push( { value : data[index].id_serie , text: data[index].serie } );
              me.transformation.id_serie_output = data[index].id_serie;
            }
            
            me.GetNumberBySerie(type);
          } else {
            Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
          }
        })
  }


  if (type == 2) {
      let me = this;
      let url = this.url_base + "list-series/"+this.transformation.type_invoice_input+"/"+this.id_establishment;
      axios({
        method: "GET",
        url: url,
        headers: { token: this.token,},
      })
        .then(function (response) {
          me.series_input = [];
          if (response.data.status == 200) {
            let data = response.data.result;
            for (let index = 0; index < data.length; index++) {
              me.series_input.push( { value : data[index].id_serie , text: data[index].serie } );
              me.transformation.id_serie_input = data[index].id_serie;
            }
            
            me.GetNumberBySerie(type);
          } else {
            Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
          }
        })
  }

}

function GetNumberBySerie(type) {

  if (type == 1) {
      let me = this;
      let url = this.url_base + "serie/view/"+this.transformation.id_serie_output;

      axios({
        method: "GET",
        url: url,
        headers: { token: this.token, module: this.module, role: this.role,},
      })
        .then(function (response) {
          if (response.data.status == 200) {
            me.transformation.number_output = response.data.result.number;
          } else {
            me.transformation.number_output = '';
          }
        })
  }

  if (type == 2) {
      let me = this;
      let url = this.url_base + "serie/view/"+this.transformation.id_serie_input;

      axios({
        method: "GET",
        url: url,
        headers: { token: this.token, module: this.module, role: this.role,},
      })
        .then(function (response) {
          if (response.data.status == 200) {
            me.transformation.number_input = response.data.result.number;
          } else {
            me.transformation.number_input = '';
          }
        })
  }
  
}

function modalProducts() {
  EventBus.$emit('ModalProductsShow',this.role,this.id_establishment);
}

function modalProductInput(index,id_product) {
  
  EventBus.$emit('ModalProductsInputShow',this.role,index,id_product);
}


function toNext() {
  
  this.errors.number = this.transformation.number == 0 ? true : false;
  this.errors.broadcast_date = this.transformation.broadcast_date == 0 ? true : false;
  this.errors.type_invoice_output = this.transformation.type_invoice_output == 0 ? true : false;
  this.errors.id_serie_output = this.transformation.id_serie_output == 0 ? true : false;
  this.errors.number_output = this.transformation.number_output.length == 0 ? true : false;
  this.errors.id_warehouse_output = this.transformation.id_warehouse_output.length == 0 ? true : false;
  this.errors.transform_output_detail = this.transform_output_detail.length == 0 ? true : false;
  
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.type_invoice_output == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie_output == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse_output == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.transform_output_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  this.first = true;
  this.second = false;
  let me = this;
  // this.tabIndex = 2 ;
  setTimeout(function(){ me.tabIndex = 2;  }, 500);


}

function toBack() {
  this.mLoadResetTransformInputDetail();
  this.first = false;
  this.second = true;
  let me = this;
  // this.tabIndex = 2 ;
  setTimeout(function(){ me.tabIndex = 1;  }, 500);
}

function AddTransformation(_this) {
  
  let me = _this;
  let url = me.url_base + "transformation/add";
  me.transformation.id_user = me.user.id_user;
  me.transformation.id_establishment = me.id_establishment;
  me.transformation.transform_output_detail = me.transform_output_detail;
  me.transformation.transform_input_detail = me.transform_input_detail;
  let data = me.transformation;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 201) {

        me.transformation.id_transformation = "",
        me.transformation.id_user = "";
        me.transformation.id_establishment = "";
        me.transformation.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.transformation.observation = "";
        me.transformation.id_serie_output = "";
        me.transformation.type_invoice_output = "NS";
        me.transformation.serie_output = "";
        me.transformation.number_output = "";
        me.transformation.id_warehouse_output = "";

        me.transformation.id_serie_input = "";
        me.transformation.type_invoice_input = "NE";
        me.transformation.serie_input = "";
        me.transformation.number_input = "";
        me.transformation.id_warehouse_input = "";

        me.mLoadResetTransformOutputDetail();
        me.mLoadResetTransformInputDetail();
        me.GetCorrelative();
        me.ListSeries(1);
        me.ListSeries(2);
        me.ListWarehouses();

        me.first = false;
        me.second = true;
        let me_ = me;
        setTimeout(function(){ me_.tabIndex = 1;  }, 500);

        Swal.fire({ icon: 'success', text: 'Se ha registrado la transformación', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

  this.errors.type_invoice_input = this.transformation.type_invoice_input == 0 ? true : false;
  this.errors.id_serie_input = this.transformation.id_serie_input == 0 ? true : false;
  this.errors.number_input = this.transformation.number_input.length == 0 ? true : false;
  this.errors.id_warehouse_input = this.transformation.id_warehouse_input.length == 0 ? true : false;
  this.errors.transform_input_detail = this.transform_input_detail.length == 0 ? true : false;
 

  if (this.errors.type_invoice_input == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie_input == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse_input == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.transform_input_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar la transformación?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddTransformation(me);
    }
  })



}



</script>
