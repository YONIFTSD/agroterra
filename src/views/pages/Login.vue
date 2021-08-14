<template>
  <div class="c-app flex-row align-items-center">
    <CContainer>

      <CRow class="justify-content-center">
        <CCol md="4">
          <CCardGroup>
            <CCard class="p-4 bg-card">
              <CCardBody>
                <CForm @submit.prevent="Login">
                  
                  <div class="w-100 text-center mb-1">
                    <b-card-img class="img-fluid" style="max-width: 200px;" :src="url_base + business.logo"></b-card-img>
                  </div>
                  <div class="w-100 text-center mt-1">
                    <span>Bienvenido a</span>
                    <h4>{{business.name}}</h4>
                  </div>
                  <div class="w-100 text-center pt-2">
                    <strong class="text-muted">Ingresa a tu cuenta</strong>
                  </div>

                  
                  

                  <b-form-group class="mb-1" label="Establecimiento :">
                    <b-form-select ref="id_establishment" v-model="id_establishment" :options="establishments"></b-form-select>
                    <small v-if="errors.id_establishment"  class="form-text text-danger" >Seleccione un establecimiento</small>
                  </b-form-group>
            
                  <b-form-group class="mb-1" label="Email :">
                    <b-form-input type="email" v-model="email"></b-form-input>
                    <small v-if="errors.email"  class="form-text text-danger" >Ingrese su email</small>
                  </b-form-group>

                  <b-form-group class="mb-1" label="Contraseña :">
                    <b-form-input type="password" autocomplete="curent-password" v-model="password"></b-form-input>
                    <small v-if="errors.password"  class="form-text text-danger" >Ingrese su contraseña</small>
                  </b-form-group>
             

                

                  <CRow>
                    <CCol col="12" class="text-left mt-2">
                      <CButton color="primary" type="submit" class="px-4 w-100"
                        >Login</CButton
                      >
                    

                    </CCol>
                    
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
<style>
/* .c-app{
   background: url('~@/assets/img/bg-login.jpg') no-repeat center center fixed; 
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
} */
.bg-card{
  background-color: #fff !important;
  
  /* opacity: 0.6; */
}
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require('json-encrypt')

import { mapState } from "vuex";


export default {
  name: "Login",
  data() {
    return {
      email: '',
      password: '',
      business: {
        logo:'',
        name:'',
      },
      id_establishment: '',
      establishments: [],

      errors:{
        id_establishment: false,
        email: false,
        password: false,
      }
    };
  },
  methods: {
    Login,
    ListEstablishment,
    ViewBussiness,
  },
  mounted() {
    this.ListEstablishment();
    this.ViewBussiness();
    
  },
  computed: {
    ...mapState(["url_base"]),
  },
};

//login
function Login() {

  if(this.id_establishment.length == 0){ 
    this.errors.id_establishment = true;
  }
  if(this.email.length == 0){ 
    this.errors.email = true;
  }
  if(this.password.length == 0){ 
    this.errors.password = true;
  }

  let me = this;
  const email = this.email;
  const password = this.password;
  const id_establishment = this.id_establishment;
  
  let url = this.url_base + "login";

  let data = {
    email: email,
    password: password,
    id_establishment: id_establishment,
  };


  axios({
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  }).then(function (response) {

    
    if (response.data.status == 200) {
      
      let user = je.encrypt(JSON.stringify(response.data.result.user));
      let token = je.encrypt(response.data.result.user.api_token);
      let id_establishment = je.encrypt(me.id_establishment);
      let user_permissions = je.encrypt(JSON.stringify(response.data.result.userPermissions));

      window.localStorage.setItem( "user",user );
      window.localStorage.setItem( "id_establishment", id_establishment );
      window.localStorage.setItem( "token", token );
      window.localStorage.setItem( "user_permissions", user_permissions);
      me.$router.push({ name: "Home"})
      Swal.fire({ icon: "success", title: "Hola "+response.data.result.user.name+ " "+response.data.result.user.last_name+", Bienvenido al sistema", showConfirmButton: false, timer: 3000,});
    }else{
      Swal.fire({ icon: "error", title: "Datos incorrectos", showConfirmButton: false,timer: 1500,});
    }
  });

}

function ViewBussiness() {
  let me = this;
  let url = this.url_base + "get-business";

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
  .then(function (response) {
    if (response.data.status == 200) {
      me.business.logo = response.data.result.logo;
      me.business.name = response.data.result.name;
    }
  })
}

function ListEstablishment() {
  let me = this;
  let url = this.url_base + "active-establishments";

  axios({
    method: "GET",
    url: url,
  })
    .then(function (response) {

      me.establishments = [];
      me.establishments.push({value:'',text:'Seleccione un establecimiento'});

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
</script>
