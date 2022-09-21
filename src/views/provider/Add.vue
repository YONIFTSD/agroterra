<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Proveedor - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-tabs content-class="mt-3">
                <b-tab title="Datos del Proveedor" active>
                  <b-row>
                    <b-col md="3">
                      <b-form-group label="Tipo de Documento :">
                        <select  ref="document_type"  class="form-control" v-model="provider.document_type">
                          <option value="1">DNI</option>
                          <option value="6">RUC</option>
                          <option value="0">OTROS</option>
                        </select>
                        <small v-if="errors.document_type" class="form-text text-danger">Seleccione un tipo de documento</small>
                      </b-form-group>
                    </b-col>
                    <b-col md="3">
                      <b-form-group label="Nro Documento :">
                        <b-input-group>
                          <b-form-input v-model="provider.document_number" class="form-control"></b-form-input>
                          <b-input-group-append>
                            <b-button variant="primary" @click="SearchProvider">
                              <b-icon icon="search"></b-icon
                            ></b-button>
                          </b-input-group-append>
                        </b-input-group>
                        <small  v-if="errors.document_number"  class="form-text text-danger">Ingrese un nro de documento</small>
                      </b-form-group>
                    </b-col>
              
                    <b-col md="6">
                      <b-form-group label="Nombres / Razón Social:" required>
                        <b-form-input type="text" ref="name" v-model="provider.name"  placeholder="Ingrese su nombre"></b-form-input>
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
                        <b-form-input type="text" ref="address" v-model="provider.address"></b-form-input>
                      </b-form-group>
                    </b-col>
            
                    <b-col md="3">
                      <b-form-group label="Teléfono :" required>
                        <b-form-input type="text"  ref="phone" v-model="provider.phone" placeholder="Ingrese su Telefono"></b-form-input>
                      </b-form-group>
                    </b-col>
                    <b-col md="6">
                      <b-form-group label="Email :" required>
                        <b-form-input  type="email" ref="email" v-model="provider.email" placeholder="Ingrese su email"></b-form-input>
                      </b-form-group>
                    </b-col>
          
                    <b-col md="3">
                      <b-form-group label="Estado :" label-for="input-1">
                        <select  ref="state"  v-model="provider.state"  class="form-control">
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

                </b-tab>
                <b-tab title="Contactos">
                  <b-row>
                    <b-col md="3">
                      <b-form-group label="Tipo de Documento :">
                        <select  ref="document_type"  class="form-control" v-model="seller.document_type">
                          <option value="1">DNI</option>
                          <option value="6">RUC</option>
                          <option value="0">OTROS</option>
                        </select>
                      </b-form-group>
                    </b-col>
                    <b-col md="3">
                      <b-form-group label="Nro Documento :">
                        <b-input-group>
                          <b-form-input v-model="seller.document_number" class="form-control"></b-form-input>
                          <b-input-group-append>
                            <b-button variant="primary" @click="SearchSeller">
                              <b-icon icon="search"></b-icon
                            ></b-button>
                          </b-input-group-append>
                        </b-input-group>
                        <small  v-if="errors.document_number_seller"  class="form-text text-danger">Ingrese un nro de documento</small>
                      </b-form-group>
                    </b-col>
              
                    <b-col md="6">
                      <b-form-group label="Nombres / Razón Social:">
                        <b-form-input type="text" v-model="seller.name"  placeholder="Ingrese su nombre"></b-form-input>
                        <small v-if="errors.name_seller" class="form-text text-danger">Ingrese un nombre o razón social</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label="N° de Licencia:">
                        <b-form-input type="text" v-model="seller.license_number"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Cargo:">
                        <b-form-input type="text" v-model="seller.position"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="4">
                      <b-form-group label="Email:">
                        <b-form-input type="text" v-model="seller.email"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label="Telefono:">
                        <b-form-input type="text" v-model="seller.phone"></b-form-input>
                      </b-form-group>
                    </b-col>

                    <b-col md="1">
                      <b-form-group label=".">
                        <b-button class="form-control" @click="AddSeller" type="button" variant="primary"><i class="fas fa-save"></i></b-button>
                      </b-form-group>
                    </b-col>


                    <div class="table-responsive mt-3">
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th width="5%" class="text-center">#</th>
                            <th width="15%" class="text-center">Nro Documento</th>
                            <th width="35%" class="text-center">Nombre</th>
                            <th width="25%" class="text-center">Email</th>
                            <th width="10%" class="text-center">Telefono</th>
                            <th width="5%" class="text-center">Acciones</th>
                          </tr>
                        </thead>
                        <tbody v-for="(item, it) in provider.sellers" :key="it">
                          <tr>
                            <td class="text-center">{{ it + 1 }}</td>
                            <td class="text-left">{{ CodeDocumentType(item.document_type) +' - '+ item.document_number }}</td>
                            <td class="text-left"> {{ item.name }}</td>
                            <td class="text-left"> {{ item.email }}</td>
                            <td class="text-left"> {{ item.phone }}</td>
              
                            <td class="text-center">
                              <b-button type="button" @click="DeleteSeller(it)" variant="danger"><i class="fas fa-trash"></i></b-button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>


                    <b-col md="5"></b-col>
                    <b-col md="2">
                      <b-button  type="submit" class="form-control" variant="primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
                    </b-col>


                  </b-row>

                </b-tab>
              </b-tabs>


              

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
import CodeToName from "@/assets/js/CodeToName";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import LoadingComponent from './../pages/Loading'
import ApiQuery from "@/assets/js/APIQuery";
export default {
  name: "UsuarioAdd",
  components:{
    vSelect,
    Keypress: () => import('vue-keypress'),
    LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Provider',
      seller:{
        id_provider_seller: "",
        id_provider: "",
        document_type: "1",
        document_number: "",
        name: "",
        license_number: "",
        position: "",
        phone: "",
        email: "",
        state: 1,
      },
      provider: {
        document_type: "6",
        document_number: "",
        name: "",
        ubigee: "",
        address: "",
        phone: "",
        email: "",
        state: 1,
        sellers:[],
      },
      mubigee:null,
      ubigee: [],
      //errors
      errors: {
        document_type: false,
        document_number: false,
        name: false,

        document_type_seller: false,
        document_number_seller: false,
        name_seller: false,
      },
      error_document_number:'',
      error_document_number_seller:'',
      validate: false,
    };
  },
  mounted() {
  this.ListUbigeos();
  },
  methods: {
    SearchProvider,
    SearchSeller,
    AddProveedor,
    Validate,
    ListUbigeos,

    AddSeller,
    CodeDocumentType,
    DeleteSeller,
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

function CodeDocumentType(code) {
  return CodeToName.NameDocumentType(code);
}

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

function SearchSeller() {
   let me = this;
  if (me.seller.document_type == 1) {
      if (me.seller.document_number.length == 8) {
        me.errors.document_number_seller = false;

        ApiQuery.SearchDni(me.seller.document_number).then((data) => {
          if (data.status == 200) {
            me.seller.name = data.razon_social;
          }else{
            me.seller.name = '';
          }
            
        });

      }else{
        me.errors.document_number_seller = true;
        me.error_document_number_seller = 'El nro de ducumento debe contener 8 digitos';
      }
  }

  if (me.seller.document_type == 6) {
      if (me.seller.document_number.length == 11) {
        me.errors.document_number_seller = false;
        
        ApiQuery.SearchRuc(me.seller.document_number).then((data) => {
          if (data.status == 200) {
            me.seller.name = data.razon_social;
          }else{
            me.seller.name = '';
          }
            
        });

      }else{
        me.errors.document_number_seller = true;
        me.error_document_number_seller = 'El nro de ducumento debe contener 11 digitos';
      }
  }
  
}

function AddProveedor(_this) {
  
  let me = _this;
  me.provider.ubigee = me.mubigee != null ?  me.mubigee.value : '';
  
  let url = me.url_base + "provider/add";
  let data = me.provider;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {
      "Content-Type": "application/json",
      token: me.token,
      module: me.module,
      role: 2,
    },
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.provider.document_type = 6;
          me.provider.document_number = "";
          me.provider.name = "";
          me.provider.ubigee = "";
          me.provider.address = "";
          me.provider.phone = "";
          me.provider.email = "";
          me.provider.state = 1;
          me.provider.sellers = [];
          me.mubigee = null;
          Swal.fire({ icon: 'success', text: 'Se ha registrado el nuevo proveedor', timer: 3000,})
      } else if (response.data.status == 400) {
        Swal.fire({ icon: 'warning', text: 'El proveedor ingresado ya se encuentra registrado', timer: 3000,})
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
        this.AddProveedor(me);
      }
    });

  }


}


function AddSeller() {
    this.validate = false;
  if (this.seller.document_type == 1) {
    this.errors.document_number_seller = this.seller.document_number.length != 8 ? true : false;
    this.error_document_number_seller = 'El nro de ducumento debe contener 8 digitos';
  }else if(this.seller.document_type == 6){
    this.errors.document_number_seller = this.seller.document_number.length != 11 ? true : false;
    this.error_document_number_seller = 'El nro de ducumento debe contener 11 digitos';
  }else if(this.seller.document_type == 4){
    this.errors.document_number_seller = this.seller.document_number.length != 12 ? true : false;
    this.error_document_number_seller = 'El nro de ducumento debe contener 12 digitos';
  }else if(this.seller.document_type == 7){
    this.errors.document_number_seller = this.seller.document_number.length != 12 ? true : false;
    this.error_document_number_seller = 'El nro de ducumento debe contener 12 digitos';
  }else{
    this.errors.document_number_seller = this.seller.document_number.length == 0 ? true : false;
    this.error_document_number_seller = 'Ingrese un nro de documento';
  }

  this.errors.document_type_seller = this.seller.document_type.length == 0 ? true : false;
  this.errors.name_seller = this.seller.name.length == 0 ? true : false;

  if (this.errors.document_type_seller) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.document_number_seller) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.name_seller) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let data = {
    id_provider_seller: this.seller.id_provider_seller,
    id_provider: this.seller.document_type,
    document_type: this.seller.document_type,
    document_number: this.seller.document_number,
    name: this.seller.name,
    license_number: this.seller.license_number,
    position: this.seller.position,
    phone: this.seller.phone,
    email: this.seller.email,
    state: 1
  };
  this.provider.sellers.push(data);

  this.seller.document_type = 1;
  this.seller.document_number = '';
  this.seller.name = '';
  this.seller.license_number = '';
  this.seller.position = '';
  this.seller.email = '';
  this.seller.phone = '';

}

function DeleteSeller(index) {
  this.provider.sellers.splice(index, 1);
}
</script>
