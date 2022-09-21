<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cuentas por Pagar - Listar</strong>
          </CCardHeader>
          <CCardBody>

            <b-tabs content-class="mt-3">
              <b-tab title="Cuentas por Pagar - Pendientes" active>
                <b-row>
                  <b-col md="6">
                    <b-form-group>
                      <label>Proveedor:</label>
                      <v-select @input="ListAccountPayPending" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider_pending" @search="SearchProviderPending" :options="providers_pending"></v-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-button class="form-control" @click="ShowModalEECC" type="button" variant="primary">VER EECC</b-button>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="3">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_pending" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListAccountPayPending">
                            <b-icon icon="search"></b-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="1">
                    <b-form-group label=".">
                      <b-link  v-if="Permission('AccountPayAdd')" class="btn form-control btn-primary"  :to="{ path: '/cuentas-por-pagar/nuevo' }" append ><i class="fas fa-file"></i></b-link>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="table-responsive mt-3 height-table">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th width="5%" class="text-center">#</th>
                        <th width="9%" class="text-center">Fecha</th>
                        <th width="10%" class="text-center">Comprobante</th>
                        <th width="40%" class="text-center">Proveedor</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="8%" class="text-center">Total</th>
                        <th width="8%" class="text-center">Saldo</th>
                        <th width="8%" class="text-center">Estado</th>
                        <th width="8%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in accoun_pay_pending" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.broadcast_date  }}</td>
                        <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                        <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                        <td class="text-center"> {{ item.coin  }}</td>
                        <td class="text-right"> {{ item.total  }}</td>
                        <td class="text-right"> {{ item.balance  }}</td>
                        <td class="text-center">
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Cancelado</b-badge>
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                        </td>
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('AccountPayEdit')" @click="ModalProgramsShow(item.id_account_pay)">Programaciones</b-dropdown-item>
                            <b-dropdown-item v-if="Permission('AccountPayEdit') && item.id_module == 0" @click="EditAccountPay(item.id_account_pay)">Editar</b-dropdown-item>
                            <b-dropdown-item v-if="Permission('AccountPayView')" @click="ViewAccountPay(item.id_account_pay)" >Ver</b-dropdown-item >
                            <b-dropdown-item v-if="Permission('AccountPayDelete') && item.id_module == 0" @click="ConfirmDeleteAccountPay(item.id_account_pay)">Eliminar</b-dropdown-item>
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_pending" v-on:input="ListAccountPayPending" :total-rows="rows_pending" :per-page="perPage_pending" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_pending }}</p>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab title="Cuentas por Pagar - Canceladas">
                <b-row>
                  <b-col sm="12" md="5">
                      <b-form-group>
                        <label>Proveedor:</label>
                        <v-select @input="ListAccountPayCancelled" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider_cancelled" @search="SearchProviderCancelled" :options="providers_cancelled"></v-select>
                      </b-form-group>
                    </b-col>
                  <b-col sm="6" md="5">
                  </b-col>
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_cancelled" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListAccountPayCancelled">
                            <b-icon icon="search"></b-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="table-responsive mt-3 height-table">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th width="5%" class="text-center">#</th>
                        <th width="9%" class="text-center">Fecha</th>
                        <th width="10%" class="text-center">Comprobante</th>
                        <th width="40%" class="text-center">Proveedor</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="8%" class="text-center">Total</th>
                        <th width="8%" class="text-center">Saldo</th>
                        <th width="8%" class="text-center">Estado</th>
                        <th width="8%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in accoun_pay_cancelled" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.broadcast_date  }}</td>
                        <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                        <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                        <td class="text-center"> {{ item.coin  }}</td>
                        <td class="text-right"> {{ item.total  }}</td>
                        <td class="text-right"> {{ item.balance  }}</td>
                        <td class="text-center">
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Cancelado</b-badge>
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                        </td>
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('AccountPayEdit')" @click="ModalProgramsShow(item.id_account_pay)">Programaciones</b-dropdown-item>
                            <b-dropdown-item v-if="Permission('AccountPayView')" @click="ViewAccountPay(item.id_account_pay)" >Ver</b-dropdown-item >
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_cancelled" v-on:input="ListAccountPayPending" :total-rows="rows_cancelled" :per-page="perPage_cancelled" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_cancelled }}</p>
                  </b-col>
                </b-row>
              </b-tab>

              <b-tab title="Letras de Cambio - Pendientes">
                <b-row>
                  <b-col sm="12" md="5">
                      <b-form-group>
                        <label>Proveedor:</label>
                        <v-select @input="ListBillExchangePending" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider_pending_bill" @search="SearchProviderPendingBill" :options="providers_pending_bill"></v-select>
                      </b-form-group>
                    </b-col>
                  <b-col sm="6" md="5">
                  </b-col>
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_pending_bill" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListBillExchangePending">
                            <b-icon icon="search"></b-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="table-responsive mt-3 height-table">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th width="5%" class="text-center">#</th>
                        <th width="9%" class="text-center">F. Emision</th>
                        <th width="9%" class="text-center">F. Venc.</th>
                        <th width="40%" class="text-center">Proveedor</th>
                        <th width="10%" class="text-center">Nro Letra</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="8%" class="text-center">Total</th>
                        <th width="8%" class="text-center">Saldo</th>
                        <th width="8%" class="text-center">Estado</th>
                        <th width="8%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in bill_exchange_pending_bill" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.broadcast_date  }}</td>
                        <td class="text-center"> {{ item.expiration_date  }}</td>
                        <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                        <td class="text-left"> {{ item.letter_number }}</td>
                        <td class="text-center"> {{ item.coin  }}</td>
                        <td class="text-right"> {{ item.total  }}</td>
                        <td class="text-right"> {{ item.balance  }}</td>
                        <td class="text-center">
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Cancelado</b-badge>
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                        </td>
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('AccountPayView')" @click="ShowModalBillExchange(item.id_bill_exchange)" >Ver</b-dropdown-item >
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_pending_bill" v-on:input="ListBillExchangePending" :total-rows="rows_pending_bill" :per-page="perPage_pending_bill" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_pending_bill }}</p>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab title="Letras de Cambio - Cancelados">
                <b-row>
                  <b-col sm="12" md="5">
                      <b-form-group>
                        <label>Proveedor:</label>
                        <v-select @input="ListBillExchangeCancelled" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider_cancelled_bill" @search="SearchProviderCancelledBill" :options="providers_cancelled_bill"></v-select>
                      </b-form-group>
                    </b-col>
                  <b-col sm="6" md="5">
                  </b-col>
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_cancelled_bill" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListBillExchangeCancelled">
                            <b-icon icon="search"></b-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                </b-row>
                <div class="table-responsive mt-3 height-table">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th width="5%" class="text-center">#</th>
                        <th width="9%" class="text-center">F. Emision</th>
                        <th width="9%" class="text-center">F. Venc.</th>
                        <th width="40%" class="text-center">Proveedor</th>
                        <th width="10%" class="text-center">Nro Letra</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="8%" class="text-center">Total</th>
                        <th width="8%" class="text-center">Saldo</th>
                        <th width="8%" class="text-center">Estado</th>
                        <th width="8%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in bill_exchange_cancelled_bill" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.broadcast_date  }}</td>
                        <td class="text-center"> {{ item.expiration_date  }}</td>
                        <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                        <td class="text-left"> {{ item.letter_number }}</td>
                        <td class="text-center"> {{ item.coin  }}</td>
                        <td class="text-right"> {{ item.total  }}</td>
                        <td class="text-right"> {{ item.balance  }}</td>
                        <td class="text-center">
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Cancelado</b-badge>
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                        </td>
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('AccountPayView')" @click="ShowModalBillExchange(item.id_bill_exchange)" >Ver</b-dropdown-item >
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_cancelled_bill" v-on:input="ListBillExchangeCancelled" :total-rows="rows_cancelled_bill" :per-page="perPage_cancelled_bill" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_cancelled_bill }}</p>
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>








            
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <ModalBillExchange />
    <ModalEECCClient />
    <ModalPrograms />
  </div>
</template>

<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
import LoadingComponent from './../pages/Loading'
import ModalBillExchange from './components/ModalBillExchange'
import ModalEECCClient from './components/ModalEECCClient'
import ModalPrograms from './components/ModalPrograms'
export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
    ModalBillExchange,
    ModalEECCClient,
    ModalPrograms,
  },
  data() {
    return {
      isLoading:false,
      module:'AccountPay',

      perPage_pending: 15,
      currentPage_pending: 1,
      rows_pending: 0,
      search_pending: "",
      accoun_pay_pending: [],
      providers_pending: [],
      provider_pending:null,


      perPage_cancelled: 15,
      currentPage_cancelled: 1,
      rows_cancelled: 0,
      search_cancelled: "",
      accoun_pay_cancelled: [],
      providers_cancelled: [],
      provider_cancelled:null,



      perPage_pending_bill: 15,
      currentPage_pending_bill: 1,
      rows_pending_bill: 0,
      search_pending_bill: "",
      bill_exchange_pending_bill: [],
      providers_pending_bill: [],
      provider_pending_bill:null,


      perPage_cancelled_bill: 15,
      currentPage_cancelled_bill: 1,
      rows_cancelled_bill: 0,
      search_cancelled_bill: "",
      bill_exchange_cancelled_bill: [],
      providers_cancelled_bill: [],
      provider_cancelled_bill:null,


    };
  },
  mounted() {
    EventBus.$on('RefreshAccountPay', () => {
        this.ListAccountPayPending();
        this.ListAccountPayCancelled();
        this.ListBillExchangePending();
        this.ListBillExchangeCancelled();
    });

    this.ListAccountPayPending();
    this.ListAccountPayCancelled();

    this.ListBillExchangePending();
    this.ListBillExchangeCancelled();
  },
  methods: {
    ListAccountPayPending,
    SearchProviderPending,
 
    ListAccountPayCancelled,
    SearchProviderCancelled,

    ListBillExchangePending,
    SearchProviderPendingBill,
 
    ListBillExchangeCancelled,
    SearchProviderCancelledBill,

    ShowModalBillExchange,
    ShowModalEECC,
    CodeInvoice,
    EditAccountPay,
    ViewAccountPay,
    ConfirmDeleteAccountPay,
    DeleteAccountPay,
    Permission,

    ModalProgramsShow,
  },

  computed: {
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

function SearchProviderPending(search, loading) {

  let me = this;
  let url = this.url_base + "search-providers/" + search;
  if (search !== "") {
    loading(true);
    axios({
      method: "GET",
      url: url,
    }).then(function (response) {
          me.providers_pending = response.data.result;
          loading(false);
    })
  }
}

function ListAccountPayPending() {
  let search = this.search_pending == "" ? "all" : this.search_pending;
  let id_provider = this.provider_pending == null ? "all": this.provider_pending.id;
  let me = this;
  let url = this.url_base + "account-pay/list/"+ this.id_establishment +"/1/" +id_provider+"/"+ search + "?page=" + this.currentPage_pending;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_pending = response.data.result.total;
        me.accoun_pay_pending = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function SearchProviderCancelled(search, loading) {
  
  let me = this;
  let url = this.url_base + "search-providers/" + search;
  if (search !== "") {
    loading(true);
    axios({
      method: "GET",
      url: url,
    }).then(function (response) {
          me.providers_cancelled = response.data.result;
          loading(false);
    })
  }
}

function ListAccountPayCancelled() {
  let search = this.search_cancelled == "" ? "all" : this.search_cancelled;
  let id_provider = this.provider_cancelled == null ? "all": this.provider_cancelled.id;
  let me = this;
  let url = this.url_base + "account-pay/list/"+ this.id_establishment +"/2/" +id_provider+"/"+ search + "?page=" + this.currentPage_cancelled;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_cancelled = response.data.result.total;
        me.accoun_pay_cancelled = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}





function SearchProviderPendingBill(search, loading) {

  let me = this;
  let url = this.url_base + "search-providers/" + search;
  if (search !== "") {
    loading(true);
    axios({
      method: "GET",
      url: url,
    }).then(function (response) {
          me.providers_pending_bill = response.data.result;
          loading(false);
    })
  }
}

function ListBillExchangePending() {
  let search = this.search_pending_bill == "" ? "all" : this.search_pending_bill;
  let id_provider = this.provider_pending_bill == null ? "all": this.provider_pending_bill.id;
  let me = this;
  let url = this.url_base + "bill-exchange/list/"+ this.id_establishment +"/1/" +id_provider+"/"+ search + "?page=" + this.currentPage_pending_bill;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_pending_bill = response.data.result.total;
        me.bill_exchange_pending_bill = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}



function SearchProviderCancelledBill(search, loading) {

  let me = this;
  let url = this.url_base + "search-providers/" + search;
  if (search !== "") {
    loading(true);
    axios({
      method: "GET",
      url: url,
    }).then(function (response) {
          me.providers_cancelled_bill = response.data.result;
          loading(false);
    })
  }
}

function ListBillExchangeCancelled() {
  let search = this.search_cancelled_bill == "" ? "all" : this.search_cancelled_bill;
  let id_provider = this.provider_cancelled_bill == null ? "all": this.provider_cancelled_bill.id;
  let me = this;
  let url = this.url_base + "bill-exchange/list/"+ this.id_establishment +"/2/" +id_provider+"/"+ search + "?page=" + this.currentPage_cancelled_bill;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_cancelled_bill = response.data.result.total;
        me.bill_exchange_cancelled_bill = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}




















// Editar usuario
function EditAccountPay(id_account_pay) {
  this.$router.push({
    name: "AccountPayEdit",
    params: { id_account_pay: je.encrypt(id_account_pay) },
  });
}

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

// Ver Usuario
function ViewAccountPay(id_account_pay) {
  this.$router.push({
    name: "AccountPayView",
    params: { id_account_pay: je.encrypt(id_account_pay) },
  });
}

function ShowModalBillExchange(id_bill_exchange) {
  EventBus.$emit('ModalBillExchangeShow',id_bill_exchange);
}

function ShowModalEECC() {
  EventBus.$emit('ModalEECCShow');  
}


function ModalProgramsShow(id_account_pay) {
  EventBus.$emit('ModalProgramsShow',id_account_pay);  
}


// Confirmar eliminar
function ConfirmDeleteAccountPay(id_account_pay) {
  Swal.fire({
    title: "Esta seguro de eliminar cuenta por cobrar?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteAccountPay(id_account_pay);
    }
  });
}

// eliminar usuario
function DeleteAccountPay(id_account_pay) {
  let me = this;
  let url = this.url_base + "account-pay/delete/" + id_account_pay;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 4,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.accoun_pay_pending.length; i++) {
          if (me.accoun_pay_pending[i].id_account_pay == id_account_pay) {
            me.accoun_pay_pending.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado la cuenta por pagar', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

// permisos
function Permission(module_permission) {
  let user_permissions = window.localStorage.getItem("user_permissions");
  user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));
  if (user_permissions.indexOf(module_permission) > -1) {
    return true;
  } else {
    return false;
  }
}
</script>
