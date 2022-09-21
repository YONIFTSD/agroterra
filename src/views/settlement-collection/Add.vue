<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Liquidación de Cobros - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-tabs v-model="tabIndex" content-class="mt-3">
                <b-tab :disabled="first" title="Cuentas por Cobrar" active>
                  <b-row>
                      
                    <b-col md="8">
                      <b-form-group>
                        <label>Cliente: </label>
                        <v-select placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                        <small v-if="errors.id_client" class="form-text text-danger" >Seleccione un cliente</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label="Moneda:">
                        <b-form-select ref="coin" @change="mLoadResetSettlementCollection(),UpdateCoin()" v-model="settlement_collection.coin" :options="coins" ></b-form-select>
                        <small v-if="errors.coin" class="form-text text-danger">Seleccione una moneda</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label=".">
                        <b-button type="button" @click="ModalAccountReceivableShow" variant="primary" class="form-control">Cuenta por Cobrar</b-button>
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
                            <tr v-for="(item, it) in account_receivable" :key="it">
                                <td class="text-center">{{ it + 1 }}</td>
                                <td class="text-center">{{ item.broadcast_date }}</td>
                                <td class="text-center">{{ item.expiration_date }}</td>
                                <td class="text-center">{{ item.document }}</td>
                                <td class="text-center">{{ item.coin }}</td>
                                <td class="text-right">{{ item.total }}</td>
                                <td class="text-center">
                                    <button type="button" @click="DeleteAccountReceivable(it)" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></button>  
                                </td>
                            </tr>
                            <tr>
                                <th colspan="5" class="align-middle text-right">Total :</th>
                                <th class="align-middle text-right">{{ msettlement_collection.total }}</th>
                                <th class="align-middle text-center">
                                </th>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="w-100 text-center">
                        <small v-if="errors.account_receivable" class="form-text text-danger">Agrege cuentas por pagar</small>
                      </div>
                    </div>
                      

                      <b-col md="5"></b-col>
                      <b-col md="2">
                        <b-form-group class="mt-2">
                          <b-button @click="toNext" variant="primary" class="form-control" type="button">Siguiente <i class="fas fa-arrow-circle-right"></i></b-button>
                        </b-form-group>
                      </b-col>

                  

                  </b-row>
                  
                </b-tab>
                <b-tab :disabled="second" title="Aplicación de Cobros">
                    <b-row>
                      <b-col md="6">
                        <b-form-group>
                          <label>Cliente:</label>
                            <b-form-input disabled :value="client == null ? '': client.full_name"></b-form-input>
                        </b-form-group>
                      </b-col>

                      <b-col md="2">
                        <b-form-group label="Moneda:">
                          <b-form-select disabled v-model="settlement_collection.coin" :options="coins" ></b-form-select>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="Total:">
                          <b-form-input disabled class="text-right" type="number" step="any" v-model="msettlement_collection.total" ></b-form-input>
                          <small v-if="errors.total" class="form-text text-danger">Ingrese un total</small>
                        </b-form-group>
                      </b-col>
                      <b-col md="2">
                        <b-form-group label="Saldo:">
                          <b-form-input disabled class="text-right" type="number" step="any" v-model="msettlement_collection.balance"></b-form-input>
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
                                    <tr v-for="(item, it) in account_receivable" :key="it">
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
                              <div class="w-100"><small v-if="errors.account_receivable" class="form-text text-danger">Agrege cuentas por pagar</small></div>
                            </div>
                          </b-row>
                        </b-card>
                      </b-col>
                      <b-col md="6">
                        <b-card header="Registro de Cobros">
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
                                    <tr v-for="(item, it) in charges" :key="it">
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
                              <div class="w-100 text-center"><small v-if="errors.charges" class="form-text text-danger">Agrege letras de cambio</small></div>
                            </div>
                          </b-row>
                        </b-card>
                      </b-col>
                    </b-row>
                    

                  

                  

                  <b-row>
                    <b-col md="3"></b-col>
                    <b-col md="2">
                      <b-form-group class="mt-2">
                        <b-button @click="toBack" variant="primary" class="form-control" type="button"><i class="fas fa-arrow-alt-circle-left"></i> Regresar</b-button>
                      </b-form-group>
                    </b-col>
                    <b-col md="2">
                      <b-form-group class="mt-2">
                        <b-button variant="info" @click="ModalChargeShow" class="form-control" type="button">Cobros</b-button>
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


    <ModalClients />
    <ModalAccountReceivable />
    <ModalCharge />
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
import CodeToName from "@/assets/js/CodeToName";
// components
import ModalClients from './../components/ModalProvider'
import ModalAccountReceivable from './components/ModalAccountReceivable'
import ModalCharge from './components/ModalCharge'
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalClients,
      ModalAccountReceivable,
      ModalCharge,
      LoadingComponent,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading: false,
      module: 'AccountReceivable',
      role: 2,
      tabIndex: 0,
      first:false,
      second: true,
      settlement_collection: {
          id_settlement_collection:'',
          id_provider:'',
          id_user:'',
          id_establishment:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          references:'',
          coin:'PEN',
          total: (0).toFixed(2),
          state:1,
          account_receivable : [],
          charges : [],
      },
      clients: [],
      client:null,
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      //errors
      errors: {
        id_client: false,
        coin: false,
        total: false,
        balance: false,
        account_receivable: false,
        charges: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.mLoadResetSettlementCollection();
  },
  methods: {
    SearchClients,
    CodeInvoice,
    ModalAccountReceivableShow,
    ModalChargeShow,
    toBack,
    toNext,
    DeleteAccountReceivable,
    DeletePayment,
    UpdateCoin,

    AddSettlementCollection,
    Validate,
    ...mapActions('SettlementCollection',['mLoadDeleteAccountReceivable','mLoadDeleteCharge','mLoadResetSettlementCollection','mLoadResetCharge','mLoadUpdateSettlementCollectionCoin']),
  },

  computed: {
    ...mapState('SettlementCollection',['msettlement_collection','account_receivable','charges']),
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
  this.mLoadUpdateSettlementCollectionCoin(this.settlement_collection.coin);
}
function DeleteAccountReceivable(index) {
  this.mLoadDeleteAccountReceivable(index)
}
function DeletePayment(index) {
  this.mLoadDeleteCharge(index)
}
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function toNext() {
  
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.settlement_collection.coin == 0 ? true : false;
  this.errors.account_receivable = this.account_receivable.length == 0 ? true : false;
 
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.account_receivable == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
 
  this.first = true;
  this.second = false;
  let me = this;

  setTimeout(function(){ me.tabIndex = 2;  }, 500);


}

function toBack() {
  this.first = false;
  this.second = true;
  let me = this;
  this.mLoadResetCharge();
  setTimeout(function(){ me.tabIndex = 1;  }, 500);
}

function SearchClients(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients = response.data;
            loading(false);
      })
    }
}


function ModalAccountReceivableShow() {
  this.errors.id_client = false;
  this.errors.coin = false;
  if (this.client == null) {
    this.errors.id_client = true;
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  if (this.settlement_collection.coin.length == 0) {
    this.errors.coin = true;
    Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); 
    return false;
  }
  EventBus.$emit('ModalAccountReceivableShow',{id_client: this.client.id, coin:this.settlement_collection.coin, role:2});
}

function ModalChargeShow() {
  let related_documents = '';
  for (let index = 0; index < this.account_receivable.length; index++) {
    const element = this.account_receivable[index];
    related_documents += element.document + ", ";
  }
  EventBus.$emit('ModalChargeShow',{related_documents: related_documents, id_client:this.client.id, role:2});
}

function AddSettlementCollection(me) {

  me.settlement_collection.id_user = me.user.id_user;
  me.settlement_collection.id_establishment = me.id_establishment;
  me.settlement_collection.id_client = me.client.id;
  me.settlement_collection.account_receivable = me.account_receivable;
  me.settlement_collection.charges = me.charges;
  me.settlement_collection.total = me.msettlement_collection.total;
  let url = me.url_base + "settlement-collection/add";
  let data = me.settlement_collection;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.settlement_collection.id_settlement_collection = '';
          me.settlement_collection.id_user = '';
          me.settlement_collection.id_establishment = '';
          me.settlement_collection.id_client = '';
          me.settlement_collection.coin = 'PEN';
          me.settlement_collection.references = '';
          me.settlement_collection.total = (0).toFixed(2);
          me.settlement_collection.state = 1;
          me.client = null;
          me.mLoadResetSettlementCollection();
          me.toBack();
          Swal.fire({ icon: 'success', text: 'Se ha registrado la liquidación de cobro', timer: 3000,})
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

 
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.settlement_collection.coin.length == 0 ? true : false;
  this.errors.account_receivable = this.account_receivable.length == 0 ? true : false;
  this.errors.charges = this.charges.length == 0 ? true : false;
  this.errors.total = parseFloat(this.msettlement_collection.total) <= 0 ? true : false;
  this.errors.balance = parseFloat(this.msettlement_collection.balance) > 0 ? true : false;


  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.account_receivable == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.charges == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.balance == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

 let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar el liquidar el cobro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddSettlementCollection(me);
    }
  })


}
</script>
