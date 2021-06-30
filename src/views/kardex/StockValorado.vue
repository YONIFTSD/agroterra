<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Stock Valorado</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>

                <b-col sm="12" md="8">
            
                </b-col>

     
                
                <b-col sm="6" md="4">
                  <b-form-group label=".">
                    <b-input-group>
                    <b-form-input v-model="search" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="primary" @click="ListStockGeneral"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>

            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th rowspan="2" width="5%" class="text-center">#</th>
                    <th rowspan="2" width="8%" class="text-center">Codigo</th>
                    <th rowspan="2" width="40%" class="text-center">Nombre</th>
                    <th rowspan="2" width="10%" class="text-center">Categoria</th>
                    <th :colspan="item.quantity" width="10%" class="text-center" v-for="(item, it) in establishments" :key="it">{{ item.name }}</th>
                  </tr>
                  <tr>
                    <th class="text-center" v-for="(item, it) in warehouses" :key="it">{{ item.name }}</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name + " - "+item.presentation }}</td>
                    <td class="text-left"> {{ item.category_name }}</td>
                    <td class="text-center" v-for="(stock, it1) in item.stock" :key="it1">
                       {{stock.quantity}}
                    </td>
                
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListStockGeneral" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script>

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");

export default {
  name: "RquirementList",
  data() {
    return {
      module: 'StockGeneral',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      data_table: [],
      establishments:[],
      warehouses:[],

      search: "",
      errors:{
        to:false,
        from:false,
      }
    };
  },
  mounted() {
    this.ListEstablishmentAndWarehouses();
    this.ListStockGeneral();
  },
  methods: {
    ListStockGeneral,
    ListEstablishmentAndWarehouses,
    ViewRequirement,
    ConfirmDeleteRequirement,
    DeleteRequirement,
    Permission,

    CodeInvoice,
    Substr,
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
function Substr(name,limit) {
  if (name.length > limit ) {
    return name.substr(0,limit)+'...';
  }else{
    return name;
  }
}
//listar usuario
function ListStockGeneral() {


  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "kardex/stock-general/" + search + "?page=" + this.currentPage;


  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.table.total;
        me.data_table = response.data.result.products;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

// Editar usuario
function ListEstablishmentAndWarehouses() {
  let me = this;
  let url = this.url_base + "establishment/list-establishment-warehouses";
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.establishments = response.data.result.establishments;
        me.warehouses = response.data.result.warehouses;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    });
}

// Ver Usuario
function ViewRequirement(id_requirement) {
  this.$router.push({
    name: "RequirementView",
    params: { id_requirement: je.encrypt(id_requirement) },
  });
}

// Confirmar eliminar
function ConfirmDeleteRequirement(id_requirement) {
  Swal.fire({
    title: "Esta seguro de eliminar el requerimiento?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteRequirement(id_requirement);
    }
  });
}

// eliminar usuario
function DeleteRequirement(id_requirement) {
  let me = this;
  let url = this.url_base + "requirement/delete/" + id_requirement;
  axios({
    method: "delete",
    url: url,
    headers: {token: this.token, module: this.module, role: 4,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_requirement == id_requirement) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el requerimiento', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',text: 'A ocurrido un error',timer: 2000,})
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
