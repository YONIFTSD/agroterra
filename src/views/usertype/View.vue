<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Tipo Usuario - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>
                
                <b-col md="3">
                  <b-form-group label="Nombres :">
                    <b-form-input
                      disabled
                      type="text"
                      ref="name"
                      v-model="usertype.name"
                      placeholder="Ingrese su nombre"
                    ></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger"
                      >Ingrese un nombre</small
                    >
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Descripción :">
                    <b-form-input
                      disabled
                      type="text"
                      ref="description"
                      v-model="usertype.description"
                      placeholder="Ingrese su apellido"
                    ></b-form-input>
                    <small v-if="errors.description" class="form-text text-danger"
                      >Ingrese una descripcion</small
                    >
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select
                      disabled
                      ref="state"
                      v-model="usertype.state"
                      class="form-control"
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>

                <b-col md="3" v-for="zone in modules" :key="zone.id_zone">
                  <b-card :header="zone.group" :title="zone.name">
                    <b-card-text>

                    <b-form-group>
                      <b-form-checkbox
                        disabled
                        v-for="privilege in zone.privileges" :key="privilege.id_privilege"
                        v-model="privilege_zone"
                        :value="zone.id_zone + '_' +privilege.id_privilege"
                        name="flavour-3a"
                      >
                        {{ privilege.name }}
                      </b-form-checkbox>
                    </b-form-group>

                    </b-card-text>
                  </b-card>
                </b-col>


                <b-col md="12"></b-col>
                <b-col md="3"></b-col>

                <b-col md="6">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/tipo-usuario/listar' }" append >REGRESAR</b-link>
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
  name: "TipoUsuarioView",
  props: ["id_user_type"],
  data() {
    return {
      module:'UserType',
      usertype: {
        id_user_type: "",
        name: "",
        description: "",
        state: "",
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
    this.ViewUserType();
  },
  methods: {
    ListModules,
    ViewUserType,
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
      role: 5,
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


//ver usuario
function ViewUserType() {
  let id_user_type = je.decrypt(this.id_user_type);
  let me = this;
  let url = this.url_base + "user-type/view/" + id_user_type;

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
        me.usertype.id_user_type = response.data.result.user_type.id_user_type;
        me.usertype.name = response.data.result.user_type.name;
        me.usertype.description = response.data.result.user_type.description;
        me.usertype.state = response.data.result.user_type.state;
        me.privilege_zone = response.data.result.privilege_zone;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}
</script>
