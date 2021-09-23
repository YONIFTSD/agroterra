<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Reporte de Precio de Productos</strong>
          </CCardHeader>
          <CCardBody>

          <b-form id="Form" @submit.prevent="Validate">
            <b-row>
                <b-col sm="12" md="2">
                  <b-form-group label="Establecimiento">
                    <b-form-select v-model="report.id_establishment" :options="establishments"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Usuario">
                    <b-form-select v-model="report.id_user" :options="users"></b-form-select>
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
                    <th class="text-center" colspan="13">PRODUCTOS COMISIONABLES ( {{report.from}} -  {{report.to}}) </th>
                  </tr>
                  <tr>
                    <th class="text-center">#</th>
                    <th class="text-center">Fecha</th>
                    <th class="text-center">Documento</th>
                    <th class="text-center">Usuario</th>
                    <th class="text-center">Código</th>
                    <th class="text-center">Producto</th>
                    <th class="text-center">Cantidad</th>
                    <th class="text-center">P. Unit</th>
                    <th class="text-center">P. Total</th>
                    <th class="text-center">Com. Unit.</th>
                    <th class="text-center">Com. Total</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{it + 1}}</td>
                    <td class="text-center">{{item.broadcast_date}}</td>
                    <td class="text-center">{{ CodeInvoice(item.type_invoice)+" "+item.serie+"-"+item.number }}</td>
                    <td class="text-center">{{item.user}}</td>
                    <td class="text-left">{{item.code}}</td>
                    <td class="text-left">{{item.name}}</td>
                    <td class="text-center">{{item.quantity}}</td>
                    <td class="text-right">{{item.unit_price}}</td>
                    <td class="text-right">{{item.total_price}}</td>
                    <td class="text-right">{{item.unit_commission}}</td>
                    <td class="text-right">{{item.total_commission}}</td>
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
      module: 'ReportCommissionableProducts',
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],

      report:{
        id_establishment: 'all',
        id_user:'all',
        from:moment(new Date()).local().format("YYYY-MM-DD"),
        to:moment(new Date()).local().format("YYYY-MM-DD"),
      },
      establishments:[],
      users:[],
      
      errors:{
        id_establishment:false,
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListEstablishments();
    this.ListUsers();
  },
  methods: {
    ListEstablishments,
    ListUsers,
    Validate,
    Report,
    CodeInvoice,
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
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ExportExcel() {  
   let me = this;
  let url = me.url_base + "excel-report-commissionable-products/"+me.report.id_establishment+"/"+me.report.id_user+"/"+me.report.from+"/"+me.report.to;
  window.open(url,'_blank');
}

function ListEstablishments() {

  let me = this;
  let url = this.url_base + "active-establishments";
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      me.establishments = [{value:'all',text:'-- Todos --'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.establishments.push({value: element.id_establishment, text: element.name});
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



function Validate() {
  
  // this.errors.id_establishment = this.report.id_establishment.length == 0 ? true : false;
  this.errors.from = this.report.from.length == 0 ? true : false;
  this.errors.to = this.report.to.length == 0 ? true : false;

  // if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.from == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.to == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  this.Report(this);
}


function Report(me) {
  let data = me.report;
  let url = this.url_base + "report/commissionable-products";
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
