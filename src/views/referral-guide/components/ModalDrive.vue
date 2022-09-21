<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalDrives" class="w-100" title="Conductores">
      <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
        <b-row>
         <b-col md="3">
            <b-form-group label="Tipo de Documento :">
              <b-form-select ref="city" v-model="drive.document_type" :options="document_type"></b-form-select>
            </b-form-group>
            <small v-if="errors.document_type"  class="form-text text-danger" >Seleccione un tipo de documento</small>
          </b-col>

          <b-col md="3">
            <b-form-group label="Nro Documento :">
              <b-input-group>
                <b-form-input v-model="drive.document_number" class="form-control" ></b-form-input>
                <b-input-group-append>
                  <b-button variant="info"  @click="SearchClient"><b-icon icon="search"></b-icon></b-button>
                </b-input-group-append>
              </b-input-group>
              <small v-if="errors.document_number" class="form-text text-danger" >{{error_document_number}}</small>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Nombres / Razón Social:" required>
              <b-form-input type="text" ref="name" v-model="drive.name" placeholder="Ingrese su nombre"></b-form-input>
              <small v-if="errors.name" class="form-text text-danger" >Ingrese un nombre o razón social</small>
            </b-form-group>
          </b-col>
     

          <b-col md="2">
            <b-form-group label="Nro Licencia">
              <b-form-input v-model="drive.license_number"></b-form-input>
              <small v-if="errors.license_number"  class="form-text text-danger" >Seleccione un nro de licencia</small>
            </b-form-group>
          </b-col>

          <b-col md="4">
            <b-form-group label="Dirección">
              <b-form-input v-model="drive.address"></b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="3">
            <b-form-group label="Email">
              <b-form-input v-model="drive.email"></b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="2">
            <b-form-group label="Teléfono">
              <b-form-input v-model="drive.phone"></b-form-input>
            </b-form-group>
          </b-col>

          <b-col md="1">
            <b-form-group label=".">
                <b-button class="form-control" v-if="drive.id_drive.length == 0" type="submit" variant="primary" title="Guardar"><i class="fas fa-save"></i></b-button>
                <b-button class="form-control" v-if="drive.id_drive.length != 0" type="submit" variant="info" title="Modificar"><i class="fas fa-edit"></i></b-button>
              </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <b-row>
        <b-col md="8">
        </b-col>
         <b-col md="4">
          <b-form-group label=".">
            <b-input-group>
              <b-form-input v-model="search" class="form-control"></b-form-input>
              <b-input-group-append>
                <b-button variant="primary" @click="ListDrives"><b-icon icon="search"></b-icon></b-button>
              </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3 height-table">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%"  class="text-center align-middle">#</th>
                  <th width="60%"  class="text-center align-middle">Conductor</th>
                  <th width="15%"  class="text-center align-middle">Nro Licencia</th>
                  <th width="10%"  class="text-center align-middle">Teléfono</th>
                  <th width="10%"  class="text-center align-middle">Acciones</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in data_table" :key="it">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-left">{{ item.name + " - "+item.document_number }}</td>
                  <td class="text-left">{{ item.license_number }}</td>
                  <td class="text-left">{{ item.phone }}</td>
                  <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item @click="ViewCar(item.id_drive)">Editar</b-dropdown-item>
                        <b-dropdown-item @click="ConfirmDeleteDrive(item.id_drive)">Eliminar</b-dropdown-item>
                      </b-dropdown>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
      <b-row class="mt-4">
          <b-col md="8">
            <b-pagination v-model="currentPage" v-on:input="ListDrives" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
          </b-col>
          <b-col md="4 text-center">
            <p>Pagina Actual: {{ currentPage }}</p>
          </b-col>
        </b-row>
    </b-modal>
  </div>
</template>
<style>



</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import ApiQuery from "@/assets/js/APIQuery";


export default {
  name: "ModalsProduct",
  data() {
    return {
        modalDrives:false,
        module:'ReferralGuide',
        role:0,
        drive:{
          id_drive:'',
          document_type:'1',
          document_number:'',
          name:'',
          address:'',
          phone:'',
          email:'',
          license_number:'',
          state:'1',
        },
        error_document_number:'',
        errors:{
          document_number:false,
          name:false,
          license_number:false,
        },
        document_type: [
          {value: 1 , text : 'DNI'},
          // {value: 6 , text : 'RUC'},
          // {value: 4 , text : 'CARNET DE EXTRANJERIA'},
          // {value: 7 , text : 'PASAPORTE'},
          // {value: 0 , text : 'OTROS'},
        ],



        search:'',
        perPage: 15,
        currentPage: 1,
        rows: 0,
        data_table: [],


        products: [],
        establishment:{},
        id_establishment:'',
        warehouses:[]
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalDrivesShow', (role) => {
      this.modalDrives = true;
      this.role = role;
      this.ListDrives(this);
    });
    
  },
  methods: {
      SearchClient,
      ListDrives,
      Validate,
      AddDrive,
      EditDrive,
      ViewCar,
      ConfirmDeleteDrive,
      DeleteDrive,
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

function SearchClient() {


  let me = this;
  if (me.drive.document_type == 1) {
      if (me.drive.document_number.length == 8) {
        me.errors.document_number = false;
        ApiQuery.SearchDni(me.drive.document_number).then((data) => {
          if (data.status == 200) {
            me.drive.name = data.razon_social;
            me.drive.address = data.direccion;
          }else{
            me.drive.name = '';
            me.drive.address = '';
          }
            
        });
      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 8 digitos';
      }
  }

  if (me.drive.document_type == 6) {
      if (me.drive.document_number.length == 11) {
        me.errors.document_number = false;
        ApiQuery.SearchRuc(me.drive.document_number).then((data) => {
          if (data.status == 200) {
            me.drive.name = data.razon_social;
            me.drive.address = data.direccion;
          }else{
            me.drive.name = '';
            me.drive.address = '';
          } 
        });
      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 11 digitos';
      }
  }
  
}

function ListDrives(me) {
  let search = me.search == "" ? "all" : me.search;
  let url = me.url_base + "drive/list/" + search + "?page=" + me.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
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

function ViewCar(id_drive) {
  
  let me = this;
  let url = this.url_base + "drive/view/"+id_drive;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.drive.id_drive = response.data.result.id_drive;
        me.drive.document_type = response.data.result.document_type;
        me.drive.document_number = response.data.result.document_number;
        me.drive.name = response.data.result.name;
        me.drive.address = response.data.result.address;
        me.drive.phone = response.data.result.phone;
        me.drive.email = response.data.result.email;
        me.drive.license_number = response.data.result.license_number;
        me.drive.state = response.data.result.state;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire("422", "A Ocurrido un error" + error, "error");
    });
}

function Validate() {
  this.errors.document_number = this.drive.document_number.length == 0 ? true : false;
  this.errors.name = this.drive.name.length == 0 ? true : false;
  this.errors.license_number = this.drive.license_number.length == 0 ? true : false;

  if (this.errors.document_number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.license_number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;
  if (this.drive.id_drive.length == 0) {
    Swal.fire({
      title: 'Esta seguro de registrar el conductor?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Estoy de Acuerdo!'
    }).then((result) => {
      if (result.isConfirmed) {
        me.AddDrive(me);
      }
    })
  }else{
    Swal.fire({
      title: 'Esta seguro de modificar el vehiculo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Estoy de Acuerdo!'
    }).then((result) => {
      if (result.isConfirmed) {
        me.EditDrive(me);
      }
    })
  }
 
}

function AddDrive(me) {

  let url = me.url_base + "drive/add";
  let data = me.drive;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.drive.id_drive = "",
        me.drive.document_type = 6,
        me.drive.document_number = "";
        me.drive.name = "";
        me.drive.license_number = "";
        me.drive.address = "";
        me.drive.phone = "";
        me.drive.email = "";
        me.drive.state = 1;
        me.ListDrives(me);
        EventBus.$emit('RefreshListDrives');
        Swal.fire({ icon: 'success', text: 'Se ha registrado el conductor', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function EditDrive(me) {

  let url = me.url_base + "drive/edit";
  let data = me.drive;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.drive.id_drive = "",
        me.drive.document_type = 6,
        me.drive.document_number = "";
        me.drive.name = "";
        me.drive.license_number = "";
        me.drive.address = "";
        me.drive.phone = "";
        me.drive.email = "";
        me.drive.state = 1;
        me.ListDrives(me);
        EventBus.$emit('RefreshListDrives');
        Swal.fire({ icon: 'success', text: 'Se ha modificado el conductor', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function ConfirmDeleteDrive(id_drive) {
  Swal.fire({
    title: "Esta seguro de eliminar el conductor?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteDrive(id_drive);
    }
  });
}

// eliminar usuario
function DeleteDrive(id_drive) {
  let me = this;
  let url = this.url_base + "drive/delete/" + id_drive;
  axios({
    method: "delete",
    url: url,
    headers: {token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.data_table.length; i++) {
          if (me.data_table[i].id_drive == id_drive) {
            me.data_table.splice(i, 1);
            break;
          }
        }
        EventBus.$emit('RefreshListDrives');
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el conductor', timer: 2000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 2000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error',text: 'A ocurrido un error',timer: 2000,})
    });
}


</script>
