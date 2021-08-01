<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cuentas por Pagar - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="modalProvider" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Seleccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select v-model="account_pay.type_invoice" :options="type_invoice"></b-form-select>
                    <small v-if="errors.type_invoice" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" @change="UpperCase" v-model="account_pay.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="account_pay.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="account_pay.broadcast_date" ></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha Vencimiento:">
                    <b-form-input type="date" ref="expiration_date" v-model="account_pay.expiration_date" ></b-form-input>
                    <small v-if="errors.expiration_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="account_pay.coin" :options="coins" ></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Observación:">
                    <b-form-input v-model="account_pay.reason" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="total:">
                    <b-form-input type="number" @change="ChangeTotal" class="text-right" step="any" v-model="account_pay.total" ></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>
                </b-col>

           


        

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button type="submit" class="form-control" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalProviders />
    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
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
import LoadingComponent from './../pages/Loading'
export default {
  name: "UsuarioAdd",
  props: ["id_account_pay"],
  components:{
      vSelect,
      ModalProviders,
      Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'AccountReceivable',
      role: 3,
      account_pay: {
          id_account_pay:'',
          id_sale:'',
          id_provider:'',
          id_establishment:'',
          id_user:'',
          type_invoice:'01',
          serie:'',
          number:'',
          coin:'PEN',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          expiration_date:moment(new Date()).local().format("YYYY-MM-DD"),
          reason:'',
          total: (0).toFixed(2),
          fee:'',
          balance:'',
          state:1,
      },

      providers: [],
      provider:null,

      type_invoice:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "04", text : "Liquidación de compra"},
        {value: "07", text : "Nota de crédito"},
        {value: "08", text : "Nota de débito"},
        {value: "09", text : "Guía de remisión - Remitente"},
        {value: "12", text : "Ticket o cinta emitido por máquina registradora"},
        {value: "22", text : "Comprobante por Operaciones No Habituales"},
        {value: "31", text : "Guía de Remisión - Transportista"},
        {value: "50", text : "Declaración Única de Aduanas - Importación definitiva"},
        {value: "52", text : "Despacho Simplificado - Importación Simplificada"},
        {value: "91", text : "Comprobante de No Domiciliado"},
        {value: "NE", text : "Nota de Entrada"},
        {value: "00", text : "Otros"},
      ],

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],

      //errors
      errors: {
        id_provider: false,
        type_invoice: false,
        serie: false,
        number: false,
        broadcast_date: false,
        expiration_date: false,
        coin: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewAccountReceivable();
  },
  methods: {
    ViewAccountReceivable,
    SearchProvider,
    modalProvider,
    NumberPadStart,
    UpperCase,
    ChangeTotal,

    EditAccountPay,
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


function ViewAccountReceivable() {

  let id_account_pay = je.decrypt(this.id_account_pay);
  let me = this;
  let url = this.url_base + "account-pay/view/" + id_account_pay;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {

          me.provider = {id: response.data.result.id_provider, name : response.data.result.name+' - '+response.data.result.document_number };
          me.account_pay.id_account_pay = response.data.result.id_account_pay;
          me.account_pay.id_sale = response.data.result.id_sale;
          me.account_pay.id_provider = response.data.result.id_provider;
          me.account_pay.provider = response.data.result.name+' - '+response.data.result.document_number;
          me.account_pay.id_establishment = response.data.result.id_establishment;
          me.account_pay.id_user = response.data.result.id_user;
          me.account_pay.type_invoice = response.data.result.type_invoice;
          me.account_pay.serie = response.data.result.serie;
          me.account_pay.number = response.data.result.number;
          me.account_pay.coin = response.data.result.coin;
          me.account_pay.broadcast_date = response.data.result.broadcast_date;
          me.account_pay.expiration_date = response.data.result.expiration_date;
          me.account_pay.reason = response.data.result.reason;
          me.account_pay.total = response.data.result.total;
          me.account_pay.fee = response.data.result.fee;
          me.account_pay.balance = response.data.result.balance;
          me.account_pay.state = response.data.result.state;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function ChangeTotal() {
  this.account_pay.total = parseFloat(this.account_pay.total);
  this.account_pay.total = this.account_pay.total.toFixed(2);
}

function SearchProvider(search, loading) {
  
   let me = this;
  let url = this.url_base + "search-providers/" + search;
  if (search !== "") {
    loading(true);
    axios({
      method: "GET",
      url: url,
    }).then(function (response) {
          me.providers = response.data.result;
          loading(false);
    })
  }
}

function NumberPadStart() {
  var number = String(this.account_pay.number);
  number = number.padStart(8,"0");
  this.account_pay.number = number;
}
function UpperCase() {
  this.account_pay.serie = this.account_pay.serie.toUpperCase();
}

function modalProvider() {
  EventBus.$emit('ModalProvidersShow');
}

function EditAccountPay(me) {
  me.isLoading = true;
  me.account_pay.id_user = me.user.id_user;
  me.account_pay.id_establishment = me.id_establishment;
  me.account_pay.balance = me.account_pay.total;
  me.account_pay.id_provider = me.provider.id;
  let url = me.url_base + "account-pay/edit";
  let data = me.account_pay;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
          Swal.fire({ icon: 'success', text: 'Se ha modificado la cuenta por pagar', timer: 3000,})
      } else if(response.data.status == 400) {
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function Validate() {

 
  this.errors.id_provider = this.provider == null ? true : false;
  this.errors.type_invoice = this.account_pay.type_invoice.length == 0 ? true : false;
  this.errors.serie = this.account_pay.serie.length != 4 ? true : false;
  this.errors.number = this.account_pay.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.account_pay.broadcast_date.length == 0 ? true : false;
  this.errors.expiration_date = this.account_pay.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.account_pay.coin.length == 0 ? true : false;
  this.errors.total = parseFloat(this.account_pay.total) <= 0 ? true : false;
  

  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.voucher_type == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.expiration_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

 let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar la cuenta por pagar?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditAccountPay(me);
    }
  })


}
</script>
