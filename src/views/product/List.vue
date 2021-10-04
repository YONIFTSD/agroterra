<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Producto - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              <b-col sm="12" md="7"></b-col>

              
               <b-col sm="12" md="1">
                  <b-link v-if="Permission('ProductAdd')" class="btn form-control btn-warning" :to="{ path: '/producto/importar' }" title="Importar Productos" append><i class="fas fa-file-upload"></i></b-link>
              </b-col>

              <b-col sm="12" md="1">
                  <b-button type="button" title="Exportar Excel" @click="ExportExcel" class="form-control" variant="success"><i class="fas fa-file-excel"></i></b-button>
              </b-col>
              <b-col sm="6" md="2">
                <b-input-group>
                  <b-form-input  v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListProduct"><b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-col>
              <b-col sm="6" md="1">
                <b-link v-if="Permission('ProductAdd')" class="btn form-control btn-primary" :to="{ path: '/producto/nuevo' }" append><i class="fas fa-file"></i></b-link>
              </b-col>
            </b-row>
            <div v-if="type_business != 2" class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="6%" class="text-center">Código</th>
                    <th width="43%" class="text-center">Nombre</th>
                    <th width="10%" class="text-center">Categoria</th>
                    <th width="10%" class="text-center">Marca</th>
                    <th width="23%" class="text-center">Proveedor</th>
                    <th width="6%" class="text-center">Estado</th>
                    <th width="8%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_product">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name + (item.presentation.length == 0 ? "": " - "+item.presentation) }}</td>
                    <td class="text-left"> {{ item.category_name }}</td>
                    <td class="text-left"> {{ item.brand_name }}</td>
                    <td class="text-left"> {{ item.provider_name }}</td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('ProductEdit')" @click="EditProduct(item.id_product)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('ProductView')" @click="ViewProduct(item.id_product)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('ProductDelete')" @click="ConfirmDeleteProduct(item.id_product)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-if="type_business == 2" class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    
                    <th width="6%" class="text-center">Código</th>
                    <th width="40%" class="text-center">Nombre</th>
                    <th width="10%" class="text-center">Categoria</th>
                    <th width="10%" class="text-center">Marca</th>
                    <th width="23%" class="text-center">Proveedor</th>
                    <th width="6%" class="text-center">Foto</th>
                    <th width="6%" class="text-center">Estado</th>
                    <th width="8%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_product">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name + (item.presentation.length == 0 ? "": " - "+item.presentation) }}</td>
                    <td class="text-left"> {{ item.category_name }}</td>
                    <td class="text-left"> {{ item.brand_name }}</td>
                    <td class="text-left"> {{ item.provider_name }}</td>
                    <td class="text-center">
                      <b-card-img :src="url_base + item.photo"></b-card-img>
                    </td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('ProductEdit')" @click="EditProduct(item.id_product)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('ProductView')" @click="ViewProduct(item.id_product)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('ProductDelete')" @click="ConfirmDeleteProduct(item.id_product)">Eliminar</b-dropdown-item>
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
                  v-on:input="ListProduct"
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
  name: "UsuarioList",
  data() {
    return {
      module:'Product',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
    };
  },
  mounted() {
    this.ListProduct();
  },
  methods: {
    ListProduct,
    EditProduct,
    ViewProduct,
    ConfirmDeleteProduct,
    DeleteProduct,
    Permission,
    ExportExcel,
  },

  computed: {
    ...mapState(["url_base"]),
    type_business: function () {
      let type_business = window.localStorage.getItem("type_business");
      type_business = JSON.parse(JSON.parse(je.decrypt(type_business)));
      return type_business.type_business;
    },
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};

//listar usuario
function ListProduct() {
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url =
    this.url_base + "product/list/" + search + "?page=" + this.currentPage;

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
function EditProduct(id_product) {
  this.$router.push({
    name: "ProductEdit",
    params: { id_product: je.encrypt(id_product) },
  });
}

// Ver Usuario
function ViewProduct(id_product) {
  this.$router.push({
    name: "ProductView",
    params: { id_product: je.encrypt(id_product) },
  });
}

function ExportExcel() {  
  let url = this.url_base + "excel-products";
  window.open(url,'_blank');
}

// Confirmar eliminar
function ConfirmDeleteProduct(id_product) {
  Swal.fire({
    title: "Esta seguro de eliminar el producto?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteProduct(id_product);
    }
  });
}

// eliminar usuario
function DeleteProduct(id_product) {
  let me = this;
  let url = this.url_base + "product/delete/" + id_product;
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
          if (me.data_table[i].id_product == id_product) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'El producto ha sido elimimado', timer: 3000,})
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
