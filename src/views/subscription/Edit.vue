<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Promoción - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
         
                <b-col md="3">
                  <b-form-group>
                    <b-card-img :src="url_base + promotion.photo"></b-card-img>
                  </b-form-group>

                  <b-form-group>
                    <b-form-file @change="onFileChange" accept="image/png,image/jpeg" v-model="photo" placeholder="Seleccione un foto..." drop-placeholder="Suelta la imagen aquí..."></b-form-file>
                    <small v-if="errors.photo" class="form-text text-danger">Seleccione un foto</small>
                  </b-form-group>
                 
                </b-col>

                <b-col md="9"> 
                  <b-row>
                        <b-col md="4">
                          <b-form-group label="Nombre:">
                            <b-form-input type="text" ref="name" v-model="promotion.title"></b-form-input>
                            <small v-if="errors.title" class="form-text text-danger">Ingrese un nombre</small>
                          </b-form-group>
                        </b-col>
                
                        <b-col md="6">
                          <b-form-group label="Url :" required>
                            <b-form-input type="text" ref="description" v-model="promotion.url"></b-form-input>
                          </b-form-group>
                        </b-col>
              
                        <b-col md="2">
                          <b-form-group label="Estado :" label-for="input-1">
                            <select ref="state" v-model="promotion.state" class="form-control">
                              <option value="1">Activo</option>
                              <option value="0">Inactivo</option>
                            </select>
                          </b-form-group>
                        </b-col>
              

                        <b-col md="3"></b-col>
                        <b-col md="6">
                          <b-button type="submit" class="form-control btn-primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
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
  props: ["id_promotion"],
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'WebPage',
      promotion: {
        id_promotion: "",
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
    this.ViewPromotion();
  },
  methods: {
    ViewPromotion,
    EditPromotion,
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
  this.promotion.photo_change = e.target.files[0];
}
//ver usuario
function ViewPromotion() {
  let id_promotion = je.decrypt(this.id_promotion);
  let me = this;
  let url = this.url_base + "promotion/view/" + id_promotion;

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
        me.promotion.id_promotion = response.data.result.id_promotion;
        me.promotion.title = response.data.result.title;
        me.promotion.photo = response.data.result.image;
        me.promotion.url = response.data.result.url;
        me.promotion.state = response.data.result.state;

        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}



//editar usuario
function EditPromotion(_this) {
 
  let me = _this;
  let url = me.url_base + "promotion/edit";
  let data = new FormData();
  data.append("id_promotion", me.promotion.id_promotion);
  data.append("title", me.promotion.title);
  data.append("url", me.promotion.url);
  data.append("photo", me.promotion.photo_change);
  data.append("state", me.promotion.state);

  axios({
    method: "post",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 3,},
  }).then(function (response) {
    if (response.data.status == 200) {
      me.promotion.photo = response.data.result.image;
      me.photo = null;
      Swal.fire({ icon: 'success', text: 'Se ha modificado la promoción', timer: 3000,})
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
  this.errors.title = this.promotion.title.length == 0 ? true : false;
  if (this.errors.title) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  let me = this;
  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar la promoción?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditPromotion(me);
      }
    });

  }
}
</script>
