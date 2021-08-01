<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Guia Remisión - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">

              <b-tabs content-class="mt-3">
                <b-tab title="Datos de Guia de Remisión" active>
                    <b-row>
                        <b-col md="2">
                            <b-form-group label="Tipo de Comprobante :">
                              <b-form-select @change="ListSeries" v-model="referral_guide.type_invoice" :options="type_invoice"></b-form-select>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label="Serie :">
                              <b-form-select @change="GetNumberBySerie" v-model="referral_guide.id_serie" :options="series"></b-form-select>
                              <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label="Numero :">
                              <b-form-input class="text-center" readonly type="text" ref="number"  v-model="referral_guide.number"></b-form-input>
                              <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                            </b-form-group>
                          </b-col>
                          

                          <b-col md="2">
                            <b-form-group label="Fecha Emision:">
                              <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="referral_guide.broadcast_date"></b-form-input>
                              <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label="Fecha Traslado:">
                              <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="referral_guide.broadcast_date"></b-form-input>
                              <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label=".">
                              <b-button class="form-control" variant="primary" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                            </b-form-group>
                          </b-col>

                          <b-col md="6">
                            <b-form-group>
                              <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                              <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                              <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Ubigeo de Destino:" required>
                            <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="ubigeo_destination" :options="ubigees"></v-select>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Dirección del Destino:">
                              <b-form-input rows="1"  v-model="referral_guide.observation" max-rows="2"></b-form-input>
                            </b-form-group>
                          </b-col>


                          <b-col md="7">
                            <b-form-group label="Observación:">
                              <b-form-input rows="1"  v-model="referral_guide.observation" max-rows="2"></b-form-input>
                            </b-form-group>
                          </b-col>

                          


                          <!-- Detalle venta -->
                          <ReferralGuideDetail/>
                          <b-col md="12" class="text-center">
                            <small  v-if="errors.requirement_detail"  class="form-text tex-center text-danger">Ingrese Productos</small>
                          </b-col>
                          
                          
                          <!-- Detalle venta -->

                          <b-col md="12" class="mt-3"></b-col>

                
                  

                          <b-col md="5"></b-col>
                          <b-col md="2">
                            <b-button  type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                          </b-col>
                        </b-row>
                </b-tab>
                <b-tab title="Datos de Transportista">

                    <b-row>
                      <b-col md="2">
                        <b-form-group label="Medio de Transporte">
                          <b-form-select v-model="referral_guide.carrier_type" :options="carrier_type"></b-form-select>
                        </b-form-group>
                      </b-col>
                      <b-col md="5">
                        <b-form-group>
                          <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                          <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                        </b-form-group>
                      </b-col>
                      
                      <b-col md="5">
                        <b-form-group>
                          <label>Conductor : <span @click="modalDrives" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un conductor" label="text" class="w-100"  v-model="drive" :options="drives"></v-select>
                          <small v-if="errors.id_drive" class="form-text text-danger" >Selccione un conductor</small>
                        </b-form-group>
                      </b-col>

                      <b-col md="3">
                        <b-form-group>
                          <label>Vehiculo : <span @click="modalCars" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un vehiculo" label="text" class="w-100"  v-model="car" :options="cars"></v-select>
                          <small v-if="errors.id_car" class="form-text text-danger" >Selccione un vehiculo</small>
                        </b-form-group>
                      </b-col>
                    </b-row>
                </b-tab>
              </b-tabs>




              
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <!-- Modal Products -->

    <ModalCar />
    <ModalDrive />
    <ModalProviders />
    <LoadingComponent :is-visible="isLoading"/>
  </div>
</template>

<style>

</style>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");
import EventBus from '@/assets/js/EventBus';
import converter from "@/assets/js/NumberToLetters";
import { mapState,mapActions } from "vuex";


// components
import ModalProviders from '@/views/components/ModalProvider'
import LoadingComponent from './../pages/Loading'

import ModalCar from './components/ModalCar'
import ModalDrive from './components/ModalDrive'
import ModalProducts from './components/ModalProduct'
import ReferralGuideDetail from './components/ReferralGuideDetail'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,  
      ModalProducts,
      ReferralGuideDetail,
      ModalProviders,
      LoadingComponent,
      ModalCar,
      ModalDrive,
  },
  data() {
    return {
      isLoading:false,
      module: 'ReferralGuide',
      role: 2,
      referral_guide: {
        id_requirement: "",
        id_establishment: "",
        id_establishment_request: "",
        id_user: 1,
        type_invoice: "09",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        observation: "",
        state: '1',
      },

      providers: [],
      provider:null,
      ubigees:[],
      ubigeo_destination:null,
      cars:[],
      car:null,
      drives:[],
      drive:null,
      series: null,
      establishments: [],
      type_invoice:[
        {value: "09", text : "Guia de Remisión"},
      ],
      carrier_type:[
        {value:'01', text:'Privado'},
        {value:'02', text:'Publico'},
      ],
      //errors
      errors: {
        type_invoice: false,
        serie: false,
        number: false,
        requirement_detail: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    
    this.ListSeries();
    this.ListUbigeos();
    this.ListCars();
    this.ListDrives();
    // EventBus.$on('RefreshListDrives', () => {
    //   this.ListDrives();
    // });
    // EventBus.$on('RefreshListCars', () => {
    //   this.ListCars();
    // });
  },
  methods: {
    ListSeries,
    ListUbigeos,
    GetNumberBySerie,
    modalProducts,
    AddRequirement,
    Validate,
    SearchProvider,
    ListCars,
    ListDrives,


    modalProviders,
    modalCars,
    modalDrives,
  },

  computed: {
    ...mapState('Requirement',['requirement_detail']),
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function ListUbigeos() {
  let url = this.url_base + "list-ubigee";
  let me = this;
  axios({
      method: "GET",
      url: url,
    }).then(function (response) {
      for (let index = 0; index < response.data.length; index++) {
      const element = response.data[index];
      me.ubigees.push({value:element.id_ubigee,text:element.department+', '+element.province+', '+element.district })
    }
    })

}

function ListCars() {
  let url = this.url_base + "car/list-active";
  let me = this;
  axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module, role: this.role, },
    }).then(function (response) {
      me.cars = [];
      for (let index = 0; index < response.data.result.length; index++) {
        const element = response.data.result[index];
        me.cars.push({id:element.id_car,text:element.brand + " | "+ element.plate + " | " + element.plate_secondary + " | " + element.record_number})
      }
    })
}
function ListDrives() {
  let url = this.url_base + "drive/list-active";
  let me = this;
  axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module, role: this.role, },
    }).then(function (response) {
      me.drives = [];
      for (let index = 0; index < response.data.result.length; index++) {
        const element = response.data.result[index];
        me.drives.push({id:element.id_drive,text:element.name + " | "+ element.document_number + " | " + element.license_number})
      }
    })
}



function SearchProvider(search, loading) {
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.providers = response.data.result;
            loading(false);
      })
    }
}


function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}
function modalCars() {
  EventBus.$emit('ModalCarsShow',2);
}
function modalDrives() {
  EventBus.$emit('ModalDrivesShow',2);
}

//listar almacenes
function ListSeries() {

  let me = this;
  let url = this.url_base + "list-series/"+this.referral_guide.type_invoice+"/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,},
  })
    .then(function (response) {
      me.series = [];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.series.push( { value : data[index].id_serie , text: data[index].serie } );
          me.referral_guide.id_serie = data[index].id_serie;
        }
        
         me.GetNumberBySerie();
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

function GetNumberBySerie() {
   let me = this;
  let url = this.url_base + "serie/view/"+this.referral_guide.id_serie;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.referral_guide.number = response.data.result.number;
      } else {
        me.referral_guide.number = '';
      }
    })
}

function modalProducts() {
  if (this.referral_guide.id_establishment_request.length == 0) {
    Swal.fire({ icon: 'warning', text: 'Seleccione un establecimiento', timer: 2000,})
    return false;
  }
  EventBus.$emit('ModalProductsShow',this.role,this.referral_guide.id_establishment_request);
}


function AddRequirement(_this) {
  
  let me = _this;
  let url = me.url_base + "requirement/add";
  me.referral_guide.id_user = me.user.id_user;
  me.referral_guide.id_establishment = me.id_establishment;
  me.referral_guide.requirement_detail = me.requirement_detail;
  let data = me.requirement;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        me.referral_guide.id_requirement = "",
        me.referral_guide.id_establishment = "";
        me.referral_guide.id_establishment_request = "";
        me.referral_guide.id_user = "";
        me.referral_guide.type_invoice = "NR";
        me.referral_guide.serie = "";
        me.referral_guide.number = "";
        me.referral_guide.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.referral_guide.observation = "";
        me.referral_guide.state = 1;
        me.ListSeries();
        me.mLoadResetReferralGuideDetail();
        Swal.fire({ icon: 'success', text: 'Se ha registrado correctamente el requerimiento', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  this.errors.type_invoice = this.referral_guide.type_invoice.length == 0 ? true : false;
  this.errors.id_serie = this.referral_guide.id_serie.length == 0 ? true : false;
  this.errors.broadcast_date = this.referral_guide.broadcast_date.length == 0 ? true : false;
  this.errors.id_establishment_request = this.referral_guide.id_establishment_request.length == 0 ? true : false;
  this.errors.requirement_detail = this.requirement_detail.length == 0 ? true : false;
  
  if (this.errors.type_invoice == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_establishment_request == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.requirement_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar el requerimiento?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddRequirement(me);
    }
  })



}



</script>
