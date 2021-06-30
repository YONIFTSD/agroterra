<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Tipo Usuario - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col md="8"></b-col>
              <b-col md="2">
                <b-link
                  v-if="Permission('UserTypeAdd')"
                  class="btn form-control btn-primary"
                  :to="{ path: '/tipo-usuario/nuevo' }"
                  append
                  >NUEVO</b-link
                >
              </b-col>
              <b-col md="2">
                <b-input-group>
                  <b-form-input
                    v-model="search"
                    class="form-control"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListUserType">
                      <b-icon icon="search"></b-icon
                    ></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="30%" class="text-center">Nombre</th>
                    <th width="45%" class="text-center">Descripción</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="15%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_user_type">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left">{{ item.name }}</td>
                    <td class="text-left">{{ item.description }}</td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item
                          v-if="Permission('UserTypeEdit')"
                          @click="EditUserType(item.id_user_type)"
                          >Editar</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('UserTypeView')"
                          @click="ViewUserType(item.id_user_type)"
                          >Ver</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('UserTypeDelete')"
                          @click="ConfirmDeleteUserType(item.id_user_type)"
                          >Eliminar</b-dropdown-item
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
                  v-on:input="ListUserType"
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

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "UserTypeList",
  data() {
    return {
      module: 'UserType',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListUserType();
  },
  methods: {
    ListUserType,
    EditUserType,
    ViewUserType,
    ConfirmDeleteUserType,
    DeleteUserType,
    Permission,
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};

//listar usuario
function ListUserType() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "user-type/list/" + search + "?page=" + this.currentPage;

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
function EditUserType(id_user_type) {
  this.$router.push({
    name: "UserTypeEdit",
    params: { id_user_type: je.encrypt(id_user_type) },
  });
}

// Ver Usuario
function ViewUserType(id_user_type) {
  this.$router.push({
    name: "UserTypeView",
    params: { id_user_type: je.encrypt(id_user_type) },
  });
}

// Confirmar eliminar
function ConfirmDeleteUserType(id_user_type) {
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
      this.DeleteUserType(id_user_type);
    }
  });
}

// eliminar usuario
function DeleteUserType(id_user_type) {
  let me = this;
  let url = this.url_base + "user-type/delete/" + id_user_type;
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
          if (me.data_table[i].id_user_type == id_user_type) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Eliminado!", "El registro ha sido eliminado", "success");
      } else {
        Swal.fire(
          "A Ocurrido un error",
          "El registro no ha sido eliminado",
          "error"
        );
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
