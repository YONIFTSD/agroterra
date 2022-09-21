<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Arqueo de Caja - Nuevo</strong>
          </CCardHeader>
          <CCardBody>

                <div class="w-100" v-if="state == 1">

                    <b-form id="Form" autocomplete="off" @submit.prevent="ValidateAdd">
                      <b-row>
                          <b-col md="2">
                              <b-form-group label="Codigo:">
                              <b-form-input type="text" class="text-center" readonly v-model="newcash.cash_number" ></b-form-input>
                              <small v-if="newerrors.id_correlative" class="form-text text-danger">Ingrese un código</small >
                              </b-form-group>
                          </b-col>

                          <b-col md="2">
                              <b-form-group label="Fecha Inicio:">
                              <b-form-input :min="min_date" type="date" class="text-center"  v-model="newcash.start_date" ></b-form-input>
                              </b-form-group>
                          </b-col>

                          <b-col md="2">
                              <b-form-group label="Saldo Inicial (Soles) :">
                              <b-form-input type="number" step="any" class="text-right" v-model="newcash.initial_balance_pen" ></b-form-input>
                              <small v-if="newerrors.initial_balance_pen" class="form-text text-danger">Ingrese un monto</small >
                              </b-form-group>
                          </b-col>

                          <b-col md="2">
                              <b-form-group label="Saldo Inicial (Dolares) :">
                              <b-form-input type="number" step="any" class="text-right" v-model="newcash.initial_balance_usd" ></b-form-input>
                              <small v-if="newerrors.initial_balance_usd" class="form-text text-danger">Ingrese un monto</small >
                              </b-form-group>
                          </b-col>

                          <b-col md="2">
                              <b-form-group label="Usuario :">
                              <b-form-input disabled  v-model="user.user" ></b-form-input>
                              </b-form-group>
                          </b-col>

                          <b-col md="2">
                              <b-form-group label=".">
                              <b-button type="submit" class="form-control btn btn-primary" variant="primary">INICIAR</b-button>
                              </b-form-group>
                          </b-col>
                      </b-row>
                    </b-form>


                  
                </div>



                <div class="w-100" v-if="state == 2">

                    <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
                            <b-row>
                                <b-col md="3">
                                    <b-form-group label="Codigo:">
                                    <b-form-input type="text" class="text-center" readonly v-model="cash.cash_number" ></b-form-input>
                                    <small v-if="errors.id_correlative" class="form-text text-danger">Ingrese un código</small >
                                    </b-form-group>
                                </b-col>

                                <b-col md="3">
                                    <b-form-group label="Fecha Inicio:">
                                    <b-form-input type="date" class="text-center" readonly v-model="cash.start_date" ></b-form-input>
                                    </b-form-group>
                                </b-col>

                                <b-col md="3">
                                    <b-form-group label="Fecha Final:">
                                    <b-form-input type="date" @change="CalculateCash" :min="cash.start_date" class="text-center" v-model="cash.end_date" ></b-form-input>
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


                                <b-col md="12"></b-col>
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
                                            <td class="text-let pl-5" >Tarjeta de Débito</td>
                                            <td class="text-right" >{{cash.debit_pen}}</td>
                                            <td class="text-right" >{{cash.debit_usd}}</td>
                                          </tr>
                                          
                                          <tr class="bg-light text-dark">
                                            <td class="text-let pl-5" >Tarjeta de Crédito</td>
                                            <td class="text-right" >{{cash.credit_pen}}</td>
                                            <td class="text-right" >{{cash.credit_usd}}</td>
                                          </tr>
                                          <tr class="bg-light text-dark">
                                            <td class="text-let pl-5" >Transferencia de Fondos</td>
                                            <td class="text-right" >{{cash.transfer_funds_pen}}</td>
                                            <td class="text-right" >{{cash.transfer_funds_usd}}</td>
                                          </tr>
                                          <tr class="bg-light text-dark">
                                            <td class="text-let pl-5" >Pagos por Web</td>
                                            <td class="text-right" >{{cash.web_payment_pen}}</td>
                                            <td class="text-right" >{{cash.web_payment_usd}}</td>
                                          </tr>
                                          <tr class="bg-light text-dark">
                                            <td class="text-let pl-5" >Otros</td>
                                            <td class="text-right" >{{cash.others_pen}}</td>
                                            <td class="text-right" >{{cash.others_usd}}</td>
                                          </tr>
                                          <tr class="bg-info">
                                            <td class="text-let pl-3" >Ventas al Credito</td>
                                            <td class="text-right" >{{cash.total_credit_sales_pen}}</td>
                                            <td class="text-right" >{{cash.total_credit_sales_usd}}</td>
                                          </tr>
                                          <tr class="bg-info">
                                            <td class="text-let pl-3" >Ventas al Anticipo</td>
                                            <td class="text-right" >{{cash.total_cash_sales_advance_pen}}</td>
                                            <td class="text-right" >{{cash.total_cash_sales_advance_usd}}</td>
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

                          


                                <b-col md="3"></b-col>
                                <b-col md="2">
                                    <b-button type="button" @click="ExportPDF" class="form-control btn btn-primary" variant="info">PDF</b-button>
                                </b-col>
                                <b-col md="2">
                                    <b-button type="button" @click="ExportExcel" class="form-control btn btn-primary" variant="success">Excel</b-button>
                                </b-col>
                                <b-col md="2">
                                    <b-button type="submit" class="form-control btn btn-primary" variant="primary">Cerrar Caja</b-button>
                                </b-col>
                            </b-row>
                      </b-form>

                </div>

        
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
  name: "CashAdd",
  components:{
  },
  data() {
    return {
      module: "Cash",
      role: 2,
      state: 0,
      min_date:'',
      //new
      newcash: {
          id_cash:0,
          id_user:0,
          id_correlative:0,
          cash_number:'',
          start_date:moment(new Date()).local().format("YYYY-MM-DD"),
          end_date:'',
          initial_balance_pen:(0).toFixed(2),
          initial_balance_usd:(0).toFixed(2),
          observation:'',
          state:1,
      },
      newerrors: {
        id_correlative: false,
        initial_balance_pen: false,
        initial_balance_usd: false,
      },
      validate_add: false,







      cash: {
          id_cash:0,
          id_user:0,
          id_correlative:0,
          cash_number:'',
          start_date:'',
          end_date:'',

          initial_balance_pen:(0).toFixed(2),
          counted_pen:(0).toFixed(2),
          deposit_account_pen:(0).toFixed(2),
          debit_pen:(0).toFixed(2),
          credit_pen:(0).toFixed(2),
          transfer_funds_pen:(0).toFixed(2),
          others_pen:(0).toFixed(2),
          web_payment_pen:(0).toFixed(2),
          total_cash_sales_pen:(0).toFixed(2),
          total_cash_sales_advance_pen:(0).toFixed(2),
          total_credit_sales_pen:(0).toFixed(2),
          total_sales_period_pen:(0).toFixed(2),
          total_credit_collection_income_pen:(0).toFixed(2),
          total_extraordinary_income_pen:(0).toFixed(2),
          total_extraordinary_expenses_pen:(0).toFixed(2),
          total_income_pen:(0).toFixed(2),

          initial_balance_usd:(0).toFixed(2),
          counted_usd:(0).toFixed(2),
          deposit_account_usd:(0).toFixed(2),
          debit_usd:(0).toFixed(2),
          credit_usd:(0).toFixed(2),
          transfer_funds_usd:(0).toFixed(2),
          others_usd:(0).toFixed(2),
          web_payment_usd:(0).toFixed(2),
          total_cash_sales_usd:(0).toFixed(2),
          total_cash_sales_advance_usd:(0).toFixed(2),
          total_credit_sales_usd:(0).toFixed(2),
          total_sales_period_usd:(0).toFixed(2),
          total_credit_collection_income_usd:(0).toFixed(2),
          total_extraordinary_income_usd:(0).toFixed(2),
          total_extraordinary_expenses_usd:(0).toFixed(2),
          total_income_usd:(0).toFixed(2),

          observation:'',
          state:0,
          

      },

      //errors
      errors: {
        id_correlative: false,
        initial_balance_pen: false,
        initial_balance_usd: false,
        initial_balance_clp: false,
      },
      
      validate: false,


    };
  },
  mounted() {
    this.ValidateOpenBox();
  },
  methods: {
    ValidateOpenBox,

    GetCorrelative,
    Addcash,
    ValidateAdd,
    ExportExcel,
    ExportPDF,

    GetActiveCash,
    CalculateCash,
    Closecash,
    GetLastDate,
    Validate,

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

function ExportExcel() {

  let me = this;
  let url = this.url_base + "cash-export-excel/"+this.cash.id_cash+'/'+this.cash.end_date;
  
  window.open(url,'_blank');
}

function ExportPDF() {

  let me = this;
  let url = this.url_base + "cash-export-pdf/"+this.cash.id_cash+'/'+this.cash.end_date;
  
  window.open(url,'_blank');
}

function ValidateOpenBox() {
  let me = this;
  let url = this.url_base + "cash/validate-open-box/"+this.id_establishment;

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
        me.state = 2;
        me.cash.end_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.GetActiveCash();
      }else{
        me.state = 1;
        me.GetCorrelative();
        me.GetLastDate();

       

      }
    })
}




function GetLastDate() {
  let me = this;
  let url = this.url_base + "cash/get-last-date/"+this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.min_date = response.data.result.end_date;
        me.newcash.start_date = response.data.result.end_date;
      } 
    })
}


////STATE 1
function GetCorrelative() {
  let me = this;
  let url = this.url_base + "cash/correlative";

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
        me.newcash.id_correlative = response.data.result.id_correlative;
        me.newcash.cash_number = response.data.result.number;
      } 
    })
}

function Addcash(_this) {

  
  let me = _this;
  me.newcash.id_establishment = me.id_establishment;
  me.newcash.id_user = me.user.id_user;
  let url = me.url_base + "cash/add";
  let data = me.newcash;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role
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
}

function ValidateAdd() {
  this.newerrors.id_correlative = this.newcash.id_correlative.length == 0 ? true : false;
  this.newerrors.initial_balance_pen = this.newcash.initial_balance_pen.length == 0 ? true : false;
  this.newerrors.initial_balance_usd = this.newcash.initial_balance_usd.length == 0 ? true : false;
  

  if (this.newerrors.id_correlative) { this.validate_add = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.newerrors.initial_balance_pen) { this.validate_add = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.newerrors.initial_balance_usd) { this.validate_add = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }


  let me = this;
  Swal.fire({
    title: "Esta seguro de inicar caja ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.Addcash(me);
    }
  });

}





// STATE 2


//listar usuario
function GetActiveCash() {
  let me = this;
  let url = this.url_base + "cash/get-active-cash/"+this.id_establishment;

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
        
          me.cash.id_cash = response.data.result.id_cash;
          me.cash.id_establishment = response.data.result.id_establishment;
          me.cash.id_user = response.data.result.id_user;
          me.cash.id_correlative = response.data.result.id_correlative;
          me.cash.cash_number = response.data.result.cash_number;
          me.cash.start_date = response.data.result.start_date;
          me.cash.end_date = moment(new Date()).local().format("YYYY-MM-DD");

          me.cash.observation = response.data.result.observation;
          me.cash.state = response.data.result.state;
          me.cash.user = response.data.result.user;
          

          me.CalculateCash();
          

      } 
    })
}

function CalculateCash() {
  let me = this;
  let url = this.url_base + "cash/calculate_cash/"+me.cash.id_cash+"/"+me.cash.end_date;

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


          me.cash.initial_balance_pen = response.data.result.initial_balance_pen;
          me.cash.counted_pen = response.data.result.counted_pen;
          me.cash.deposit_account_pen = response.data.result.deposit_account_pen;
          me.cash.debit_pen = response.data.result.debit_pen;
          me.cash.credit_pen = response.data.result.credit_pen;
          me.cash.transfer_funds_pen = response.data.result.transfer_funds_pen;
          me.cash.others_pen = response.data.result.others_pen;
          me.cash.web_payment_pen = response.data.result.web_payment_pen;
          me.cash.total_cash_sales_pen = response.data.result.total_cash_sales_pen;
          me.cash.total_cash_sales_advance_pen = response.data.result.total_cash_sales_advance_pen;
          me.cash.total_credit_sales_pen = response.data.result.total_credit_sales_pen;
          me.cash.total_sales_period_pen = response.data.result.total_sales_period_pen;
          me.cash.total_credit_collection_income_pen = response.data.result.total_credit_collection_income_pen;
          me.cash.total_extraordinary_income_pen = response.data.result.total_extraordinary_income_pen;
          me.cash.total_extraordinary_expenses_pen = response.data.result.total_extraordinary_expenses_pen;
          me.cash.total_income_pen = response.data.result.total_income_pen;

          me.cash.initial_balance_usd = response.data.result.initial_balance_usd;
          me.cash.counted_usd = response.data.result.counted_usd;
          me.cash.deposit_account_usd = response.data.result.deposit_account_usd;
          me.cash.debit_usd = response.data.result.debit_usd;
          me.cash.credit_usd = response.data.result.credit_usd;
          me.cash.transfer_funds_usd = response.data.result.transfer_funds_usd;
          me.cash.others_usd = response.data.result.others_usd;
          me.cash.web_payment_usd = response.data.result.web_payment_usd;
          me.cash.total_cash_sales_usd = response.data.result.total_cash_sales_usd;
          me.cash.total_cash_sales_advance_usd = response.data.result.total_cash_sales_advance_usd;
          me.cash.total_credit_sales_usd = response.data.result.total_credit_sales_usd;
          me.cash.total_sales_period_usd = response.data.result.total_sales_period_usd;
          me.cash.total_credit_collection_income_usd = response.data.result.total_credit_collection_income_usd;
          me.cash.total_extraordinary_income_usd = response.data.result.total_extraordinary_income_usd;
          me.cash.total_extraordinary_expenses_usd = response.data.result.total_extraordinary_expenses_usd;
          me.cash.total_income_usd = response.data.result.total_income_usd;

      } 
    })
}

function Closecash(me) {
  me.cash.id_user = me.user.id_user;
  me.cash.id_establishment = me.user.id_establishment;
  let url = me.url_base + "cash/close";
  let data = me.cash;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire("Sistema", "Se ha Cerrado la caja", "success");
        me.ValidateOpenBox();
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  this.errors.id_cash = this.cash.id_cash.length == 0 ? true : false;
  this.errors.end_date = this.cash.end_date.length == 0 ? true : false;

  if (this.errors.id_cash) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.end_date) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  Swal.fire({
    title: 'Esta seguro de cerrar la caja?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      Closecash(me);
    }
  })


}
</script>
