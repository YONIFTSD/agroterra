<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalBillExchange" class="w-100" title="Letras de cambio">
      <b-form id="Form" @submit.prevent="Validate">
        <b-row>
          <b-col md="2">
            <b-form-group label="Nro Letra :">
              <b-form-input disabled type="text" v-model="bill_exchange.letter_number"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Fecha Emision :">
              <b-form-input disabled class="text-center" type="date" v-model="bill_exchange.broadcast_date"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Fecha Venc. :">
              <b-form-input disabled class="text-center" type="date" v-model="bill_exchange.expiration_date"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Moneda :">
              <b-form-select disabled v-model="bill_exchange.coin" :options="coin"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Total :">
              <b-form-input disabled class="text-right" v-model="bill_exchange.total"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="2">
            <b-form-group label="Deuda :">
              <b-form-input disabled class="text-right" v-model="bill_exchange.balance"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>

    </b-modal>
    <LoadingComponent :is-visible="isLoading"/>
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
import LoadingComponent from './../../pages/Loading'
export default {
  name: "ModalsProduct",
  components:{
    LoadingComponent,
  },
  data() {
    return {
      isLoading:false,
        modalBillExchange:false,
        module:'AccountPay',
        role:3,
        id_bill_exchnge:0,
        bill_exchange:{
          id_bill_exchange_ar:'',
          letter_number:'',
          broadcast_date:'',
          expiration_date:'',
          payment_method:'008',
          number_op:'',
          bank:'',
          observation:'',
          balance:0,
          applied:0,
          total:0,
          state:'1',
        },
        coin:[
          {value:'PEN',text:'PEN'},
          {value:'USD',text:'USD'},
        ]
  
     
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalBillExchangeShow', (id_bill_exchnge) => {
      this.modalBillExchange = true;
      this.id_bill_exchnge = id_bill_exchnge;
      this.ViewBillExchange();
    });
  },
  methods: {
      ViewBillExchange,
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

function ViewBillExchange() {
    let me = this;
    let url = me.url_base + "bill-exchange/view/"+me.id_bill_exchnge;
    me.isLoading = true;
    axios({
      method: "GET",
      url:url,
      headers: { token: me.token, module: me.module, role: me.role },
    })
    .then(function (response) {
      if (response.data.status == 200) {
        me.bill_exchange.letter_number = response.data.result.letter_number;
        me.bill_exchange.broadcast_date = response.data.result.broadcast_date;
        me.bill_exchange.expiration_date = response.data.result.expiration_date;
        me.bill_exchange.coin = response.data.result.coin;
        me.bill_exchange.total = response.data.result.total;
        me.bill_exchange.balance = response.data.result.balance;
      }
      me.isLoading = false;
    })
    .catch((error) => {
      console.log(error);
      me.isLoading = false;
    });
}
</script>
