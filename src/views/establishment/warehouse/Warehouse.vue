<template>
  <div>

      <b-modal size="xl" hide-footer v-model="modalWarehouse" id="modal-warehouse" title="Modulo de Almacen">
        <b-row>
          <b-col md="12">
            <b-row>
              <b-col md="4">
                <b-form-group label="Establecimiento:">
                  <b-form-input type="text" readonly v-model="establishment.name"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="3">
                <b-form-group label="Código:">
                  <b-form-input type="text" ref="code" v-model="warehouse.code"></b-form-input>
                  <small v-if="errors.code" class="form-text text-danger">Ingrese un código</small>
                </b-form-group>
              </b-col>
              <b-col md="5">
                <b-form-group label="Nombre:">
                  <b-form-input type="text" ref="name" v-model="warehouse.name"></b-form-input>
                  <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                </b-form-group>
              </b-col>
              <b-col md="6">
                <b-form-group label="Descripción:">
                  <b-form-input type="text" ref="description" v-model="warehouse.description"></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                  <b-form-group label="Por defecto :">
                    <select v-model="warehouse.default" class="form-control">
                      <option value="1">SI</option>
                      <option value="0">NO</option>
                    </select>
                  </b-form-group>
              </b-col>
              <b-col md="2">
                  <b-form-group label="Estado :">
                    <select v-model="warehouse.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
              </b-col>
              <b-col md="2">
                  <b-form-group label=".">
                    <b-button v-if="warehouse.id_warehouse == null" type="button" @click="AddWarehouse" variant="primary" class="btn form-control">GUARDAR</b-button>
                    <b-button v-if="warehouse.id_warehouse != null" type="button" @click="EditWarehouse" variant="primary" class="btn form-control">EDITAR</b-button>
                  </b-form-group>
              </b-col>
            </b-row>
          </b-col>

          <b-col md="12">
            <div class="table-responsive mt-3">
                <table class="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th width="5%" class="text-center">#</th>
                      <th width="10%" class="text-center">Código</th>
                      <th width="40%" class="text-center">Nombre</th>
                      <th width="15%" class="text-center">Descripción</th>
                      <th width="10%" class="text-center">Por Defecto</th>
                      <th width="10%" class="text-center">Estado</th>
                      <th width="10%" class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody v-for="(item, it) in data_table" :key="item.id_warehouse">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-left"> {{ item.code }}</td>
                    <td class="text-left"> {{ item.name }}</td>
                    <td class="text-left"> {{ item.description }}</td>
                    <td class="text-center">
                      <b-badge v-if="item.default == 1" variant="success">SI</b-badge>
                      <b-badge v-if="item.default == 0" variant="warning">NO</b-badge>
                    </td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                      <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                    </td> 
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('EstablishmentEdit')" @click="ViewWarehouse(item.id_warehouse)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('EstablishmentEdit')"  @click="ConfirmDeleteWarehouse(item.id_warehouse)" >Eliminar</b-dropdown-item>
                
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
                  v-on:input="ListWarehouse"
                  :total-rows="rows"
                  :per-page="perPage"
                  align="center"
                ></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
            </b-row>

          </b-col>
        </b-row>
      </b-modal>
    </div>
  
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "ModalWarehouse",
  data() {
    return {

      module: 'Establishment',
      role:3,

      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],

      id_establishment: null,
      modalWarehouse: false,

      establishment:{
        name : null
      },
      warehouse:{
        id_establishment: null,
        id_warehouse: null,
        code: '',
        name: '',
        description: null,
        default: 1,
        state: 1,
      },

      errors:{
        id_establishment: false,
        id_warehouse: false,
        code: false,
        name: false,
        state: 1,
      },
      
      
      
    };
  },
  mounted() {

  },
  beforeUpdate(){
    
  },
  methods: {
    ViewEstablishment,
    ListWarehouse,
    EditWarehouse,
    ViewWarehouse,
    ConfirmDeleteWarehouse,
    DeleteWarehouse,
    Permission,

    AddWarehouse,
    Validate,
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

//ver usuario
function ViewEstablishment() {
  
  let me = this;
  let url = this.url_base + "establishment/view/" + this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.establishment.name = response.data.result.name;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

// //listar usuario
function ListWarehouse(id_establishment) {
  
  this.modalWarehouse = true;
  this.id_establishment = id_establishment;
  this.ViewEstablishment();
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "warehouse/list/"+id_establishment+"/"+ search + "?page=" + this.currentPage;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
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
}

//ver usuario
function ViewWarehouse(id_warehouse) {
  
  let me = this;
  let url = this.url_base + "warehouse/view/" + id_warehouse;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.warehouse.id_establishment = response.data.result.id_establishment;
        me.warehouse.id_warehouse = response.data.result.id_warehouse;
        me.warehouse.code = response.data.result.code;
        me.warehouse.name = response.data.result.name;
        me.warehouse.description = response.data.result.description;
        me.warehouse.default = response.data.result.default;
        me.warehouse.state = response.data.result.state;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

//editar usuario
function EditWarehouse() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  let me = this;
  let url = this.url_base + "warehouse/edit";
  let data = {
    id_establishment: this.warehouse.id_establishment,
    id_warehouse: this.warehouse.id_warehouse,
    code: this.warehouse.code,
    name: this.warehouse.name,
    description: this.warehouse.description,
    state: this.warehouse.state,
    default: this.warehouse.default,
  };

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.warehouse.id_warehouse = null;
        me.warehouse.code = "";
        me.warehouse.name = "";
        me.warehouse.description = "";
        me.warehouse.default = 1;
        me.warehouse.state = 1;
        
        me.ListWarehouse(me.id_establishment);
        
        Swal.fire({ icon: 'success', text: 'Se ha modificado el almacen', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}


// Confirmar eliminar
function ConfirmDeleteWarehouse(id_warehouse) {
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
      this.DeleteWarehouse(id_warehouse);
    }
  });
}

// eliminar usuario
function DeleteWarehouse(id_warehouse) {
  let me = this;
  let url = this.url_base + "warehouse/delete/" + id_warehouse;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        //eliminado del objeto
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_warehouse == id_warehouse) {
            me.data_table.splice(i, 1);
            break;
          }
        }        
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el almacen', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
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




function AddWarehouse() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  let me = this;
  let url = this.url_base + "warehouse/add";
  let data = {
    id_establishment: this.id_establishment,
    code: this.warehouse.code,
    name: this.warehouse.name,
    description: this.warehouse.description,
    default: this.warehouse.default,
    state: this.warehouse.state,
  };

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.warehouse.id_warehouse = null;
        me.warehouse.code = "";
        me.warehouse.name = "";
        me.warehouse.description = "";
        me.warehouse.default = 1;
        me.warehouse.state = 1;
        me.ListWarehouse(me.id_establishment);
        Swal.fire({ icon: 'success', text: 'Se ha creado el nuevo almacen', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}


function Validate() {

  // this.errors.id_warehouse = this.warehouse.id_warehouse.length == 0 ? true : false;
  this.errors.code = this.warehouse.code.length == 0 ? true : false;
  this.errors.name = this.warehouse.name.length == 0 ? true : false;
  
  // this.id_warehouse = this.errors.id_warehouse == true ? true : false;
  this.validate = this.errors.code == true ? true : false;
  this.validate = this.errors.name == true ? true : false;


}
</script>
