<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Categoria - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
          
                <b-col md="3">
                  <b-form-group label="Nombre:">
                    <b-form-input type="text" ref="name" v-model="category.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>
        
                <b-col md="4">
                  <b-form-group label="Descripción :" required>
                    <b-form-input type="text" ref="description" v-model="category.description"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Foto :">
                  <b-form-file @change="onFileChange" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                  <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
                  </b-form-group>
                </b-col>
      
                <b-col md="2">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select ref="state" v-model="category.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
      

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button type="submit" class="form-control btn-primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

     <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
  </div>
</template>

<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  components:{
      Keypress: () => import('vue-keypress'),
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Category',
      category: {
        name: "",
        description: "",
        photo: "",
        state: 1,
      },
      photo: null,
      errors: {
        name: false,
        photo:false,
      },
      validate: false,
    };
  },
  mounted() {
  
  },
  methods: {
    AddCategory,
    Validate,
    onFileChange,
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

function onFileChange(e) {
  this.category.photo = e.target.files[0];
}

function AddCategory(_this) {
 

  let me = _this;
  let url = me.url_base + "category/add";
  let data = new FormData();
  data.append("name", me.category.name);
  data.append("description", me.category.description);
  data.append("photo", me.category.photo);
  data.append("state", me.category.state);
  me.isLoading = true;
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
        me.category.name = "";
        me.category.description = ""
        me.category.state = 1;
        me.photo = null;
        Swal.fire({ icon: 'success', text: 'Se ha creado la nueva categoria', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function Validate() {
  this.errors.name = this.category.name.length == 0 ? true : false;
  this.errors.state = this.category.state.length == 0 ? true : false;
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.state) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

   if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de registrar la categoria ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.AddCategory(me);
      }
    });

  }
}
</script>
