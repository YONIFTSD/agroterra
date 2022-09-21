<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Gastos de Compra - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <v-select disabled placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select disabled v-model="purchase_expenses.type_invoice" :options="type_invoice"></b-form-select>
                    <small v-if="errors.type_invoice" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input disabled type="text" ref="serie" @change="UpperCase" v-model="purchase_expenses.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input disabled class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="purchase_expenses.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input disabled class="text-center" type="date"  ref="broadcast_date" @change="GetExchangeRateByDate" v-model="purchase_expenses.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Forma de Pago :">
                    <b-form-select disabled v-model="purchase_expenses.way_to_pay" :options="way_to_pay"></b-form-select>
                    <small v-if="errors.way_to_pay" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select disabled ref="coin" @change="GetExchangeRateByDate" v-model="purchase_expenses.coin" :options="coin"></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger" >Selccione un tipo de moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label for="">Tipo de Cambio : </label>
                    <b-form-input disabled type="text" readonly ref="exchange_rate" v-model="purchase_expenses.exchange_rate"></b-form-input>
                    <small v-if="errors.exchange_rate" class="form-text text-danger" >Selccione un tipo de moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Detracción:">
                    <b-form-select disabled ref="detraction" v-model="purchase_expenses.detraction" :options="detraction"></b-form-select>
                    <small v-if="errors.detraction" class="form-text text-danger" >Selccione una opción</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Costo ?:">
                    <b-form-select disabled ref="cost" v-model="purchase_expenses.cost" :options="cost"></b-form-select>
                    <small v-if="errors.cost" class="form-text text-danger" >Selccione una opción</small>
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Observación:">
                    <b-form-input disabled type="text" v-model="purchase_expenses.observation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="8"></b-col>
                <b-col md="4">
                  <b-form-group  label-cols-sm="7" label="Gravado :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" disabled step="any" v-model="purchase_expenses.taxed"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="No Gravado :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" disabled step="any" v-model="purchase_expenses.not_taxed"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="Subtotal :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" disabled v-model="purchase_expenses.subtotal"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="Igv (18%) :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" disabled v-model="purchase_expenses.igv"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="Total :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" disabled v-model="purchase_expenses.total"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/gastos-compra/listar' }" append >Regresar</b-link>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalProviders />
    <ModalExchangeRate />
    <LoadingComponent :is-visible="isLoading"/>
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
import ModalProviders from '@/views/components/ModalProvider'
import ModalExchangeRate from '@/views/components/ModalExchangeRate'
import LoadingComponent from './../pages/Loading'

export default {
  name: "IncomeEdit",
  props: ["id_purchase_expenses"],
  components:{
      vSelect,
      ModalProviders,
      ModalExchangeRate,
      LoadingComponent,
  },
  data() {
    return {
      isLoading:false,
      module: 'PurchaseExpenses',
      role: 5,
      purchase_expenses: {
          id_purchase_expenses:'',
          id_provider:'',
          id_user:'',
          linkages:'',
          type_invoice:'01',
          serie:'',
          number:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          coin:'PEN',
          exchange_rate:(0).toFixed(2),
          way_to_pay:'01-008',
          payment_type:'',
          payment_method:'',
          payment_deadline:'',
          detraction:'',
          cost:'',
          observation:'',
          taxed:(0).toFixed(2),
          not_taxed:(0).toFixed(2),
          subtotal:(0).toFixed(2),
          igv:(0).toFixed(2),
          total:(0).toFixed(2),
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
        {value: "RH", text : "Recibo por Honorarios"},
        {value: "00", text : "Otros"},
      ],

      coin:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],

      way_to_pay:[
        {value:"01-008",text:'Contado - Efectivo'},
        {value:"01-009",text:'Contado - Efectivo en los demás casos'},
        {value:"01-001",text:'Contado - Depósito en cuenta'},
        {value:"01-002",text:'Contado - Giro'},
        {value:"01-003",text:'Contado - Transferencia de fondos'},
        {value:"01-004",text:'Contado - Orden de pago'},
        {value:"01-005",text:'Contado - Tarjeta de Débito'},
        {value:"03-7",text:'Crédito - 7 dias'},
        {value:"03-15",text:'Crédito - 15 dias'},
        {value:"03-30",text:'Crédito - 30 dias'},
        {value:"03-45",text:'Crédito - 45 dias'},
        {value:"03-60",text:'Crédito - 60 dias'},
        {value:"03-75",text:'Crédito - 75 dias'},
        {value:"03-90",text:'Crédito - 90 dias'},
      ],

      detraction: [
        { value: '',text:'Seleccione una opción'},
        { value: '1',text:'SI'},
        { value: '0',text:'NO'},
      ],

      cost: [
        { value: '',text:'Seleccione una opción'},
        { value: '1',text:'SI'},
        { value: '0',text:'NO'},
      ],

      //errors
      errors: {
        id_provider: false,
        voucher_type: false,
        serie: false,
        number: false,
        broadcast_date: false,
        coin: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    EventBus.$on('RefreshGetExchangeRateByDate', () => {
      this.GetExchangeRateByDate();
    });
    this.ViewPurchaseExpenses();
  },
  methods: {

    NumberPadStart,
    UpperCase,
    ShowModalProvider,
    modalExachangeRate,
    SearchProvider,
    ChangeAmount,
    GetExchangeRateByDate,
    ViewPurchaseExpenses,
    EditPurchaseExpenses,
    Validate,
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};

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
  var number = String(this.purchase_expenses.number);
  number = number.padStart(8,"0");
  this.purchase_expenses.number = number;
}
function UpperCase() {
    this.purchase_expenses.serie = this.purchase_expenses.serie.toUpperCase();
}

function ShowModalProvider() {
  EventBus.$emit('ModalProvidersShow');
}

function modalExachangeRate() {
  let data = {
    date : this.purchase_expenses.broadcast_date
  }
  EventBus.$emit('ModalExchangeRateShow',data);
}
//ver usuario
function ViewPurchaseExpenses() {
  let id_purchase_expenses = je.decrypt(this.id_purchase_expenses);
  let me = this;
  let url = this.url_base + "purchase-expenses/view/" + id_purchase_expenses;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        if (response.data.result.payment_type == "01") {
          me.purchase_expenses.way_to_pay = response.data.result.payment_type +"-"+response.data.result.payment_method;
        }
        if (response.data.result.payment_type == "03") {
          me.purchase_expenses.way_to_pay = response.data.result.payment_type +"-"+response.data.result.payment_deadline;
        }
        me.provider = {id: response.data.result.id_provider, name: response.data.result.name + " - " + response.data.result.document_number};

        me.purchase_expenses.id_purchase_expenses = response.data.result.id_purchase_expenses;
        me.purchase_expenses.id_provider = response.data.result.id_provider;
        me.purchase_expenses.id_user = response.data.result.id_user;
        me.purchase_expenses.id_establishment = response.data.result.id_establishment;
        me.purchase_expenses.linkages = response.data.result.linkages;
        me.purchase_expenses.type_invoice = response.data.result.type_invoice;
        me.purchase_expenses.serie = response.data.result.serie;
        me.purchase_expenses.number = response.data.result.number;
        me.purchase_expenses.broadcast_date = response.data.result.broadcast_date;
        me.purchase_expenses.coin = response.data.result.coin;
        me.purchase_expenses.exchange_rate = response.data.result.exchange_rate;
        me.purchase_expenses.payment_type = response.data.result.payment_type;
        me.purchase_expenses.payment_method = response.data.result.payment_method;
        me.purchase_expenses.payment_deadline = response.data.result.payment_deadline;
        me.purchase_expenses.detraction = response.data.result.detraction;
        me.purchase_expenses.cost = response.data.result.cost;
        me.purchase_expenses.observation = response.data.result.observation;
        me.purchase_expenses.taxed = response.data.result.taxed;
        me.purchase_expenses.not_taxed = response.data.result.not_taxed;
        me.purchase_expenses.subtotal = response.data.result.subtotal;
        me.purchase_expenses.igv = response.data.result.igv;
        me.purchase_expenses.total = response.data.result.total;
        me.purchase_expenses.state = response.data.result.state;
      }else{
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire("Sistema", "A Ocurrido un error", "error");
      me.isLoading = false;
    });
}

//editar usuario
function EditPurchaseExpenses(_this) {
 

  let me = _this;
  let url = me.url_base + "purchase-expenses/edit";
  me.purchase_expenses.id_provider = me.provider.id;
  let data = me.purchase_expenses;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token,  module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado el gasto de la compra correctamente', timer: 3000,})
      } else if(response.data.status == 400) {
        Swal.fire({ icon: 'warning', text: 'El comprobante ya fue registrado previamente', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//validacion de formulario
function Validate() {

  this.errors.id_provider = this.provider == null ? true : false;
  this.errors.type_invoice = this.purchase_expenses.type_invoice.length == 0 ? true : false;
  this.errors.serie = this.purchase_expenses.serie.length != 4 ? true : false;
  this.errors.number = this.purchase_expenses.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.purchase_expenses.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.purchase_expenses.coin.length == 0 ? true : false;
  this.errors.exchange_rate = this.purchase_expenses.exchange_rate.length == 0 ? true : false;
  this.errors.way_to_pay = this.purchase_expenses.way_to_pay.length == 0 ? true : false;
  this.errors.detraction = this.purchase_expenses.detraction.length == 0 ? true : false;
  this.errors.cost = this.purchase_expenses.cost.length == 0 ? true : false;
  this.errors.total = parseFloat(this.purchase_expenses.total) == 0 ? true : false;

  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.exchange_rate == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.detraction == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.cost == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  
  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar el gasto de compra ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditPurchaseExpenses(me);
    }
  })
  
}

function ChangeAmount(type) {
  if (type == 1) {
    this.purchase_expenses.taxed = parseFloat(this.purchase_expenses.taxed);
    this.purchase_expenses.not_taxed = parseFloat(0);
    this.purchase_expenses.subtotal = parseFloat(this.purchase_expenses.taxed) / 1.18;;
    this.purchase_expenses.igv = parseFloat(this.purchase_expenses.taxed) - parseFloat(this.purchase_expenses.subtotal);
    this.purchase_expenses.total = parseFloat(this.purchase_expenses.taxed);
  } else {
    this.purchase_expenses.taxed = parseFloat(0);
    this.purchase_expenses.not_taxed = parseFloat(this.purchase_expenses.not_taxed);
    this.purchase_expenses.subtotal = parseFloat(this.purchase_expenses.not_taxed);;
    this.purchase_expenses.igv = parseFloat(this.purchase_expenses.not_taxed) * 0.18;
    this.purchase_expenses.total = parseFloat(this.purchase_expenses.not_taxed) + parseFloat(this.purchase_expenses.igv);
  }

  this.purchase_expenses.taxed = this.purchase_expenses.taxed.toFixed(2);
  this.purchase_expenses.not_taxed = this.purchase_expenses.not_taxed.toFixed(2);
  this.purchase_expenses.subtotal = this.purchase_expenses.subtotal.toFixed(2);
  this.purchase_expenses.igv = this.purchase_expenses.igv.toFixed(2);
  this.purchase_expenses.total = this.purchase_expenses.total.toFixed(2);
}

function GetExchangeRateByDate() {
  let me = this;
  let url = this.url_base + "exchange-rate/get-by-date";
  let data = {
    coin: this.purchase_expenses.coin,
    date: this.purchase_expenses.broadcast_date,
  }
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module,role: this.role},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.purchase_expenses.exchange_rate = response.data.result.shopping;
      } else {
        me.purchase_expenses.exchange_rate = '';
        me.modalExachangeRate();
      }
    })
}
</script>
