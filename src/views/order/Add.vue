<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Venta - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
       
                <b-col md="3">
                  <b-form-group>
                    <b-form-select v-model="sale.id_warehouse" :options="warehouses"></b-form-select>
                    <small  v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

               

    
                <b-col md="6"></b-col>
                <b-col md="3">
                  <b-form-group>
                    <b-button class="form-control btn btn-info" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                  </b-form-group>
                </b-col>
             

               <b-col md="3">
                  <b-form-group label="Comprobante :">
                    <b-form-select @change="ListSeries" v-model="sale.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-select @change="GetNumberBySerie" v-model="sale.id_serie" :options="series"></b-form-select>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" readonly type="text" ref="number"  v-model="sale.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input class="text-center" type="date" ref="broadcast_date" v-model="sale.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: <span @click="modalClients" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>

                 <b-col md="3">
                  <b-form-group label="Moneda :">
                    <b-form-select v-model="sale.coin" :options="coins"></b-form-select>
                    <small  v-if="errors.coin"  class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                 <b-col md="3">
                  <b-form-group label="Forma de Pago :">
                    <b-form-select v-model="sale.way_to_pay" :options="way_to_pay"></b-form-select>
                  </b-form-group>
                </b-col>


                <b-col md="12">
                  <b-form-group label="Observación:">
                    <b-form-textarea rows="1"  v-model="sale.observation" max-rows="2"></b-form-textarea>
                  </b-form-group>
                </b-col>


                <!-- Detalle venta -->
                <SaleDetail/>
                <small  v-if="errors.sale_detail"  class="form-text text-danger">Ingrese Productos</small>
                
                <!-- Detalle venta -->

                <b-col md="12" class="mt-3"></b-col>

                <b-col md="8">
                  <b-form-group class="m-0" >
                    <b-form-input readonly v-model="total_sale.number_to_letters" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group class="m-0" label-cols-lg="8" label="Subtotal:" label-align="right" >
                    <b-form-input readonly class="text-right" v-model="total_sale.subtotal"></b-form-input>
                  </b-form-group>

                  <b-form-group  class="m-0"  label-cols-lg="8" label="IGV (18%):"  label-align="right">
                    <b-form-input readonly class="text-right" v-model="total_sale.igv"></b-form-input>
                  </b-form-group>

                  <b-form-group  class="m-0" label-cols-lg="8" label="Total:" label-align="right">
                    <b-form-input readonly class="text-right" v-model="total_sale.total"></b-form-input>
                    <small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>

                </b-col>

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button  type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
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

    <!-- Modal Clients -->
    <ModalClients />
    <!-- Modal Clients -->

    
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
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import SaleDetail from './components/SaleDetail'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
  },
  data() {
    return {
      module: 'Sale',
      role: 2,
      sale: {
        id_sale: "",
        id_client: "",
        id_serie: "",
        id_warehouse: 1,
        type_operation: "01",
        type_invoice: "03",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        broadcast_time: "",
        expiration_date: moment(new Date()).local().format("YYYY-MM-DD"),
        coin: "PEN",
        way_to_pay: "01-008",
        payment_type: "01",
        payment_method: "008",
        payment_deadline: "0",
        observation: "",
        modified_document_type: "",
        modified_serie: "",
        modified_number: "",
        modified_emission_date: "",
        reason: "",
        support: "",
        sunat_message: "",
        hash_cpe: "",
        hash_cdr: "",
        taxed_operation: '0.00',
        exonerated_operation: '0.00',
        unaffected_operation: '0.00',
        discount: '0.00',
        subtotal: '0.00',
        igv: '0.00',
        total: '0.00',
        state: '1',
        number_to_letters: '',
      },

      series: null,
      warehouses: [],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
      type_invoice:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "NV", text : "Nota de Venta"},
      ],
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      way_to_pay:[
        {value:"01-008", text: 'Contado - Efectivo'},
        {value:"01-001", text: 'Contado - Depósito en Cuenta'},
        {value:"01-002", text: 'Contado - Giro'},
        {value:"01-005", text: 'Contado - Tarjeta de Débito'},
      ],

  
      //errors
      errors: {
        id_serie: false,
        id_client: false,
        way_to_pay: false,
        sale_detail: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.mLoadResetSaleDetail();
    this.ListWarehouses();
    this.ListSeries();
  },
  methods: {
    
    SearchClients,
    ListWarehouses,
    ListSeries,
    GetNumberBySerie,

    modalProducts,
    modalClients,

    AddSale,
    Validate,

    ...mapActions('Sale',['mLoadResetSaleDetail']),
  },

  computed: {
    ...mapState('Sale',['sale_detail','total_sale']),
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


function SearchClients(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients = response.data;
            loading(false);
      })
    }
}

//listar almacenes
function ListSeries() {

  let me = this;
  let url = this.url_base + "list-series/"+this.sale.type_invoice+"/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.series = [];
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.series.push( { value : data[index].id_serie , text: data[index].serie } );
          me.sale.id_serie = data[index].id_serie;
        }
        
         me.GetNumberBySerie();
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function GetNumberBySerie() {
   let me = this;
  let url = this.url_base + "serie/view/"+this.sale.id_serie;

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
        me.sale.number = response.data.result.number;
      } else {
        me.sale.number = '';
      }
    })
}

//listar almacenes
function ListWarehouses() {

  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.warehouses.push({value : '', text: '-- Seleccione un almacen --'});
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.warehouses.push( { value : data[index].id_warehouse , text: data[index].name } );
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function modalProducts() {
  EventBus.$emit('ModalProductsShow',this.role);
}

function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function AddSale(_this) {
  
  let me = _this;
  let url = me.url_base + "sale/add";
  me.sale.id_user = me.user.id_user;
  me.sale.id_client = me.client.id;
  me.sale.taxed_operation = me.total_sale.taxed_operation;
  me.sale.unaffected_operation = me.total_sale.unaffected_operation;
  me.sale.exonerated_operation = me.total_sale.exonerated_operation;
  me.sale.discount = me.total_sale.discount;
  me.sale.subtotal = me.total_sale.subtotal;
  me.sale.igv = me.total_sale.igv;
  me.sale.total = me.total_sale.total;
  me.sale.number_to_letters = me.total_sale.number_to_letters;
  
  me.sale.sale_detail = me.sale_detail;


  let data = me.sale;
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
      
        me.client = {id:1,full_name:'CLIENTES VARIOS - 00000000'};
        me.sale.type_operation = "01",
        me.sale.type_invoice = "03";
        me.sale.serie = "";
        me.sale.number = "";
        me.sale.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.sale.broadcast_time = "";
        me.sale.expiration_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.sale.coin = "PEN";
        me.sale.way_to_pay = "01-008";
        me.sale.payment_type = "01";
        me.sale.payment_method = "008";
        me.sale.payment_deadline = "0";
        me.sale.observation = "";
        me.sale.modified_document_type = "";
        me.sale.modified_serie = "";
        me.sale.modified_number = "";
        me.sale.modified_emission_date = "";
        me.sale.reason = "";
        me.sale.support = "";
        me.sale.sunat_message = "";
        me.sale.hash_cpe = "";
        me.sale.hash_cdr = "";
        me.sale.taxed_operation = '0.00';
        me.sale.exonerated_operation = '0.00';
        me.sale.unaffected_operation = '0.00';
        me.sale.discount = '0.00';
        me.sale.subtotal = '0.00';
        me.sale.igv = '0.00';
        me.sale.total = '0.00';
        me.sale.state = '1';
        me.sale.number_to_letters = '';
        me.ListSeries();
        me.mLoadResetSaleDetail();
        Swal.fire({ icon: 'success', text: 'Se ha emitido correctamente la venta', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  this.errors.id_serie = this.sale.id_serie == 0 ? true : false;
  this.errors.broadcast_date = this.sale.broadcast_date == 0 ? true : false;
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.sale.coin == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay == 0 ? true : false;
  this.errors.sale_detail = this.sale_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_sale.total) <= 0 ? true : false;
  
  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.sale_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de emitir la venta?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddSale(me);
    }
  })



}



</script>
