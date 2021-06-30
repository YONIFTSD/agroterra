<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Comprobante - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="4">
                  <b-form-group>
                    <label class="control-label">Comprobante: </label>
                    <b-form-input class="text-center" readonly :value="CodeInvoice(payment.voucher_type) + ' '+payment.serie  + ' - '+ payment.number"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group>
                    <label class="control-label">Fecha Emision: </label>
                    <b-form-input class="text-center" readonly v-model="payment.broadcast_date" type="date"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group>
                    <label class="control-label">Forma de Pago: </label>
                    <b-form-select v-model="payment.way_to_pay" :options="way_to_pay"></b-form-select>
                    <small v-if="errors.way_to_pay" class="form-text text-danger" >Seleccione ua forma de pago</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label class="control-label">Moneda: </label>
                    <b-form-select v-model="payment.coin" :options="coins"></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger" >Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                 <b-col md="5">
                  <b-form-group>
                    <label class="control-label">Cliente: </label>
                    <input class="form-control" :value="payment.client" readonly />
                  </b-form-group>
                </b-col>

                <b-col md="7">
                  <b-form-group>
                    <label class="control-label">Observación: </label>
                    <b-form-input v-model="payment.observation" type="text"></b-form-input>                    
                  </b-form-group>
                </b-col>


                <b-col md="12">
                    <div class="table-responsive mt-3">
                      <table class="table table-striped table-hover table-bordered table-lg mt-lg mb-0">
                        <thead>
                          <tr>
                            <th width="5%" class="text-center">#</th>
                            <th width="10%" class="text-center">Codigo</th>
                            <th width="52%" class="text-center">Nombre</th>
                            <th width="7%" class="text-center">Cantidad</th>
                            <th width="10%" class="text-center">P. Unit</th>
                            <th width="10%" class="text-center">P. Total</th>
                          </tr>
                        </thead>
                        <tbody v-for="(item, index) in payment.payment_detail" :key="index">
                          <tr>
                              <td class="text-center">{{ index + 1 }}</td>
                              <td class="text-left">{{ item.code }}</td>
                              <td class="text-left">{{ item.name }}</td>
                              <td class="text-center">{{ item.quantity }}</td>
                              <td class="text-right">{{ item.unit_price }}</td>
                              <td class="text-right">{{ item.total_price }}</td>
                          </tr>
                              
                        </tbody>
                      </table>
                    </div>
                </b-col>
          
<!-- {{room_control_detail}} -->


                <b-col class="mt-4" md="12">

                </b-col>


                <b-col md="12">

                    <b-row>

                      <b-col md="12">
                        <b-form-group>
                          <b-form-input readonly v-model="payment.number_to_letters" type="text"></b-form-input>
                        </b-form-group>
                     </b-col>

                    </b-row>


                    
             
                </b-col>

                <b-col md="4"> </b-col>

                <b-col md="4">
                  
                  <b-form-group label-cols-sm="6"  label="Ope. Gravadas :" class="text-right">
                    <b-form-input type="number" step="any" class="text-right" v-model="payment.taxed_operation" readonly ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-sm="6"  label="Ope. Inafectas :" class="text-right">
                    <b-form-input type="number" step="any" class="text-right" v-model="payment.exonerated_operation" readonly ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-sm="6"  label="Ope. Exoneradas :" class="text-right">
                    <b-form-input type="number" step="any" class="text-right" v-model="payment.unaffected_operation" readonly ></b-form-input>
                  </b-form-group>


                </b-col>


                <b-col md="4">
                  
                  <b-form-group label-cols-sm="6"  label="Subtotal :" class="text-right">
                    <b-form-input type="number" step="any" class="text-right" v-model="payment.subtotal" readonly ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-sm="6"  label="Igv (18%) :" class="text-right">
                    <b-form-input type="number" step="any" class="text-right" v-model="payment.igv" readonly ></b-form-input>
                  </b-form-group>

                  <b-form-group label-cols-sm="6"  label="Total :" class="text-right">
                    <b-form-input type="number" step="any" class="text-right" v-model="payment.total" readonly ></b-form-input>
                  </b-form-group>

                </b-col>

                

                <b-col md="4"></b-col>
                <b-col md="4">
                  <b-button type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button>
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
  props: ["id_payment"],
  components:{

  },
  data() {
    return {
      module: 'Payment',
      role: 3,

      
      payment: {

      way_to_pay:'', 

      id_payment:'',
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
      payment_deadline:'',
      observation:'',
      modified_voucher_type:'',
      modified_serie:'',
      modified_number:'',
      modified_broadcast_date:'',
      modified_reason:'',
      modified_support:'',
      sunat_message:'',
      hash_cpe:'',
      hash_cdr:'',
      taxed_operation:'',
      exonerated_operation:'',
      unaffected_operation:'',
      discount:'',
      subtotal:'',
      igv:'',
      total:'',
      number_to_letters:'',
      cash_payment:'',
      card_payment:'',
      web_way_payment:'',
      state:'',
      registration_date:'',

      payment_detail: [],

      },

      


      way_to_pay:[
          {value:'01-008',text:'Contado - Efectivo'},
          {value:'01-001',text:'Contado - Depósito en Cuenta'},
          {value:'01-002',text:'Contado - Giro'},
          {value:'01-003',text:'Contado - Transferencia de Fondos'},
          {value:'01-004',text:'Contado - Orden de Pago'},
          {value:'01-005',text:'Contado - Tarjeta de Débito'},
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
    this.ViewPayment();
 
  },
  methods: {
    TotalPrices,
    PaymentMethod,
    CodeInvoice,

    ViewPayment,

    EditPayment,
    Validate,
    ...mapActions('Shopping',['mLoadResetShoppingDetail']),
    ...mapActions('Shopping',['mLoadAddShoppingDetail']),
    ...mapActions('Shopping',['mLoadTotalsShoppingDetail']),
    
  },

  computed: {
    ...mapState('Shopping',['shopping_detail','total_shopping']),
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

function ViewPayment() {

  let id_payment = je.decrypt(this.id_payment);
  let me = this;
  let url = this.url_base + "payment/view/" + id_payment;
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
         
          me.payment.id_payment = response.data.result.payment.id_payment;
          me.payment.id_room_control = response.data.result.payment.id_room_control;
          me.payment.id_client = response.data.result.payment.id_client;
          me.payment.id_user = response.data.result.payment.id_user;
          me.payment.id_serie = response.data.result.payment.id_serie;
          me.payment.voucher_type = response.data.result.payment.voucher_type;
          me.payment.serie = response.data.result.payment.serie;
          me.payment.number = response.data.result.payment.number;
          me.payment.broadcast_date = response.data.result.payment.broadcast_date;
          me.payment.broadcast_time = response.data.result.payment.broadcast_time;
          me.payment.expiration_date = response.data.result.payment.expiration_date;
          me.payment.coin = response.data.result.payment.coin;
          me.payment.payment_type = response.data.result.payment.payment_type;
          me.payment.payment_method = response.data.result.payment.payment_method;
          me.payment.payment_deadline = response.data.result.payment.payment_deadline;
          me.payment.observation = response.data.result.payment.observation;
          me.payment.modified_voucher_type = response.data.result.payment.modified_voucher_type;
          me.payment.modified_serie = response.data.result.payment.modified_serie;
          me.payment.modified_number = response.data.result.payment.modified_number;
          me.payment.modified_broadcast_date = response.data.result.payment.modified_broadcast_date;
          me.payment.modified_reason = response.data.result.payment.modified_reason;
          me.payment.modified_support = response.data.result.payment.modified_support;
          me.payment.sunat_message = response.data.result.payment.sunat_message;
          me.payment.hash_cpe = response.data.result.payment.hash_cpe;
          me.payment.hash_cdr = response.data.result.payment.hash_cdr;
          me.payment.taxed_operation = response.data.result.payment.taxed_operation;
          me.payment.exonerated_operation = response.data.result.payment.exonerated_operation;
          me.payment.unaffected_operation = response.data.result.payment.unaffected_operation;
          me.payment.discount = response.data.result.payment.discount;
          me.payment.subtotal = response.data.result.payment.subtotal;
          me.payment.igv = response.data.result.payment.igv;
          me.payment.total = response.data.result.payment.total;
          me.payment.number_to_letters = response.data.result.payment.number_to_letters;
          me.payment.cash_payment = response.data.result.payment.cash_payment;
          me.payment.card_payment = response.data.result.payment.card_payment;
          me.payment.web_way_payment = response.data.result.payment.web_way_payment;
          me.payment.state = response.data.result.payment.state;
          me.payment.registration_date = response.data.result.payment.registration_date;
          me.payment.payment_detail = response.data.result.payment_detail;


           if (response.data.result.payment.payment_type == "01") {
            me.payment.way_to_pay = response.data.result.payment.payment_type+'-'+response.data.result.payment.payment_method;
          }
          if (response.data.result.payment.payment_type == "03") {
            me.payment.way_to_pay = response.data.result.payment.payment_type+'-'+response.data.result.payment.payment_deadline;
          }

          me.payment.client = response.data.result.payment.name + ' - '+response.data.result.payment.document_number;
          

      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
}


function TotalPrices() {
  let detail = this.room_control_detail;
  this.payment.taxed_operation = 0;
  this.payment.exonerated_operation = 0;
  this.payment.unaffected_operation = 0;
  this.payment.discount = 0;
  this.payment.subtotal = 0;
  this.payment.igv = 0;
  this.payment.total = 0;

  for (let index = 0; index < detail.length; index++) {
    if (detail[index].igv == '10') {
      this.payment.taxed_operation += parseFloat(detail[index].total_price);
    }
    if (detail[index].igv == '20') {
      this.payment.exonerated_operation += parseFloat(detail[index].total_price);
    }
    if (detail[index].igv == '30') {
      this.payment.unaffected_operation += parseFloat(detail[index].total_price);
    }
  }

this.payment.igv = this.payment.taxed_operation - (this.payment.taxed_operation / 1.18);
  this.payment.total = (this.payment.taxed_operation + this.payment.exonerated_operation + this.payment.unaffected_operation);
  this.payment.subtotal = (this.payment.total  - this.payment.igv);
  

  this.payment.taxed_operation = this.payment.taxed_operation.toFixed(2);
  this.payment.exonerated_operation = this.payment.exonerated_operation.toFixed(2);
  this.payment.unaffected_operation = this.payment.unaffected_operation.toFixed(2);
  this.payment.discount = this.payment.discount.toFixed(2);
  this.payment.subtotal = this.payment.subtotal.toFixed(2);
  this.payment.igv = this.payment.igv.toFixed(2);
  this.payment.total = this.payment.total.toFixed(2);

  this.payment.number_to_letters =  'SON: '+ converter.NumberToLetters(this.payment.total);


  this.payment.cash_payment = this.payment.total;
  this.payment.card_payment = (0).toFixed(2);
  this.payment.web_way_payment = (0).toFixed(2);

}

function PaymentMethod(type) {
  if (type == 'card') {
    let total = parseFloat(this.payment.total) - parseFloat(this.payment.card_payment);
    if (total >= 0) {
      this.payment.cash_payment = total.toFixed(2);
      this.payment.card_payment = parseFloat(this.payment.card_payment).toFixed(2);
      this.payment.web_way_payment = (0).toFixed(2);
    }else{
      this.payment.cash_payment = parseFloat(this.payment.total).toFixed(2);
      this.payment.card_payment = (0).toFixed(2);
      this.payment.web_way_payment = (0).toFixed(2);
    }
  }

  if (type == 'web') {
    let total = parseFloat(this.payment.total) - parseFloat(this.payment.web_way_payment);
    if (total >= 0) {
      this.payment.cash_payment = total.toFixed(2);
      this.payment.card_payment = (0).toFixed(2);
      this.payment.web_way_payment = parseFloat(this.payment.web_way_payment).toFixed(2);
    }else{
      this.payment.cash_payment = parseFloat(this.payment.total).toFixed(2);
      this.payment.card_payment = (0).toFixed(2);
      this.payment.web_way_payment = (0).toFixed(2);
    }
  }

  
}


function EditPayment(mthis) {

  let me = mthis;
  let url = me.url_base + "payment/edit";


  let data = me.payment;
  axios({
    method: "put",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          Swal.fire({ icon: 'success', text: 'Se ha editado el pago', timer: 2000,})
      }else if(response.data.status == 400){
          Swal.fire({ icon: 'error', text: 'No se puede editar el pago', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error',text: 'A ocurrido un error', timer: 2000})
      }
    })

}

function Validate() {

  this.errors.way_to_pay = this.payment.way_to_pay.length == 0  ? true : false;
  this.errors.coin = this.payment.coin.length == 0 ? true : false;


  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }



  
  let me = this;

  Swal.fire({
    title: 'Esta seguro de editar el registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditPayment(me);
    }
  })


}

</script>
