<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cuentas por Cobrar - Listar</strong>
          </CCardHeader>
          <CCardBody>

            <b-tabs content-class="mt-3">
              <b-tab title="Cuentas por Cobrar - Pendientes" active>
                <b-row>
                  <b-col sm="12" md="5">
                      <b-form-group label="Cliente:">
                        <v-select @input="ListAccountReceivablePending" placeholder="Todos" class="w-100" :filterable="false" label="full_name" v-model="client_pending" @search="SearchClientsPending" :options="clients_pending"></v-select>
                      </b-form-group>
                    </b-col>
                  
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-button class="form-control" @click="ShowModalEECC" type="button" variant="primary">VER EECC</b-button>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="1">
                  </b-col>
                  <b-col sm="6" md="3">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_pending" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListAccountReceivablePending">
                            <b-icon icon="search"></b-icon></b-button>
                        </b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col sm="6" md="1">
                  <b-form-group label=".">
                    <b-link  v-if="Permission('AccountReceivableAdd')" class="btn form-control btn-primary"  :to="{ path: '/cuentas-por-cobrar/nuevo' }" append ><i class="fas fa-file"></i></b-link>
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
                        <th width="40%" class="text-center">Cliente</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="8%" class="text-center">Total</th>
                        <th width="8%" class="text-center">Saldo</th>
                        <th width="8%" class="text-center">Estado</th>
                        <th width="8%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in accoun_receivable_pending" :key="it">
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
                            <b-dropdown-item v-if="Permission('AccountReceivableEdit') && item.id_sale == 0" @click="EditAccountReceivable(item.id_account_receivable)">Editar</b-dropdown-item>
                            <b-dropdown-item v-if="Permission('AccountReceivableView')" @click="ViewAccountReceivable(item.id_account_receivable)" >Ver</b-dropdown-item >
                            <b-dropdown-item v-if="Permission('AccountReceivableDelete')  && item.id_sale == 0" @click="ConfirmDeleteAccountReceivable(item.id_account_receivable)">Eliminar</b-dropdown-item>
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_pending" v-on:input="ListAccountReceivablePending" :total-rows="rows_pending" :per-page="perPage_pending" align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center">
                    <p>Pagina Actual: {{ currentPage_pending }}</p>
                  </b-col>
                </b-row>
              </b-tab>
              <b-tab title="Cuentas por Cobrar - Canceladas">
                <b-row>
                  <b-col sm="12" md="5">
                      <b-form-group label="Cliente:">
                        <v-select @input="ListAccountReceivableCancelled" placeholder="Todos" class="w-100" :filterable="false" label="full_name" v-model="client_cancelled" @search="SearchClientsCancelled" :options="clients_cancelled"></v-select>
                      </b-form-group>
                    </b-col>
                  <b-col sm="6" md="5">
                    <!-- <b-link v-if="Permission('IncomeAdd')"  class="btn form-control btn-primary" :to="{ path: '/ingresos/nuevo' }" append>NUEVO</b-link> -->
                  </b-col>
                  <b-col sm="6" md="2">
                    <b-form-group label=".">
                      <b-input-group>
                        <b-form-input v-model="search_cancelled" class="form-control" ></b-form-input>
                        <b-input-group-append>
                          <b-button variant="primary" @click="ListAccountReceivableCancelled">
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
                        <th width="40%" class="text-center">Cliente</th>
                        <th width="5%" class="text-center">Moneda</th>
                        <th width="8%" class="text-center">Total</th>
                        <th width="8%" class="text-center">Saldo</th>
                        <th width="8%" class="text-center">Estado</th>
                        <th width="8%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in accoun_receivable_cancelled" :key="it">
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
                            <b-dropdown-item v-if="Permission('IncomeView')" @click="ViewAccountReceivable(item.id_account_receivable)" >Ver</b-dropdown-item >
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage_cancelled" v-on:input="ListAccountReceivablePending" :total-rows="rows_cancelled" :per-page="perPage_cancelled" align="center"></b-pagination>
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
      module:'AccountReceivable',

      perPage_pending: 15,
      currentPage_pending: 1,
      rows_pending: 0,
      search_pending: "",
      accoun_receivable_pending: [],
      clients_pending: [],
      client_pending:null,


      perPage_cancelled: 15,
      currentPage_cancelled: 1,
      rows_cancelled: 0,
      search_cancelled: "",
      accoun_receivable_cancelled: [],
      clients_cancelled: [],
      client_cancelled:null,
    };
  },
  mounted() {
    EventBus.$on('RefreshAccountReceivable', () => {
        this.ListAccountReceivablePending();
        this.ListAccountReceivableCancelled();
    });

    this.ListAccountReceivablePending();
    this.ListAccountReceivableCancelled();
  },
  methods: {
    ListAccountReceivablePending,
    SearchClientsPending,
 
    ListAccountReceivableCancelled,
    SearchClientsCancelled,

    ShowModalAmortization,
    ShowModalEECC,
    CodeInvoice,
    EditAccountReceivable,
    ViewAccountReceivable,
    ConfirmDeleteAccountReceivable,
    DeleteAccountReceivable,
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

function SearchClientsPending(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients_pending = response.data;
            loading(false);
      })
    }
}



//listar usuario
function ListAccountReceivablePending() {
  let search = this.search_pending == "" ? "all" : this.search_pending;
  let id_client = this.client_pending == null ? "all": this.client_pending.id;
  let me = this;
  let url = this.url_base + "account-receivable/list/"+ this.id_establishment +"/1/" +id_client+"/"+ search + "?page=" + this.currentPage_pending;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_pending = response.data.result.total;
        me.accoun_receivable_pending = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function SearchClientsCancelled(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients_cancelled = response.data;
            loading(false);
      })
    }
}



//listar usuario
function ListAccountReceivableCancelled() {
  let search = this.search_cancelled == "" ? "all" : this.search_cancelled;
  let id_client = this.client_cancelled == null ? "all": this.client_cancelled.id;
  let me = this;
  let url = this.url_base + "account-receivable/list/"+ this.id_establishment +"/2/" +id_client+"/"+ search + "?page=" + this.currentPage_cancelled;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_cancelled = response.data.result.total;
        me.accoun_receivable_cancelled = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

// Editar usuario
function EditAccountReceivable(id_account_receivable) {
  this.$router.push({
    name: "AccountReceivableEdit",
    params: { id_account_receivable: je.encrypt(id_account_receivable) },
  });
}

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

// Ver Usuario
function ViewAccountReceivable(id_account_receivable) {
  this.$router.push({
    name: "AccountReceivableView",
    params: { id_account_receivable: je.encrypt(id_account_receivable) },
  });
}

function ShowModalAmortization(id_account_receivable) {
  EventBus.$emit('ModalAmortizationsShow',id_account_receivable);
}
function ShowModalEECC() {
  EventBus.$emit('ModalEECCShow');  
}

// Confirmar eliminar
function ConfirmDeleteAccountReceivable(id_account_receivable) {
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
      this.DeleteAccountReceivable(id_account_receivable);
    }
  });
}

// eliminar usuario
function DeleteAccountReceivable(id_account_receivable) {
  let me = this;
  let url = this.url_base + "account-receivable/delete/" + id_account_receivable;
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
        for (var i = 0; i < me.accoun_receivable_pending.length; i++) {
          if (me.accoun_receivable_pending[i].id_account_receivable == id_account_receivable) {
            me.accoun_receivable_pending.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha anulado la cuenta por cobrar', timer: 3000,})
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
