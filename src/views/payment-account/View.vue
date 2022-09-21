<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Abono - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off">
              <b-row>

                <b-col md="3">
                  <b-form-group>
                    <label class="control-label">Comprobante: </label>
                    <b-form-input class="text-center" disabled :value="CodeInvoice(payment_account.voucher_type) + ' '+payment_account.serie  + ' - '+ payment_account.number"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label class="control-label">Fecha Emision: </label>
                    <b-form-input class="text-center" disabled v-model="payment_account.broadcast_date" type="date"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col sm="6" md="2">
                  <b-form-group>
                    <label class="control-label">Forma de Pago: </label>
                    <b-form-select v-model="payment_account.payment_type" :options="payment_type"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="3">
                  <b-form-group>
                    <label class="control-label">Referencia: </label>
                    <b-form-input v-model="payment_account.reference" type="text"></b-form-input>                    
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label class="control-label">Moneda: </label>
                    <b-form-select v-model="payment_account.coin" disabled :options="coins"></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger" >Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                 <b-col md="5">
                  <b-form-group>
                    <label class="control-label">Cliente: </label>
                    <input class="form-control" disabled :value="payment_account.client" />
                  </b-form-group>
                </b-col>

                <b-col md="5">
                  <b-form-group>
                    <label class="control-label">Observación: </label>
                    <b-form-input disabled v-model="payment_account.observation" type="text"></b-form-input>                    
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label class="control-label">Total: </label>
                    <b-form-input disabled v-model="payment_account.total" type="text" class="text-right"></b-form-input>                    
                  </b-form-group>
                </b-col>



               <b-col class="mt-4" md="12"></b-col>

          

              


                <b-col md="3"></b-col>
                <b-col md="3">
                 <b-button class="btn btn-info form-control" @click="DataPayment(payment_account.id_payment_account)">IMPRIMIR</b-button>
                </b-col>
                <b-col md="3">
                  <b-link  class="btn form-control btn-primary" :to="{ path: '/pago-a-cuenta/listar' }" append >REGRESAR</b-link>
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
///import vue select
// import vSelect from "vue-select";
// import 'vue-select/dist/vue-select.css';
// import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");

import CodeToName from "@/assets/js/CodeToName";
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import converter from "@/assets/js/NumberToLetters";

export default {
  name: "PaymentEdit",
  props: ["id_payment_account"],
  components:{

  },
  data() {
    return {
      module: 'PaymentAccount',
      role: 5,

      
      payment_account: {

      way_to_pay:'', 

      id_payment_account:'',
      id_room_control:'',
      id_client:'',
      id_user:'',
      id_serie:'',
      voucher_type:'',
      serie:'',
      number:'',
      broadcast_date:'',
      broadcast_time:'',
      expiration_date:'',
      coin:'',
      payment_type:'',
      payment_method:'',
      observation:'',

      total:'',
      number_to_letters:'',
      cash_payment:'',
      card_payment:'',

      state:'',
      registration_date:'',


      },

      


      payment_type:[
            {value:'01-001',text:'Contado - Efectivo'},
            {value:'01-002',text:'Contado - Visa'},
            {value:'01-003',text:'Contado - Mastercard'},
            {value:'01-004',text:'Contado - American Express'},
            {value:'01-005',text:'Contado - Transferencia de Fondos'},
            {value:'01-006',text:'Contado - Deposito en Cuenta'},
            // {value:'03-7',text:'Credito - 7 Dias'},
            // {value:'03-15',text:'Credito - 15 Dias'},
            // {value:'03-30',text:'Credito - 30 Dias'},
            // {value:'03-45',text:'Credito - 45 Dias'},
            // {value:'03-60',text:'Credito - 60 Dias'},
            // {value:'03-75',text:'Credito - 75 Dias'},
        ],
      coins:[
        {value: 'PEN', text:'PEN'},
        {value: 'USD', text:'USD'},
        {value: 'CLP', text:'CLP'},
      ],

      //errors
      errors: {
        way_to_pay: false,
        coin:false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewPaymentAccount();
 
  },
  methods: {
    CodeInvoice,
    ViewPaymentAccount,

    DataPayment,
    Print,
  
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

function ViewPaymentAccount() {

  let id_payment_account = je.decrypt(this.id_payment_account);
  let me = this;
  let url = this.url_base + "payment-account/view/" + id_payment_account;
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
         
          me.payment_account.id_payment_account = response.data.result.id_payment_account;
          me.payment_account.id_room_control = response.data.result.id_room_control;
          me.payment_account.id_client = response.data.result.id_client;
          me.payment_account.id_user = response.data.result.id_user;
          me.payment_account.id_serie = response.data.result.id_serie;
          me.payment_account.voucher_type = response.data.result.voucher_type;
          me.payment_account.serie = response.data.result.serie;
          me.payment_account.number = response.data.result.number;
          me.payment_account.broadcast_date = response.data.result.broadcast_date;
          me.payment_account.broadcast_time = response.data.result.broadcast_time;
          
          me.payment_account.coin = response.data.result.coin;
          me.payment_account.payment_type = response.data.result.payment_type;
          me.payment_account.payment_method = response.data.result.payment_method;
          
          me.payment_account.observation = response.data.result.observation;

          me.payment_account.total = response.data.result.total;
          me.payment_account.number_to_letters = response.data.result.number_to_letters;
          me.payment_account.cash_payment = response.data.result.cash_payment;
          me.payment_account.card_payment = response.data.result.card_payment;
        
          me.payment_account.state = response.data.result.state;
          me.payment_account.registration_date = response.data.result.registration_date;
          me.payment_account.payment_detail = response.data.result.payment_detail;


           if (response.data.result.payment_type == "01") {
            me.payment_account.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_method;
          }
          if (response.data.result.payment_type == "03") {
            me.payment_account.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_deadline;
          }

          me.payment_account.client = response.data.result.name + ' - '+response.data.result.document_number;
          

      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
}


function DataPayment(id_payment_account) {

 

  let me = this;
  let url = this.url_base + "payment-account/data-print/"+id_payment_account;
  axios({
    method: "GET",
    url: url,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let data = {
          business : response.data.business,
          payment : response.data.payment,
          payment_detail : response.data.payment_detail,
        }
        me.Print(data);
      }else{
          Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}



function Print(payment_account) {

  // let me = this;
  let url = 'http://localhost/print/consumirapi.php';
  var data = new FormData(); 
  data.append("business",JSON.stringify(payment_account.business)); 
  data.append("payment",JSON.stringify(payment_account.payment)); 
  data.append("payment_detail",JSON.stringify(payment_account.payment_detail));  


  axios({
    method: "POST",
    url: url,
    data:data,
    headers: {
      "Content-Type": "application/json",
      "Accept":"*/*",
    },
  })
    .then(function (response) {
     
    })
    .catch((error) => {
      console.log(error);
      // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


</script>
