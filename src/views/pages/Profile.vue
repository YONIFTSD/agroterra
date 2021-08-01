<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Perfil de Usuario</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Tipo de Usuario :" required>
                    <select disabled ref="id_user_type" class="form-control" v-model="user.id_user_type">
                      <option value="">-- Seleccione --</option>
                      <option v-for="item of user_type" :key="item.id_user_type" :value="item.id_user_type">
                        {{ item.name }}
                      </option>
                    </select>
                    <small  v-if="errors.id_user_type" class="form-text text-danger">Seleccione un tipo de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="3">
                  <b-form-group label="Nombres :" required>
                    <b-form-input type="text" ref="name" v-model="user.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger" >Ingrese un nombre de usuario</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Apellido :" required>
                    <b-form-input type="text" ref="last_name" v-model="user.last_name" placeholder="Ingrese su apellido"></b-form-input>
                    <small v-if="errors.last_name" class="form-text text-danger">Ingrese un apellido de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="3">
                  <b-form-group label="Telefono :" required>
                    <b-form-input type="text" ref="phone" v-model="user.phone" placeholder="Ingrese su Telefono"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Usuario :" required>
                    <b-form-input disabled type="text" ref="user" v-model="user.user" placeholder="Ingrese su nombre de usuario"></b-form-input>
                    <small v-if="errors.user" class="form-text text-danger">Ingrese un usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Email :" required>
                    <b-form-input disabled type="email" ref="email" v-model="user.email" placeholder="Ingrese su email" ></b-form-input>
                    <small v-if="errors.email" class="form-text text-danger">Ingrese un email de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Password :" label-for="input-1">
                    <b-form-input type="password" ref="password" v-model="user.password"></b-form-input>
                    <small class="form-text text-info">Ingrese un password solo en caso de resetar una contraseña</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

          
                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control btn-primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
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
  name: "UsuarioEdit",
  data() {
    return {
      module:'User',
      role:3,
      user: {
        id_user: "",
        establishment: [],
        id_user_type: "",
        name: "",
        last_name: "",
        user: "",
        email: "",
        password: "",
        phone: "",
        state: 1,
      },
      user_type: [],
      establishments:[],
      //errors
      errors: {
        id_user: false,
        id_user_type: false,
        name: false,
        last_name: false,
        email: false,
        password: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListEstablishment();
    this.ListUserType();
    this.ViewUser();
  },
  methods: {
    ListUserType,
    ListEstablishment,
    ViewUser,
    EditUser,
    Validate,
  },

  computed: {
    ...mapState(["url_base"]),
    id_user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.id_user;
    },
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};

function ListEstablishment() {
  let me = this;
  let url = this.url_base + "active-establishments";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {

      me.establishments = [];

      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.establishments.push({ value: element.id_establishment, text: element.name })
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

//listar usuario
function ListUserType() {
  let me = this;
  let url = this.url_base + "usertype-list-active";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.user_type = response.data.result;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//ver usuario
function ViewUser() {
  let me = this;
  let url = this.url_base + "user-view/" + this.id_user;
  let data = this.user
  axios({
    method: "GET",
    url: url,
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.user.id_user = response.data.result.id_user;
        me.user.id_user_type = response.data.result.id_user_type;
        me.user.establishment = response.data.result.establishment;
        me.user.name = response.data.result.name;
        me.user.last_name = response.data.result.last_name;
        me.user.user = response.data.result.user;
        me.user.email = response.data.result.email;
        me.user.phone = response.data.result.phone;
        me.user.state = response.data.result.state;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

//editar usuario
function EditUser(_this) {

  let me = _this;
  let url = me.url_base + "update-profile";
  let data = me.user;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let user = je.encrypt(JSON.stringify(response.data.result));
        window.localStorage.setItem( "user",user );
        Swal.fire({ icon: 'success', text: 'Se ha modificado el perfil', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A Ocurrido un error', timer: 3000,})
      }
    })
}

//validacion de formulario
function Validate() {

  this.errors.name = this.user.name.length == 0 ? true : false;
  this.errors.last_name = this.user.last_name.length == 0 ? true : false;
  this.errors.user = this.user.user.length == 0 ? true : false;
  this.errors.email = this.user.email.length == 0 ? true : false;

if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.last_name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.user) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.email) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar tu perfil de usuario ?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditUser(me);
      }
    });

  }
}
</script>
