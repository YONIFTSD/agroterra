<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Portada - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
         
                <b-col md="3">
                  <b-form-group>
                    <b-card-img :src="url_base + cover_page.photo"></b-card-img>
                  </b-form-group>

                  <b-form-group>
                    <b-form-file @change="onFileChange" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                    <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
                  </b-form-group>
                 
                </b-col>

                <b-col md="9"> 
                  <b-row>
                        <b-col md="4">
                          <b-form-group label="Nombre:">
                            <b-form-input type="text" ref="name" v-model="cover_page.title"></b-form-input>
                            <small v-if="errors.title" class="form-text text-danger">Ingrese un nombre</small>
                          </b-form-group>
                        </b-col>
                
                        <b-col md="6">
                          <b-form-group label="Url :" required>
                            <b-form-input type="text" ref="description" v-model="cover_page.url"></b-form-input>
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
                          <b-button type="submit" class="form-control btn-primary">GUARDAR</b-button>
                        </b-col>
                  </b-row>
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
  name: "CategoryEdit",
  props: ["id_cover_page"],
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'WebPage',
      cover_page: {
        id_cover_page: "",
        name: "",
        photo: '',
        photo_change: '',
        url: "",
        state: 1,
      },
      photo :null,
      errors: {
        title: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewCoverPage();
  },
  methods: {
    ViewCoverPage,
    EditCoverPage,
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
  this.cover_page.photo_change = e.target.files[0];
}
//ver usuario
function ViewCoverPage() {
  let id_cover_page = je.decrypt(this.id_cover_page);
  let me = this;
  let url = this.url_base + "cover-page/view/" + id_cover_page;

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
        me.cover_page.id_cover_page = response.data.result.id_cover_page;
        me.cover_page.title = response.data.result.title;
        me.cover_page.photo = response.data.result.photo;
        me.cover_page.url = response.data.result.url;
        me.cover_page.state = response.data.result.state;

        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}



//editar usuario
function EditCoverPage(_this) {
 
  let me = _this;
  let url = me.url_base + "cover-page/edit";
  let data = new FormData();
  data.append("id_cover_page", me.cover_page.id_cover_page);
  data.append("title", me.cover_page.title);
  data.append("url", me.cover_page.url);
  data.append("photo", me.cover_page.photo_change);
  data.append("state", me.cover_page.state);

  axios({
    method: "post",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: 3,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.cover_page.photo = response.data.result.photo;
        me.photo = null;
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


  this.errors.title = this.cover_page.title.length == 0 ? true : false;

  if (this.errors.title) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  

   let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar la portada?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditCoverPage(me);
      }
    });

  }
}
</script>
