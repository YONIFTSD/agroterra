<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Proveedor - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
                <b-col md="3">
                  <b-form-group label="Tipo de Documento :">
                    <select  ref="document_type" class="form-control" v-model="provider.document_type">
                      <option value="1">DNI</option>
                      <option value="6">RUC</option>
                      <option value="0">OTROS</option>
                    </select>
                    <small  v-if="errors.document_type" class="form-text text-danger">Seleccione un tipo de documento</small>
                  </b-form-group>
                </b-col>
                <b-col md="3">
                  <b-form-group label="Nro Documento :">
                    <b-input-group>
                      <b-form-input v-model="provider.document_number" class="form-control"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click="SearchProvider">
                          <b-icon icon="search"></b-icon
                        ></b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <small v-if="errors.document_number" class="form-text text-danger">Ingrese un nro de documento</small>
                  </b-form-group>
                </b-col>
  
                <b-col md="6">
                  <b-form-group label="Nombres / Razón Social:" required>
                    <b-form-input type="text" ref="name" v-model="provider.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre o razón social</small>
                  </b-form-group>
                </b-col>
  
                <b-col md="6">
                  <b-form-group label="Ubigeo :" required>
                  <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="mubigee" :options="ubigee"></v-select>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Dirección :" required>
                    <b-form-input type="text"  ref="address" v-model="provider.address"></b-form-input>
                  </b-form-group>
                </b-col>
       
                <b-col md="3">
                  <b-form-group label="Teléfono :" required>
                    <b-form-input type="text" ref="phone" v-model="provider.phone"  placeholder="Ingrese su Telefono"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Email :" required>
                    <b-form-input  type="email" ref="email" v-model="provider.email" placeholder="Ingrese su email"></b-form-input>
                  </b-form-group>
                </b-col>
 
                <b-col md="3">
                  <b-form-group label="Estado :" label-for="input-1">
                    <select  ref="state" v-model="provider.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
       


                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button  type="submit" class="form-control" variant="primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
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
  name: "ProviderEdit",
  props: ["id_provider"],
  components:{
    vSelect,
    Keypress: () => import('vue-keypress'),
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Provider',
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
      error_document_number:'',
      validate: false,
    };
  },
  mounted() {
    this.ListUbigeos();
    
  },
  methods: {
    SearchProvider,
    ViewProvider,
    EditProvider,
    Validate,
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
function SearchProvider() {


  let me = this;
 if (me.provider.document_type == 1) {
      if (me.provider.document_number.length == 8) {
        me.errors.document_number = false;
        axios({
          method: "GET",
          url: 'https://dni.optimizeperu.com/api/persons/'+me.provider.document_number,
        }).then(function (response) {
          console.log(response);
            if (response.data.name != undefined ) {
              me.provider.name =  response.data.first_name + ' ' + response.data.last_name + ' '+ response.data.name;
            }
        })
      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 8 digitos';
      }
  }

  if (me.provider.document_type == 6) {
      if (me.provider.document_number.length == 11) {
        me.errors.document_number = false;
        axios({
          method: "GET",
          url: 'https://dniruc.apisperu.com/api/v1/ruc/'+me.provider.document_number+'?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InNlZ2NhbmFodWlyZUBnbWFpbC5jb20ifQ.wEYHsSfNliepUjte7SjQVBPxEEB_4TDy9ZEZ_SwArJM',
        }).then(function (response) {
          console.log(response);
            if (response.data.razonSocial != undefined ) {
              me.provider.name = response.data.razonSocial;
            }
        })
      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 11 digitos';
      }
  }
  
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
      role: 3,
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

//editar usuario
function EditProvider(_this) {

  let me = _this;
  me.provider.ubigee = me.mubigee != null ?  me.mubigee.value : '';
  
  let url = me.url_base + "provider/edit";
  let data = me.provider;

  axios({
    method: "PUT",
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
         Swal.fire({ icon: 'success', text: 'Se ha modificado el proveedor', timer: 3000,})
      } else if (response.data.status == 400) {
        Swal.fire({ icon: 'warning', text: 'El proveedor ingresado ya se encuentra registrado', timer: 3000,})
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
this.validate = false;
  if (this.provider.document_type == 1) {
    this.errors.document_number = this.provider.document_number.length != 8 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 8 digitos';
  }else if(this.provider.document_type == 6){
    this.errors.document_number = this.provider.document_number.length != 11 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 11 digitos';
  }else if(this.provider.document_type == 4){
    this.errors.document_number = this.provider.document_number.length != 12 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 12 digitos';
  }else if(this.provider.document_type == 7){
    this.errors.document_number = this.provider.document_number.length != 12 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 12 digitos';
  }else{
    this.errors.document_number = this.provider.document_number.length == 0 ? true : false;
    this.error_document_number = 'Ingrese un nro de documento';
  }

  this.errors.document_type = this.provider.document_type.length == 0 ? true : false;
  this.errors.name = this.provider.name.length == 0 ? true : false;

  if (this.errors.document_type) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.document_number) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de guardar el proveedor?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditProvider(me);
      }
    });

  }
}
</script>
