<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cierre de Caja - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="8"></b-col>
              <b-col sm="6" md="3">
                <b-input-group>
                  <b-form-input v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListCash">
                      <b-icon icon="search"></b-icon
                    ></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col sm="6" md="1">
                <b-link v-if="Permission('CashAdd')" class="btn form-control btn-primary" :to="{ path: '/caja/nuevo' }" append><i class="fas fa-file"></i></b-link>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="5%" class="text-center">Nro Caja</th>
                    <th width="14%" class="text-center">Fecha Inicio</th>
                    <th width="14%" class="text-center">Fecha Final</th>
                    <th width="23%" class="text-center">Usuario</th>
                    <th width="7%" class="text-center">Soles</th>
                    <th width="7%" class="text-center">Dolares</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="8%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="align-middle text-center">{{ it + 1 }}</td>
                    <td class="align-middle text-left"> {{ item.cash_number }}</td>
                    <td class="align-middle text-center"> {{ item.start_date }}</td>
                    <td class="align-middle text-center"> {{ item.end_date }}</td>
                    <td class="align-middle text-left"> {{ item.user }}</td>
                    <td class="align-middle text-right"> {{ item.total_income_pen }}</td>
                    <td class="align-middle text-right"> {{ item.total_income_usd }}</td>
                    <td class="align-middle text-center">
                      <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                      <b-badge v-if="item.state == 2" variant="success">Finalizado</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                  
                    </td>
                    <td class="align-middle text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item
                          v-if="Permission('CashEdit') && item.state == 2"
                          @click="EditCash(item.id_cash)"
                          >Editar</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('CashView') && item.state != 1"
                          @click="ViewCash(item.id_cash)"
                          >Ver</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('CashDelete') && item.state != 0"
                          @click="ConfirmDeleteCash(item.id_cash)"
                          >Anular</b-dropdown-item
                        >
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination
                  v-model="currentPage"
                  v-on:input="ListCash"
                  :total-rows="rows"
                  :per-page="perPage"
                  align="center"
                ></b-pagination>
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
<style>
td{
  vertical-align: middle;
}
</style>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "CashList",
  data() {
    return {
      module:'Cash',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListCash();
  },
  methods: {
    ListCash,
    EditCash,
    ViewCash,
    ConfirmDeleteCash,
    DeleteCash,
    Permission,
  },

  computed: {
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



//listar usuario
function ListCash() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "cash/list/"+this.id_establishment+"/" + search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 1,
    },
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
function EditCash(id_cash) {
  this.$router.push({
    name: "CashEdit",
    params: { id_cash: je.encrypt(id_cash) },
  });
}

// Ver Usuario
function ViewCash(id_cash) {
  this.$router.push({
    name: "CashView",
    params: { id_cash: je.encrypt(id_cash) },
  });
}

// Confirmar eliminar
function ConfirmDeleteCash(id_cash) {
  Swal.fire({
    title: "Esta seguro de anular la caja?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteCash(id_cash);
    }
  });
}

// eliminar usuario
function DeleteCash(id_cash) {
  let me = this;
  let url = this.url_base + "cash/cancel/" + id_cash;
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
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_cash == id_cash) {
            me.data_table[i].state = 0;
            break;
          }
        }
        Swal.fire("Eliminado!", "Se ha anulado la caja", "success");
      } else {
        Swal.fire( "A Ocurrido un error", "El registro no ha sido anulado", "error");
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
