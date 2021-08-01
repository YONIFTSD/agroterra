<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Tipo Usuario - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="AddUserType">
              <b-row>
                <b-col md="3">
                  <b-form-group label="Nombres :" >
                    <b-form-input type="text" ref="name"  v-model="usertype.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Descripción :" >
                    <b-form-input type="text" ref="description" v-model="usertype.description" placeholder="Ingrese su apellido"></b-form-input>
                    <small v-if="errors.description" class="form-text text-danger">Ingrese una descripcion</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Estado :" >
                    <select  ref="state" v-model="usertype.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>

                <b-col md="3" v-for="zone in modules" :key="zone.id_zone">
                  <b-card  :header="zone.group" :title="zone.name">
                    <b-card-text>

                    <b-form-group>
                      <b-form-checkbox v-for="privilege in zone.privileges" :key="privilege.id_privilege"
                        v-model="privilege_zone" :value="zone.id_zone + '_' +privilege.id_privilege" name="flavour-3a">
                        {{ privilege.name }}
                      </b-form-checkbox>
                    </b-form-group>

                    </b-card-text>
                  </b-card>
                </b-col>

                <b-col md="12"></b-col>
                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button  type="submit" class="form-control bg-primary" variant="primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
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
  name: "TipoUsuarioAdd",
  data() {
    return {
      module: 'UserType',
      usertype: {
        name: "",
        description: "",
        state: 1,
      },
      modules: [],
      privilege_zone: [],

      //errors
      errors: {
        name: false,
        description: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListModules();
  },
  methods: {
    ListModules,
    AddUserType,
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
function ListModules() {
  let me = this;
  let url = this.url_base + "user-type/modules";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.modules = response.data.result;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function AddUserType() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  let me = this;
  let url = this.url_base + "user-type/add";
  let data = {
    name: this.usertype.name,
    description: this.usertype.description,
    state: this.usertype.state,
    privilege_zone: this.privilege_zone,
  };

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: this.module,
      role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        
        me.usertype.name = "";
        me.usertype.description = "";
        me.usertype.state = 1;
        me.privilege_zone = [];
        Swal.fire("Usuario", "Se ha creado el nuevo tipo de usuario", "success");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  this.errors.name = this.usertype.name.length == 0 ? true : false;
  this.errors.description = this.usertype.description.length == 0 ? true : false;

  this.validate = this.errors.name == true ? true : false;
  this.validate = this.errors.description == true ? true : false;
}
</script>
