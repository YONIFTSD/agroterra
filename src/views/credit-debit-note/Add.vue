<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Nota de Crédito/Débito - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>
               
                
                

                <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select @change="ChangeReason" v-model="credit_debit.type_invoice" :options="type_invoice"></b-form-select>
                    <small v-if="errors.type_invoice" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" @change="UpperCase" v-model="credit_debit.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="credit_debit.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date"  v-model="credit_debit.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col v-if="credit_debit.type_invoice == '07'" md="2">
                  <b-form-group label="Medio de Pago:">
                    <b-form-select  v-model="credit_debit.payment_method" :options="payment_method"></b-form-select>
                    <small v-if="errors.payment_method" class="form-text text-danger">Seleccione una forma</small>
                  </b-form-group>
                </b-col>

                <b-col v-if="credit_debit.type_invoice == '08'" md="2">
                  <b-form-group label="Fecha Vencimiento:">
                    <b-form-input type="date"  v-model="credit_debit.expiration_date"></b-form-input>
                    <small v-if="errors.expiration_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label=".">
                    <b-button @click="modalShoppingShow" class="form-control" type="button" variant="primary" >Compras</b-button>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Proveedor:">
                    <b-form-input readonly  v-model="shopping.provider"></b-form-input>
                    <small v-if="errors.id_shopping" class="form-text text-danger" >Selccione una compra</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select @change="ChangeCoin" v-model="credit_debit.coin" :options="coins"></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger" >Selccione una moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="T. C.:">
                    <b-form-input class="text-right" :readonly="readonly_exchange_rate"  v-model="credit_debit.exchange_rate"></b-form-input>
                    <small v-if="errors.exchange_rate" class="form-text text-danger" >Selccione un tipo de cambio</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Motivo:">
                    <b-form-select v-model="credit_debit.reason" :options="reason"></b-form-select>
                    <small v-if="errors.reason" class="form-text text-danger" >Seleccione un motivo</small>
                  </b-form-group>
                </b-col>

                <CreditDebitDetail/>
                <div class="w-100 text-center">
                  <small v-if="errors.credit_debit_detail" class="form-text text-danger" >Agrege un producto</small>
                </div>
                
                   <b-col md="8">
                  <b-row>
                     <b-col md="6">
                       <div class="table-responsive mt-3">
                        <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                          <thead >
                            <tr>
                              <th  width="30%" class="text-center">Fecha</th>
                              <th  width="600%" class="text-center">Referencia</th>
                              <th  width="10%" class="text-center">Acc.</th>
                            </tr>
                          </thead>
                          <tbody v-for="(item, it) in linkages" :key="it">
                            <tr>
                              <td class="text-center">{{ item.broadcast_date }}</td>
                              <td class="text-center">{{ item.reference }}</td>
                              <td class="text-center">
                                <button type="button" @click="mLoadDeleteLinkages(it)" class="btn btn-danger">
                                  <i class="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                       </div>
                     </b-col>
                   </b-row>
                </b-col>
                <b-col md="4">
                  <div class="mt-3 w-100"></div>
                  <b-form-group  label-cols-sm="7" label="Ope. Gravadas :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_credit_debit.taxed_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="7" label="Ope. Exonerada :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_credit_debit.exonerated_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="Ope. Inafecta :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_credit_debit.unaffected_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="7" label="IGV (18%) :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_credit_debit.igv"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="7" label="Total :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_credit_debit.total"></b-form-input>
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


    <ModalShopping />
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
import ModalShopping from './components/ModalShopping'
import CreditDebitDetail from './components/CreditDebitDetail'
import LoadingComponent from './../pages/Loading'
export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalShopping,
      LoadingComponent,
      CreditDebitDetail,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading:false,
      module: 'CreditDebitNote',
      role: 2,
      credit_debit: {
          id_credit_debit_note:'',
          id_shopping:'',
          id_user:'',
          linkages: [],
          type_invoice:'07',
          serie:'',
          number:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          expiration_date:moment(new Date()).local().format("YYYY-MM-DD"),
          coin:'PEN',
          exchange_rate:'1.00',
          reason:'',
          payment_method:'008',
          reference:'',
          observation:'',
          taxed_operation:(0).toFixed(2),
          exonerated_operation:(0).toFixed(2),
          unaffected_operation:(0).toFixed(2),
          discount:(0).toFixed(2),
          subtotal:(0).toFixed(2),
          igv:(0).toFixed(2),
          total:(0).toFixed(2),
          state:1,
      },
      shopping: {
        id_shopping:'',
        provider:'',
        coin:'',
        exchange_rate:'',
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
      readonly_exchange_rate: true,
      reason:[
        {value: '', text : 'Seleccione una opción'},
        {value: '01', text : 'Anulación de la Operación'},
        {value: '02', text : 'Anulacion por error de RUC'},
        {value: '03', text : 'Corrección por error de la descripción'},
        {value: '04', text : 'Descuento global'},
        {value: '05', text : 'Descuento por item'},
        {value: '06', text : 'Devolución total'},
        {value: '07', text : 'Devolución por item'},
        {value: '08', text : 'Bonificación'},
        {value: '09', text : 'Disminucion en el valor'},
        {value: '10', text : 'Otros conceptos'},
        {value: '11', text : 'Ajustes de operación de exportación'},
        {value: '12', text : 'ajustes afectos al IVAP '},
      ],
      providers: [],
      provider:null,

      type_invoice:[
        {value: "07", text : "Nota de crédito"},
        {value: "08", text : "Nota de débito"},
      ],

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],

      //errors
      errors: {
        id_shopping: false,
        type_invoice: false,
        serie: false,
        number: false,
        broadcast_date: false,
        coin: false,
        exchange_rate: false,
        reason:false,
        total: false,
        credit_debit_detail:false,
      },
      validate: false,
    };
  },
  mounted() {
    EventBus.$on('InfoShopping', (data) => {
      this.shopping.id_shopping = data.id_shopping;
      this.shopping.provider = data.provider;
      this.shopping.id_provider = data.id_provider;
      this.shopping.coin = data.coin;
      this.shopping.exchange_rate = data.exchange_rate;

      this.credit_debit.coin = data.coin;
      this.credit_debit.exchange_rate = data.exchange_rate;
    });
    this.mLoadResetCreditDebitDetail();
  },
  methods: {
    SearchProvider,
    NumberPadStart,
    UpperCase,

    modalShoppingShow,
    ChangeReason,
    ChangeCoin,
    AddCreditDebitNote,
    Validate,
    ...mapActions('CreditDebitNote',['mLoadResetCreditDebitDetail','mLoadDeleteLinkages']),
  },

  computed: {
    ...mapState('CreditDebitNote',['credit_debit_detail','total_credit_debit','linkages']),
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
  var number = String(this.credit_debit.number);
  number = number.padStart(8,"0");
  this.credit_debit.number = number;
}
function UpperCase() {
    this.credit_debit.serie = this.credit_debit.serie.toUpperCase();
}

function ChangeReason() {
    if (this.credit_debit.type_invoice == "07") {
      this.credit_debit.reason = '';
      this.reason = [
        {value: '', text : 'Seleccione una opción'},
        {value: '01', text : 'Anulación de la Operación'},
        {value: '02', text : 'Anulacion por error de RUC'},
        {value: '03', text : 'Corrección por error de la descripción'},
        {value: '04', text : 'Descuento global'},
        {value: '05', text : 'Descuento por item'},
        {value: '06', text : 'Devolución total'},
        {value: '07', text : 'Devolución por item'},
        {value: '08', text : 'Bonificación'},
        {value: '09', text : 'Disminucion en el valor'},
        {value: '10', text : 'Otros conceptos'},
        {value: '11', text : 'Ajustes de operación de exportación'},
        {value: '12', text : 'ajustes afectos al IVAP '},
      ];
    }
    if (this.credit_debit.type_invoice == "08") {
      this.credit_debit.reason = '';
      this.reason = [
        {value: '', text : 'Seleccione una opción'},
        {value:'01', text:'Intereses por mora'},
        {value:'02', text:'Aumento en el valor'},
        {value:'03', text:'Penalidades / otros conceptos'},
        {value:'11', text:'Ajustes de operaciones de exportaciones'},
        {value:'12', text:'Ajustes afectos al IVAP'},
      ];
      
    }
}

function ChangeCoin() {
  if (this.credit_debit.coin == 'PEN') {
    this.credit_debit.exchange_rate = '1.00';
    this.readonly_exchange_rate = true;
  }
  if (this.credit_debit.coin == 'USD') {
    if (this.shopping.exchange_rate.length != 0) {
     if (this.shopping.coin == 'USD') {
       this.credit_debit.exchange_rate = this.shopping.exchange_rate;
       this.readonly_exchange_rate = true;
     }else{
      this.credit_debit.exchange_rate = '';
      this.readonly_exchange_rate = false;
     }
    }else{
      this.credit_debit.exchange_rate = '';
      this.readonly_exchange_rate = false;
    }
  }
}
function modalShoppingShow() {
  EventBus.$emit('ModalShoppingShow',this.role);
}

function AddCreditDebitNote(me) {
  me.credit_debit.id_establishment = me.id_establishment;
  me.credit_debit.id_user = me.user.id_user;
  me.credit_debit.id_provider = me.shopping.id_provider;
  me.credit_debit.id_shopping = me.shopping.id_shopping;
  me.credit_debit.linkages = me.linkages;
  me.credit_debit.credit_debit_detail = me.credit_debit_detail;
  me.credit_debit.taxed_operation = me.total_credit_debit.taxed_operation;
  me.credit_debit.exonerated_operation = me.total_credit_debit.exonerated_operation;
  me.credit_debit.unaffected_operation = me.total_credit_debit.unaffected_operation;
  me.credit_debit.discount = me.total_credit_debit.discount;
  me.credit_debit.subtotal = me.total_credit_debit.subtotal;
  me.credit_debit.igv = me.total_credit_debit.igv;
  me.credit_debit.total = me.total_credit_debit.total;
  let url = me.url_base + "credit-debit-note/add";
  let data = me.credit_debit;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token,module: me.module,role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.credit_debit.id_credit_debit_note = '';
          me.credit_debit.id_shopping = '';
          me.credit_debit.id_user = '';
          me.credit_debit.linkages = '';
          me.credit_debit.type_invoice = '07';
          me.credit_debit.serie = '';
          me.credit_debit.number = '';
          me.credit_debit.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
          me.credit_debit.coin = 'PEN';
          me.credit_debit.exchange_rate = '1.00';
          me.credit_debit.observation = '';
          me.credit_debit.reason = '';
          me.credit_debit.reference = '';
          me.credit_debit.taxed_operation = (0).toFixed(2);
          me.credit_debit.exonerated_operation = (0).toFixed(2);
          me.credit_debit.unaffected_operation = (0).toFixed(2);
          me.credit_debit.discount = (0).toFixed(2);
          me.credit_debit.subtotal = (0).toFixed(2);
          me.credit_debit.igv = (0).toFixed(2);
          me.credit_debit.total = (0).toFixed(2);
          me.credit_debit.state = 1;
          me.shopping =  {
            id_shopping:'',
            provider:'',
            coin:'',
            exchange_rate:'',
          };
          me.mLoadResetCreditDebitDetail();
        Swal.fire("Sistema", "Se ha registrado la nota de crédito/débito", "success");
      } else if(response.data.status == 404) {
        Swal.fire("Sistema", response.data.message, "warning");
      }else{
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function Validate() {

 
  this.errors.id_shopping = this.shopping.id_shopping.length == 0 ? true : false;
  this.errors.type_invoice = this.credit_debit.type_invoice.length == 0 ? true : false;
  this.errors.serie = this.credit_debit.serie.length != 4 ? true : false;
  this.errors.number = this.credit_debit.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.credit_debit.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.credit_debit.coin.length == 0 ? true : false;
  this.errors.exchange_rate = this.credit_debit.exchange_rate.length == 0 ? true : false;
  this.errors.reason = this.credit_debit.reason.length == 0 ? true : false;
  this.errors.total = this.total_credit_debit.total.length == 0 ? true : false;
  this.errors.credit_debit_detail = this.credit_debit_detail.length == 0 ? true : false;
  if (this.credit_debit.type_invoice == "07") {
    this.errors.payment_method = this.credit_debit.payment_method.length == 0 ? true : false;
  }
  if (this.credit_debit.type_invoice == "08") {
    this.errors.expiration_date = this.credit_debit.expiration_date.length == 0 ? true : false;
  }

  if (this.errors.id_shopping == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.payment_method == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.expiration_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.exchange_rate == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.reason == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.credit_debit_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;
  Swal.fire({
    title: "Esta seguro de registrar la nota de crédito/débito ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.AddCreditDebitNote(me);
    }
  });
 

}
</script>
