<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Portadas - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
          
                <b-col md="3">
                  <b-form-group label="Titulo:">
                    <b-form-input type="text" ref="name" v-model="cover_page.title"></b-form-input>
                    <small v-if="errors.title" class="form-text text-danger">Ingrese un titulo</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Url:">
                    <b-form-input type="text" ref="name" v-model="cover_page.url"></b-form-input>
                    <small v-if="errors.url" class="form-text text-danger">Ingrese una url</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Foto :">
                  <b-form-file @change="onFileChange" accept="image/png,image/jpeg" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                  <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
                  </b-form-group>
                </b-col>
      
                <b-col md="2">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select ref="state" v-model="cover_page.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
      

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control btn-primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
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

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'WebPage',
      cover_page: {
        name: "",
        url: '',
        photo: "",
        state: 1,
      },
      photo:null,
      errors: {
        title: false,
        photo: false,
      },
      validate: false,
    };
  },
  mounted() {
  
  },
  methods: {
    AddCoverPage,
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
  this.cover_page.photo = e.target.files[0];
}

function AddCoverPage(_this) {

  let me = _this;
  let url = me.url_base + "cover-page/add";
  let data = new FormData();

  data.append("title", me.cover_page.title);
  data.append("url", me.cover_page.url);
  data.append("photo", me.cover_page.photo);
  data.append("state", me.cover_page.state);

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
        me.cover_page.title = "";
        me.cover_page.url = "";
        me.cover_page.photo = "";
        me.cover_page.state = 1;
        me.photo = null;
        Swal.fire({ icon: 'success', text: 'Se ha registrado la nueva portada', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

  this.errors.title = this.cover_page.title.length == 0 ? true : false;
  this.errors.photo = this.photo == null ? true : false;
  this.errors.state = this.cover_page.state.length == 0 ? true : false;
  
  if (this.errors.title) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.photo) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.state) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  

   let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de registrar la portada?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.AddCoverPage(me);
      }
    });

  }
}
</script>
