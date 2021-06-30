<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Usuario - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form  @submit.prevent="Validate">
              <b-row>

                
                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Establecimiento :" required>
                    <b-form-select v-model="user.establishment" :options="establishments" multiple :select-size="4"></b-form-select>
                    <small  v-if="errors.establishment" class="form-text text-danger">Seleccione uno o mas establecimientos</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>


                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Tipo de Usuario :" required>
                    <select ref="id_user_type" class="form-control" v-model="user.id_user_type">
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
                    <b-form-input type="text" ref="user" v-model="user.user" placeholder="Ingrese su nombre de usuario"></b-form-input>
                    <small v-if="errors.user" class="form-text text-danger">Ingrese un usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Email :" required>
                    <b-form-input type="email" ref="email" v-model="user.email" placeholder="Ingrese su email" ></b-form-input>
                    <small v-if="errors.email" class="form-text text-danger">Ingrese un email de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Password :" label-for="input-1">
                    <b-form-input type="password" ref="password" v-model="user.password" ></b-form-input>
                    <small v-if="errors.password" class="form-text text-danger" >Ingrese un password de usuario</small>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select  ref="state"  v-model="user.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
                <b-col md="3"></b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button  type="submit" class="btn form-control  btn-primary">GUARDAR</b-button>
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
  name: "UsuarioAdd",
  data() {
    return {
      module:'User',
      role:2,
      user: {
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
        establishment: false,
        id_user_type: false,
        name: false,
        last_name: false,
        user: false,
        email: false,
        password: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListEstablishment();
    this.ListUserType();
  },
  methods: {
    ListUserType,
    ListEstablishment,
    AddUser,
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

//listar usuario
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
}

function AddUser(_this) {
 
  let me = _this;
  let url = me.url_base + "user/add";
  let data = me.user;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: me.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.user.establishment = [];
        me.user.id_user_type = "";
        me.user.name = "";
        me.user.last_name = "";
        me.user.phone = "";
        me.user.user = "";
        me.user.email = "";
        me.user.password = "";
        me.user.state = 1;
        Swal.fire({ icon: 'success', text: 'Se ha creado el nuevo usuario', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

function Validate() {
  this.errors.establishment = this.user.establishment.length == 0 ? true : false;
  this.errors.id_user_type = this.user.id_user_type.length == 0 ? true : false;
  this.errors.name = this.user.name.length == 0 ? true : false;
  this.errors.last_name = this.user.last_name.length == 0 ? true : false;
  this.errors.user = this.user.user.length == 0 ? true : false;
  this.errors.email = this.user.email.length == 0 ? true : false;
  this.errors.password = this.user.password.length == 0 ? true : false;

if (this.errors.establishment) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.id_user_type) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.last_name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.user) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.email) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
if (this.errors.password) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de guardar el usuario?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.AddUser(me);
      }
    });

  }

}
</script>
