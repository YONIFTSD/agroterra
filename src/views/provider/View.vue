<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Proveedor - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off">
              <b-row>
          
                <b-col md="3">
                  <b-form-group label="Tipo de Documento :">
                    <select
                      disabled
                      ref="document_type"
                      class="form-control"
                      v-model="provider.document_type"
                    >
                      <option value="1">DNI</option>
                      <option value="6">RUC</option>
                      <option value="0">OTROS</option>
                    </select>
                    <small
                      v-if="errors.document_type"
                      class="form-text text-danger"
                      >Seleccione un tipo de documento</small
                    >
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Nro Documento :">
                    <b-input-group>
                      <b-form-input
                      disabled
                        v-model="provider.document_number"
                        class="form-control"
                      ></b-form-input>
                    </b-input-group>
                    <small
                      v-if="errors.document_number"
                      class="form-text text-danger"
                      >Ingrese un nro de documento</small
                    >
                  </b-form-group>
                </b-col>
      
                <b-col md="6">
                  <b-form-group label="Nombres / Razón Social:" required>
                    <b-form-input
                    disabled
                      type="text"
                      ref="name"
                      v-model="provider.name"
                      placeholder="Ingrese su nombre"
                    ></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger"
                      >Ingrese un nombre o razón social</small
                    >
                  </b-form-group>
                </b-col>
       
                <b-col md="6">
                  <b-form-group label="Ubigeo :" required>
                  <v-select disabled placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="mubigee" :options="ubigee"></v-select>
                  </b-form-group>
                </b-col>
  
                <b-col md="6">
                  <b-form-group label="Dirección :" required>
                    <b-form-input
                    disabled
                      type="text"
                      ref="address"
                      v-model="provider.address"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
       
                <b-col md="3">
                  <b-form-group label="Teléfono :" required>
                    <b-form-input
                    disabled
                      type="text"
                      ref="phone"
                      v-model="provider.phone"
                      placeholder="Ingrese su Telefono"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Email :" required>
                    <b-form-input
                    disabled
                      type="email"
                      ref="email"
                      v-model="provider.email"
                      placeholder="Ingrese su email"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
    
                <b-col md="3">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select
                    disabled
                      ref="state"
                      v-model="provider.state"
                      class="form-control"
                    >
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
        

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link
                    class="btn form-control btn-primary"
                    :to="{ path: '/proveedor/listar' }"
                    append
                    >REGRESAR</b-link
                  >
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
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
import LoadingComponent from './../pages/Loading'

export default {
  name: "ProviderView",
  props: ["id_provider"],
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module:'Provider',
      provider: {
        id_provider: "",
        document_type: "",
        document_number: "",
        name: "",
        ubigee: "",
        address: "",
        phone: "",
        email: "",
        state: 1,
      },
      mubigee:null,
      ubigee: [],
      
      //errors
      errors: {
        document_type: false,
        document_number: false,
        name: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListUbigeos();
    
  },
  methods: {
    ViewProvider,
    ListUbigeos,

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
function ListUbigeos() {
 this.ubigee = [];
  let url = this.url_base + "list-ubigee";
  let me = this;
  me.isLoading = true;
  axios({
      method: "GET",
      url: url,
    }).then(function (response) {
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        me.ubigee.push({value:element.id_ubigee,text:element.department+', '+element.province+', '+element.district })
      }
      me.ViewProvider(me);

    })

}

//ver usuario
function ViewProvider(me) {
  let id_provider = je.decrypt(me.id_provider);
  let url = me.url_base + "provider/view/" + id_provider;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: me.token,
      module: me.module,
      role: 5,
    },
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        me.provider.id_provider = response.data.result.id_provider;
        me.provider.document_type = response.data.result.document_type;
        me.provider.document_number = response.data.result.document_number;
        me.provider.name = response.data.result.name;
        me.provider.ubigee = response.data.result.ubigee;
        me.provider.phone = response.data.result.phone;
        me.provider.email = response.data.result.email;
        me.provider.state = response.data.result.state;
        for (let index = 0; index < me.ubigee.length; index++) {
          const element = me.ubigee[index];
          if (element.value == response.data.result.ubigee) {
            me.mubigee = { value : element.value, text:element.text};
            break;
          }
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

</script>
