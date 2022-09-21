<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Reporte Seguimiento de Ventas</strong>
          </CCardHeader>
          <CCardBody>

          <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
            <b-row class="row justify-content-md-center">


                <b-col md="6">
                  <b-form-group label="Producto :">
                    <v-select placeholder="Seleccione un producto" class="w-100" :filterable="false" label="name" v-model="product" @search="SearchProduct" :options="products"></v-select>
                    <small v-if="errors.id_product" class="form-text text-danger" >Seleccione un producto</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Establecimiento">
                    <b-form-select v-model="report.id_establishment" :options="establishment"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Usuario">
                    <b-form-select v-model="report.id_user" :options="users"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Moneda">
                    <b-form-select v-model="report.coin" :options="coin"></b-form-select>
                  </b-form-group>
                </b-col>

                

                <b-col sm="12" md="2">
                  <b-form-group label="Metodo">
                    <b-form-select v-model="report.method" :options="method"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" v-if="report.method == 1" md="2">
                  <b-form-group label="Mes">
                    <b-form-select v-model="report.month" :options="month"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" v-if="report.method == 1" md="2">
                  <b-form-group label="Año">
                    <b-form-select v-model="report.year" :options="year"></b-form-select>
                  </b-form-group>
                </b-col>

                 <b-col sm="12" v-if="report.method == 2" md="2">
                  <b-form-group label="Desde :">
                    <b-form-input class="text-center" :max="report.to" type="date"  ref="to" v-model="report.from"></b-form-input>
                    <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" v-if="report.method == 2" md="2">
                  <b-form-group label="Hasta :">
                    <b-form-input class="text-center" :min="report.from" type="date"  ref="from" v-model="report.to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                

                <b-col sm="12" md="6">
                  <b-form-group>
                    <label>Cliente: </label>
                    <v-select placeholder="Todos" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
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
                    <th class="text-center" colspan="19">SEGUIMIENTO DE VENTAS ( {{report.from}} -  {{report.to}}) </th>
                  </tr>
                  <tr>
                    <th width ="3%" class="text-center">#</th>
                    <th width ="8%" class="text-center">Fecha</th>
                    <th width ="10%" class="text-center">Documento</th>
                    <th width ="7%" class="text-center">Código</th>
                    <th width ="35%" class="text-center">Producto</th>
                    <th width ="15%" class="text-center">U.M.</th>
                    <th width ="7%" class="text-center">Cantidad</th>
                    <th width ="7%" class="text-center">P. Unit</th>
                    <th width ="7%" class="text-center">P. Total</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{it + 1}}</td>
                    <td class="text-center">{{item.broadcast_date}}</td>
                    <td class="text-center">{{ item.type_invoice +" " +item.serie+"- "+item.number }}</td>
                    <td class="text-left">{{item.code}}</td>
                    <td class="text-left">{{item.name+ " - "+item.presentation}}</td>
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
var moment = require("moment");
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'ReportSalesTracking',
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],


      report:{
        id_establishment: 'all',
        id_user:'all',
        id_product:'',
        method:'2',
        month:moment(new Date()).local().format("MM"),
        year:moment(new Date()).local().format("YYYY"),
        from:moment(new Date()).local().format("YYYY-MM-DD"),
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'PEN',
        id_client:'',
      },
      establishment:[],
      users:[],
      products:[],
      product: null,

      method:[
        {value:'1',text:'Periodo'},
        {value:'2',text:'Fecha'},
      ],
      month:[
        {value:'01',text:'Enero'},
        {value:'02',text:'Febrero'},
        {value:'03',text:'Marzo'},
        {value:'04',text:'Abril'},
        {value:'05',text:'Mayo'},
        {value:'06',text:'Junio'},
        {value:'07',text:'Julio'},
        {value:'08',text:'Agosto'},
        {value:'09',text:'Septiembre'},
        {value:'10',text:'Octubre'},
        {value:'11',text:'Noviembre'},
        {value:'12',text:'Diciembre'},
      ],
      year:[
        {value:'2020',text:'2020'},
        {value:'2021',text:'2021'},
        {value:'2022',text:'2022'},
        {value:'2023',text:'2023'},
        {value:'2024',text:'2024'},
        {value:'2025',text:'2025'},
        {value:'2026',text:'2026'},
        {value:'2027',text:'2027'},
        {value:'2028',text:'2028'},
        {value:'2029',text:'2029'},
        {value:'2030',text:'2030'},
      ],
      coin:[
        {value:'PEN',text:'Soles'},
        {value:'USD',text:'Dólares'},
      ],

      id_client:0,
      to:moment(new Date()).local().format("YYYY-MM-DD"),
      from:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
      search: "",
      clients: [],
      client:null,
      errors:{
        id_product: false,
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListEstablishment();
    this.ListUsers();
  },
  methods: {
    ListEstablishment,
    ListUsers,
    SearchProduct,
    Validate,
    Report,
    SearchClients,
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
  me.report.id_client = me.client == null ? 'all':me.client.id;
  me.report.id_product = me.product == null ? 'all':me.product.id;

  // if (me.product == null) {
  //   return false;
  // }

  let url = me.url_base + "excel-report-sales-tracking/"+me.report.id_product+"/"+me.report.id_establishment+"/"+me.report.id_user+"/"+
  me.report.method+"/"+me.report.month+"/"+me.report.year+"/"+me.report.from+"/"+me.report.to+"/"+me.report.coin+"/"+me.report.id_client;
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
      me.establishment = [{value:'all',text:'-- Todos --'}];
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

function ListUsers() {

  let me = this;
  let url = this.url_base + "active-users";
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      me.users = [{value:'all',text:'-- Todos --'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.users.push({value: element.id_user, text: element.user});
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
}

function SearchClients(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients = response.data;
            loading(false);
      })
    }
}

function SearchProduct(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-products-select";
    let data = {
      search:search
    }
    if (search !== "") {
      loading(true);
      axios({
        method: "POST",
        data:data,
        url: url,
      }).then(function (response) {
            me.products = response.data.result;
            loading(false);
      })
    }
    
}

function Validate() {
  
  // this.errors.id_product = this.product == null ? true : false;
  // if (this.errors.id_product == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  this.Report();
}

function Report() {
  let me = this;
  me.report.id_client = me.client == null ? 'all':me.client.id;
  me.report.id_product = me.product == null ? 'all':me.product.id;
  let data = me.report;
  let url = this.url_base + "report/sales-tracking";
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
