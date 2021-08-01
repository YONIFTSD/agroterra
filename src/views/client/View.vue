<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Cliente - Ver</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
              <b-row>
            
                <b-col md="2">
                  <b-form-group label="Tipo de Documento :">
                    <b-form-select disabled v-model="client.document_type" :options="document_type"></b-form-select>
                  </b-form-group>
                  <small v-if="errors.document_type"  class="form-text text-danger" >Seleccione un tipo de documento</small>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Nro Documento :">
                    <b-input-group>
                      <b-form-input disabled v-model="client.document_number" class="form-control" ></b-form-input>
                    </b-input-group>
        
                  </b-form-group>
                </b-col>
      
                <b-col md="6">
                  <b-form-group label="Nombres / Razón Social:">
                    <b-form-input disabled type="text" ref="name" v-model="client.name" placeholder="Ingrese su nombre"></b-form-input>
               
                  </b-form-group>
                </b-col>
      
                <b-col md="2">
                  <b-form-group label="Pais :" label-for="input-1">
                    <b-form-select disabled ref="country" v-model="client.country" @change="ListCities" :options="contries"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Ciudad :">
                    <b-form-select disabled ref="city" v-model="client.city" :options="cities"></b-form-select>
                  </b-form-group>
                </b-col>
                
                <b-col md="4">
                  <b-form-group label="Ubigeo :">
                  <v-select disabled placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="mubigee" :options="ubigee"></v-select>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Dirección :">
                    <b-form-input disabled type="text"  ref="address"  v-model="client.address" ></b-form-input>
                  </b-form-group>
                </b-col>
   
                <b-col md="2">
                  <b-form-group label="Teléfono :">
                    <b-form-input disabled type="text" ref="phone" v-model="client.phone" placeholder="Ingrese su Telefono"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Nacimiento :" required>
                    <b-form-input disabled type="date" v-model="client.date_of_birth" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Sexo :">
                    <b-form-select disabled ref="sex" v-model="client.sex" :options="sex"></b-form-select>
                  </b-form-group>
                  <small v-if="errors.sex"  class="form-text text-danger" >Seleccione un sexo</small>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Email :">
                    <b-form-input disabled type="email"  ref="email" v-model="client.email" placeholder="Ingrese su email" ></b-form-input>
                  </b-form-group>
                </b-col>
   
                <b-col md="2">
                  <b-form-group label="Clave :" required>
                    <b-form-input disabled type="password"  ref="password" v-model="client.password" placeholder="Ingrese su clave" ></b-form-input>
                  </b-form-group>
                </b-col>
       
                <b-col md="2">
                  <b-form-group label="Estado :">
                    <b-form-select disabled  v-model="client.state" :options="state"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/cliente/listar' }" append >REGRESAR</b-link>
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
  name: "ClienteView",
  props: ["id_client"],
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module:'Client',
      client: {
        id_client: "",
        document_type: "1",
        document_number: "",
        name: "",
        country: "PE",
        ubigee: "",
        address: "",
        phone: "",
        email: "",
        city: "",
        nationality: "",
        coming_from: "",
        profession: "",
        age: "",
        sex: "",
        marital_status: "",
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
      validate: false,
    };
  },
  mounted() {
    this.ListCountries();
    
  },
  methods: {
    ViewClient,
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
      me.ViewClient(me)
    })

}


//ver usuario
function ViewClient(me) {
  let id_client = je.decrypt(me.id_client);
  let url = me.url_base + "client/view/" + id_client;

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

</script>
