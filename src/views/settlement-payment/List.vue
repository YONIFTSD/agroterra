<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Liquidación de Pagos - Listar</strong>
          </CCardHeader>
          <CCardBody>

          <b-row>
            <b-col sm="12" md="6">
              <b-form-group>
                <label>Proveedor: </label>
                <v-select @input="ListSettlementPayment" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
              </b-form-group>
            </b-col>
            
            <b-col sm="6" md="2">
   
            </b-col>
            <b-col sm="6" md="3">
              <b-form-group label=".">
                <b-input-group>
                  <b-form-input v-model="search" class="form-control" ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListSettlementPayment">
                      <b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </b-col>
            <b-col sm="6" md="1">
              <b-form-group label=".">
                <b-link  v-if="Permission('SettlementPaymentAdd')" class="btn form-control btn-primary"  :to="{ path: '/liquidacion-de-pagos/nuevo' }" append ><i class="fas fa-file"></i></b-link>
              </b-form-group>
            </b-col>
          </b-row>
          <div class="table-responsive mt-3 height-table">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%" class="text-center">#</th>
                  <th width="8%" class="text-center">Fecha</th>
                  <th width="40%" class="text-center">Proveedor</th>
                  <th width="23%" class="text-center">Doc. Referencias</th>
                  <th width="5%" class="text-center">Moneda</th>
                  <th width="7%" class="text-center">Total</th>
                  <th width="7%" class="text-center">Estado</th>
                  <th width="7%" class="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in settlement_payment" :key="it">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-center"> {{ item.broadcast_date  }}</td>
                  <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                  <td class="text-left"> {{ item.references  }}</td>
                  <td class="text-center"> {{ item.coin  }}</td>
                  <td class="text-right"> {{ item.total  }}</td>
                  <td class="text-center">
                    <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                    <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                  </td>
                  <td class="text-center">
                    <b-dropdown bloque size="sm" text="Acciones" right>
                      <b-dropdown-item v-if="Permission('SettlementPaymentView')" @click="ViewSettlementPayment(item.id_settlement_payment)" >Ver</b-dropdown-item >
                      <b-dropdown-item v-if="Permission('SettlementPaymentDelete')" @click="ConfirmDeleteSettlementPayment(item.id_settlement_payment)">Eliminar</b-dropdown-item>
                    </b-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <b-row class="mt-4">
            <b-col md="8">
              <b-pagination v-model="currentPage" v-on:input="ListSettlementPayment" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
            </b-col>
            <b-col md="4 text-center">
              <p>Pagina Actual: {{ currentPage }}</p>
            </b-col>
          </b-row>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <ModalViewSettlementPayment />
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
import ModalViewSettlementPayment from './components/ModalViewSettlementPayment'
export default {
  name: "UsuarioList",
  components:{
    vSelect,
    LoadingComponent,
    ModalViewSettlementPayment,
  },
  data() {
    return {
      isLoading:false,
      module:'SettlementPayment',

      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      settlement_payment: [],
      providers: [],
      provider:null,

    };
  },
  mounted() {
    this.ListSettlementPayment();

  },
  methods: {
    ListSettlementPayment,
    SearchProvider,
    CodeInvoice,
    ViewSettlementPayment,
    ConfirmDeleteSettlementPayment,
    DeleteSettlementPayment,
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


//listar usuario
function ListSettlementPayment() {
  let search = this.search == "" ? "all" : this.search;
  let id_provider = this.provider == null ? "all": this.provider.id;
  let me = this;
  let url = this.url_base + "settlement-payment/list/"+ this.id_establishment +"/" +id_provider+"/"+ search + "?page=" + this.currentPage;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.settlement_payment = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}




function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ViewSettlementPayment(id_settlement_payment) {
  EventBus.$emit('ModalViewSettlementPaymentShow',id_settlement_payment);
}

// Confirmar eliminar
function ConfirmDeleteSettlementPayment(id_settlement_payment) {
  Swal.fire({
    title: "Esta seguro de eliminar la liquidación de pago?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteSettlementPayment(id_settlement_payment);
    }
  });
}

// eliminar usuario
function DeleteSettlementPayment(id_settlement_payment) {
  let me = this;
  let url = this.url_base + "settlement-payment/delete/" + id_settlement_payment;
  axios({
    method: "delete",
    url: url,
    headers: { token: this.token, module: this.module, role: 4, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.settlement_payment.length; i++) {
          if (me.settlement_payment[i].id_settlement_payment == id_settlement_payment) {
            me.settlement_payment.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado la liquidación de pago', timer: 3000,})
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
