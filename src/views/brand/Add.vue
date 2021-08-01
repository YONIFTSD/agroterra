<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Marcas - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
          
                <b-col md="3">
                  <b-form-group label="Nombre:">
                    <b-form-input type="text" ref="name" v-model="brand.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>
        
                <b-col md="4">
                  <b-form-group label="Descripción :" required>
                    <b-form-input type="text" ref="description" v-model="brand.description"></b-form-input>
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
                    <select ref="state" v-model="brand.state" class="form-control">
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

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Brand',
      brand: {
        name: "",
        id_provider: '',
        description: "",
        photo: "",
        state: 1,
      },
      photo:null,
      mprovider :null,
      providers: [],
      errors: {
        name: false,
        id_provider: false,
      },
      validate: false,
    };
  },
  mounted() {
  
  },
  methods: {
    SearchProvider,
    AddBrand,
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
  this.brand.photo = e.target.files[0];
}
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

function AddBrand(_this) {

  let me = _this;
  let url = me.url_base + "brand/add";
  let data = new FormData();
  data.append("name", me.brand.name);
  data.append("description", me.brand.description);
  data.append("photo", me.brand.photo);
  data.append("state", me.brand.state);
  me.isLoading = true;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token,module: me.module, role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.brand.name = "";
        me.brand.id_provider = "";
        me.brand.description = "";
        me.brand.state = 1;
        me.photo = null;
        Swal.fire({ icon: 'success', text: 'Se ha registrado la nueva marca', timer: 3000,})
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

  this.errors.name = this.brand.name.length == 0 ? true : false;
  this.errors.state = this.brand.state.length == 0 ? true : false;
  
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.state) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  

   let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de registrar la marca?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.AddBrand(me);
      }
    });

  }
}
</script>
