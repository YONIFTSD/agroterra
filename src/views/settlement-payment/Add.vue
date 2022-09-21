<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Liquidación de pagos - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-tabs v-model="tabIndex" content-class="mt-3">
                <b-tab :disabled="first" title="Cuentas por Pagar" active>
                  <b-row>
                      
                    <b-col md="8">
                      <b-form-group>
                        <label>Proveedor:</label>
                        <v-select  @input="mLoadResetSettlementPayment" placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                        <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label="Moneda:">
                        <b-form-select ref="coin" @change="mLoadResetSettlementPayment(),UpdateCoin()" v-model="settlement_payment.coin" :options="coins" ></b-form-select>
                        <small v-if="errors.coin" class="form-text text-danger">Seleccione una moneda</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label=".">
                        <b-button type="button" @click="ModalAccountPayShow" variant="primary" class="form-control">Cuenta por Cobrar</b-button>
                      </b-form-group>
                    </b-col>


                    <div class="col-md-12">
                      <div class="table-responsive mt-3">
                        <table  class="table  table-bordered table-hover">
                          <thead class="">
                            <tr>
                              <th width="5%" class="text-center">#</th>
                              <th width="20%" class="text-center">Fecha Emisión</th>
                              <th width="20%" class="text-center">Fecha Venc.</th>
                              <th width="27%" class="text-center">Comprobante</th>
                              <th width="10%" class="text-center">Moneda</th>
                              <th width="10%" class="text-center">Total</th>
                              <th width="8%" class="text-center">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, it) in account_pay" :key="it">
                                <td class="text-center">{{ it + 1 }}</td>
                                <td class="text-center">{{ item.broadcast_date }}</td>
                                <td class="text-center">{{ item.expiration_date }}</td>
                                <td class="text-center">{{ item.document }}</td>
                                <td class="text-center">{{ item.coin }}</td>
                                <td class="text-right">{{ item.total }}</td>
                                <td class="text-center">
                                    <button type="button" @click="DeleteAccountPay(it)" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>  
                                </td>
                            </tr>
                            <tr>
                                <th colspan="5" class="align-middle text-right">Total :</th>
                                <th class="align-middle text-right">{{ msettlement_payment.total }}</th>
                                <th class="align-middle text-center">
                                </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="w-100 text-center">
                        <small v-if="errors.account_pay" class="form-text text-danger">Agrege cuentas por pagar</small>
                      </div>
                    </div>
                      

                      <b-col md="5"></b-col>
                      <b-col md="2">
                        <b-form-group class="mt-2">
                          <b-button @click="toNext" variant="primary" class="form-control" type="button">SIGUIENTE <i class="fas fa-arrow-circle-right"></i></b-button>
                        </b-form-group>
                      </b-col>

                  

                  </b-row>
                  
                </b-tab>
                <b-tab :disabled="second" title="Aplicación de Pagos">
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label>Proveedor:</label>
                            <b-form-input disabled :value="provider == null ? '': provider.name"></b-form-input>
                        </b-form-group>
                      </b-col>

                      <b-col md="2">
                        <b-form-group label="Moneda:">
                          <b-form-select disabled v-model="settlement_payment.coin" :options="coins" ></b-form-select>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="Total:">
                          <b-form-input disabled class="text-right" type="number" step="any" v-model="msettlement_payment.total" ></b-form-input>
                          <small v-if="errors.total" class="form-text text-danger">Ingrese un total</small>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="Saldo:">
                          <b-form-input disabled class="text-right" type="number" step="any" v-model="msettlement_payment.balance"></b-form-input>
                          <small v-if="errors.balance" class="form-text text-danger">El saldo debe ser igual a 0</small>
                        </b-form-group>
                      </b-col>

                      <b-col md="6">
                        <b-card header="Documentos Relacionados">
                          <b-row>
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                                  <thead class="">
                                    <tr>
                                      <th width="5%" class="text-center">#</th>
                                      <th width="20%" class="text-center">Fecha Emisión</th>
                                      <th width="20%" class="text-center">Fecha Venc.</th>
                                      <th width="25%" class="text-center">Documento</th>
                                      <th width="10%" class="text-center">Moneda</th>
                                      <th width="10%" class="text-center">Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, it) in account_pay" :key="it">
                                        <td class="align-middle text-center">{{ it + 1 }}</td>
                                        <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                                        <td class="align-middle text-center">{{ item.expiration_date }}</td>
                                        <td class="align-middle text-center">{{ item.document }}</td>
                                        <td class="align-middle text-center">{{ item.coin }}</td>
                                        <td class="align-middle text-right">{{ item.total }}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div class="w-100"><small v-if="errors.account_pay" class="form-text text-danger">Agrege cuentas por pagar</small></div>
                            </div>
                          </b-row>
                        </b-card>
                      </b-col>
                      <b-col md="6">
                        <b-card header="Letras de Cambios">
                          <b-row>
                            <div class="col-md-12">
                              <div class="table-responsive">
                                <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                                  <thead class="">
                                    <tr>
                                      <th width="5%" class="text-center">#</th>
                                      <th width="15%" class="text-center">Fecha Emision</th>
                                      <th width="15%" class="text-center">Documento</th>
                                      <th width="15%" class="text-center">Moneda</th>
                                      <th width="15%" class="text-center">Importe</th>
                                      <th width="10%" class="text-center">T. C.</th>
                                      <th width="10%" class="text-center">Total</th>
                                      <th width="10%" class="text-center">Acc.</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr v-for="(item, it) in payments" :key="it">
                                        <td class="align-middle text-center">{{ it + 1 }}</td>
                                        <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                                        <td class="align-middle text-center">{{ item.document }}</td>
                                        <td class="align-middle text-center">{{ item.coin }}</td>
                                        <td class="align-middle text-right">{{ item.amount }}</td>
                                        <td class="align-middle text-center">{{ item.exchange_rate }}</td>
                                        <td class="align-middle text-right">{{ item.amount_final }}</td>
                                         <td class="text-center">
                                          <button type="button" @click="DeletePayment(it)" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>  
                                        </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                              <div class="w-100 text-center"><small v-if="errors.payments" class="form-text text-danger">Agrege letras de cambio</small></div>
                            </div>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                    

                  

                  

                  <b-row>
                    <b-col md="3"></b-col>
                    <b-col md="2">
                      <b-form-group class="mt-2">
                        <b-button @click="toBack" variant="primary" class="form-control" type="button"><i class="fas fa-arrow-alt-circle-left"></i> REGRESAR</b-button>
                      </b-form-group>
                    </b-col>
                    <b-col md="2">
                      <b-form-group class="mt-2">
                        <b-button variant="info" @click="ModalPaymentShow" class="form-control" type="button">AGREGAR PAGOS</b-button>
                      </b-form-group>
                    </b-col>
                    <b-col md="2">
                      <b-form-group class="mt-2">
                        <b-button  variant="dark" class="form-control" type="submit"><i class="fas fa-save"></i> Guardar (F4)</b-button>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-tab>
              </b-tabs>
              <b-row>
            
                

                <!-- <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control btn-primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col> -->
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalProviders />
    <ModalAccountPay />
    <ModalPayment />
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
import CodeToName from "@/assets/js/CodeToName";
// components
import ModalProviders from './../components/ModalProvider'
import ModalAccountPay from './components/ModalAccountPay'
import ModalPayment from './components/ModalPayment'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalProviders,
      ModalAccountPay,
      ModalPayment,
  },
  data() {
    return {
      module: 'AccountReceivable',
      role: 2,
      tabIndex: 0,
      first:false,
      second: true,
      settlement_payment: {
          id_settlement_payment:'',
          id_provider:'',
          id_user:'',
          id_establishment:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          references:'',
          coin:'PEN',
          total: (0).toFixed(2),
          state:1,
          account_pay : [],
          payments : [],
      },
      providers: [],
      provider:null,
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      //errors
      errors: {
        id_provider: false,
        coin: false,
        total: false,
        balance: false,
        account_pay: false,
        payments: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.mLoadResetSettlementPayment();
  },
  methods: {
    SearchProvider,
    CodeInvoice,
    ModalAccountPayShow,
    ModalPaymentShow,
    toBack,
    toNext,
    DeleteAccountPay,
    DeletePayment,
    UpdateCoin,

    AddSettlementPayment,
    Validate,
    ...mapActions('SettlementPayment',['mLoadDeleteAccountPay','mLoadDeletePayment','mLoadResetSettlementPayment','mLoadResetPayment','mLoadUpdateSettlementPaymentCoin']),
  },

  computed: {
    ...mapState('SettlementPayment',['msettlement_payment','account_pay','payments']),
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

function UpdateCoin() {
  this.mLoadUpdateSettlementPaymentCoin(this.settlement_payment.coin);
}
function DeleteAccountPay(index) {
  this.mLoadDeleteAccountPay(index)
}
function DeletePayment(index) {
  this.mLoadDeletePayment(index)
}
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function toNext() {
  
  this.errors.id_provider = this.provider == null ? true : false;
  this.errors.coin = this.settlement_payment.coin == 0 ? true : false;
  this.errors.account_pay = this.account_pay.length == 0 ? true : false;
 
  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.account_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
 
  this.first = true;
  this.second = false;
  let me = this;

  setTimeout(function(){ me.tabIndex = 2;  }, 500);


}

function toBack() {
  this.first = false;
  this.second = true;
  let me = this;
  this.mLoadResetPayment();
  setTimeout(function(){ me.tabIndex = 1;  }, 500);
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


function ModalAccountPayShow() {
  this.errors.id_provider = false;
  this.errors.coin = false;
  if (this.provider == null) {
    this.errors.id_provider = true;
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  if (this.settlement_payment.coin.length == 0) {
    this.errors.coin = true;
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  EventBus.$emit('ModalAccountPayShow',{id_provider: this.provider.id, coin:this.settlement_payment.coin, role:2});
}

function ModalPaymentShow() {
  let related_documents = '';
  for (let index = 0; index < this.account_pay.length; index++) {
    const element = this.account_pay[index];
    related_documents += element.document + ", ";
  }
  EventBus.$emit('ModalPaymentShow',{related_documents: related_documents, id_provider:this.provider.id, role:2});
}

function AddSettlementPayment(me) {

  me.settlement_payment.id_user = me.user.id_user;
  me.settlement_payment.id_establishment = me.id_establishment;
  me.settlement_payment.id_provider = me.provider.id;
  me.settlement_payment.account_pay = me.account_pay;
  me.settlement_payment.payments = me.payments;
  me.settlement_payment.total = me.msettlement_payment.total;
  let url = me.url_base + "settlement-payment/add";
  let data = me.settlement_payment;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.settlement_payment.id_settlement_payment = '';
          me.settlement_payment.id_user = '';
          me.settlement_payment.id_establishment = '';
          me.settlement_payment.id_provider = '';
          me.settlement_payment.coin = 'PEN';
          me.settlement_payment.references = '';
          me.settlement_payment.total = (0).toFixed(2);
          me.settlement_payment.state = 1;
          me.provider = null;
          me.mLoadResetSettlementPayment();
          me.toBack();
          Swal.fire({ icon: 'success', text: 'Se ha registrado la liquidación de pago', timer: 3000,})
      } else if(response.data.status == 400) {
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

 
  this.errors.id_provider = this.providers == null ? true : false;
  this.errors.coin = this.settlement_payment.coin.length == 0 ? true : false;
  this.errors.account_pay = this.account_pay.length == 0 ? true : false;
  this.errors.payments = this.payments.length == 0 ? true : false;
  this.errors.total = parseFloat(this.msettlement_payment.total) <= 0 ? true : false;
  this.errors.balance = parseFloat(this.msettlement_payment.balance) > 0 ? true : false;


  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.account_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.payments == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.balance == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

 let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar el liquidar el pago?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddSettlementPayment(me);
    }
  })


}
</script>
