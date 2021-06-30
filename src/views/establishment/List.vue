<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Establecimiento - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>
              
              <b-col md="8"></b-col>
              <b-col md="2">
                <b-link v-if="Permission('EstablishmentAdd')" :to="{ path: '/establecimiento/nuevo' }" variant="info" class="btn form-control btn-primary" append>NUEVO</b-link >
              </b-col>
              <b-col md="2">
                <b-input-group>
                  <b-form-input
                    v-model="search"
                    class="form-control"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button variant="info" @click="ListEstablishment">
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
                    <th width="05%" class="text-center">#</th>
                    <th width="10%" class="text-center">Código</th>
                    <th width="30%" class="text-center">Nombre</th>
                    <th width="25%" class="text-center">Nombre Corto</th>
                    <th width="7%" class="text-center">Val. Stock</th>
                    <th width="7%" class="text-center">Val. Precio</th>
                    <th width="7%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_establishment">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name }}</td>
                    <td class="text-left"> {{ item.short_name }}</td>                
                    <td class="text-center">
                      <b-badge v-if="item.validate_stock == 1" variant="success">SI</b-badge>
                      <b-badge v-if="item.validate_stock == 0" variant="warning">NO</b-badge>
                    </td> 
                    <td class="text-center">
                      <b-badge v-if="item.validate_price == 1" variant="success">SI</b-badge>
                      <b-badge v-if="item.validate_price == 0" variant="warning">NO</b-badge>
                    </td> 
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="error">Inactivo</b-badge>
                    </td> 
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item
                          v-if="Permission('EstablishmentEdit')"
                          @click="EditEstablishment(item.id_establishment)"
                          >Editar</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('EstablishmentView')"
                          @click="ViewEstablishment(item.id_establishment)"
                          >Ver</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('EstablishmentEdit')"
                       
                          @click="ShowModalWarehouse(item.id_establishment)"
                          >Almacenes</b-dropdown-item
                        >
                        <b-dropdown-item
                          v-if="Permission('EstablishmentDelete')"
                          @click="ConfirmDeleteEstablishment(item.id_establishment)"
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
                <b-pagination v-model="currentPage" v-on:input="ListEstablishment" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <ModalWarehouse ref="Warehouse"/>
  </div>
</template>
<style>
div.modal-backdrop {
    opacity: .5;
}
</style>
<script>
import ModalWarehouse from './warehouse/Warehouse'
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "EstablishmentList",
  components:{
    ModalWarehouse
  },
  data() {
    return {
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],
      id_establishment_children: null,
      
    };
  },
  mounted() {
    this.ListEstablishment();
  },
  methods: {
    ListEstablishment,
    EditEstablishment,
    ViewEstablishment,
    ConfirmDeleteEstablishment,
    DeleteEstablishment,
    Permission,
    ShowModalWarehouse,
  },
  
  computed: {
    ...mapState(["url_base"]),
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
  },
};

//listar usuario
function ListEstablishment() {

  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "establishment/list/" + search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.user.api_token,
      module: "Establishment",
      role: 1,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.data_table = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
}

// Editar usuario
function EditEstablishment(id_establishment) {
  this.$router.push({
    name: "EstablishmentEdit",
    params: { id_establishment: je.encrypt(id_establishment) },
  });
}

// Ver Usuario
function ViewEstablishment(id_establishment) {
  this.$router.push({
    name: "EstablishmentView",
    params: { id_establishment: je.encrypt(id_establishment) },
  });
}

// Confirmar eliminar
function ConfirmDeleteEstablishment(id_establishment) {
  Swal.fire({
    title: "Esta seguro de eliminar el establecimiento?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteEstablishment(id_establishment);
    }
  });
}

// eliminar usuario
function DeleteEstablishment(id_establishment) {
  let me = this;
  let url = this.url_base + "establishment/delete/" + id_establishment;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.user.token,
      module: "Establishment",
      role: 4,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_establishment == id_establishment) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el establecimiento', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 2000,})
      }
    })
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



function ShowModalWarehouse(id_establishment) {
  this.$refs.Warehouse.ListWarehouse(id_establishment);
}
</script>
