<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Proveedor - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-tabs content-class="mt-3">
                <b-tab title="Datos del Proveedor" active>
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
                        <b-button class="form-control" @click="ValidateSeller" type="button" variant="primary"><i class="fas fa-save"></i></b-button>
                      </b-form-group>
                    </b-col>


                    <div class="table-responsive mt-3">
                      <table class="table table-hover table-bordered">
                        <thead>
                          <tr>
                            <th width="5%" class="text-center">#</th>
                            <th width="12%" class="text-center">Nro Documento</th>
                            <th width="35%" class="text-center">Nombre</th>
                            <th width="25%" class="text-center">Email</th>
                            <th width="10%" class="text-center">Telefono</th>
                            <th width="8%" class="text-center">Acciones</th>
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
                              <b-button type="button" size="sm" @click="ViewProviderSeller(item.id_provider_seller)" variant="primary"><i class="fas fa-eye"></i></b-button>
                              <b-button type="button" size="sm" @click="ConfirmDeleteSeller(item.id_provider_seller)" variant="danger"><i class="fas fa-trash"></i></b-button>
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

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import LoadingComponent from './../pages/Loading'
import ApiQuery from "@/assets/js/APIQuery";

import CodeToName from "@/assets/js/CodeToName";
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
      role:3,
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
        selected: false,
      },
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
    ViewProvider,
    EditProvider,
    Validate,
    ListUbigeos,

    SearchSeller,
    ValidateSeller,
    AddSeller,
    EditSeller,
    CodeDocumentType,
    ConfirmDeleteSeller,
    DeleteSeller,
    ViewProviderSeller,
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
        me.provider.sellers = response.data.result.sellers;

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


function ValidateSeller() {
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

  if (this.seller.id_provider_seller.length == 0) {
    Swal.fire({
      title: "Esta seguro de registrar el contacto del proveedor?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.AddSeller();
      }
    });
  }else{
    Swal.fire({
      title: "Esta seguro de modificar el contacto del proveedor?",
      text: "",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, Estoy de acuerdo!",
    }).then((result) => {
      if (result.value) {
        this.EditSeller();
      }
    });
  }

}

function AddSeller() {

  let me = this;
  let url = me.url_base + "provider-seller/add";
  me.seller.id_provider = me.provider.id_provider;
  let data = me.seller;
  me.isLoading = true;
  axios({
    method: "POST",
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
      if (response.data.status == 201) {
          me.provider.sellers = response.data.result;
          me.seller.id_provider_seller = '';
          me.seller.id_provider = '';
          me.seller.document_type = 1;
          me.seller.document_number = '';
          me.seller.name = '';
          me.seller.license_number = '';
          me.seller.position = '';
          me.seller.email = '';
          me.seller.phone = '';
          Swal.fire({ icon: 'success', text: 'Se ha registrado el nuevo contacto', timer: 3000,})
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

function EditSeller() {

  let me = this;
  let url = me.url_base + "provider-seller/edit";
  me.seller.id_provider = me.provider.id_provider;
  let data = me.seller;
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
          me.provider.sellers = response.data.result;

          me.seller.id_provider_seller = '';
          me.seller.id_provider = '';
          me.seller.document_type = 1;
          me.seller.document_number = '';
          me.seller.name = '';
          me.seller.license_number = '';
          me.seller.position = '';
          me.seller.email = '';
          me.seller.phone = '';
          Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente el contacto del proveedor', timer: 3000,})
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

function ConfirmDeleteSeller(id_provider_seller) {
  Swal.fire({
    title: "Esta seguro de eliminar el contacto del proveedor?",
    text: "",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteSeller(id_provider_seller);
    }
  });
}

function DeleteSeller(id_provider_seller) {
  let me = this;
  let url = this.url_base + "provider-seller/delete/" + id_provider_seller;
  axios({
    method: "delete",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.provider.sellers.length; i++) {
          if (me.provider.sellers[i].id_provider_seller == id_provider_seller) {
            me.provider.sellers.splice(i, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text: 'Se ha eliminado el contacto del proveedor', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ViewProviderSeller(id_provider_seller) {
  let me = this;
  this.isLoading = true;
  let url = me.url_base + "provider-seller/view/" + id_provider_seller;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: me.token,
      module: me.module,
      role: me.role
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.seller.id_provider_seller = response.data.result.id_provider_seller;
        me.seller.id_provider = response.data.result.id_provider;
        me.seller.document_type = response.data.result.document_type;
        me.seller.document_number = response.data.result.document_number;
        me.seller.name = response.data.result.name;
        me.seller.license_number = response.data.result.license_number;
        me.seller.position = response.data.result.position;
        me.seller.phone = response.data.result.phone;
        me.seller.email = response.data.result.email;
        me.seller.state = response.data.result.state;
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
