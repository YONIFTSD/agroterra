<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Registro de Pagos - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProviders" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Medio de Pago :">
                    <b-form-select v-model="payment.payment_method" :options="payment_method"></b-form-select>
                    <small v-if="errors.payment_method" class="form-text text-danger" >Seleccione un metodo</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Documento :">
                    <b-form-input v-model="payment.document"></b-form-input>
                    <small v-if="errors.document" class="form-text text-danger" >Ingrese un documento</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="payment.broadcast_date" ></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Nro Operación :">
                    <b-form-input type="text"  v-model="payment.number_op"></b-form-input>
                    <small v-if="errors.number_op"  class="form-text text-danger" >Ingrese una nro de operación</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Banco :">
                    <b-form-input  type="text" v-model="payment.bank"></b-form-input>
                    <small v-if="errors.bank" class="form-text text-danger">Ingrese un banco</small>
                  </b-form-group>
                </b-col>


                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="payment.coin" :options="coins" ></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Observación:">
                    <b-form-input v-model="payment.observation" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="total:">
                    <b-form-input type="number" class="text-right" step="any" v-model="payment.total" ></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control" variant="primary" >GUARDAR</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalProviders />
  </div>
</template>

<script>

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");

import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
// components
import ModalProviders from './../components/ModalProvider'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalProviders,
  },
   props: ["id_payment"],
  data() {
    return {
      module: 'Payment',
      role: 2,
      payment: {
          id_payment:'',
          id_provider:'',
          id_user:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          payment_method:'008',
          document:'',
          coin:'PEN',
          bank:'',
          number_op:'',
          observation:'',
          total: (0).toFixed(2),
          applied:(0).toFixed(2),
          balance:(0).toFixed(2),
          state:1,
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
      providers: [],
      provider:null,
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      //errors
      errors: {
        id_provider: false,
        payment_method: false,
        bank: false,
        number_op: false,
        broadcast_date: false,
        coin: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewCharge();
  },
  methods: {
    ViewCharge,
    SearchProviders,
    modalProviders,
    EditPayment,
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


function SearchProviders(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.providers = response.data;
            loading(false);
      })
    }
}


function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}

function ViewCharge() {
  let me = this;
  let id_payment = je.decrypt(this.id_payment);
  let url = me.url_base + "payment/view/"+id_payment;
  axios({
    method: "GET",
    url: url,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.payment.id_payment = response.data.result.id_payment;
          me.payment.id_provider = response.data.result.id_provider;
          me.payment.id_user = response.data.result.id_user;
          me.payment.broadcast_date = response.data.result.broadcast_date;
          me.payment.payment_method = response.data.result.payment_method;
          me.payment.document = response.data.result.document;
          me.payment.coin = response.data.result.coin;
          me.payment.bank = response.data.result.bank;
          me.payment.number_op = response.data.result.number_op;
          me.payment.observation = response.data.result.observation;
          me.payment.total = response.data.result.total;
          me.payment.applied = response.data.result.applied;
          me.payment.balance = response.data.result.balance;
          me.payment.state = response.data.result.state;
          me.provider = {id: response.data.result.id_provider, name: response.data.result.name + " - "+ response.data.result.document_number};
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}
function EditPayment(me) {

  me.payment.id_user = me.user.id_user;
  me.payment.id_establishment = me.id_establishment;
  me.payment.id_provider = me.provider.id;
  let url = me.url_base + "payment/edit";
  let data = me.payment;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado el pago', timer: 3000,})
      }else if(response.data.status == 400){
        Swal.fire({ icon: 'warning', text: response.data.message , timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

 
  this.errors.id_provider = this.provider == null ? true : false;
  this.errors.payment_method = this.payment.payment_method.length == 0 ? true : false;
  if (this.payment.payment_method != "008") {
    this.errors.number_op = this.payment.number_op.length  == 0 ? true : false;
    this.errors.bank = this.payment.bank.length == 0 ? true : false;
  }
  this.errors.broadcast_date = this.payment.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.payment.coin.length == 0 ? true : false;
  this.errors.total = parseFloat(this.payment.total) <= 0 ? true : false;
  
  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.payment_method == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number_op == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.bank == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

 let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar el pago ?',
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
