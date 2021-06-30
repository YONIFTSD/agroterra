<template>
  <div>

      <b-modal size="md" v-model="modalSerie" hide-footer id="modal-warehouse" :title="'Modulo de Serie - ' + voucher.name">
        <b-row>
          <b-col md="12">
            <b-row>

              <b-col md="2">
                <b-form-group label="Comprobante:">
                  <b-form-input
                    type="text"
                    disabled
                    v-model="voucher.name"
                  ></b-form-input>
                </b-form-group>
              </b-col>


              <b-col md="2">
                <b-form-group label="Serie:">
                  <b-form-input
                    type="text"
                    ref="serie"
                    v-model="serie.serie"
                  ></b-form-input>
                  <small v-if="errors.code" class="form-text text-danger">Ingrese un serie</small>
                </b-form-group>
              </b-col>

              <b-col md="2">
                <b-form-group label="Numero:">
                  <b-form-input
                    type="number"
                    ref="num"
                    v-model="serie.num"
                  ></b-form-input>
                  <small v-if="errors.num" class="form-text text-danger">Ingrese un numero</small>
                </b-form-group>
              </b-col>

              <b-col md="2">
                <b-form-group label="C. Electronico ?:">
                  <select
                      ref="document_type"
                      v-model="serie.document_type"
                      class="form-control">
                      <option value="1">SI</option>
                      <option value="0">NO</option>
                    </select>
                </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label="Estado :">
                    <select
                      ref="state"
                      v-model="serie.state"
                      class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
              </b-col>

              <b-col md="2">
                  <b-form-group label=".">
                    <button v-if="serie.id_serie == null" type="button" @click="AddSerie" class="btn btn-primary form-control">GUARDAR</button>
                    <button v-if="serie.id_serie != null" type="button" @click="EditSerie" class="btn btn-primary form-control">EDITAR</button>
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
                      <th width="20%" class="text-center">Serie</th>
                      <th width="30%" class="text-center">Numero</th>
                      <th width="20%" class="text-center">C. Electronico</th>
                      <th width="5%" class="text-center">Estado</th>
                      <th width="8%" class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody v-for="(item, it) in data_table" :key="item.id_serie">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.serie }}</td>
                    <td class="text-center"> {{ item.number }}</td>
                    <td class="text-center"> {{ item.document_type == 1 ? 'Si':'No' }}</td>
                    <td class="text-center">
                      {{ item.state == 1 ? "Activo" : "Inactivo" }}
                    </td> 
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('VoucherEdit')" @click="ViewSerie(item.id_serie)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="Permission('VoucherDelete')" @click="ConfirmDeleteSerie(item.id_serie)" >Eliminar</b-dropdown-item >
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
                  v-on:input="ListSerie"
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

      <LoadingComponent :is-visible="isLoading"/>
    </div>
</template>
<style >
.modal-md{
  max-width: 70% !important;
}
</style>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
import LoadingComponent from './../../pages/Loading'

export default {
  name: "ModalSerie",
  components:{
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      perPage: 15,
      currentPage: 1,
      rows: 0,
      search: "",
      data_table: [],

      id_voucher: null,
      modalSerie: false,
      role: 2,
      module: 'Voucher',
      establishment: null,

      voucher:{
        name : null
      },
      serie:{
        id_voucher: null,
        id_serie: null,
        serie: '',
        number: '',
        num: '',
        document_type: 0,
        state: 1,
      },

      errors:{
        serie: false,
        number: false,
        num: false,
        document_type: false,
        state: 1,
      },
      
      
      
    };
  },
  mounted() {
    EventBus.$on('ModalSerieShow', (id_voucher) => {
      this.isLoading = true;
      this.modalSerie = true;
      this.id_voucher = id_voucher;
      this.ListSerie(this.id_voucher);
    });
    

  },
  methods: {
    ViewVoucher,
    ListSerie,
    EditSerie,
    ViewSerie,
    ConfirmDeleteSerie,
    DeleteSerie,
    Permission,

    AddSerie,
    Validate,

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

//ver usuario
function ViewVoucher() {
  
  let me = this;
  let url = this.url_base + "voucher/view/" + this.id_voucher;

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
        
        me.voucher.name = response.data.result.name;

      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


// //listar usuario
function ListSerie(id_voucher) {
  
  this.id_voucher = id_voucher;

  this.serie.id_serie = null;
  this.serie.serie = "";
  this.serie.number = "";
  this.serie.num = "";
  this.serie.document_Type = 0;
  this.serie.state = 1;

  this.ViewVoucher()
  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "serie/list/"+id_voucher+"/"+ search +"/" + this.id_establishment + "?page=" + this.currentPage;
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
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      this.isLoading = false;
    });
}

//ver usuario
function ViewSerie(id_serie) {
  
  let me = this;
  let url = this.url_base + "serie/view/" + id_serie;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.serie.id_serie = response.data.result.id_serie;
        me.serie.id_establishment = response.data.result.id_establishment;
        me.serie.serie = response.data.result.serie;
        me.serie.number = response.data.result.number;
        me.serie.num = response.data.result.num;
        me.serie.document_type = response.data.result.document_type;
        me.serie.state = response.data.result.state;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//editar usuario
function EditSerie() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }
  
  var number = String(this.serie.num);
   number = number.padStart(8,"0");

  let me = this;
  let url = this.url_base + "serie/edit";
  let data = {
    id_serie: this.serie.id_serie,
    id_establishment: this.serie.id_establishment,
    serie: this.serie.serie,
    number: number,
    num: this.serie.num,
    document_type: this.serie.document_type,
    state: this.serie.state,
  };

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.serie.id_serie = null;
        me.serie.serie = "";
        me.serie.number = "";
        me.serie.num = "";
        me.serie.document_type = 0;
        me.serie.state = 1;
        me.ListSerie(me.id_voucher);
        Swal.fire("Sistema", "Se ha modificado la serie", "success");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


// Confirmar eliminar
function ConfirmDeleteSerie(id_serie) {
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
      this.DeleteSerie(id_serie);
    }
  });
}

// eliminar usuario
function DeleteSerie(id_serie) {
  let me = this;
  let url = this.url_base + "serie/delete/" + id_serie;
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
          if (me.data_table[i].id_serie == id_serie) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        Swal.fire("Sistema", "El registro ha sido eliminado", "success");
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




function AddSerie() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  var number = String(this.serie.num);
  number = number.padStart(8,"0");

  let me = this;
  let url = this.url_base + "serie/add";
  let data = {
    id_voucher: this.id_voucher,
    id_establishment: this.id_establishment,
    serie: this.serie.serie,
    number: number,
    num: this.serie.num,
    document_type: this.serie.document_type,
    state: this.serie.state,
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
        me.serie.id_serie = null;
        me.serie.serie = "";
        me.serie.number = "";
        me.serie.num = "";
        me.serie.document_Type = 0;
        me.serie.state = 1;
        me.ListSerie(me.id_voucher);
        Swal.fire("Comprobante", "Se ha creado la nueva serie", "success");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function Validate() {


  this.errors.serie = this.serie.serie.length == 0 ? true : false;
  this.errors.num = this.serie.num.length == 0 ? true : false;
  
  this.validate = this.errors.serie == true ? true : false;
  this.validate = this.errors.num == true ? true : false;


}
</script>
