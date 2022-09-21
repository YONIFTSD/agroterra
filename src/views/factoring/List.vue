<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Categoria - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="8"></b-col>
             
              <b-col sm="6" md="3">
                <b-input-group>
                  <b-form-input v-model="search" class="form-control" ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListCategory">
                      <b-icon icon="search"></b-icon
                    ></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
               <b-col sm="6" md="1">
                <b-link v-if="Permission('CategoryAdd')" class="btn form-control btn-primary" :to="{ path: '/categoria/nuevo' }" append ><i class="fas fa-file"></i></b-link >
              </b-col>
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="35%" class="text-center">Nombre</th>
                    <th width="40%" class="text-center">Descripción</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_category">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left"> {{ item.name }}</td>
                    <td class="text-left"> {{ item.description }}</td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        
                        <b-dropdown-item v-if="Permission('CategoryEdit')" @click="ModalCategoriesShow(item.id_category)" >Subcategorias</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('CategoryEdit')" @click="EditCategory(item.id_category)" >Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('CategoryView')" @click="ViewCategory(item.id_category)" >Ver</b-dropdown-item >
                        <b-dropdown-item v-if="Permission('CategoryDelete')"  @click="ConfirmDeleteCategory(item.id_category)" >Eliminar</b-dropdown-item>
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
                  v-on:input="ListCategory"
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

    <ModalSubcategories/>
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import ModalSubcategories from './components/ModalSubcategories'
import EventBus from "@/assets/js/EventBus";

export default {
  name: "UsuarioList",
  components:{
    ModalSubcategories
  },
  
  data() {
    return {
      module:'Category',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListCategory();
  },
  methods: {
    ListCategory,
    EditCategory,
    ViewCategory,
    ConfirmDeleteCategory,
    DeleteCategory,
    Permission,
    ModalCategoriesShow,
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
function ListCategory() {
  let url = this.url_base + "factoring/generation-token";
  axios({
    method: "GET",
    url: url,
    headers: {token: this.token, module: this.module, role: 1, },
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
function EditCategory(id_category) {
  this.$router.push({
    name: "CategoryEdit",
    params: { id_category: je.encrypt(id_category) },
  });
}

// Ver Usuario
function ViewCategory(id_category) {
  this.$router.push({
    name: "CategoryView",
    params: { id_category: je.encrypt(id_category) },
  });
}

function ModalCategoriesShow(id_category) {
  EventBus.$emit('ModalAmortizationsShow',id_category);
}
// Confirmar eliminar
function ConfirmDeleteCategory(id_category) {
  Swal.fire({
    title: "Esta seguro de eliminar la categoria ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteCategory(id_category);
    }
  });
}

// eliminar usuario
function DeleteCategory(id_category) {
  let me = this;
  let url = this.url_base + "category/delete/" + id_category;
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
          if (me.data_table[i].id_category == id_category) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Eliminado!", "Se ha eliminado la categoria", "success");
      } else {
        Swal.fire("A Ocurrido un error", "El registro no ha sido eliminado", "error");
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
