<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Categoria - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
                
                <b-col md="3">
                  <b-form-group>
                    <b-card-img :src="url_base + category.photo"></b-card-img>
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
                          <b-form-input type="text" ref="name" v-model="category.name" placeholder="Ingrese su nombre"></b-form-input>
                          <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                        </b-form-group>
                      </b-col>
            
                      <b-col md="6">
                        <b-form-group label="Descripción :" required>
                          <b-form-input type="text" ref="description" v-model="category.description"></b-form-input>
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
            

                      <b-col md="3"></b-col>
                      <b-col md="6">
                        <b-button type="submit" class="form-control btn-primary">GUARDAR</b-button >
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
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";

export default {
  name: "CategoryEdit",
  props: ["id_category"],
  data() {
    return {
      module:'Category',
      category: {
        id_category: "",
        name: "",
        photo:"",
        photo_change:"",
        description: "",
        state: 1,
      },
      photo: null,
      ubigens: [],
      //errors
      errors: {
        name: false,
        name: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewCategory();
  },
  methods: {
    ViewCategory,
    EditCategory,
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
  this.category.photo_change = e.target.files[0];
}

//ver usuario
function ViewCategory() {
  let id_category = je.decrypt(this.id_category);
  let me = this;
  let url = this.url_base + "category/view/" + id_category;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 3,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.category.id_category = response.data.result.id_category;
        me.category.name = response.data.result.name;
        me.category.photo = response.data.result.photo;
        me.category.description = response.data.result.description;
        me.category.state = response.data.result.state;

      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//editar usuario
function EditCategory(_this) {
  

  let me = _this;
  let url = me.url_base + "category/edit";
  let data = new FormData();
  data.append("id_category", me.category.id_category);
  data.append("name", me.category.name);
  data.append("description", me.category.description);
  data.append("photo", me.category.photo_change);
  data.append("state", me.category.state);

  axios({
    method: "POST",
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
        me.category.photo = response.data.result.photo;
        me.photo = null;
        Swal.fire({ icon: 'success', text: 'Se ha modificado la categoria', timer: 3000,})
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
  this.errors.name = this.category.name.length == 0 ? true : false;
  this.errors.state = this.category.state.length == 0 ? true : false;
  
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.state) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

   if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar la categoria ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditCategory(me);
      }
    });

  }
}
</script>
