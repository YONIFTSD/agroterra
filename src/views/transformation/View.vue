<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Transformacion - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">

              <b-card title="Datos de Transformación">
                <b-row>
                  <b-col md="2">
                      <b-form-group label="Nro de Transformación :">
                        <b-form-input class="text-center" disabled type="text" ref="number"  v-model="transformation.number"></b-form-input>
                        <small v-if="errors.number"  class="form-text text-danger" >Ingrese un Nro de transformación</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Fecha Emision:">
                        <b-form-input class="text-center" disabled type="date" ref="broadcast_date" v-model="transformation.broadcast_date"></b-form-input>
                        <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                      </b-form-group>
                    </b-col>

                      <b-col md="7">
                      <b-form-group label="Observación:" disabled>
                        <b-form-input rows="1"  v-model="transformation.observation" max-rows="2"></b-form-input>
                      </b-form-group>
                    </b-col>
                </b-row>
              </b-card>

              <b-card title="Datos de Salida">
                  <b-row>
                    <b-col md="3">
                      <b-form-group label="Comprobante :">
                        <b-form-select disabled  v-model="transformation.type_invoice_output" :options="type_invoice_output"></b-form-select>
                        <small v-if="errors.type_invoice_output"  class="form-text text-danger" >Seleccione un tipo de comprobante</small>
                      </b-form-group>
                    </b-col>
                      
                    <b-col md="3">
                      <b-form-group label="Serie :">
                        <b-form-input class="text-center" disabled type="text" v-model="transformation.serie_output"></b-form-input>
                        <small v-if="errors.id_serie_output"  class="form-text text-danger" >Seleccione una serie</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Numero :">
                        <b-form-input class="text-center" disabled type="text" ref="number"  v-model="transformation.number_output"></b-form-input>
                        <small v-if="errors.number_output" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Almacen ? :">
                        <b-form-select disabled v-model="transformation.id_warehouse_output" :options="warehouses"></b-form-select>
                        <small  v-if="errors.id_warehouse_output"  class="form-text text-danger">Seleccione un almacen</small>
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
                            </tr>
                          </thead>
                          <tbody v-for="(item, it) in transformation.transform_output_detail" :key="it">
                            <tr>
                                <td class="align-middle text-center">{{ it + 1 }}</td>
                                <td class="align-middle text-left">{{ item.code }}</td>
                                <td class="align-middle text-left">{{ item.name + " - "+item.presentation }}</td>
                                <td class="align-middle text-center">{{ item.unit_measure }}</td>
                                <td class="align-middle text-right">{{ item.quantity }}</td>
                                <td class="align-middle text-right">{{ item.capacity }}</td>
                                <td class="align-middle text-right">{{ item.total_capacity }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                </b-row>
              </b-card>

              <b-card title="Datos de Entrada">
                <b-row class="mt-3">
                    <b-col md="3">
                      <b-form-group label="Comprobante :">
                        <b-form-select disabled v-model="transformation.type_invoice_input" :options="type_invoice_input"></b-form-select>
                      </b-form-group>
                    </b-col>
                      
                    <b-col md="3">
                      <b-form-group label="Serie :">
                        <b-form-input class="text-center" disabled type="text" ref="number"  v-model="transformation.serie_input"></b-form-input>
                        <small v-if="errors.id_serie_input"  class="form-text text-danger" >Seleccione una serie</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Numero :">
                        <b-form-input class="text-center" disabled type="text" ref="number"  v-model="transformation.number_input"></b-form-input>
                        <small v-if="errors.number_input" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Almacen ? :">
                        <b-form-select disabled v-model="transformation.id_warehouse_input" :options="warehouses"></b-form-select>
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
                            </tr>
                          </thead>
                          <tbody v-for="(item, it) in transformation.transform_input_detail" :key="it">
                            <tr>
                                <td class="align-middle text-center">{{ it + 1 }}</td>
                                <td class="align-middle text-left">{{ item.code }}</td>
                                <td class="align-middle text-left">{{ item.name + " - "+item.presentation }}</td>
                                <td class="align-middle text-center">{{  item.unit_measure }}</td>
                                <td class="align-middle text-right">{{ item.quantity }}</td>
                                <td class="align-middle text-right">{{ item.capacity }}</td>
                                <td class="align-middle text-right">{{ item.total_capacity }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <b-col md="4"></b-col>
                    <b-col md="4">
                      <b-form-group class="mt-2">
                        <b-link class="btn form-control btn-primary" :to="{ path: '/transformacion/listar' }" append >REGRESAR</b-link>
                      </b-form-group>
                    </b-col>

                </b-row>
              </b-card>

            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    
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
import TransformDetailOutput from './components/TransformDetailOutput'

export default {
  name: "UsuarioAdd",
  props: ["id_transformation"],
  components:{
      vSelect,  
      ModalProductsOutput,
      TransformDetailOutput,
      ModalClients,
  },
  data() {
    return {
      module: 'Transformation',
      tabIndex: 0,
      role: 5,
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
    this.ViewTransformation();
    this.ListWarehouses();
  },
  methods: {
    ViewTransformation,
    ListWarehouses,
    modalProducts,
    EditRequirement,
    Validate,

    ...mapActions('Requirement',['mLoadResetRequirementDetail','mLoadAddRequirementDetail']),
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

function ViewTransformation() {

  let id_transformation = je.decrypt(this.id_transformation);
  let me = this;
  let url = this.url_base + "transformation/view/" + id_transformation;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {

          me.transformation.id_transformation = response.data.result.transformation.id_transformation;
          me.transformation.id_user = response.data.result.transformation.id_user;
          me.transformation.id_establishment = response.data.result.transformation.id_establishment;
          me.transformation.number = response.data.result.transformation.number;
          me.transformation.broadcast_date = response.data.result.transformation.broadcast_date;
          me.transformation.observation = response.data.result.transformation.observation;
          me.transformation.id_serie_output = response.data.result.transformation.id_serie_output;
          me.transformation.type_invoice_output = response.data.result.transformation.type_invoice_output;
          me.transformation.serie_output = response.data.result.transformation.serie_output;
          me.transformation.number_output = response.data.result.transformation.number_output;
          me.transformation.id_warehouse_output = response.data.result.transformation.id_warehouse_output;
          me.transformation.id_serie_input = response.data.result.transformation.id_serie_input;
          me.transformation.type_invoice_input = response.data.result.transformation.type_invoice_input;
          me.transformation.serie_input = response.data.result.transformation.serie_input;
          me.transformation.number_input = response.data.result.transformation.number_input;
          me.transformation.id_warehouse_input = response.data.result.transformation.id_warehouse_input;
          me.transformation.state = response.data.result.transformation.state;

          let detail = response.data.result.transformation_detail;

          for (let index = 0; index < detail.length; index++) {
            const element = detail[index];
            if (element.type == 1) {
              me.transformation.transform_input_detail.push({
                id_product: element.id_product,
                code: element.code,
                name: element.name,
                presentation: element.presentation,
                unit_measure: element.unit_measure,
                igv: element.igv,
                existence_type: element.existence_type,
                quantity: element.quantity,
                capacity: element.capacity,
                total_capacity: element.total_capacity,
              })
            }

            if (element.type == 2) {
              me.transformation.transform_output_detail.push({
                id_product: element.id_product,
                code: element.code,
                name: element.name,
                presentation: element.presentation,
                unit_measure: element.unit_measure,
                igv: element.igv,
                existence_type: element.existence_type,
                quantity: element.quantity,
                capacity: element.capacity,
                total_capacity: element.total_capacity,
              })
            }
            
          }


      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
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
