<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modalSubcategories" class="w-100" :title="category.name">
      <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
        <b-row>
          <b-col md="3">
            <b-form-group class="text-center">
              
              <b-card-img class="max-width text-center" v-if="subcategory.id_subcategory.length != 0" :src="url_base + subcategory.photo"></b-card-img>
              <b-card-img class="max-width text-center" v-if="subcategory.id_subcategory.length == 0" src="https://loisjeans.id/skin/frontend/base/default/images/catalog/product/placeholder/image.jpg"></b-card-img>
              
            </b-form-group>

            <b-form-group>
              <b-form-file @change="onFileChange" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
              <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
            </b-form-group>
            
          </b-col>

          <b-col md="9">
              <b-row>
                <b-col md="8">
                  <b-form-group label="Nombre:">
                    <b-form-input v-model="subcategory.name"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Estado :">
                    <select  v-model="subcategory.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>

                <b-col md="8">
                  <b-form-group label="Descripción:">
                    <b-form-input v-model="subcategory.description" ></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>
        
                <b-col md="4">
                  <b-form-group label=".">
                    <b-button v-if="subcategory.id_subcategory.length == 0" type="submit" variant="primary" class="form-control"><i class="fas fa-save"></i> Guardar (F4)</b-button>
                    <b-button v-if="subcategory.id_subcategory.length != 0" type="submit" variant="primary" class="form-control">ACTUALIZAR</b-button>
                  </b-form-group>
                </b-col>

              </b-row>
          </b-col>

          
        </b-row>
      </b-form>
      <b-col md="12">
        <div class="table-responsive mt-1">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th width="10%" class="text-center">#</th>
                <th width="65%" class="text-center">Nombre</th>
                <th width="10%" class="text-center">Estado</th>
                <th width="15%" class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody v-for="(item, it) in subcategories" :key="it">
              <tr>
                <td class="text-center">{{ it + 1 }}</td>
                <td class="text-left">{{ item.name }}</td>
                <td class="text-center">
                  <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                  <b-badge v-if="item.state == 0" variant="danger">Anulado</b-badge>
                </td>
                <td class="text-center">
                    <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item  @click="ViewSubcategory(item.id_subcategory)">Editar</b-dropdown-item>
                        <b-dropdown-item v-if="item.state == 1" @click="ConfirmDeleteSubcategory(item.id_subcategory)" >Eliminar</b-dropdown-item >
                    </b-dropdown>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>

    </b-modal>
  </div>
</template>
<style scoped>
.max-width{
  max-width: 8rem;
}
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
var moment = require("moment");

export default {
  name: "ModalsProduct",
  data() {
    return {
        modalSubcategories:false,
        module:'Category',
        role:3,
        id_category:0,
        subcategories: [],
        category:{
          id_category:'',
          code:'',
          name:'',
        },
        photo:null,
        subcategory:{
          id_subcategory:'',
          id_category:'',
          name:'',
          description:'',
          photo:'',
          state:'1',
        },
        errors:{
          id_subcategory:false,
          id_category:false,
          name:false,
          description:false,
          photo:false,
        }

     
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalAmortizationsShow', (id_category) => {
      this.modalSubcategories = true;
      this.id_category = id_category;
      this.subcategory.id_subcategory = '';
      this.subcategory.name = '';
      this.subcategory.description = '';
      this.subcategory.photo = '';
      this.subcategory.state = 1;
      this.ViewCategory();
      this.ListSubcategories(this);
    });
    
  },
  methods: {
      ViewCategory,
      ListSubcategories,
      Validate,
      AddSubcategory,
      EditAmortization,
 
      ViewSubcategory,
      ConfirmDeleteSubcategory,
      DeleteSubcategory,
      onFileChange,
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};
function onFileChange(e) {
  this.category.photo_change = e.target.files[0];
}
function ViewCategory() {
    let me  = this;
    let url = me.url_base + "category/view/"+me.id_category;
    axios({
      method: "GET",
      url:url,
      headers: { token: me.token, module: me.module, role: me.role },
    })
    .then(function (response) {
      if (response.data.status == 200) {
        me.category.id_category = response.data.result.id_category;
        me.category.name = response.data.result.name;
      } 
    })
}

function Validate() {
  let me = this;
  this.errors.id_category = this.id_category.length == 0 ? true : false;
  this.errors.name = this.subcategory.name.length == 0 ? true : false;
  
  if (this.errors.id_category == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  

  if (this.subcategory.id_subcategory.length == 0) {
      Swal.fire({
        title: 'Esta seguro de registrar la subcategeoria?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Estoy de Acuerdo!'
      }).then((result) => {
        if (result.isConfirmed) {
          AddSubcategory(me);
        }
      })
  }else{
      Swal.fire({
        title: 'Esta seguro de modificar la subcategoria?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, Estoy de Acuerdo!'
      }).then((result) => {
        if (result.isConfirmed) {
          EditAmortization(me);
        }
      })
  }





 
}


function AddSubcategory(me) {
  let url = me.url_base + "subcategory/add";
  let data = new FormData();
  data.append("id_category", me.id_category);
  data.append("name", me.subcategory.name);
  data.append("description", me.subcategory.description);
  data.append("photo", me.subcategory.photo);
  data.append("state", me.subcategory.state);
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.subcategory.name = "";
        me.subcategory.description = ""
        me.subcategory.state = 1;
        me.photo = null;
        me.ListSubcategories(me);
        Swal.fire({ icon: 'success', text: 'Se ha creado la nueva categoria', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
   
}

function EditAmortization(me) {
  let url = me.url_base + "subcategory/edit";
  let data = new FormData();
  data.append("id_subcategory", me.subcategory.id_subcategory);
  data.append("id_category", me.id_category);
  data.append("name", me.subcategory.name);
  data.append("description", me.subcategory.description);
  data.append("photo", me.subcategory.photo);
  data.append("state", me.subcategory.state);
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.subcategory.id_subcategory = "";
        me.subcategory.name = "";
        me.subcategory.description = ""
        me.subcategory.state = 1;
        me.photo = null;
        Swal.fire({ icon: 'success', text: 'Se ha modificado la subcategoria', timer: 3000,})
        me.ListSubcategories(me);
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}



function ViewSubcategory(id_subcategory) {
  let me = this;
  let url = me.url_base + "subcategory/view/"+id_subcategory;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.subcategory.id_subcategory = response.data.result.id_subcategory;
          me.subcategory.id_category = response.data.result.id_category;
          me.subcategory.name = response.data.result.name;
          me.subcategory.description = response.data.result.description;
          me.subcategory.state = response.data.result.state;
          me.ListSubcategories(me);
      } 
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ConfirmDeleteSubcategory(id_subcategory) {
  Swal.fire({
    title: "Esta seguro de eliminar la subcategoria?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteSubcategory(id_subcategory);
    }
  });
}

function DeleteSubcategory(id_subcategory) {
  let me = this;
  let url = me.url_base + "subcategory/delete/"+id_subcategory;
  axios({
    method: "delete",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.ListSubcategories(me);
        Swal.fire({ icon: 'success', text: 'Se ha eliminado la subcateegory', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}


//Buscar productos
function ListSubcategories(me) {
  let url = me.url_base + "subcategory/list/"+me.id_category;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.subcategories = response.data.result;
      } else {
        me.subcategories = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}
</script>
