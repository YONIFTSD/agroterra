<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Entrada - Listar</strong>
          </CCardHeader>
          <CCardBody>

            <b-row>
              <b-col sm="12" md="5">
                <b-form-group>
                  <label>Proveedor: </label>
                  <v-select @input="ListInput" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="2">
                <b-form-group label="Desde :">
                  <b-form-input @change="ListInput" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
                  <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="2">
                <b-form-group label="Hasta :">
                  <b-form-input @change="ListInput" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
                  <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                </b-form-group>
              </b-col>
              
              <b-col sm="6" md="2">
                <b-form-group label=".">
                  <b-input-group>
                  <b-form-input v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListInput"><b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
                </b-form-group>
              </b-col>

              <b-col sm="6" md="1">
                <b-form-group label=".">
                  <b-link  v-if="Permission('InputAdd')" class="btn form-control btn-primary"  :to="{ path: '/entrada/nuevo' }" append ><i class="fas fa-file"></i></b-link>
                </b-form-group>
              </b-col>
            </b-row>

        

            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="15%" class="text-center">Comprobante</th>
                    <th width="45%" class="text-center">Razón Social</th>
                    <th width="10%" class="text-center">Usuario</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_input">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.provider_name + ' - '+item.provider_document_number }}</td>
                    <td class="text-left"> {{ Substr(item.user_email,23)}} </td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="info">Pendiente</b-badge>
                      <b-badge v-if="item.state == 2" variant="success">Finalizado</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('InputEdit')  && item.state == 1" @click="EditInput(item.id_input)" >Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('InputView')"  @click="ViewInput(item.id_input)" >Ver</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('InputEdit')  && item.state == 1" @click="ConfirmCancelInput(item.id_input)">Anular</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('InputDelete')  && item.state == 1" @click="ConfirmDeleteInput(item.id_input)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage"  v-on:input="ListInput"  :total-rows="rows"  :per-page="perPage" align="center" ></b-pagination>
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
  name: "EntradaList",
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'Input',
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
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
    this.ListInput();
  },
  methods: {
    ListInput,
    EditInput,
    ViewInput,
    ConfirmDeleteInput,
    DeleteInput,
    ConfirmCancelInput,
    CancelInput,
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
function ListInput() {
  
  this.errors.from = false;
  this.errors.to = false;

  let id_provider = this.provider == null ? 0 : this.provider.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "input/list/" + id_provider + "/" + this.from + "/" + this.to + "/"+this.id_establishment + "/" + search + "?page=" + this.currentPage;


  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module,role: 1,},
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
function EditInput(id_input) {
  this.$router.push({
    name: "InputEdit",
    params: { id_input: je.encrypt(id_input) },
  });
}

// Ver Usuario
function ViewInput(id_input) {
  this.$router.push({
    name: "InputView",
    params: { id_input: je.encrypt(id_input) },
  });
}

// Confirmar eliminar
function ConfirmDeleteInput(id_input) {
  Swal.fire({
    title: "Esta seguro de eliminar la entrada?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteInput(id_input);
    }
  });
}

// eliminar usuario
function DeleteInput(id_input) {
  let me = this;
  let url = this.url_base + "input/delete/" + id_input;
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
          if (me.data_table[i].id_input == id_input) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado la entrada', timer: 2000, })
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',  text: 'A ocurrido un error',  timer: 2000, })
    });
}



// Confirmar eliminar
function ConfirmCancelInput(id_input) {
  Swal.fire({
    title: "Esta seguro de anular la entrada?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.CancelInput(id_input);
    }
  });
}

// eliminar usuario
function CancelInput(id_input) {
  let me = this;
  let url = this.url_base + "input/cancel/" + id_input;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_input == id_input) {
            me.data_table[i].state = 0;
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha anulado la entrada', timer: 2000, })
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',  text: 'A ocurrido un error',  timer: 2000, })
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
