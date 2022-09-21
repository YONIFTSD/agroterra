<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalAmortizations" class="w-100" :title="CodeInvoice(account_receivable.type_invoice) +' '+ account_receivable.serie+'-'+ account_receivable.number + ' | Amortizaciones '">
      <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
        <b-row>
          <b-col md="2">
            <b-form-group label="Fecha :">
              <b-form-input type="date" v-model="amortization.broadcast_date"></b-form-input>
              <small v-if="errors.broadcast_date" class="form-text text-danger" >Seleccione un fecha</small>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Monto :">
              <b-form-input @change="CalculateTotal" class="text-right" type="number" step="any" v-model="amortization.amount"></b-form-input>
              <small v-if="errors.amount" class="form-text text-danger" >Ingrese un monto</small>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Interés :">
              <b-form-input @change="CalculateTotal" class="text-right" type="number" step="any" v-model="amortization.interest"></b-form-input>
              <small v-if="errors.interest" class="form-text text-danger" >Ingrese un monto</small>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Importe Total :">
              <b-form-input disabled class="text-right" type="number" step="any" v-model="amortization.total"></b-form-input>
              <small v-if="errors.total" class="form-text text-danger" >Ingrese un monto</small>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Medio de Pago :">
              <b-form-select v-model="amortization.payment_method" :options="payment_method"></b-form-select>
              <small v-if="errors.payment_method" class="form-text text-danger" >Seleccione un metodo</small>
            </b-form-group>
          </b-col>
          <b-col md="1">
            <b-form-group label=".">
              <b-button class="form-control" v-if="amortization.id_amortization_ar.length == 0" type="submit" variant="primary" title="Guardar"><i class="fas fa-save"></i></b-button>
              <b-button class="form-control" v-if="amortization.id_amortization_ar.length != 0" type="submit" variant="primary" title="Modificar"><i class="fas fa-edit"></i></b-button>
            </b-form-group>
          </b-col>
          <b-col v-if="amortization.payment_method != '008'" md="3">
            <b-form-group label="Numero OP:">
              <b-form-input type="text" v-model="amortization.number_op"></b-form-input>
              <small v-if="errors.number_op" class="form-text text-danger" >Ingrese un numero OP</small>
            </b-form-group>
          </b-col>
          <b-col v-if="amortization.payment_method != '008'" md="3">
            <b-form-group label="Banco:">
              <b-form-input type="text" v-model="amortization.bank"></b-form-input>
              <small v-if="errors.bank" class="form-text text-danger" >Ingrese un banco</small>
            </b-form-group>
          </b-col>
          <b-col v-if="amortization.payment_method != '008'" md="6">
            <b-form-group label="Observación:">
              <b-form-input type="text" v-model="amortization.observation"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <b-col md="12">
        <div class="table-responsive mt-3">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th width="5%" class="text-center">#</th>
                <th width="8%" class="text-center">Fecha</th>
                <th width="22%" class="text-center">Medio de Pago</th>
                <th width="13%" class="text-center">Numero OP</th>
                <th width="15%" class="text-center">Banco</th>
                <th width="8%" class="text-center">Monto</th>
                <th width="8%" class="text-center">Interes</th>
                <th width="8%" class="text-center">Total</th>
                <th width="8%" class="text-center">Estado</th>
                <th width="5%" class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody v-for="(item, it) in amortizations" :key="it">
              <tr>
                <td class="text-center">{{ it + 1 }}</td>
                <td class="text-center">{{ item.broadcast_date }}</td>
                <td class="text-left">{{ NameMethodPayment(item.payment_method) }}</td>
                <td class="text-left">{{ item.number_op }}</td>
                <td class="text-left">{{ item.bank }}</td>
                <td class="text-right">{{ item.amount }}</td>
                <td class="text-right">{{ item.interest }}</td>
                <td class="text-right">{{ item.total }}</td>
                <td class="text-center">
                  <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                  <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                </td>
                <td class="text-center">
                    <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item  @click="ViewAmortization(item.id_amortization_ar)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="item.state == 1" @click="ConfirmCancelAmortization(item.id_amortization_ar)" >Anular</b-dropdown-item >
                        <!-- <b-dropdown-item v-if="item.state == 1" @click="ConfirmDeleteIncome(item.id_amortization_ar)">Eliminar</b-dropdown-item> -->
                      </b-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>

      <b-col md="5">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="30%" class="text-center">F. Emision</th>
                  <th width="30%" class="text-center">F. Vencimiento</th>
                  <th width="10%" class="text-center">Moneda</th>
                  <th width="15%" class="text-center">Total</th>
                  <th width="10%" class="text-center">Deuda</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-center">{{ account_receivable.broadcast_date }}</td>
                  <td class="text-center">{{ account_receivable.expiration_date }}</td>
                  <td class="text-center">{{ account_receivable.coin }}</td>
                  <td class="text-right">{{ account_receivable.total }}</td>
                  <td class="text-right">{{ account_receivable.balance }}</td>
             
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      
    </b-modal>
  </div>
</template>
<style>



</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");
export default {
  name: "ModalsProduct",
  data() {
    return {
        modalAmortizations:false,
        module:'AccountReceivable',
        role:3,
        id_account_receivable:0,
        amortizations: [],
        account_receivable:{
          type_invoice:'',
          serie:'',
          number:'',
          coin:'',
          total:'',
          fee:'',
          balance:'',
        },
        amortization:{
          id_amortization_ar:'',
          id_account_receivable:'',
          id_user:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          payment_method:'008',
          number_op:'',
          bank:'',
          observation:'',
          amount:0,
          interest:0,
          total:0,
          state:'1',
        },
        payment_method: [
          {value :"001", text :'DEPÓSITO EN CUENTA'},
          {value :"003", text :'TRANSFERENCIA DE FONDOS'},
          {value :"004", text :'ORDEN DE PAGO'},
          {value :"005", text :'TARJETA DE DÉBITO'},
          {value :"006", text :'TARJETA DE CRÉDITO'},
          {value :"007", text :'CHEQUES CON LA CLÁUSULA DE "NO NEGOCIABLE"'},
          {value :"008", text :'EFECTIVO'},
          {value :"009", text :'EFECTIVO, EN LOS DEMÁS CASOS'},
          {value :"101", text :'TRANSFERENCIAS - COMERCIO EXTERIOR'},
          {value :"102", text :'CHEQUES BANCARIOS  - COMERCIO EXTERIOR'},
        ],
    
        errors:{
          broadcast_date:false,
          payment_method:false,
          amount:false,
          interest:false,
          total:false,
          number_op:false,
          bank:false,
        }

     
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalAmortizationsShow', (id_account_receivable) => {
      this.modalAmortizations = true;
      this.id_account_receivable = id_account_receivable;
      this.ViewAccountReceivable(this);
      this.ListAmortizations(this);
    });
    
  },
  methods: {
      ViewAccountReceivable,
      ListAmortizations,
      Validate,
      AddAmortization,
      EditAmortization,
      CodeInvoice,
      NameMethodPayment,
      CalculateTotal, 
      ViewAmortization,
      ConfirmCancelAmortization,
      CancelAmortization,
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
function CalculateTotal() {
  
  this.amortization.amount = this.amortization.amount.length == 0 ? 0 :this.amortization.amount;
  this.amortization.interest = this.amortization.interest.length == 0 ? 0 :this.amortization.interest;

  this.amortization.amount = parseFloat(this.amortization.amount);
  this.amortization.interest = parseFloat(this.amortization.interest);
  this.amortization.total = this.amortization.amount + this.amortization.interest;

  this.amortization.amount = this.amortization.amount.toFixed(2);
  this.amortization.interest = this.amortization.interest.toFixed(2);
  this.amortization.total = this.amortization.total.toFixed(2);

}
function NameMethodPayment(code) {
  let name_code = '';
  switch (code) {
    case "001":  name_code = 'DEPÓSITO EN CUENTA'; break;
    case "003":  name_code = 'TRANSFERENCIA DE FONDOS'; break;
    case "004":  name_code = 'ORDEN DE PAGO'; break;
    case "005":  name_code = 'TARJETA DE DÉBITO'; break;
    case "006":  name_code = 'TARJETA DE CRÉDITO'; break;
    case "007":  name_code = 'CHEQUES CON LA CLÁUSULA DE "NO NEGOCIABLE"'; break;
    case "008":  name_code = 'EFECTIVO'; break;
    case "009":  name_code = 'EFECTIVO, EN LOS DEMÁS CASOS'; break;
    case "101":  name_code = 'TRANSFERENCIAS - COMERCIO EXTERIOR'; break;
    case "102":  name_code = 'CHEQUES BANCARIOS  - COMERCIO EXTERIOR'; break;
    default: break;
  }
  return name_code;
 
}
//lis
function ViewAccountReceivable(me) {
    let url = me.url_base + "account-receivable/view/"+me.id_account_receivable;
    axios({
      method: "GET",
      url:url,
      headers: { token: me.token, module: me.module, role: me.role },
    })
    .then(function (response) {
      if (response.data.status == 200) {
        me.account_receivable.broadcast_date = response.data.result.broadcast_date;
        me.account_receivable.expiration_date = response.data.result.expiration_date;
        me.account_receivable.type_invoice = response.data.result.type_invoice;
        me.account_receivable.serie = response.data.result.serie;
        me.account_receivable.number = response.data.result.number;
        me.account_receivable.coin = response.data.result.coin;
        me.account_receivable.total = response.data.result.total;
        me.account_receivable.fee = response.data.result.fee;
        me.account_receivable.balance = response.data.result.balance;

        me.amortization.amount = parseFloat(me.account_receivable.balance);
        me.amortization.amount = me.amortization.amount.toFixed(2);
        me.amortization.interest = parseFloat(0).toFixed(2);
        me.amortization.total = me.amortization.amount;

     
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

function Validate() {
  let me = this;

  this.errors.broadcast_date = this.amortization.broadcast_date.length == 0 ? true : false;
  this.errors.payment_method = this.amortization.payment_method.length == 0 ? true : false;
  this.errors.amount = this.amortization.amount.length == 0 ? true : false;
  this.errors.interest = this.amortization.interest.length == 0 ? true : false;
  this.errors.total = this.amortization.total.length == 0 ? true : false;
  if (this.amortization.payment_method != '008') {
    this.errors.number_op = this.amortization.number_op.length == 0 ? true : false;
    this.errors.bank = this.amortization.bank.length == 0 ? true : false;
  }else{
     this.errors.number_op = false;
    this.errors.bank = false;
  }
  
  if (this.errors.b1roadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.payment_method == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.amount == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.interest == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number_op == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }if (this.errors.b1roadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.bank == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }if (this.errors.b1roadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  if (this.amortization.id_amortization_ar.length == 0) {
      Swal.fire({
        title: 'Esta seguro de registrar la amortización?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Estoy de Acuerdo!'
      }).then((result) => {
        if (result.isConfirmed) {
          AddAmortization(me);
        }
      })
  }else{
      Swal.fire({
        title: 'Esta seguro de modificar la amortización?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Estoy de Acuerdo!'
      }).then((result) => {
        if (result.isConfirmed) {
          EditAmortization(me);
        }
      })
  }





 
}


function AddAmortization(me) {
  
    let url = me.url_base + "amortization-ar/add";
    me.amortization.id_user = me.user.id_user;
    me.amortization.id_account_receivable = me.id_account_receivable;
    let data = me.amortization;
    axios({
      method: "POST",
      url:url,
      data:data,
      headers: { token: me.token, module: me.module, role: me.role },
    })
    .then(function (response) {
      if (response.data.status == 201) {
        me.amortization.id_amortization_ar = '';
        me.amortization.id_account_receivable = '';
        me.amortization.id_user = '';
        me.amortization.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.amortization.payment_method = '008';
        me.amortization.number_op = '';
        me.amortization.bank = '';
        me.amortization.observation ='';
        me.ViewAccountReceivable(me);
        me.ListAmortizations(me);
        EventBus.$emit('RefreshAccountReceivable');
        Swal.fire({ icon: 'success', text: 'Se ha registrado la amortización', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
    });

   
}

function EditAmortization(me) {
  let url = me.url_base + "amortization-ar/edit";
    me.amortization.id_user = me.user.id_user;
    me.amortization.id_account_receivable = me.id_account_receivable;
    let data = me.amortization;
    axios({
      method: "PUT",
      url:url,
      data:data,
      headers: { token: me.token, module: me.module, role: me.role },
    })
    .then(function (response) {
      if (response.data.status == 200) {
        me.amortization.id_amortization_ar = '';
        me.amortization.id_account_receivable = '';
        me.amortization.id_user = '';
        me.amortization.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.amortization.payment_method = '008';
        me.amortization.number_op = '';
        me.amortization.bank = '';
        me.amortization.observation ='';
        me.ViewAccountReceivable(me);
        me.ListAmortizations(me);
        EventBus.$emit('RefreshAccountReceivable');
        Swal.fire({ icon: 'success', text: 'Se ha modificado la amortización', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
    });
}



function ViewAmortization(id_amortization) {
  let me = this;
  let url = me.url_base + "amortization-ar/view/"+id_amortization;

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.amortization.id_amortization_ar = response.data.result.id_amortization_ar;
          me.amortization.id_account_receivable = response.data.result.id_account_receivable;
          me.amortization.id_user = response.data.result.id_user;
          me.amortization.broadcast_date = response.data.result.broadcast_date;
          me.amortization.payment_method = response.data.result.payment_method;
          me.amortization.number_op = response.data.result.number_op;
          me.amortization.bank = response.data.result.bank;
          me.amortization.observation = response.data.result.observation;
          me.amortization.amount = response.data.result.amount;
          me.amortization.interest = response.data.result.interest;
          me.amortization.total = response.data.result.total;
          me.amortization.state = response.data.result.state;
      } 
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ConfirmCancelAmortization(id_amortization) {
  Swal.fire({
    title: "Esta seguro de anular la amortización?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.CancelAmortization(id_amortization);
    }
  });
}

function CancelAmortization(id_amortization) {
  let me = this;
  let url = me.url_base + "amortization-ar/cancel/"+id_amortization;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.ViewAccountReceivable(me);
        me.ListAmortizations(me);
        EventBus.$emit('RefreshAccountReceivable');
        Swal.fire({ icon: 'success', text: 'Se ha anulado la amortización', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}


//Buscar productos
function ListAmortizations(me) {
  let url = me.url_base + "amortization-ar/list/"+me.id_account_receivable;

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.amortizations = response.data.result;
      } else {
        me.amortizations = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}
</script>
