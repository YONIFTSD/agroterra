<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalEECC" class="w-100" title="Cuentas por cobrar por cliente">
     
     <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
            <b-row>

                <b-col sm="12" md="10">
                  <b-form-group>
                    <label>Cliente: </label>
                    <v-select placeholder="Todos" @input="Validate" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                  </b-form-group>
                </b-col>

      

                <b-col sm="12" md="2">
                  <b-form-group label="Moneda">
                    <b-form-select @change="Validate" v-model="report.coin" :options="coin"></b-form-select>
                  </b-form-group>
                </b-col>

            </b-row>
          </b-form>


            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th class="text-center" colspan="19">CUENTAS POR COBRAR AL {{report.to}} {{NameCoin(report.coin)}} </th>
                  </tr>
                  <tr>
                    <th width="8%" class="text-center">F. Emision</th>
                    <th width="8%" class="text-center">F. Vcto</th>
                    <th width="12%" class="text-center">Documento</th>
                    <th width="48%" class="text-center">Acreedor</th>
                    <th width="7%" class="text-center">Moneda</th>
                    <th width="8%" class="text-center">Importe</th>
                    <th width="8%" class="text-center">A Cuenta</th>
                    <th width="8%" class="text-center">Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, it) in data_table" :key="it">
                    <td class="text-center">{{item.broadcast_date}}</td>
                    <td class="text-center">{{item.expiration_date}}</td>
                    <td class="text-center">{{ item.document }}</td>
                    <td class="text-left">{{ item.client }}</td>
                    <td class="text-center">{{item.coin}}</td>
                    <td class="text-right">{{item.total}}</td>
                    <td class="text-right">{{item.fee}}</td>
                    <td class="text-right">{{item.balance}}</td>
                  </tr>
                  <tr>
                    <td colspan="5" class="text-right">TOTAL DOLARES</td>
                    <td class="text-right">{{total_usd.total}}</td>
                    <td class="text-right">{{total_usd.fee}}</td>
                    <td class="text-right">{{total_usd.balance}}</td>
                  </tr>
                  <tr>
                    <td colspan="5" class="text-right">TOTAL SOLES</td>
                    <td class="text-right">{{total_pen.total}}</td>
                    <td class="text-right">{{total_pen.fee}}</td>
                    <td class="text-right">{{total_pen.balance}}</td>
                  </tr>
                  
                </tbody>
               
              </table>
            </div>

      
    </b-modal>
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
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");
export default {
  name: "ModalsProduct",
  components:{
    vSelect,
  },
  data() {
    return {
        modalEECC:false,
        module:'AccountReceivable',
  
        isLoading: false,
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],
      report:{
        id_client:'',
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'all',
      },
      total_pen:{
        total:'0.00',
        fee:'0.00',
        balance:'0.00',
      },
      total_usd:{
        total:'0.00',
        fee:'0.00',
        balance:'0.00',
      },
      clients: [],
      client:null,
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
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalEECCShow', () => {
      this.modalEECC = true;
      this.Validate();
    });
    
  },
  methods: {
        Validate,
    Report,
    ExportExcel,
    SearchClients,
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


function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

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

function ExportExcel() {  
  let me = this;
   me.report.id_client = me.client == null ? 'all':me.client.id;
  let url = me.url_base + "excel-report-accounts-receivable/"+me.report.id_client+"/"+me.report.to+"/"+me.report.coin;
  window.open(url,'_blank');
}

function Validate() {
  
  // this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  // if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  this.Report(this);
}


function Report(me) {

  
  let url = this.url_base + "report/accounts-receivable";
  me.report.id_client = me.client == null ? 'all':me.client.id;
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
        me.total_pen = response.data.result.total_pen;
        me.total_usd = response.data.result.total_usd;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}


</script>
