<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Usuario - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="EditUser">
              <b-row>
                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Establecimiento :">
                    <b-form-select disabled v-model="user.establishment" :options="establishments" multiple :select-size="4"></b-form-select>
                    <small  v-if="errors.establishment" class="form-text text-danger">Seleccione uno o mas establecimientos</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>


                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Tipo de Usuario :">
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
                  <b-form-group label="Nombres :">
                    <b-form-input disabled type="text" ref="name" v-model="user.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger" >Ingrese un nombre de usuario</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Apellido :">
                    <b-form-input disabled type="text" ref="last_name" v-model="user.last_name" placeholder="Ingrese su apellido"></b-form-input>
                    <small v-if="errors.last_name" class="form-text text-danger">Ingrese un apellido de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="3">
                  <b-form-group label="Telefono :">
                    <b-form-input disabled type="text" ref="phone" v-model="user.phone" placeholder="Ingrese su Telefono"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Usuario :">
                    <b-form-input disabled type="text" ref="user" v-model="user.user" placeholder="Ingrese su nombre de usuario"></b-form-input>
                    <small v-if="errors.user" class="form-text text-danger">Ingrese un usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Email :">
                    <b-form-input disabled type="email" ref="email" v-model="user.email" placeholder="Ingrese su email" ></b-form-input>
                    <small v-if="errors.email" class="form-text text-danger">Ingrese un email de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select  disabled ref="state"  v-model="user.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>

                <b-col md="6">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/usuario/listar' }" append>REGRESAR</b-link>
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
  name: "UsuarioView",
  props: ["id_user"],
  data() {
    return {
      module: 'User',
      role:5,
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
  let id_user = je.decrypt(this.id_user);
  let me = this;
  let url = this.url_base + "user/view/" + id_user;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 5,
    },
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
function EditUser() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  let me = this;
  let url = this.url_base + "user/edit";
  let data = {
    id_user: this.user.id_user,
    id_user_type: this.user.id_user_type,
    name: this.user.name,
    last_name: this.user.last_name,
    phone: this.user.phone,
    email: this.user.email,
    password: this.user.password,
    state: this.user.state,
  };

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: 5,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire("Usuario", "Se ha modificado el usuario", "success");
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
  this.errors.id_user_type = this.user.id_user_type.length == 0 ? true : false;
  this.errors.name = this.user.name.length == 0 ? true : false;
  this.errors.last_name = this.user.last_name.length == 0 ? true : false;
  this.errors.email = this.user.email.length == 0 ? true : false;

  this.validate = this.errors.id_user_type == true ? true : false;
  this.validate = this.errors.name == true ? true : false;
  this.validate = this.errors.last_name == true ? true : false;
  this.validate = this.errors.email == true ? true : false;
}
</script>
