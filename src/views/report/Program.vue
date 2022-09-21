<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Reporte Programaciones</strong>
          </CCardHeader>
          <CCardBody>

          <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
            <b-row class="justify-content-md-center">

               
                

                <b-col sm="12" md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <v-select placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProviders" :options="providers"></v-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Desde :">
                    <b-form-input class="text-center" :max="report.to" type="date"  ref="from" v-model="report.from"></b-form-input>
                    <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Hasta :">
                    <b-form-input class="text-center" :min="report.from" type="date"  ref="from" v-model="report.to"></b-form-input>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

    

                <b-col sm="12" md="1">
                  <b-form-group label=".">
                    <b-button class="form-control" type="submit" variant="primary"><i class="fas fa-search"></i></b-button>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="1">
                  <b-form-group label=".">
                    <b-button class="form-control" type="button" variant="success" @click="ExportExcel"><i class="fas fa-file-excel"></i></b-button>
                  </b-form-group>
                </b-col>

            </b-row>
          </b-form>


            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th class="text-center" colspan="19">PROGRAMACIONES DEL {{report.from +" HASTA "+report.to}} {{NameCoin(report.coin)}} ) </th>
                  </tr>
                  <tr>
                    <th width="8%" class="text-center">F. Emision</th>
                    <th width="8%" class="text-center">F. Vcto</th>
                    <th width="12%" class="text-center">Documento</th>
                    <th width="48%" class="text-center">Acreedor</th>
                    <th width="7%" class="text-center">Moneda</th>
                    <th width="8%" class="text-center">Saldo Soles</th>
                    <th width="8%" class="text-center">Saldo Dolares</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, it) in data_table" :key="it">
                    <td class="text-center">{{item.broadcast_date}}</td>
                    <td class="text-center">{{item.expiration_date}}</td>
                    <td class="text-center">{{ item.document }}</td>
                    <td class="text-left">{{ item.provider }}</td>
                    <td class="text-center">{{item.coin}}</td>
                    <td class="text-right">{{item.balance_pen}}</td>
                    <td class="text-right">{{item.balance_usd}}</td>
                  </tr>
                  <tr>
                    <td colspan="5" class="text-right">TOTAL</td>
                    <td class="text-right">{{total.balance_pen}}</td>
                    <td class="text-right">{{total.balance_usd}}</td>
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
      module: 'ReportPay',
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],
      report:{
        id_provider:'',
        from:moment(new Date()).local().format("YYYY-MM-DD"),
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'all',
      },
      total:{
        balance_pen:'0.00',
        balance_usd:'0.00',
      },
      providers: [],
      provider:null,
      coin:[
        {value:'all',text:'Todos'},
        {value:'PEN',text:'Soles'},
        {value:'USD',text:'Dólares'},
      ],
      
      errors:{
        to:false,
        from:false,
      }
    };
  },
  mounted() {
  },
  methods: {
    Validate,
    Report,
    ExportExcel,
    SearchProviders,
    CodeInvoice,
    NameCoin,
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

function NameCoin(code) {
  let name = '';
  if (code == 'PEN') {
    name = 'EXPRESADO EN SOLES';
  }
  if (code == 'USD') {
    name = 'EXPRESADO EN DOLARES';
  }
  return name;
}

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
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

function ExportExcel() {  
  let me = this;
   me.report.id_provider = me.provider == null ? 'all':me.provider.id;
  let url = me.url_base + "excel-report-programs/"+me.report.id_provider+"/"+me.report.from+"/"+me.report.to+"/"+me.report.coin;
  window.open(url,'_blank');
}

function Validate() {
  
  // this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  // if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  this.Report(this);
}


function Report(me) {

  
  let url = this.url_base + "report/programs";
  me.report.id_provider = me.provider == null ? 'all':me.provider.id;
  let data = me.report;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.data_table = response.data.result.result;
        me.total = response.data.result.total;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}





</script>
