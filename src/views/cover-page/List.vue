<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Portadas - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="8"></b-col>
              <b-col sm="6" md="2">
                <b-link  v-if="Permission('WebPageAdd')" class="btn form-control btn-primary" :to="{ path: '/portadas/nuevo' }" append>NUEVO</b-link>
              </b-col>
              <b-col sm="6" md="2">
                <b-input-group>
                  <b-form-input v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListCoverPage">
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
                    <th width="35%" class="text-center">Titulo</th>
                    <th width="40%" class="text-center">url</th>
                    <th width="10%" class="text-center">Imagen</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left"> {{ item.title }}</td>
                    <td class="text-left"> {{ item.url }}</td>
                    <td class="text-center">
                      <b-card-img :src="url_base + item.photo"></b-card-img>
                    </td>
                    
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('WebPageEdit')" @click="EditCoverPage(item.id_cover_page)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('WebPageView')" @click="ViewCoverPage(item.id_cover_page)" >Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('WebPageDelete')" @click="ConfirmDeleteCoverPage(item.id_cover_page)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListCoverPage" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
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
  name: "UsuarioList",
  data() {
    return {
      module:'WebPage',
      role:1,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListCoverPage();
  },
  methods: {
    ListCoverPage,
    EditCoverPage,
    ViewCoverPage,
    ConfirmDeleteCoverPage,
    DeleteCoverPage,
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
function ListCoverPage() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "cover-page/list/" + search + "?page=" + this.currentPage;

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
function EditCoverPage(id_cover_page) {
  this.$router.push({
    name: "CoverPageEdit",
    params: { id_cover_page: je.encrypt(id_cover_page) },
  });
}

// Ver Usuario
function ViewCoverPage(id_cover_page) {
  this.$router.push({
    name: "CoverPageView",
    params: { id_cover_page: je.encrypt(id_cover_page) },
  });
}

// Confirmar eliminar
function ConfirmDeleteCoverPage(id_cover_page) {
  Swal.fire({
    title: "Esta seguro de eliminar la marca?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteCoverPage(id_cover_page);
    }
  });
}

// eliminar usuario
function DeleteCoverPage(id_cover_page) {
  let me = this;
  let url = this.url_base + "cover-page/delete/" + id_cover_page;
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
          if (me.data_table[i].id_cover_page == id_cover_page) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'La marca se ha sido eliminado', timer: 3000,})
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
