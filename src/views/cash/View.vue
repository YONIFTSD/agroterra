<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Arqueo de Caja - Ver</strong>
          </CCardHeader>
          <CCardBody>

              <b-form id="Form">
                      <b-row>
                          <b-col md="3">
                              <b-form-group label="Codigo:">
                              <b-form-input type="text" class="text-center" readonly v-model="cash.cash_number" ></b-form-input>
                              
                              </b-form-group>
                          </b-col>

                          <b-col md="3">
                              <b-form-group label="Fecha Inicio:">
                              <b-form-input type="text" class="text-center" readonly v-model="cash.start_date" ></b-form-input>
                              </b-form-group>
                          </b-col>

                          <b-col md="3">
                              <b-form-group label="Fecha Final:">
                              <b-form-input type="text" class="text-center" readonly v-model="cash.end_date" ></b-form-input>
                              </b-form-group>
                          </b-col>

                          <b-col md="3">
                              <b-form-group label="Usuario:">
                              <b-form-input type="text" class="text-center" readonly v-model="cash.user" ></b-form-input>
                              </b-form-group>
                          </b-col>

                          <b-col md="12">
                            <b-form-group>
                              <label class="control-label">Observación: </label>
                              <b-form-textarea v-model="cash.observation" rows="2"></b-form-textarea>                 
                            </b-form-group>
                          </b-col>


                          <b-col md="12"> <br><br> </b-col>

                          <b-col md="6">
                            
                            <div class="w-100 p-2 text-center"><strong class="header">RESUMEN DE VENTAS</strong></div>
                            <div class="table-responsive">
                              <table class="table table-striped table-bordered w-100">
                                <thead>
                                    <tr class="bg-danger">
                                      <td class="text-center" width="50%" ></td>
                                      <td class="text-center" width="25%">SOLES</td>
                                      <td class="text-center" width="25%">DOLARES</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    
                                    <tr class="bg-info">
                                      <td class="text-let pl-3" >Ventas al Contado</td>
                                      <td class="text-right" >{{cash.total_cash_sales_pen}}</td>
                                      <td class="text-right" >{{cash.total_cash_sales_usd}}</td>
                                    </tr>
                                    <tr class="bg-light text-dark">
                                      <td class="text-let pl-5" >Efectivo</td>
                                      <td class="text-right" >{{cash.counted_pen}}</td>
                                      <td class="text-right" >{{cash.counted_usd}}</td>
                                    </tr>
                                    <tr class="bg-light text-dark">
                                      <td class="text-let pl-5" >Deposito a cuenta</td>
                                      <td class="text-right" >{{cash.deposit_account_pen}}</td>
                                      <td class="text-right" >{{cash.deposit_account_usd}}</td>
                                      
                                    </tr>
                                    <tr class="bg-light text-dark">
                                      <td class="text-let pl-5" >Giro</td>
                                      <td class="text-right" >{{cash.turn_pen}}</td>
                                      <td class="text-right" >{{cash.turn_usd}}</td>
                                    </tr>
                                    <tr class="bg-light text-dark">
                                      <td class="text-let pl-5" >Tarjeta de Débito</td>
                                      <td class="text-right" >{{cash.debit_pen}}</td>
                                      <td class="text-right" >{{cash.debit_usd}}</td>
                                    </tr>
                                    <tr class="bg-info">
                                      <td class="text-let pl-3" >Ventas al Credito</td>
                                      <td class="text-right" >{{cash.total_credit_sales_pen}}</td>
                                      <td class="text-right" >{{cash.total_credit_sales_usd}}</td>
                                    </tr>
                                    <tr class="bg-success">
                                      <td class="text-let" >Total de Ventas del Periodo</td>
                                      <td class="text-right" >{{cash.total_sales_period_pen}}</td>
                                      <td class="text-right" >{{cash.total_sales_period_usd}}</td>
                                    </tr>
                                </tbody>
                              </table>
                            </div>
                          </b-col>


                          <b-col md="6">
                            <div class="w-100 p-2 text-center"><strong class="header">ESTADO DE CAJA</strong></div>
                            <div class="table-responsive">
                              <table class="table table-striped table-bordered w-100">
                                <thead>
                                    <tr class="bg-danger">
                                      <td class="text-center" width="70%" ></td>
                                      <td class="text-center" width="15%">SOLES</td>
                                      <td class="text-center" width="15%">DOLARES</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-success">
                                      <td class="text-let" >Saldo Inicial</td>
                                      <td class="text-right" >{{cash.initial_balance_pen}}</td>
                                      <td class="text-right" >{{cash.initial_balance_usd}}</td>
                                    </tr>
                                    <tr class="bg-success">
                                      <td class="text-let" >Ingresos por Ventas al Contado - Efectivo</td>
                                      <td class="text-right" >{{cash.counted_pen}}</td>
                                      <td class="text-right" >{{cash.counted_usd}}</td>
                                    </tr>
                                    <tr class="bg-success">
                                      <td class="text-let" >Ingresos por cobros - Efectivo</td>
                                      <td class="text-right" >{{cash.total_credit_collection_income_pen}}</td>
                                      <td class="text-right" >{{cash.total_credit_collection_income_usd}}</td>
                                    </tr>
                                    <tr class="bg-success">
                                      <td class="text-let" >Ingresos Extraordinarios</td>
                                      <td class="text-right" >{{cash.total_extraordinary_income_pen}}</td>
                                      <td class="text-right" >{{cash.total_extraordinary_income_usd}}</td>
                                    </tr>
                                    <tr class="bg-success">
                                      <td class="text-let" >Egresos Extraordinarios</td>
                                      <td class="text-right" >{{cash.total_extraordinary_expenses_pen}}</td>
                                      <td class="text-right" >{{cash.total_extraordinary_expenses_usd}}</td>
                                    </tr>
                                    <tr class="bg-dark">
                                      <td class="text-let" >Saldo Final</td>
                                      <td class="text-right" >{{cash.total_income_pen}}</td>
                                      <td class="text-right" >{{cash.total_income_usd}}</td>
                                    </tr>
                                </tbody>
                              </table>
                            </div>
                          </b-col>

                    


                          <b-col md="3">
                          </b-col>
                          <b-col md="2">
                              <b-button type="button" @click="ExportPDF" class="form-control btn btn-primary" variant="info">PDF</b-button>
                          </b-col>
                          <b-col md="2">
                              <b-button type="button" @click="ExportExcel" class="form-control btn btn-primary" variant="success">EXCEL</b-button>
                          </b-col>
                          <b-col md="2">
                              <b-link class="btn form-control btn-primary" :to="{ path: '/caja/listar' }" append >REGRESAR</b-link>
                          </b-col>
                      </b-row>
                </b-form>

          
        
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
var moment = require("moment");


export default {
  name: "CashEdit",
  components:{
  },
  props: ["id_cash"],
  data() {
    return {
      module: "Cash",
      role: 3,

      cash: {
          id_cash:0,
          id_user:0,
          id_correlative:0,
          cash_number:'',
          start_date:'',
          end_date:'',
          initial_balance_pen:(0).toFixed(2),
          cash_pen:(0).toFixed(2),
          card_pen:(0).toFixed(2),
          web_way_pen:(0).toFixed(2),
          total_cash_sales_pen:(0).toFixed(2),
          total_credit_sales_pen:(0).toFixed(2),
          total_sales_period_pen:(0).toFixed(2),
          total_collection_credits_pen:(0).toFixed(2),
          total_extraordinary_income_pen:(0).toFixed(2),
          total_extraordinary_expenses_pen:(0).toFixed(2),
          total_income_pen:(0).toFixed(2),
          initial_balance_usd:(0).toFixed(2),
          cash_usd:(0).toFixed(2),
          card_usd:(0).toFixed(2),
          web_way_usd:(0).toFixed(2),
          total_cash_sales_usd:(0).toFixed(2),
          total_credit_sales_usd:(0).toFixed(2),
          total_sales_period_usd:(0).toFixed(2),
          total_collection_credits_usd:(0).toFixed(2),
          total_extraordinary_income_usd:(0).toFixed(2),
          total_extraordinary_expenses_usd:(0).toFixed(2),
          total_income_usd:(0).toFixed(2),
          initial_balance_clp:(0).toFixed(2),
          cash_clp:(0).toFixed(2),
          card_clp:(0).toFixed(2),
          web_way_clp:(0).toFixed(2),
          total_cash_sales_clp:(0).toFixed(2),
          total_credit_sales_clp:(0).toFixed(2),
          total_sales_period_clp:(0).toFixed(2),
          total_collection_credits_clp:(0).toFixed(2),
          total_extraordinary_income_clp:(0).toFixed(2),
          total_extraordinary_expenses_clp:(0).toFixed(2),
          total_income_clp:(0).toFixed(2),
          observation:'',
          state:0,
          

      },


    };
  },
  mounted() {
    this.ViewCash();
  },
  methods: {
    ViewCash,
    Editcash,
    Validate,

    ExportExcel,
    ExportPDF,


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
  },
};

function ExportExcel() {
  let id_cash = je.decrypt(this.id_cash);
  let me = this;
  let url = this.url_base + "cash-export-excel/"+id_cash+'/'+this.cash.end_date;
  
  window.open(url,'_blank');
}


function ExportPDF() {

  let me = this;
  let url = this.url_base + "cash-export-pdf/"+this.cash.id_cash+'/'+this.cash.end_date;
  
  window.open(url,'_blank');
}

function ViewCash() {
  let id_cash = je.decrypt(this.id_cash);
  let me = this;
  let url = this.url_base + "cash/view/"+id_cash;


  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.cash = response.data.result;
      }
    })
}






function Editcash() {
  // validacion de campos obligatorios
  this.ValidateAdd();
  if (this.validate_add) {
    return false;
  }

  this.newcash.id_user = this.user.id_user;

  let me = this;
  let url = this.url_base + "cash/add";
  let data = this.newcash;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: this.role
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        Swal.fire("Sistema", "Se ha abierto la cuena caja", "success");
        me.state = 2;
        me.GetActiveCash();
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  this.newerrors.id_correlative = this.newcash.id_correlative.length == 0 ? true : false;
  this.newerrors.initial_balance_pen = this.newcash.initial_balance_pen.length == 0 ? true : false;
  this.newerrors.initial_balance_usd = this.newcash.initial_balance_usd.length == 0 ? true : false;
  this.newerrors.initial_balance_clp = this.newcash.initial_balance_clp.length == 0 ? true : false;

  if (this.newerrors.id_correlative) { this.validate_add = true; return false;}else{ this.validate_add = false; }
  if (this.newerrors.initial_balance_pen) { this.validate_add = true; return false;}else{ this.validate_add = false; }
  if (this.newerrors.initial_balance_usd) { this.validate_add = true; return false;}else{ this.validate_add = false; }
  if (this.newerrors.initial_balance_clp) { this.validate_add = true; return false;}else{ this.validate_add = false; }


}


</script>
