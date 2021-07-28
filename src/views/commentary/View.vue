<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Comentario - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
                <b-row>
                      <b-col md="6">
                        <b-form-group label="Nombre:">
                          <b-form-input type="text" disabled :value="commentary.name + ' - ' + commentary.document_number"></b-form-input>
                        </b-form-group>
                      </b-col>
              
                      <b-col md="6">
                        <b-form-group label="Producto:">
                          <b-form-input type="text" disabled v-model="commentary.product_name"></b-form-input>
                        </b-form-group>
                      </b-col>

                      <b-col md="8">
                        <b-form-group label="Commentario:">
                          <b-form-input type="text" disabled v-model="commentary.commentary"></b-form-input>
                        </b-form-group>
                      </b-col>

                      <b-col md="2">
                        <b-form-group label="Valoración:">
                          <b-form-input type="text" disabled v-model="commentary.score"></b-form-input>
                        </b-form-group>
                      </b-col>
            
                      <b-col md="2">
                        <b-form-group label="Estado :" label-for="input-1">
                          <select ref="state" disabled v-model="commentary.state" class="form-control">
                            <option value="1">Activo</option>
                            <option value="0">Inactivo</option>
                          </select>
                        </b-form-group>
                      </b-col>
            

                      <b-col md="3"></b-col>
                      <b-col md="6">
                        <b-link class="btn form-control btn-primary" :to="{ path: '/comentarios/listar' }" append >REGRESAR</b-link>
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
  props: ["id_commentary"],
  components:{
      vSelect,
  },
  data() {
    return {
      module: 'WebPage',
      commentary: {
        id_commentary: "",
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
  this.commentary.photo_change = e.target.files[0];
}
//ver usuario
function ViewCoverPage() {
  let id_commentary = je.decrypt(this.id_commentary);
  let me = this;
  let url = this.url_base + "commentary/view/" + id_commentary;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 3,
    },
  }).then(function (response) {
    if (response.data.status == 200) {
      me.commentary.id_commentary = response.data.result.id_commentary;
      me.commentary.name = response.data.result.name;
      me.commentary.document_number = response.data.result.document_number;
      me.commentary.product_name = response.data.result.product_name;
      
      me.commentary.commentary = response.data.result.commentary;
      me.commentary.score = response.data.result.score;
      me.commentary.state = response.data.result.state;
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
  data.append("id_commentary", me.commentary.id_commentary);
  data.append("title", me.commentary.title);
  data.append("url", me.commentary.url);
  data.append("photo", me.commentary.photo_change);
  data.append("state", me.commentary.state);

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
        me.commentary.photo = response.data.result.photo;
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


  this.errors.title = this.commentary.title.length == 0 ? true : false;

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
