<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Gastos de Compra - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="5">
                <b-form-group>
                  <label>Proveedor: </label>
                  <v-select @input="ListPurchaseExpenses" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="2">
                <b-form-group label="Desde :">
                  <b-form-input @change="ListPurchaseExpenses" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
                  <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="2">
                <b-form-group label="Hasta :">
                  <b-form-input @change="ListPurchaseExpenses" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
                  <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                </b-form-group>
              </b-col>
              
              <b-col sm="6" md="2">
                <b-form-group label=".">
                  <b-input-group>
                  <b-form-input v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListPurchaseExpenses"><b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
                </b-form-group>
              </b-col>

              <b-col sm="6" md="1">
                <b-form-group label=".">
                  <b-link  v-if="Permission('PurchaseExpensesAdd')" class="btn form-control btn-primary"  :to="{ path: '/gastos-compra/nuevo' }" append ><i class="fas fa-file"></i></b-link>
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
                    <th width="8%" class="text-center">Estado</th>
                    <th width="8%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date  }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                    <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                    <td class="text-center"> {{ item.coin  }}</td>
                    <td class="text-right"> {{ item.total  }}</td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="primary">Realizado</b-badge>
                      <b-badge v-if="item.state == 2" variant="success">Finalizado</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('PurchaseExpensesEdit')" @click="EditPurchaseExpenses(item.id_purchase_expenses)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('PurchaseExpensesView')" @click="ViewPurchaseExpenses(item.id_purchase_expenses)" >Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('PurchaseExpensesDelete')" @click="ConfirmDeletePurchaseExpenses(item.id_purchase_expenses)">Eliminar</b-dropdown-item >
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage"  v-on:input="ListPurchaseExpenses" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center"><p>Pagina Actual: {{ currentPage }}</p></b-col>
            </b-row>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
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
import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");

export default {
  name: "UsuarioList",
  components:{
      vSelect,
  },
  data() {
    return {
      module:'PurchaseExpenses',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],

      id_provider:0,
      to:moment(new Date()).local().format("YYYY-MM-DD"),
      from:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
      search: "",
      providers: [],
      provider:null,
      errors:{
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListPurchaseExpenses();
  },
  methods: {
    ListPurchaseExpenses,
    EditPurchaseExpenses,
    ViewPurchaseExpenses,
    ConfirmDeletePurchaseExpenses,
    DeletePurchaseExpenses,
    Permission,
    CodeInvoice,
    SearchProvider,
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

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
//listar usuario
function ListPurchaseExpenses() {
  this.errors.from = false;
  this.errors.to = false;

  let id_provider = this.provider == null ? 0 : this.provider.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "purchase-expenses/list/" + id_provider + "/" + this.from + "/" + this.to + "/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {token: this.token,module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.data_table = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

// Editar usuario
function EditPurchaseExpenses(id_purchase_expenses) {
  this.$router.push({
    name: "PurchaseExpensesEdit",
    params: { id_purchase_expenses: je.encrypt(id_purchase_expenses) },
  });
}

// Ver Usuario
function ViewPurchaseExpenses(id_purchase_expenses) {
  this.$router.push({
    name: "PurchaseExpensesView",
    params: { id_purchase_expenses: je.encrypt(id_purchase_expenses) },
  });
}

// Confirmar eliminar
function ConfirmDeletePurchaseExpenses(id_purchase_expenses) {
  Swal.fire({
    title: "Esta seguro de eliminar el registro?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeletePurchaseExpenses(id_purchase_expenses);
    }
  });
}

// eliminar usuario
function DeletePurchaseExpenses(id_purchase_expenses) {
  let me = this;
  let url = this.url_base + "purchase-expenses/delete/" + id_purchase_expenses;
  axios({
    method: "delete",
    url: url,
    headers: { token: this.token, module: this.module, role: 4,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_purchase_expenses == id_purchase_expenses) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'El registro ha sido eliminado', timer: 3000,})
      }else if(response.data.status == 400){
          Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }else {
        Swal.fire({ icon: 'error', text: 'El registro no ha sido eliminado', timer: 3000,})
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
