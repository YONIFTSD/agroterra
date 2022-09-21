<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Cliente - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>
           
                <b-col md="2">
                  <b-form-group label="Tipo de Documento :">
                    <b-form-select ref="city" v-model="client.document_type" :options="document_type"></b-form-select>
                  </b-form-group>
                  <small v-if="errors.document_type"  class="form-text text-danger" >Seleccione un tipo de documento</small>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Nro Documento :">
                    <b-input-group>
                      <b-form-input v-model="client.document_number" class="form-control" ></b-form-input>
                      <b-input-group-append>
                        <b-button variant="primary"  @click="SearchClient"><b-icon icon="search"></b-icon></b-button>
                      </b-input-group-append>
                    </b-input-group>
                    <small v-if="errors.document_number" class="form-text text-danger" >{{error_document_number}}</small>
                  </b-form-group>
                </b-col>
         
                <b-col md="5">
                  <b-form-group label="Nombres / Razón Social:">
                    <b-form-input type="text" ref="name" v-model="client.name" placeholder="Ingrese su nombre"></b-form-input>
                    <small v-if="errors.name" class="form-text text-danger" >Ingrese un nombre o razón social</small>
                  </b-form-group>
                </b-col>
      
                <b-col md="2">
                  <b-form-group label="Pais :" label-for="input-1">
                    <b-form-select ref="country" v-model="client.country" @change="ListCities" :options="contries"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Ciudad :">
                    <b-form-select ref="city" v-model="client.city" :options="cities"></b-form-select>
                  </b-form-group>
                </b-col>
                
                <b-col md="4">
                  <b-form-group label="Ubigeo :">
                  <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="mubigee" :options="ubigee"></v-select>
                  </b-form-group>
                </b-col>
      
                <b-col md="4">
                  <b-form-group label="Dirección :">
                    <b-form-input type="text"  ref="address"  v-model="client.address" ></b-form-input>
                  </b-form-group>
                </b-col>

                 <b-col md="2">
                  <b-form-group label="Teléfono :" required>
                    <b-form-input type="text" ref="phone" v-model="client.phone" placeholder="Ingrese su Telefono"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Nacimiento :" required>
                    <b-form-input type="date" v-model="client.date_of_birth" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Sexo :">
                    <b-form-select ref="sex" v-model="client.sex" :options="sex"></b-form-select>
                  </b-form-group>
                  <small v-if="errors.sex"  class="form-text text-danger" >Seleccione un sexo</small>
                </b-col>
      

                <b-col md="4">
                  <b-form-group label="Email :">
                    <b-form-input type="email"  ref="email" v-model="client.email" placeholder="Ingrese su email" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Clave :" required>
                    <b-form-input type="password"  ref="password" v-model="client.password" placeholder="Ingrese su clave" ></b-form-input>
                  </b-form-group>
                </b-col>
       
                <b-col md="2">
                  <b-form-group label="Estado :">
                    <b-form-select  v-model="client.state" :options="state"></b-form-select>
                  </b-form-group>
                </b-col>
           


                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button type="submit" class="form-control" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
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
import ApiQuery from "@/assets/js/APIQuery";
import LoadingComponent from './../pages/Loading'

export default {
  name: "ClientEdit",
  props: ["id_client"],
  components:{
    vSelect,
    Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  
  data() {
    return {
      module:'Client',
      isLoading: false,
      client: {
        id_client: "",
        document_type: "1",
        document_number: "",
        name: "",
        country: "PE",
        ubigee: "",
        address: "",
        phone: "",
        password: "",
        email: "",
        city: "",
        sex: "",
        date_of_birth: "",
        state: 1,
      },

      mubigee:null,
      ubigee: [],
      contries: [],
      cities: [],
      document_type: [
        {value: 1 , text : 'DNI'},
        {value: 6 , text : 'RUC'},
        {value: 4 , text : 'CARNET DE EXTRANJERIA'},
        {value: 7 , text : 'PASAPORTE'},
        {value: 0 , text : 'OTROS'},
      ],
      sex: [
        {value: '' , text : 'Seleccione un sexo'},
        {value: 'H' , text : 'Hombre'},
        {value: 'M' , text : 'Mujer'},
      ],
      state:[
        {value: 1 , text : 'Activo'},
        {value: 0 , text : 'Inactivo'},
      ],
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
    this.ListCountries();
    // this.ViewClient();
    
  },
  methods: {
    ViewClient,
    EditClient,
    Validate,
    
    SearchClient,
    ListCountries,
    ListCities,
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



function ListCountries() {
 let url = this.url_base + "list-countries";
 let me = this;
 me.isLoading = true;
 axios({
    method: "GET",
    url: url,
  }).then(function (response) {
    for (let index = 0; index < response.data.length; index++) {
    const element = response.data[index];
    me.contries.push({value:element.code,text:element.name})
  }
  })
  this.ListCities();
  
}
function ListCities() {
 this.cities = [];
 this.client.city = '';
  let url = this.url_base + "list-states/"+this.client.country;
  let me = this;
  axios({
      method: "GET",
      url: url,
    }).then(function (response) {
      me.cities.push({value: '',text:'-- Seleccione una ciudad --'})
      for (let index = 0; index < response.data.length; index++) {
      const element = response.data[index];
      me.cities.push({value:element.name,text:element.name})
    }
    })
  this.ListUbigeos();
}

function ListUbigeos() {
 this.ubigee = [];
 if (this.client.country != "PE") {
   this.mubigee = null;
   return false;
 }
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

      me.ViewClient(me);
    })

}

function SearchClient() {


  let me = this;
  if (me.client.document_type == 1) {
      if (me.client.document_number.length == 8) {
        me.errors.document_number = false;
        ApiQuery.SearchDni(me.client.document_number).then((data) => {
          if (data.status == 200) {
            me.client.name = data.razon_social;
            me.client.address = data.direccion;
          }else{
            me.client.name = '';
            me.client.address = '';
          }
            
        });
      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 8 digitos';
      }
  }

  if (me.client.document_type == 6) {
      if (me.client.document_number.length == 11) {
        me.errors.document_number = false;
        ApiQuery.SearchRuc(me.client.document_number).then((data) => {
          if (data.status == 200) {
            me.client.name = data.razon_social;
            me.client.address = data.direccion;
          }else{
            me.client.name = '';
            me.client.address = '';
          } 
        });
      }else{
        me.errors.document_number = true;
        me.error_document_number = 'El nro de ducumento debe contener 11 digitos';
      }
  }
  
}

//ver usuario
function ViewClient(me) {
  let id_client = je.decrypt(me.id_client);
  let url = me.url_base + "client/view/" + id_client;
  axios({
    method: "GET",
    url: url,
    headers: {token: me.token, module: me.module, role: 3, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.client.id_client = response.data.result.id_client;
        me.client.document_type = response.data.result.document_type;
        me.client.document_number = response.data.result.document_number;
        me.client.name = response.data.result.name;
        me.client.ubigee = response.data.result.ubigee;
        me.client.country = response.data.result.country;
        me.client.phone = response.data.result.phone;
        me.client.address = response.data.result.address;
        me.client.email = response.data.result.email;
        me.client.city = response.data.result.city;
        me.client.date_of_birth = response.data.result.date_of_birth;
        me.client.age = response.data.result.age;
        me.client.sex = response.data.result.sex;
        me.client.state = response.data.result.state;

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
function EditClient(_this) {

  let me = _this;
  me.client.ubigee = me.mubigee != null ?  me.mubigee.value : '';
  let url = me.url_base + "client/edit";
  let data = me.client;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json",token: me.token, module: me.module, role: 3,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente los datos del cliente', timer: 3000,})
      } else if(response.data.status == 200) {
          Swal.fire({ icon: 'warning', text: 'El cliente ingresado ya se encuentra registrado', timer: 3000,})
      }else{
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
  if (this.client.document_type == 1) {
    this.errors.document_number = this.client.document_number.length != 8 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 8 digitos';
  }else if(this.client.document_type == 6){
    this.errors.document_number = this.client.document_number.length != 11 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 11 digitos';
  }else if(this.client.document_type == 4){
    this.errors.document_number = this.client.document_number.length != 12 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 12 digitos';
  }else if(this.client.document_type == 7){
    this.errors.document_number = this.client.document_number.length != 12 ? true : false;
    this.error_document_number = 'El nro de ducumento debe contener 12 digitos';
  }else{
    this.errors.document_number = this.client.document_number.length == 0 ? true : false;
    this.error_document_number = 'Ingrese un nro de documento';
  }

  this.errors.document_type = this.client.document_type.length == 0 ? true : false;
  this.errors.name = this.client.name.length == 0 ? true : false;

  if (this.errors.document_type) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.document_number) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  if (!this.validate) {
    Swal.fire({
      title: "Esta seguro de modificar los datos del cliente?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditClient(me);
      }
    });

  }

}
</script>
