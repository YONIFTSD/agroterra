<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modal_payment" class="w-100" title="REGISTRO DE PAGOS">
      <b-row>
        <b-col md="12" class="mt-3">
          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="10%"  class="text-center align-middle">Fecha</th>
                  <th width="15%"  class="text-center align-middle">Documento</th>
                  <th width="7%"  class="text-center align-middle">Moneda</th>
                  <th width="7%"  class="text-center align-middle">Total</th>
                  <th width="7%"  class="text-center align-middle">Saldo</th>
                  <th width="10%"  class="text-center align-middle">T. C.</th>
                  <th width="10%"  class="text-center align-middle">Importe</th>
                  <th width="10%"  class="text-center align-middle">Importe {{ msettlement_collection.coin == 'PEN' ? 'en soles':'en dolares' }}</th>
                  <th width="10%"  class="text-center align-middle">Acciones</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in charges" :key="it">
                  <tr>
                    <td class="text-center">{{ item.broadcast_date }}</td>
                    <td class="text-center">{{ item.document }}</td>
                    <td class="text-center">{{ item.coin }}</td>
                    <td class="text-center">{{ item.total }}</td>
                    <td class="text-right">{{ item.balance }}</td>
                    <td class="text-center">
                      <input @change="UpdateAmount(it)" :disabled="item.coin == msettlement_collection.coin" type="number" step="any" v-model="item.exchange_rate" :ref="'mExchangeRate'+it" class="form-control text-right">
                    </td>
                    <td class="text-right">{{ item.amount +" "+ item.coin}}</td>
                    <td class="text-right">
                      <input @change="UpdateAmount(it)" type="number" step="any" v-model="item.amount_final" :ref="'mAmount'+it" class="form-control text-right">
                    </td>
                    <td class="text-center">
                        <button @click="AddPayment(it)" type="button" class="btn btn-info">
                          <i class="fas fa-plus-square"></i>
                        </button>
                    </td>
                  </tr>
              </tbody>
            </table>
          </div>
     
        </b-col>

      </b-row>

      <b-row>
        <b-col md="7" class="mt-3">
          <div class="table-responsive">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="60%"  class="text-center align-middle">Documentos Relacionados</th>
                  <th width="10%"  class="text-center align-middle">Moneda</th>
                  <th width="10%"  class="text-center align-middle">Total</th>
                  <th width="10%"  class="text-center align-middle">Aplicado</th>
                  <th width="10%"  class="text-center align-middle">Saldo</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="text-left">{{ settlement_collection.related_documents }}</td>
                  <td class="text-center">{{ msettlement_collection.coin }}</td>
                  <td class="text-right">{{ msettlement_collection.total }}</td>
                  <td class="text-right">{{ msettlement_collection.applied }}</td>
                  <td class="text-right">{{ msettlement_collection.balance }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>

      </b-row>
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
// import Notifications from 'vue-notification/dist/ssr.js';
var moment = require("moment");

export default {
  name: "ModalsProduct",
  data() {
    return {
        modal_payment:false,
        module:'ExchangeDocument',
        role:0,
        settlement_collection : {
          related_documents : '',
          id_client:'',
        },
        charges:[],
        bill_exchange : {
          letter_number:'',
          broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
          expiration_date:'',
          coin:'',
          total: (0).toFixed(2),
        },
        validate :false,
        errors :{
          letter_number : false,
          broadcast_date : false,
          expiration_date : false,
          coin : false,
          total : false,
        },
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalChargeShow', (data) => {
      this.modal_payment = true;
      this.settlement_collection.related_documents = data.related_documents;
      this.settlement_collection.id_client = data.id_client;
      this.role = data.role;
      this.ListCharges();

    });

  },
  methods: {
      ListCharges,
      UpdateAmount,
      Validate,
      AddPayment,
      ...mapActions('SettlementCollection',['mLoadAddCharge']),
  },
  computed: {
      ...mapState('SettlementCollection',['msettlement_collection']),
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function UpdateAmount(index) {
 
  this.charges[index].exchange_rate = this.charges[index].exchange_rate.length == 0 ? 1 :this.charges[index].exchange_rate;
  this.charges[index].amount_final = this.charges[index].amount_final.length == 0 ? 1 :this.charges[index].amount_final;
 
  if (this.msettlement_collection.coin == 'PEN') {
    if (this.charges[index].coin == 'PEN') {
      this.charges[index].amount = parseFloat(this.charges[index].amount_final);
    }else{
      this.charges[index].amount = parseFloat(this.charges[index].amount_final) / parseFloat(this.charges[index].exchange_rate);
    }
  }
  if (this.msettlement_collection.coin == 'USD') {
     if (this.charges[index].coin == 'USD') {
      this.charges[index].amount = parseFloat(this.charges[index].amount_final);
    }else{
      this.charges[index].amount = parseFloat(this.charges[index].amount_final) * parseFloat(this.charges[index].exchange_rate);
    }
  }

  this.charges[index].exchange_rate = parseFloat(this.charges[index].exchange_rate).toFixed(2);
  this.charges[index].amount = parseFloat(this.charges[index].amount).toFixed(2);
  this.charges[index].amount_final = parseFloat(this.charges[index].amount_final).toFixed(2);


}

function Validate() {

  // this.errors.letter_number = this.bill_exchange.letter_number.length == 0 ? true : false;
  // this.errors.broadcast_date = this.bill_exchange.broadcast_date.length == 0 ? true : false;
  // this.errors.expiration_date = this.bill_exchange.expiration_date.length == 0 ? true : false;
  // this.errors.coin = this.bill_exchange.coin.length == 0 ? true : false;
  // this.errors.total = parseFloat(this.bill_exchange.total) <= 0 ? true : false;

  // if (this.errors.letter_number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  // if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  // if (this.errors.expiration_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  // if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  // if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
   
  // if (parseFloat(this.bill_exchange.total) <= parseFloat(this.mexchange_document.balance)) {
  //   this.AddBillExchange();
  // }else{
  //   Swal.fire({ icon: 'warning', text: 'El monto ingresado supera al saldo', timer: 2000,});
  // }
}

function ListCharges() {
  let me = this;
  let url = this.url_base + "charge/list-by-client/"+this.settlement_collection.id_client;
  axios({
    method: "GET",
    url: url,
    headers: {token: me.token, module: me.module, role: me.role,},
    
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.charges = response.data.result;
      } else {
        me.charges = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}


function AddPayment(index) {

  if (parseFloat(this.charges[index].balance) < parseFloat(this.charges[index].amount)) {
    Swal.fire({ icon: 'error', text: 'El monto ingresado es superior al saldo del pago', timer: 2000,})
    return false;
  }

  if (parseFloat(this.msettlement_collection.balance) < parseFloat(this.charges[index].amount_final)) {
    Swal.fire({ icon: 'error', text: 'El monto ingresado es superior al saldo del pago', timer: 2000,})
    return false;
  }

 let data = {
   id_charge :this.charges[index].id_charge,
   broadcast_date :this.charges[index].broadcast_date,
   document :this.charges[index].document,
   coin :this.charges[index].coin,
   exchange_rate : parseFloat(this.charges[index].exchange_rate).toFixed(2),
   amount : parseFloat(this.charges[index].amount).toFixed(2),
   amount_final : parseFloat(this.charges[index].amount_final).toFixed(2),
 };

 this.mLoadAddCharge(data);

}



</script>
