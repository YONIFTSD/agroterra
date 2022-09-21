<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Abono - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Tipo de Operación :">
                    <b-form-select ref="operation_type" v-model="shopping.operation_type" :options="operations_type"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                   <b-form-group label=".">
                    <b-button class="form-control btn" variant="primary" @click="modalProducts" ><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                   </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Comprobante :">
                    <b-form-select ref="invoice_type" v-model="shopping.invoice_type" :options="invoices_type"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" @change="UpperCase" v-model="shopping.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="shopping.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="shopping.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>


                <b-col md="3">
                  <b-form-group label="Fecha Llegada:">
                    <b-form-input type="date" ref="arrival_date" v-model="shopping.arrival_date"></b-form-input>
                    <small v-if="errors.arrival_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="shopping.coin" :options="coins"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Tipo de Cambio :">
                    <b-form-input type="number" ref="number" v-model="shopping.exchange_rate"></b-form-input>
                    <small v-if="errors.exchange_rate" class="form-text text-danger">Ingrese un tipo de cambio</small>
                  </b-form-group>
                </b-col>

           
                
                <b-col md="3">
                  <b-form-group label="Usuario:">
                    <b-form-input type="text"  readonly ref="user" v-model="user.email"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="12">
                  <b-form-group label="Observación:">
                    <b-form-textarea rows="1"  v-model="shopping.observation" max-rows="3"></b-form-textarea>
                  </b-form-group>
                </b-col>

                <!-- Detalle Entrada -->
                <mShoppingDetail/>
                <small v-if="errors.shopping_detail" class="col-md-12 form-text text-center text-danger">Agregue productos</small>
                <!-- Detalle Entrada -->
                <b-col md="12" class="mt-3"></b-col>


                <b-col md="8"></b-col>
                <b-col md="4">
                  <b-form-group
                    label-cols-sm="7"
                    label="Ope. Gravadas :"
                    class="text-right"
                  >
                    <b-form-input class="text-right" readonly v-model="total_shopping.taxed_operation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="8"></b-col>
                <b-col md="4">
                  <b-form-group
                    label-cols-sm="7"
                    label="Ope. Exonerada :"
                    class="text-right"
                  >
                    <b-form-input class="text-right" readonly v-model="total_shopping.exonerated_operation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="8"></b-col>
                <b-col md="4">
                  <b-form-group
                    label-cols-sm="7"
                    label="Ope. Inafecta :"
                    class="text-right"
                  >
                    <b-form-input class="text-right" readonly v-model="total_shopping.unaffected_operation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="8"></b-col>
                <b-col md="4">
                  <b-form-group
                    label-cols-sm="7"
                    label="IGV (18%) :"
                    class="text-right"
                  >
                    <b-form-input class="text-right" readonly v-model="total_shopping.igv"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="8"></b-col>
                <b-col md="4">
                  <b-form-group
                    label-cols-sm="7"
                    label="Total :"
                    class="text-right"
                  >
                    <b-form-input class="text-right" readonly v-model="total_shopping.total"></b-form-input>
                  </b-form-group>
                </b-col>


                <b-col md="4"></b-col>
                <b-col md="4">
                  <b-button type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
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
    <ModalProviders />
    <!-- Modal Clients -->

    
  </div>
</template>

<script>
///import vue select
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");


import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import converter from "@/assets/js/NumberToLetters";

// components
import ModalProviders from '@/views/components/ModalProvider'
import ModalProducts from './components/ModalProduct'
import mShoppingDetail from './components/ShoppingDetail'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalProducts,
      mShoppingDetail,
      ModalProviders,
  },
  data() {
    return {
      module: 'Shopping',
      role: 2,

      shopping: {
        id_shopping:'',
        id_provider:'',
        id_user:'',
        linkages:'',
        operation_type:'02',
        invoice_type:'01',
        serie:'',
        number:'',
        broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        arrival_date:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'PEN',
        exchange_rate: '1.00',
        payment_type:'01',
        payment_method:'008',
        payment_deadline:'',
        observation:'',
        taxed_operation: (0).toFixed(2),
        exonerated_operation: (0).toFixed(2),
        unaffected_operation: (0).toFixed(2),
        discount: (0).toFixed(2),
        subtotal: (0).toFixed(2),
        igv: (0).toFixed(2),
        total: (0).toFixed(2),
        state:1,
        shopping_detail: [],

      },

      providers: [],
      provider:null,

      operations_type:[
            {value :"02", text :"Compra Nacional"},
            {value :"03", text :"Consignación Recibida"},
            {value :"07", text :"Bonificación"},
            {value :"08", text :"Premio"},
            {value :"09", text :"Donación"},
            {value :"18", text :"Importación"},
            {value :"28", text :"Ajuste Por Diferencia De Inventario"},
            {value :"19", text :"Entrada De Producción"},
            {value :"21", text :"Entrada Por Transferencia Entre Almacenes"},
            {value :"16", text :"Saldo Inicial"},
      ],
      
      invoices_type:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "04", text : "Liquidación de compra"},
        {value: "07", text : "Nota de crédito"},
        {value: "08", text : "Nota de débito"},
        {value: "09", text : "Guía de remisión - Remitente"},
        {value: "12", text : "Ticket o cinta emitido por máquina registradora"},
        {value: "22", text : "Comprobante por Operaciones No Habituales"},
        {value: "31", text : "Guía de Remisión - Transportista"},
        {value: "50", text : "Declaración Única de Aduanas - Importación definitiva"},
        {value: "52", text : "Despacho Simplificado - Importación Simplificada"},
        {value: "91", text : "Comprobante de No Domiciliado"},
        {value: "NE", text : "Nota de Entrada"},
        {value: "00", text : "Otros"},
      ],

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      //errors
      errors: {
        id_provider: false,
        serie:false,
        number:false,
        broadcast_date:false,
        arrival_date:false,
        shopping_detail:false,
        exchange_rate:false,
      },
      validate: false,
    };
  },
  mounted() {
    
 
  },
  methods: {
    SearchProvider,
    modalProducts,
    modalProviders,
    NumberPadStart,
    UpperCase,
    AddShopping,
    Validate,
    ...mapActions('Shopping',['mLoadResetShoppingDetail']),
    
  },

  computed: {
    ...mapState('Shopping',['shopping_detail','total_shopping']),
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

function modalProducts() {
  EventBus.$emit('ModalProductsShow',this.role);
}

function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}


function NumberPadStart() {
  var number = String(this.shopping.number);
  number = number.padStart(8,"0");
  this.shopping.number = number;
}
function UpperCase() {
    this.shopping.serie = this.shopping.serie.toUpperCase();
}



function AddShopping(mthis) {

  let me = mthis;
  let url = me.url_base + "shopping/add";

  me.shopping.id_provider = me.provider.id;
  me.shopping.id_user = me.user.id_user;
  me.shopping.taxed_operation = me.total_shopping.taxed_operation;
  me.shopping.exonerated_operation = me.total_shopping.exonerated_operation;
  me.shopping.unaffected_operation = me.total_shopping.unaffected_operation;
  me.shopping.discount = me.total_shopping.discount;
  me.shopping.subtotal = me.total_shopping.subtotal;
  me.shopping.igv = me.total_shopping.igv;
  me.shopping.total = me.total_shopping.total;
  me.shopping.shopping_detail = me.shopping_detail;

  let data = me.shopping;
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

            me.provider = null;
            me.shopping.id_provider = '';
            me.shopping.id_user = '';
            me.shopping.linkages = '';
            me.shopping.operation_type = '02';
            me.shopping.invoice_type = '01';
            me.shopping.serie = '';
            me.shopping.number = '';
            me.shopping.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
            me.shopping.arrival_date = moment(new Date()).local().format("YYYY-MM-DD");
            me.shopping.coin = 'PEN';
            me.shopping.exchange_rate =  '1.00';
            me.shopping.payment_type = '01';
            me.shopping.payment_method = '008';
            me.shopping.payment_deadline = '';
            me.shopping.observation = '';
            me.shopping.taxed_operation =  (0).toFixed(2);
            me.shopping.exonerated_operation =  (0).toFixed(2);
            me.shopping.unaffected_operation =  (0).toFixed(2);
            me.shopping.discount =  (0).toFixed(2);
            me.shopping.subtotal =  (0).toFixed(2);
            me.shopping.igv =  (0).toFixed(2);
            me.shopping.total =  (0).toFixed(2);
            me.shopping.state = 1;
            me.shopping.shopping_detail =  [];
            me.mLoadResetShoppingDetail();

          Swal.fire({
            icon: 'success',
            text: 'Se ha registrado la nuevo compra',
            timer: 2000,
          })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: response.data.response,
        })
      }
    })
    .catch((error) => {
      Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'A ocurrido un error',
        })
    });
}

function Validate() {

  this.errors.id_provider = this.provider == null || this.provider == {}  ? true : false;
  this.errors.serie = this.shopping.serie.length != 4 ? true : false;
  this.errors.number = this.shopping.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.shopping.broadcast_date.length == 0 ? true : false;
  this.errors.arrival_date = this.shopping.arrival_date.length == 0 ? true : false;
  this.errors.exchange_rate = this.shopping.exchange_rate.length == 0 ? true : false;
  this.errors.shopping_detail = this.shopping_detail.length == 0 ? true : false;
  

  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.arrival_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.exchange_rate == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.shopping_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  
  let me = this;

  Swal.fire({
    title: 'Esta seguro de guardar el registro?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddShopping(me);
    }
  })


}

</script>
