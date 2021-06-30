<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Guia Remisión - Completar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">

              <b-tabs content-class="mt-3">
                <b-tab title="Datos de Guia de Remisión" active>
                    <b-row>
                        <b-col md="2">
                            <b-form-group label="Tipo de Comprobante :">
                              <b-form-select disabled v-model="referral_guide.type_invoice" :options="type_invoice"></b-form-select>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label="Serie :">
                              <b-form-input disabled v-model="referral_guide.serie"></b-form-input>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label="Numero :">
                              <b-form-input disabled class="text-center" readonly type="text" ref="number"  v-model="referral_guide.number"></b-form-input>
                            </b-form-group>
                          </b-col>
                          

                          <b-col md="2">
                            <b-form-group label="Fecha Emision:">
                              <b-form-input disabled class="text-center" type="date" ref="broadcast_date" v-model="referral_guide.broadcast_date"></b-form-input>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label="Fecha Traslado:">
                              <b-form-input class="text-center" type="date" ref="transfer_date" v-model="referral_guide.transfer_date"></b-form-input>
                              <small v-if="errors.transfer_date" class="form-text text-danger">Seleccione una fecha</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="2">
                            <b-form-group label=".">
                              <b-button class="form-control" variant="primary" @click="modalProducts">Agregar Productos</b-button>
                            </b-form-group>
                          </b-col>

                          <b-col md="6">
                            <b-form-group>
                              <label>Razon Social: </label>
                              <b-form-input disabled v-model="provider"></b-form-input>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Ubigeo de Destino:" required>
                            <v-select placeholder="Seleccione un ubigeo" label="text" class="w-100"  v-model="ubigee_destination" :options="ubigees"></v-select>
                            <small v-if="errors.ubigee_destination"  class="form-text text-danger" >Seleccione una Ubigeo</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="3">
                            <b-form-group label="Dirección del Destino:">
                              <b-form-input  v-model="referral_guide.address_destination"></b-form-input>
                              <small v-if="errors.address_destination"  class="form-text text-danger" >Ingrese una dirección</small>
                            </b-form-group>
                          </b-col>

                          <b-col md="12">
                            <b-form-group label="Observación:">
                              <b-form-input rows="1"  v-model="referral_guide.observation" max-rows="2"></b-form-input>
                            </b-form-group>
                          </b-col>


                          <!-- Detalle venta -->
                          <ReferralGuideDetail/>
                          <b-col md="12" class="text-center">
                            <small  v-if="errors.referral_guide_detail"  class="form-text tex-center text-danger">Ingrese Productos</small>
                          </b-col>
                          

                          <b-col md="12" class="mt-3"></b-col>
                          <b-col md="10">
                          </b-col>
                          <b-col md="2">
                            <b-form-group label="Peso Total:">
                              <b-form-input disabled type="number" step="any" class="text-right" v-model="total_weight"></b-form-input>
                              <small v-if="errors.total_weight"  class="form-text text-danger" >ingrese el peso</small>
                            </b-form-group>
                              <b-form-group label="Nro Paquetes:">
                              <b-form-input type="number" step="any" class="text-center" v-model="referral_guide.number_packages"></b-form-input>
                              <small v-if="errors.number_packages"  class="form-text text-danger" >Ingrese el nro de paquetes</small>
                            </b-form-group>
                          </b-col>
                        </b-row>
                </b-tab>
                <b-tab title="Datos de Transportista">

                    <b-row>
                      <b-col md="2">
                        <b-form-group label="Medio de Transporte">
                          <b-form-select v-model="referral_guide.carrier_type" :options="carrier_type"></b-form-select>
                          <small v-if="errors.carrier_type"  class="form-text text-danger" >Seleccione un tipo</small>
                        </b-form-group>
                      </b-col>
                      <b-col md="5">
                        <b-form-group>
                          <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="carrier" @search="SearchCarrier" :options="carriers"></v-select>
                          <small v-if="errors.id_carrier" class="form-text text-danger" >Seleccione un proveedor</small>
                        </b-form-group>
                      </b-col>
                      
                     

                      <b-col md="5">
                        <b-form-group>
                          <label>Vehiculo : <span @click="modalCars" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un vehiculo" label="text" class="w-100"  v-model="car" :options="cars"></v-select>
                          <small v-if="errors.id_car" class="form-text text-danger" >Selccione un vehiculo</small>
                        </b-form-group>
                      </b-col>

                       <b-col md="6">
                        <b-form-group>
                          <label>Conductor : <span @click="modalDrives" class="text-info link">Nuevo</span></label>
                          <v-select placeholder="Seleccione un conductor" label="text" class="w-100"  v-model="drive" :options="drives"></v-select>
                          <small v-if="errors.id_drive" class="form-text text-danger" >Selccione un conductor</small>
                        </b-form-group>
                      </b-col>
                    </b-row>
                </b-tab>
              </b-tabs>

              <b-row>
                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button  type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button>
                </b-col>
              </b-row>


              
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
  props: ["id_referral_guide"],
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
      role: 3,
      referral_guide: {
        id_referral_guide: "",
        id_user: "",
        id_serie: "",
        id_establishment: "",
        id_provider: "",
        id_output: "",
        type_invoice: "",
        serie: "",
        number: "",
        broadcast_date: "",
        broadcast_time: "",
        transfer_date: "",
        reason_code: "",
        reason: "",
        note: "",
        total_weight: 0,
        number_packages: 0,
        carrier_type: 1,
        id_carrier: 0,
        id_car: 0,
        id_drive: 0,
        code_hash: "",
        code_cdr: "",
        sunat_message: "",
        observation: "",
        state: '1',
      },

      providers: [],
      provider: '',
      carriers: [],
      carrier:null,
      ubigees:[],
      ubigee_destination:null,
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
        transfer_date: false,
        ubigee_destination: false,
        address_destination: false,
        total_weight: false,
        number_packages: false,
        carrier_type: false,
        id_carrier: false,
        id_car: false,
        id_drive: false,
        referral_guide_detail: false,
      },
      validate: false,
    };
  },
  created(){
      this.ListUbigeos();
  },
  mounted() {
    
    this.mLoadResetReferralGuideDetail();
    
    this.ListCars();
    this.ListDrives();
    this.ViewReferralGuide();
    EventBus.$on('RefreshListDrives', () => {
      this.ListDrives();
    });
    EventBus.$on('RefreshListCars', () => {
      this.ListCars();
    });
  },
  methods: {
    ViewReferralGuide,
    ListSeries,
    ListUbigeos,
    GetNumberBySerie,
    modalProducts,
    EditReferralGuide,
    Validate,
    SearchProvider,
    SearchCarrier,
    ListCars,
    ListDrives,


    modalProviders,
    modalCars,
    modalDrives,
    ...mapActions('ReferralGuide',['mLoadResetReferralGuideDetail']),
     ...mapActions('ReferralGuide',['mLoadAddReferralGuideDetail']),
    
  },

  computed: {
    ...mapState('ReferralGuide',['referral_guide_detail','total_weight']),
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

function ViewReferralGuide() {
  
  let id_referral_guide = je.decrypt(this.id_referral_guide);
  let url = this.url_base + "referral-guide/view/"+id_referral_guide;
  let me = this;
  axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module, role: this.role, },
    }).then(function (response) {
      if (response.data.status == 200) {
        let referral_guide = response.data.result.referral_guide;
        let referral_guide_detail = response.data.result.referral_guide_detail;
        me.referral_guide.id_referral_guide = referral_guide.id_referral_guide;
        me.referral_guide.id_user = referral_guide.id_user;
        me.referral_guide.id_serie = referral_guide.id_serie;
        me.referral_guide.id_establishment = referral_guide.id_establishment;
        me.referral_guide.id_provider = referral_guide.id_provider;
        me.referral_guide.id_output = referral_guide.id_output;
        me.referral_guide.type_invoice = referral_guide.type_invoice;
        me.referral_guide.serie = referral_guide.serie;
        me.referral_guide.number = referral_guide.number;
        me.referral_guide.broadcast_date = referral_guide.broadcast_date;
        me.referral_guide.broadcast_time = referral_guide.broadcast_time;
        me.referral_guide.transfer_date = referral_guide.transfer_date;
        me.referral_guide.reason_code = referral_guide.reason_code;
        me.referral_guide.reason = referral_guide.reason;
        me.referral_guide.note = referral_guide.note;
        me.referral_guide.total_weight = referral_guide.total_weight;
        me.referral_guide.number_packages = referral_guide.number_packages;
        me.referral_guide.carrier_type = referral_guide.carrier_type;
        me.referral_guide.id_carrier = referral_guide.id_carrier;
        me.referral_guide.ubigee_destination = referral_guide.ubigee_destination;
        me.referral_guide.address_destination = referral_guide.address_destination;
        me.referral_guide.ubigee_departure = referral_guide.ubigee_departure;
        me.referral_guide.address_departure = referral_guide.address_departure;
        me.referral_guide.id_car = referral_guide.id_car;
        me.referral_guide.id_drive = referral_guide.id_drive;
        me.referral_guide.code_hash = referral_guide.code_hash;
        me.referral_guide.code_cdr = referral_guide.code_cdr;
        me.referral_guide.sunat_message = referral_guide.sunat_message;
        me.referral_guide.observation = referral_guide.observation;
        me.referral_guide.state = referral_guide.state;

        me.provider =  referral_guide.name + " - "+ referral_guide.document_number;
        me.ubigee_destination = referral_guide.ubigee_destination.length == 0 ? null: {value:referral_guide.ubigee_destination,text:referral_guide.ubigee_des_department+', '+referral_guide.ubigee_des_province+', '+referral_guide.ubigee_des_district };
        me.carrier = referral_guide.id_carrier == 0 ? null: { id:referral_guide.id_carrier, name: referral_guide.carrier_name + " - "+ referral_guide.carrier_document_number};
        me.car = referral_guide.id_car == 0 ? null: { id:referral_guide.id_car, text: referral_guide.brand + " | "+ referral_guide.plate+ " | "+ referral_guide.record_number};
        me.drive = referral_guide.id_drive == 0 ? null: { id:referral_guide.id_drive, text: referral_guide.drive_name + " | "+ referral_guide.drive_document_number + " | "+ referral_guide.drive_license_number};

        for (let index = 0; index < referral_guide_detail.length; index++) {
          const element = referral_guide_detail[index];
          let detail = {
            id_product: element.id_product,
            code:element.code,
            name:element.name,
            presentation:element.presentation,
            unit_measure:element.unit_measure,
            igv:element.igv,
            existence_type:element.existence_type,
            quantity: element.quantity,
            weight_unit: element.weight_unit,
            weight_total: element.weight_total,
          }
          me.mLoadAddReferralGuideDetail(detail);
        }

      }
      
    })
}

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

function SearchCarrier(search, loading) {
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.carriers = response.data.result;
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


function EditReferralGuide(me) {

  let url = me.url_base + "referral-guide/complete";
  me.referral_guide.ubigee_destination = me.ubigee_destination.value;
  me.referral_guide.id_carrier = me.carrier.id;
  me.referral_guide.id_car = me.car.id;
  me.referral_guide.id_drive = me.drive.id;
  me.referral_guide.total_weight = me.total_weight;
  me.referral_guide.referral_guide_detail = me.referral_guide_detail;
  let data = me.referral_guide;
  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha completado la guia de remisión', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  

  this.errors.transfer_date = this.referral_guide.transfer_date.length == 0 ? true : false;
  this.errors.ubigee_destination = this.ubigee_destination == null ? true : false;
  this.errors.address_destination = this.referral_guide.address_destination.length == 0 ? true : false;
  this.errors.total_weight = parseFloat(this.total_weight) == 0 ? true : false;
  this.errors.number_packages = parseFloat(this.referral_guide.number_packages) == 0 ? true : false;
  this.errors.carrier_type = this.referral_guide.carrier_type.length == 0 ? true : false;
  this.errors.id_carrier = this.carrier == null ? true : false;
  this.errors.id_car = this.car == null ? true : false;
  this.errors.id_drive = this.drive == null ? true : false;
  this.errors.referral_guide_detail = this.referral_guide_detail.length == 0 ? true : false;

  
  if (this.errors.transfer_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.ubigee_destination == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.address_destination == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total_weight == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number_packages == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.carrier_type == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_carrier == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_car == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_drive == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.referral_guide_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de completar la guia?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditReferralGuide(me);
    }
  })



}



</script>
