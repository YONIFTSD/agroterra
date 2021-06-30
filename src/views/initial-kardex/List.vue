<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Kardex Inicial - Listar</strong>
          </CCardHeader>
          <CCardBody>
            <b-row>

                <b-col sm="12" md="8">
            
                </b-col>

                
                <b-col md="3">
                  <b-form-group label=".">
                    <b-input-group>
                    <b-form-input v-model="search" class="form-control"></b-form-input>
                    <b-input-group-append>
                      <b-button variant="primary" @click="ListInitialKardex"><b-icon icon="search"></b-icon></b-button>
                    </b-input-group-append>
                  </b-input-group>
                  </b-form-group>
                </b-col>

                <b-col sm="6" md="1">
                  <b-form-group label=".">
                    <b-link  v-if="Permission('InitialKardexAdd')" class="btn form-control btn-primary"  :to="{ path: '/kardex-inicial/nuevo' }" append ><i class="fas fa-file"></i></b-link>
                  </b-form-group>
                </b-col>
          
            </b-row>

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="15%" class="text-center">Comprobante</th>
                    <th width="50%" class="text-center">Almacen</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_input">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.warehouse_name }}</td>
                    <td class="text-center">
                        <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                        <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('InitialKardexEdit')" @click="EditInitialKardex(item.id_initial_kardex)" >Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('InitialKardexView')"  @click="ViewInitialKardex(item.id_initial_kardex)">Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('InitialKardexDelete')" @click="ConfirmDeleteInitialKardex(item.id_initial_kardex)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage" v-on:input="ListInitialKardex" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
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
  </div>
</template>

<script>

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");
import LoadingComponent from './../pages/Loading'
export default {
  name: "RquirementList",
  components:{
      LoadingComponent,
  },
  data() {
    return {
      isLoading:false,
      module: 'InitialKardex',
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
    this.ListInitialKardex();
  },
  methods: {
    ListInitialKardex,
    EditInitialKardex,
    ViewInitialKardex,
    ConfirmDeleteInitialKardex,
    DeleteInitialKardex,
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
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};



function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
function ListInitialKardex() {


  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "initial-kardex/list/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;


  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module,role: 1,},
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
function EditInitialKardex(id_initial_kardex) {
  this.$router.push({
    name: "InitialKardexEdit",
    params: { id_initial_kardex: je.encrypt(id_initial_kardex) },
  });
}

// Ver Usuario
function ViewInitialKardex(id_initial_kardex) {
  this.$router.push({
    name: "InitialKardexView",
    params: { id_initial_kardex: je.encrypt(id_initial_kardex) },
  });
}

// Confirmar eliminar
function ConfirmDeleteInitialKardex(id_initial_kardex) {
  Swal.fire({
    title: "Esta seguro de eliminar el kardex inicial?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteInitialKardex(id_initial_kardex);
    }
  });
}

// eliminar usuario
function DeleteInitialKardex(id_initial_kardex) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "initial-kardex/delete/" + id_initial_kardex;
  axios({
    method: "delete",
    url: url,
    headers: {token: this.token, module: this.module, role: 4,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_initial_kardex == id_initial_kardex) {
            me.data_table.splice(i, 1);
            break;
          }
        }
       
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el kardex inicial', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
       me.isLoading = false;
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
