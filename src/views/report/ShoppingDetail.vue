<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Reporte Detallado de Compras</strong>
          </CCardHeader>
          <CCardBody>

          <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
            <b-row>

                <b-col sm="12" md="3">
                  <b-form-group label="Establecimiento">
                    <b-form-select v-model="report.id_establishment" :options="establishment"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="3">
                  <b-form-group label="Tipo Comprobante">
                    <b-form-select v-model="report.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                 <b-col sm="12" md="2">
                  <b-form-group label="Desde :">
                    <b-form-input class="text-center" :max="report.to" type="date"  ref="to" v-model="report.from"></b-form-input>
                    <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Hasta :">
                    <b-form-input class="text-center" :min="report.from" type="date"  ref="from" v-model="report.to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Forma de Pago">
                    <b-form-select v-model="report.way_to_pay" :options="way_to_pay"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <v-select placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProviders" :options="providers"></v-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Moneda">
                    <b-form-select v-model="report.coin" :options="coin"></b-form-select>
                  </b-form-group>
                </b-col>

                

                <b-col sm="12" md="2">
                  <b-form-group label=".">
                    <b-button class="form-control" type="submit" variant="primary">BUSCAR</b-button>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label=".">
                    <b-button class="form-control" type="button" variant="success" @click="ExportExcel">EXCEL</b-button>
                  </b-form-group>
                </b-col>

            </b-row>
          </b-form>


          <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th class="text-center" colspan="14">COMPRAS DETALLADO( {{report.from}} -  {{report.to}}) </th>
                  </tr>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-center">Fecha <br> Emision</th>
                    <th class="text-center">T. C.</th>
                    <th class="text-center">Serie</th>
                    <th class="text-center">Numero</th>
                    <th class="text-center">Razón Social</th>
                      <th class="text-center">Forma <br> de Pago</th>
                     <th class="text-center">Moneda</th>
                    <th class="text-center">Código</th>
                    <th class="text-center">Producto</th>
                    <th class="text-center">U.M.</th>
                   
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">P. Unit</th>
                    <th class="text-center">P. Total</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{it + 1}}</td>
                    <td class="text-center">{{item.broadcast_date}}</td>
                    <td class="text-center">{{item.invoice_type}}</td>
                    <td class="text-center">{{item.serie}}</td>
                    <td class="text-center">{{item.number}}</td>
                    <td class="text-left">{{item.provider_name +" - "+ item.provider_document_number}}</td>
                    <td class="text-center">
                      <span v-if="item.payment_type == '01'">Contado</span>
                      <span v-if="item.payment_type == '03'">Crédito</span>
                    </td>
                    <td class="text-center">{{item.coin}}</td>
                    <td class="text-left">{{item.code}}</td>
                    <td class="text-left">{{item.name + " - " +item.presentation}}</td>
                    <td class="text-center">{{item.unit_measure}}</td>
                    
                    <td class="text-center">{{item.quantity}}</td>
                    <td class="text-right">{{item.unit_price}}</td>
                    <td class="text-right">{{item.total_price}}</td>
                  </tr>
                </tbody>
               
              </table>
            </div>

  
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

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
import { mapState } from "vuex";
import CodeToName from "@/assets/js/CodeToName";
import LoadingComponent from './../pages/Loading'
var moment = require("moment");
export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Sale',
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],

      report:{
        id_establishment: 'all',
        type_invoice:'all',
        from:moment(new Date()).local().format("YYYY-MM-DD"),
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'all',
        way_to_pay:'all',
        id_provider:'',
      },
      establishment:[],
      type_invoice:[
        {value:'all',text:'-- Todos --'},
        {value:'01',text:'Factura'},
        {value:'03',text:'Boleta'},
        {value:'NV',text:'Nota de Venta'},
      ],
      coin:[
        {value:'all',text:'-- Todos --'},
        {value:'PEN',text:'Soles'},
        {value:'USD',text:'Dólares'},
      ],
      way_to_pay:[
        {value:'all',text:'-- Todos --'},
        {value:'01',text:'Contado'},
        {value:'03',text:'Crédito'},
      ],
      providers: [],
      provider:null,

      errors:{
        from: false,
        to:false,
      }
    
    };
  },
  mounted() {
    this.ListEstablishment();
  },
  methods: {
    ListEstablishment,
    Validate,
    Report,
    SearchProviders,
     ExportExcel,
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let id_establishment = window.localStorage.getItem("id_establishment");
      id_establishment = JSON.parse(je.decrypt(id_establishment));
      return id_establishment;
    },
  },
};

function ExportExcel() {  
  let me = this;
  me.report.id_provider = me.provider == null ? 'all':me.provider.id;
  let url = me.url_base + "excel-report-shopping-detail/"+me.report.id_establishment+"/"+me.report.type_invoice+"/"+me.report.from+"/"+me.report.to+"/"+me.report.coin+"/"+me.report.way_to_pay+"/"+me.report.id_provider;
  window.open(url,'_blank');
}
function ListEstablishment() {

  let me = this;
  let url = this.url_base + "active-establishments";
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      me.establishment = [{value:'all',text:'Seleccione un establecimiento'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.establishment.push({value: element.id_establishment, text: element.name});
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
}

function SearchProviders(search, loading) {
  
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

function Validate() {
  
  // this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  // if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  this.Report(this);
}


function Report(me) {
  me.report.id_provider = me.provider == null ? 'all':me.provider.id;
  let data = me.report;
  let url = this.url_base + "report/shopping-detail";
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.data_table = response.data.result;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}





</script>
