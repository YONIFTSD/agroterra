<template>
  <div>
    <b-modal size="md" hide-footer v-model="modalProviders" class="" title="NUEVO PROVEEDOR">
      <b-row>
        <b-col md="12">
          <b-form id="Form" @submit.prevent="AddProvider">
              <b-row>
                <b-col md="6">
                  <b-form-group label="Tipo de Documento :">
                    <select class="form-control"  v-model="provider.document_type" >
                      <option value="1">DNI</option>
                      <option value="6">RUC</option>
                      <option value="0">OTROS</option>
                    </select>
                    <small v-if="errors.document_type" class="form-text text-danger">Seleccione un tipo de documento</small >
                  </b-form-group>
                </b-col>
                <b-col md="6">
                  <b-form-group label="Nro Documento :">
                    <b-input-group>
                      <b-form-input v-model="provider.document_number" class="form-control" ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="info" @click="SearchProvider">
                          <b-icon icon="search"></b-icon></b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <small v-if="errors.document_number" class="form-text text-danger">{{error_document_number}}</small>
                  </b-form-group>
                </b-col>
            

                <b-col md="12">
                  <b-form-group label="Nombres / Razón Social:" required>
                    <b-form-input type="text" v-model="provider.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger">Ingrese un nombre o razón social</small>
                  </b-form-group>
                </b-col>
     
         
                <b-col md="12">
                  <b-form-group label="Ubigeo :" required>
                  <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="mubigee" :options="ubigee"></v-select>
                  </b-form-group>
                </b-col>
            
                <b-col md="12">
                  <b-form-group label="Dirección :" required>
                    <b-form-input type="text"  ref="address" v-model="provider.address"></b-form-input>
                  </b-form-group>
                </b-col>
  
      
                <b-col md="12">
                  <b-form-group label="Email :" required>
                    <b-form-input type="email" ref="email" v-model="provider.email"  placeholder="Ingrese su email" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-button type="submit" class="form-control bg-primary text-white" variant="primary" >GUARDAR</b-button>
                </b-col>
              </b-row>
            </b-form>
        </b-col>
  
      </b-row>
    </b-modal>
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
import EventBus from "@/assets/js/EventBus";
import ApiQuery from "@/assets/js/APIQuery";
export default {
  name: "ProviderModal",
  components:{
    vSelect,
  },
  data() {
    return {
        modalProviders: false,
        provider: {
          document_type: "1",
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
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProvidersShow', () => {
      this.modalProviders = true;
      this.ListUbigeos();
    });
  },
  methods: {
    SearchProvider,
    AddProvider,
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
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function ListUbigeos() {
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
    })

}


function SearchProvider() {


   let me = this;
  if (me.provider.document_type == 1) {
      if (me.provider.document_number.length == 8) {
        me.errors.document_number = false;

        ApiQuery.SearchDni(me.provider.document_number).then((data) => {
          if (data.status == 200) {
            me.provider.name = data.razon_social;
            me.provider.address = data.direccion;
          }else{
            me.provider.name = '';
            me.provider.address = '';
          }
            
        });

      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 8 digitos';
      }
  }

  if (me.provider.document_type == 6) {
      if (me.provider.document_number.length == 11) {
        me.errors.document_number = false;
        
        ApiQuery.SearchRuc(me.provider.document_number).then((data) => {
          if (data.status == 200) {
            me.provider.name = data.razon_social;
            me.provider.address = data.direccion;
          }else{
            me.provider.name = '';
            me.provider.address = '';
          }
            
        });

      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 11 digitos';
      }
  }
  
}


function AddProvider() {
  // validacion de campos obligatorios
  this.Validate();
  if (this.validate) {
    return false;
  }

  this.provider.ubigee = this.mubigee != null ?  this.mubigee.value : '';

  let me = this;
  let url = this.url_base + "provider/add";
  let data = {
    document_type: this.provider.document_type,
    document_number: this.provider.document_number,
    name: this.provider.name,
    ubigee: this.provider.ubigee,
    address: this.provider.address,
    phone: this.provider.phone,
    email: this.provider.email,
    state: this.provider.state,
  };

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: this.token,
      module: "Provider",
      role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.provider.document_type = 1;
        me.provider.document_number = "";
        me.provider.name = "";
        me.provider.ubigee = "";
        me.provider.address = "";
        me.provider.phone = "";
        me.provider.email = "";
        me.provider.state = 1;
        me.modalProviders = false;
        Swal.fire("Sistema", "Se ha registrado el nuevo proveedor", "success");
      } else if (response.data.status == 400) {
        Swal.fire("Sistema", "El proveedor ingresado ya se encuentra registrado", "warning");
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

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

}
</script>
