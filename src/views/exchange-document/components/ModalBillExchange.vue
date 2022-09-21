<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modal_bill_exchange" class="w-100" title="Letras de Cambio">
      <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
        <b-row>
          <b-col md="2">
            <b-form-group label="N° de Letra:">
              <b-form-input type="text" class="text-left" v-model="bill_exchange.letter_number"></b-form-input>
              <small v-if="errors.letter_number" class="form-text text-danger" >Ingrese una letra</small>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label="F. Emisión:">
              <b-form-input type="date" class="text-center" v-model="bill_exchange.broadcast_date"></b-form-input>
              <small v-if="errors.broadcast_date" class="form-text text-danger" >Ingrese una fecha</small>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label="F. Venc.:">
              <b-form-input type="date"  class="text-center" :min="bill_exchange.broadcast_date" v-model="bill_exchange.expiration_date"></b-form-input>
              <small v-if="errors.expiration_date" class="form-text text-danger" >Ingrese una fecha</small>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label="Moneda">
              <b-form-input disabled type="text"  class="text-center" v-model="bill_exchange.coin"></b-form-input>
              <small v-if="errors.coin" class="form-text text-danger" >Ingrese una moneda</small>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label="Total:">
              <b-form-input type="number" step="any" class="text-right" v-model="bill_exchange.total"></b-form-input>
              <small v-if="errors.total" class="form-text text-danger" >Ingrese un monto</small>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label=".">
              <b-button type="submit" class="form-control" variant="primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
            </b-form-group>
          </b-col>

        </b-row>
      </b-form>

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
                  <td class="text-left">{{ exchange_document.related_documents }}</td>
                  <td class="text-center">{{ exchange_document.coin }}</td>
                  <td class="text-right">{{ mexchange_document.total }}</td>
                  <td class="text-right">{{ mexchange_document.applied }}</td>
                  <td class="text-right">{{ mexchange_document.balance }}</td>
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
        modal_bill_exchange:false,
        module:'ExchangeDocument',
        role:0,
        exchange_document : {
          related_documents : '',
          coin : '',
        },
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
    EventBus.$on('ModalBillExchangeShow', (data) => {
      this.modal_bill_exchange = true;
      this.exchange_document.related_documents = data.related_documents;
      this.exchange_document.coin = data.coin;
      this.bill_exchange.coin = data.coin;
      this.role = data.role;
      this.ClearBillExchange();

    });

  },
  methods: {
      ClearBillExchange,
      Validate,
      AddBillExchange,
      ...mapActions('ExchangeDocument',['mLoadAddBillExchange']),
  },
  computed: {
      ...mapState('ExchangeDocument',['mexchange_document']),
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

function Validate() {

  this.errors.letter_number = this.bill_exchange.letter_number.length == 0 ? true : false;
  this.errors.broadcast_date = this.bill_exchange.broadcast_date.length == 0 ? true : false;
  this.errors.expiration_date = this.bill_exchange.expiration_date.length == 0 ? true : false;
  this.errors.coin = this.bill_exchange.coin.length == 0 ? true : false;
  this.errors.total = parseFloat(this.bill_exchange.total) <= 0 ? true : false;

  if (this.errors.letter_number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.expiration_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
   
  if (parseFloat(this.bill_exchange.total) <= parseFloat(this.mexchange_document.balance)) {
    this.AddBillExchange();
  }else{
    Swal.fire({ icon: 'warning', text: 'El monto ingresado supera al saldo', timer: 2000,});
  }

  

}

function AddBillExchange() {
 let data = {
   letter_number : this.bill_exchange.letter_number,
   broadcast_date : this.bill_exchange.broadcast_date,
   expiration_date : this.bill_exchange.expiration_date,
   coin : this.bill_exchange.coin,
   total : parseFloat(this.bill_exchange.total).toFixed(2),
 };
 this.mLoadAddBillExchange(data);
 this.ClearBillExchange();

}

function ClearBillExchange() {
  this.bill_exchange.letter_number = '';
  this.bill_exchange.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
  this.bill_exchange.expiration_date = '';
  this.bill_exchange.coin = this.exchange_document.coin;
  this.bill_exchange.total = this.mexchange_document.balance;
}

</script>
