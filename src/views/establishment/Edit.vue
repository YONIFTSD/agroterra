<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Establecimiento - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
  
                <b-col md="2">
                  <b-form-group label="Código:">
                    <b-form-input type="text" v-model="establishment.code"></b-form-input>
                    <small v-if="errors.code" class="form-text text-danger">Ingrese un código</small>
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Nombre:">
                    <b-form-input type="text" ref="name" v-model="establishment.name"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre</small>
                  </b-form-group>
                </b-col>
       
                <b-col md="4">
                  <b-form-group label="Nombre Corto:">
                    <b-form-input type="text" ref="name" v-model="establishment.short_name"></b-form-input>
                  </b-form-group>
                </b-col>
         
           
                <b-col md="4">
                  <b-form-group label="Ubigeo :" required>
                  <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="mubigee" :options="ubigee"></v-select>
                  <small v-if="errors.ubigee" class="form-text text-danger">Seleccione un ubigeo</small>
                  </b-form-group>
                </b-col>
        
                <b-col md="5">
                  <b-form-group label="Dirección :">
                    <b-form-input type="text" v-model="establishment.address"></b-form-input>
                  </b-form-group>
                  <small v-if="errors.address" class="form-text text-danger">Ingrese una dirección</small>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Teléfono :">
                    <b-form-input type="text" v-model="establishment.phone"></b-form-input>
                  </b-form-group>
                  <small v-if="errors.phone" class="form-text text-danger">Ingrese un teléfono</small>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Email :">
                    <b-form-input type="text" v-model="establishment.email"></b-form-input>
                  </b-form-group>
                </b-col>
        
                <b-col md="2">
                  <b-form-group label="Val Stock :">
                    <select v-model="establishment.validate_stock"  class="form-control">
                      <option value="1">SI</option>
                      <option value="0">NO</option>
                    </select>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Val Precio :">
                    <select v-model="establishment.validate_price"  class="form-control">
                      <option value="1">SI</option>
                      <option value="0">NO</option>
                    </select>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Estado :">
                    <select  v-model="establishment.state" class="form-control">
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </b-form-group>
                </b-col>
        


                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control text-white" variant="primary">GUARDAR</b-button>
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
  name: "EstablishmentEdit",
  props: ["id_establishment"],
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Establishment',
      role: 3,
      establishment: {
        code: "",
        name: "",
        short_name: "",
        description: "",
        ubigee: "",
        address: "",
        validate_stock: 1,
        validate_price: 1,
        state: 1,
      },

      ubigee: [],
      mubigee:null,
      //errors
      errors: {
        code: false,
        name: false,
        ubigee: false,
        address: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ListUbigee();
    
  },
  methods: {
    ViewEstablishment,
    EditEstablishment,
    Validate,
    ListUbigee,
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

function ListUbigee() {
  this.ubigee = [];
  let url = this.url_base + "list-ubigee";
  let me = this;
  axios({
      method: "GET",
      url: url,
    }).then(function (response) {
      for (let index = 0; index < response.data.length; index++) {
        const element = response.data[index];
        me.ubigee.push({value:element.id_ubigee,text:element.department+', '+element.province+', '+element.district })
      }
      me.ViewEstablishment(me);
    })

}

function ViewEstablishment(me) {
  me.isLoading = true;
  let id_establishment = je.decrypt(me.id_establishment);
  let url = me.url_base + "establishment/view/" + id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.establishment.id_establishment = response.data.result.id_establishment;
        me.establishment.name = response.data.result.name;
        me.establishment.code = response.data.result.code;
        me.establishment.short_name = response.data.result.short_name;
        me.establishment.description = response.data.result.description;
        me.establishment.ubigee = response.data.result.ubigee;
        me.establishment.address = response.data.result.address;
        me.establishment.email = response.data.result.email;
        me.establishment.phone = response.data.result.phone;
        me.establishment.state = response.data.result.state;
        me.establishment.validate_stock = response.data.result.validate_stock;
        me.establishment.validate_price = response.data.result.validate_price;

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
  
}

//editar usuario
function EditEstablishment(_this) {
  let me = _this;
  let url = me.url_base + "establishment/edit";
  me.establishment.ubigee = me.mubigee != null ?  me.mubigee.value : '';
  let data = me.establishment;
  me.isLoading = true;
  axios({
    method: "PUT",
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
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado el establecimiento', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}

//validacion de formulario
function Validate() {

  this.errors.code = this.establishment.code.length == 0 ? true : false;
  this.errors.name = this.establishment.name.length == 0 ? true : false;
  this.errors.ubigee = this.mubigee == null ? true : false;
  this.errors.address = this.establishment.address.length == 0 ? true : false;
  
  if (this.errors.code) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.ubigee) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.address) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar el establecimiento?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditEstablishment(me);
      }
    });

  }

}
</script>
