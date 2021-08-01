<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Marca - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
     
                <b-col md="4">
                  <b-form-group label="Nombre:">
                    <b-form-input disabled type="text" ref="name" v-model="brand.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>
        
                <b-col md="6">
                  <b-form-group label="Descripción :" required>
                    <b-form-input disabled type="text" ref="description" v-model="brand.description"></b-form-input>
                  </b-form-group>
                </b-col>
      
                <b-col md="2">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select disabled ref="state" v-model="brand.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
      

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link
                    class="btn form-control btn-primary"
                    :to="{ path: '/marca/listar' }"
                    append
                    >REGRESAR</b-link
                  >
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <LoadingComponent :is-visible="isLoading"/>
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
  name: "CategoryEdit",
  props: ["id_brand"],
  components:{
      vSelect,
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Brand',
      brand: {
        id_brand: "",
        name: "",
        id_provider: '',
        description: "",
        state: 1,
      },
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
    this.ViewBrand();
  },
  methods: {
    ViewBrand,
    EditBrand,
    Validate,
    SearchProvider,
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
function ViewBrand() {
  let id_brand = je.decrypt(this.id_brand);
  let me = this;
  let url = this.url_base + "brand/view/" + id_brand;
  me.isLoading = true;
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
        me.brand.id_brand = response.data.result.id_brand;
        me.brand.name = response.data.result.name;
        me.brand.id_provider = response.data.result.id_provider;
        me.brand.description = response.data.result.description;
        me.brand.state = response.data.result.state;


      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = true;
    });
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


//editar usuario
function EditBrand(_this) {
 
  let me = _this;
  let url = this.url_base + "brand/edit";
   me.brand.id_provider = me.mprovider.id;
  let data = me.brand;

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
        Swal.fire({ icon: 'success', text: 'Se ha modificado la marca', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//validacion de formulario
function Validate() {

   this.errors.id_provider = this.mprovider == null ? true : false;
  this.errors.name = this.brand.name.length == 0 ? true : false;

  if (this.errors.id_provider) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  
}
</script>
