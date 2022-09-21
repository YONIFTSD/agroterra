<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Reporte de Venta 14.1</strong>
          </CCardHeader>
          <CCardBody>

          <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
            <b-row class="row justify-content-md-center">

               
                
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
                  <b-form-group label="Moneda :">
                    <b-form-select v-model="report.coin" :options="coin"></b-form-select>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col>

                <!-- <b-col sm="12" md="2">
                  <b-form-group label="Convertir a:">
                    <b-form-select v-model="report.coin_convert" :options="coin_convert"></b-form-select>
                    <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                  </b-form-group>
                </b-col> -->


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
                    <th class="text-center" colspan="20">VENTAS 14.1 ( {{report.from}} -  {{report.to}}) </th>
                  </tr>
                  <tr>
                    <th rowspan="2" class="text-center">#</th>
                    <th rowspan="2" class="text-center">Fecha <br> Emision</th>
                    <th rowspan="2" class="text-center">Fecha <br> Vencim.</th>
                    <th colspan="3" class="text-center">Comprobante de Pago</th>
                    <th colspan="3" class="text-center">Información del Cliente</th>
                    <th rowspan="2" class="text-center">Moneda</th>
                    <th rowspan="2" class="text-center">Ope. <br> Gravada</th>
                    <th rowspan="2" class="text-center">IGV</th>
                    <th colspan="2" class="text-center">Ope. no Gravada</th>
                    
                    <th rowspan="2" class="text-center">Total</th>
                    <th rowspan="2" class="text-center">Tipo <br> Cambio</th>
                    <th colspan="4" class="text-center">Referencia del comprobante</th>
                  </tr>
                  <tr>
                    <th class="text-center">Tipo</th>
                    <th class="text-center">Serie</th>
                    <th class="text-center">Numero</th>

                    <th class="text-center">Tipo</th>
                    <th class="text-center">Numero</th>
                    <th class="text-center">Razón Social</th>

                    <th class="text-center">Exonerada</th>
                    <th class="text-center">Inafecta</th>

                    <th class="text-center">Fecha</th>
                    <th class="text-center">Tipo</th>
                    <th class="text-center">Serie</th>
                    <th class="text-center">Numero</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{it + 1}}</td>
                    <td class="text-center">{{item.broadcast_date}}</td>
                    <td class="text-center">{{item.expiration_date}}</td>
                    <td class="text-center">{{item.type_invoice}}</td>
                    <td class="text-center">{{item.serie}}</td>
                    <td class="text-center">{{item.number}}</td>
                    <td class="text-center">{{item.client_document_type}}</td>
                    <td class="text-left">{{item.client_document_number}}</td>
                    <td class="text-left">{{item.client_name}}</td>
                    <td class="text-left">{{item.coin}}</td>
                    <td class="text-right">{{item.taxed_operation}}</td>
                    <td class="text-right">{{item.igv}}</td>
                    <td class="text-right">{{item.exonerated_operation}}</td>
                    <td class="text-right">{{item.unaffected_operation}}</td>
                    
                    <td class="text-right">{{item.total}}</td>
                    <td class="text-center">{{item.exchange_rate}}</td>
                    <td class="text-center">{{item.modified_emission_date}}</td>
                    <td class="text-center">{{item.modified_document_type}}</td>
                    <td class="text-center">{{item.modified_serie}}</td>
                    <td class="text-center">{{item.modified_number}}</td>
                    
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
      module: 'ReportSale14.1',
      role:1,
      perPage: 15,
      currentPage: 1,
      coin:[        
        {value:'PEN',text:'Soles'},
        {value:'USD',text:'Dólares'}
      ],
      coin_convert:[
        {value:'all',text:'Ninguno'},
        {value:'PEN',text:'Soles'},
        {value:'USD',text:'Dólares'}
      ],
      rows: 0,
      data_table: [],
      report:{
        from:moment(new Date()).local().format("YYYY-MM-DD"),
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'PEN',
        coin_convert:'all',
      },
      
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
  let url = me.url_base + "excel-report-sales-141/"+me.report.from+"/"+me.report.to+"/"+me.report.coin;
  window.open(url,'_blank');
}

function Validate() {
  
  // this.errors.id_establishment = this.kardex.id_establishment.length == 0 ? true : false;
  // if (this.errors.id_establishment == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  this.Report(this);
}


function Report(me) {
  let data = me.report;
  let url = this.url_base + "report/sales-141";
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
