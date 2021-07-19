<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Registro de Pagos - Listar</strong>
          </CCardHeader>
          <CCardBody>

            <b-tabs content-class="mt-3">
              <b-tab title="Registro de Pagos - No Aplicados" active>
                <b-row>
                  

                  <b-col md="5">
                    <b-form-group>
                      <label>Proveedor: </label>
                      <v-select @input="ListPaymentPending" placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider_pending" @search="SearchProvidersPending" :options="providers_pending"></v-select>
                    </b-form-group>
                  </b-col>

                  <b-col sm="12" md="2">
                    <b-form-group label="Desde :">
                      <b-form-input @change="ListPaymentPending" class="text-center" :max="to_pending" type="date"  v-model="from_pending"></b-form-input>
                      <small v-if="errors_pending.from_pending" class="form-text text-danger" >Selccione una fecha</small>
                    </b-form-group>
                  </b-col>

                  <b-col sm="12" md="2">
                    <b-form-group label="Hasta :">
                      <b-form-input @change="ListPaymentPending" class="text-center" :min="from_pending" type="date" v-model="to_pending"></b-form-input>
                      <small v-if="errors_pending.to_pending" class="form-text text-danger" >Selccione una fecha</small>
                    </b-form-group>
                  </b-col>

                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_pending" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListPaymentPending">
                            <b-icon icon="search"></b-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="1">
                  <b-form-group label=".">
                    <b-link  v-if="Permission('PaymentAdd')" class="btn form-control btn-primary"  :to="{ path: '/registro-de-pagos/nuevo' }" append ><i class="fas fa-file"></i></b-link>
                  </b-form-group>
                </b-col>
                </b-row>
                <div class="table-responsive mt-3 height-table">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th width="5%" class="text-center">#</th>
                        <th width="8%" class="text-center">Fecha</th>
                        <th width="40%" class="text-center">Cliente</th>
                         <th width="13%" class="text-center">Medio de Pago</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="6%" class="text-center">Total</th>
                        <th width="6%" class="text-center">Aplicado</th>
                        <th width="6%" class="text-center">Saldo</th>
                        <th width="7%" class="text-center">Estado</th>
                        <th width="7%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in payment_pending" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.broadcast_date  }}</td>
                        <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                        <td class="text-left"> {{ CodeMethodPayment(item.payment_method)  }}</td>
                        <td class="text-center"> {{ item.coin  }}</td>
                        <td class="text-right"> {{ item.total  }}</td>
                        <td class="text-right"> {{ item.applied  }}</td>
                        <td class="text-right"> {{ item.balance  }}</td>
                        <td class="text-center">
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Finalizado</b-badge>
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                        </td>
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('PaymentEdit')" @click="EditPayment(item.id_payment)">Editar</b-dropdown-item>
                            <b-dropdown-item v-if="Permission('PaymentView')" @click="ViewPayment(item.id_payment)" >Ver</b-dropdown-item >
                            <b-dropdown-item v-if="Permission('PaymentDelete')" @click="ConfirmDeletePayment(item.id_payment)">Eliminar</b-dropdown-item>
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_pending" v-on:input="ListPaymentPending" :total-rows="rows_pending" :per-page="perPage_pending" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_pending }}</p>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab title="Registro de Pagos - Aplicados">
                <b-row>
              
                  <b-col md="6">
                    <b-form-group>
                      <label>Proveedor: </label>
                      <v-select @input="ListPaymentCancelled" placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider_cancelled" @search="SearchProvidersCancelled" :options="providers_cancelled"></v-select>
                    </b-form-group>
                  </b-col>

                  <b-col sm="12" md="2">
                    <b-form-group label="Desde :">
                      <b-form-input @change="ListPaymentCancelled" class="text-center" :max="to_cancelled" type="date"  v-model="from_cancelled"></b-form-input>
                      <small v-if="errors_cancelled.from_cancelled" class="form-text text-danger" >Selccione una fecha</small>
                    </b-form-group>
                  </b-col>

                  <b-col sm="12" md="2">
                    <b-form-group label="Hasta :">
                      <b-form-input @change="ListPaymentCancelled" class="text-center" :min="from_cancelled" type="date" v-model="to_cancelled"></b-form-input>
                      <small v-if="errors_cancelled.to_cancelled" class="form-text text-danger" >Selccione una fecha</small>
                    </b-form-group>
                  </b-col>
                  
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_cancelled" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListPaymentCancelled">
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
                        <th width="8%" class="text-center">Fecha</th>
                        <th width="40%" class="text-center">Cliente</th>
                         <th width="13%" class="text-center">Medio de Pago</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="6%" class="text-center">Total</th>
                        <th width="6%" class="text-center">Aplicado</th>
                        <th width="6%" class="text-center">Saldo</th>
                        <th width="7%" class="text-center">Estado</th>
                        <th width="7%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in payment_cancelled" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.broadcast_date  }}</td>
                        <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                        <td class="text-left"> {{ CodeMethodPayment(item.payment_method)  }}</td>
                        <td class="text-center"> {{ item.coin  }}</td>
                        <td class="text-right"> {{ item.total  }}</td>
                        <td class="text-right"> {{ item.applied  }}</td>
                        <td class="text-right"> {{ item.balance  }}</td>
                        <td class="text-center">
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Finalizado</b-badge>
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                        </td>
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('PaymentView')" @click="ViewPayment(item.id_payment)" >Ver</b-dropdown-item >
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_cancelled" v-on:input="ListPaymentPending" :total-rows="rows_cancelled" :per-page="perPage_cancelled" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_cancelled }}</p>
                  </b-col>
                </b-row>
              </b-tab>
            </b-tabs>








            
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <ModalAmortization />
    <ModalEECCClient />
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

import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
import LoadingComponent from './../pages/Loading'
import ModalAmortization from './components/ModalAmortization'
import ModalEECCClient from './components/ModalEECCClient'


export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
    ModalAmortization,
    ModalEECCClient,
  },
  data() {
    return {
      isLoading:false,
      module:'Payment',

      perPage_pending: 15,
      currentPage_pending: 1,
      rows_pending: 0,
      to_pending:moment(new Date()).local().format("YYYY-MM-DD"),
      from_pending:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
      search_pending: "",
      payment_pending: [],
      providers_pending: [],
      provider_pending:null,
      errors_pending:{
        to_pending:false,
        from_pending:false,
      },


      perPage_cancelled: 15,
      currentPage_cancelled: 1,
      rows_cancelled: 0,
      to_cancelled:moment(new Date()).local().format("YYYY-MM-DD"),
      from_cancelled:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
      search_cancelled: "",
      payment_cancelled: [],
      providers_cancelled: [],
      provider_cancelled:null,
      errors_cancelled:{
        to_cancelled:false,
        from_cancelled:false,
      },
    };
  },
  mounted() {
    EventBus.$on('RefreshPayment', () => {
        this.ListPaymentPending();
        this.ListPaymentCancelled();
    });

    this.ListPaymentPending();
    this.ListPaymentCancelled();
  },
  methods: {


    ListPaymentPending,
    SearchProvidersPending,
 
    ListPaymentCancelled,
    SearchProvidersCancelled,

    ShowModalAmortization,
    ShowModalEECC,
    CodeInvoice,
    CodeMethodPayment,
    EditPayment,
    ViewPayment,
    ConfirmDeletePayment,
    DeletePayment,
    Permission,
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


function SearchProvidersPending(search, loading) {
  
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

function CodeMethodPayment(code) {
  return CodeToName.NameMethodPayment(code);
}

//listar usuario
function ListPaymentPending() {
  let search = this.search_pending == "" ? "all" : this.search_pending;
  let id_provider = this.provider_pending == null ? "all": this.provider_pending.id;
  if (this.from_pending.length == 0) {this.errors_pending.from_pending = true; return false;}
  if (this.to_pending.length == 0) {this.errors_pending.to_pending = true; return false;}
  let me = this;
  let url = this.url_base + "payment/list/" +id_provider+"/1/"+ this.from_pending +"/"+this.to_pending +"/"+ search + "?page=" + this.currentPage_pending;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_pending = response.data.result.total;
        me.payment_pending = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function SearchProvidersCancelled(search, loading) {
  
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

//listar usuario
function ListPaymentCancelled() {
  let search = this.search_cancelled == "" ? "all" : this.search_cancelled;
  let id_provider = this.client_cancelled == null ? "all": this.client_cancelled.id;
  if (this.from_cancelled.length == 0) {this.errors_cancelled.from_cancelled = true; return false;}
  if (this.to_cancelled.length == 0) {this.errors_cancelled.to_cancelled = true; return false;}
  let me = this;
  let url = this.url_base + "payment/list/" +id_provider+"/2/"+ this.from_cancelled +"/"+this.to_cancelled +"/"+ search + "?page=" + this.currentPage_cancelled;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_cancelled = response.data.result.total;
        me.payment_cancelled = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

// Editar usuario
function EditPayment(id_payment) {
  this.$router.push({
    name: "PaymentEdit",
    params: { id_payment: je.encrypt(id_payment) },
  });
}

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

// Ver Usuario
function ViewPayment(id_payment) {
  this.$router.push({
    name: "PaymentView",
    params: { id_payment: je.encrypt(id_payment) },
  });
}

function ShowModalAmortization(id_payment) {
  EventBus.$emit('ModalAmortizationsShow',id_payment);
}
function ShowModalEECC() {
  EventBus.$emit('ModalEECCShow');  
}

// Confirmar eliminar
function ConfirmDeletePayment(id_payment) {
  Swal.fire({
    title: "Esta seguro de eliminar el pago?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeletePayment(id_payment);
    }
  });
}

// eliminar usuario
function DeletePayment(id_payment) {
  let me = this;
  let url = this.url_base + "payment/delete/" + id_payment;
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
        for (var i = 0; i < me.payment_pending.length; i++) {
          if (me.payment_pending[i].id_payment == id_payment) {
            me.payment_pending.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el pago', timer: 3000,})
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
