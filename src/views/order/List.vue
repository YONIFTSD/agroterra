<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Pedidos - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col md="8"></b-col>
              <b-col md="2">
                <!-- <b-link  v-if="Permission('OrderAdd')" variant="info" class="btn form-control btn-primary" :to="{ path: '/pedido/nuevo' }"append >NUEVO</b-link> -->
              </b-col>
              <b-col md="2">
                <b-input-group>
                  <b-form-input v-model="search"  class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListOrders"><b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="7%" class="text-center">N° Pedido</th>
                    <th width="30%" class="text-center">Cliente</th>
                    <th width="15%" class="text-center">Email</th>
                    <th width="10%" class="text-center">Teléfono</th>
                    <th width="8%" class="text-center">Total</th>
                    <th width="7%" class="text-center">Estado</th>
                    <th width="7%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.created_at }}</td>
                    <td class="text-center"> {{ item.number_of_order }}</td>
                    <td class="text-left"> {{ item.client_name + ' - '+item.client_document_number }}</td>
                    <td class="text-left"> {{ item.client_email }} </td>
                    <td class="text-left"> {{ item.client_phone }} </td>
                    <td class="text-right"> {{ item.total }} </td>
                    <td class="text-center">
                          <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                          <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                          <b-badge v-if="item.state == 2" variant="info">En Proceso</b-badge>
                          <b-badge v-if="item.state == 3" variant="success">Finalizado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('OrderEdit')" @click="EditOrder(item.id_order)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('OrderView')"  @click="ViewOrder(item.id_order)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('OrderDelete')" @click="ConfirmDeleteOrder(item.id_order)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListOrders" :total-rows="rows"  :per-page="perPage" align="center"></b-pagination>
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

export default {
  name: "UsuarioList",
  data() {
    return {
      module:'Order',
      role:1,
      perPage: 30,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListOrders();
  },
  methods: {
    ListOrders,
    EditOrder,
    ViewOrder,
    ConfirmDeleteOrder,
    DeleteOrder,
    Permission,
    CodeInvoice,
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let id_establishment = window.localStorage.getItem("id_establishment");
      id_establishment = JSON.parse(je.decrypt(id_establishment));
      return id_establishment;
    },
  },
};

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
//listar usuario
function ListOrders() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "order/list/"+ search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {token: this.token, module: this.module,role: this.role,},
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
function EditOrder(id_order) {
  this.$router.push({
    name: "OrderEdit",
    params: { id_order: je.encrypt(id_order) },
  });
}

// Ver Usuario
function ViewOrder(id_order) {
  this.$router.push({
    name: "OrderView",
    params: { id_order: je.encrypt(id_order) },
  });
}

// Confirmar eliminar
function ConfirmDeleteOrder(id_order) {
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
      this.DeleteOrder(id_order);
    }
  });
}

// eliminar usuario
function DeleteOrder(id_order) {
  let me = this;
  let url = this.url_base + "order/delete/" + id_order;
  axios({
    method: "delete",
    url: url,
    headers: { token: this.token, module: this.module, role: 4},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_order == id_order) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Eliminado!", "El registro ha sido eliminado", "success");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
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
