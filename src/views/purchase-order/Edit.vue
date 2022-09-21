<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Orden Compra - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>
                 <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                    <v-select @input="ViewProvider" placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Seleccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="N° Orden :">
                    <b-form-input class="text-center" disabled type="text" v-model="shopping.code"></b-form-input>
                  </b-form-group>
                </b-col>


                <b-col md="2">
                  <b-form-group label="Fecha Emisión:">
                    <b-form-input type="date" class="text-center" v-model="shopping.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Forma de Pago :">
                    <b-form-select v-model="shopping.way_to_pay" :options="way_to_pay"></b-form-select>
                    <small v-if="errors.way_to_pay" class="form-text text-danger">Seleccione una forma de pago</small>
                  </b-form-group>
                </b-col>

                

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" @change="EditCoin" v-model="shopping.coin" :options="coins"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Valor Unitario:">
                    <b-form-select @change="ChangeUnitValue" v-model="shopping.unit_value" :options="unit_value"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Descuento:">
                    <b-form-select v-model="shopping.type_discount" :options="type_discount"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Vendedor:">
                    <b-form-select v-model="shopping.id_seller" :options="users"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                   <b-form-group label=".">
                    <b-button class="form-control btn" variant="primary" @click="modalProducts" ><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                   </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Email:">
                    <b-form-input v-model="shopping.email"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="shopping.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

                



                <!-- Detalle Entrada -->
                 <b-col md="12">
                    <mShoppingDetail :type_discount="shopping.type_discount"/>
                    <small v-if="errors.shopping_detail" class="col-md-12 form-text text-center text-danger">Agregue productos</small>
                 </b-col>
                
                <!-- Detalle Entrada -->
                <b-col md="12" class="mt-3"></b-col>

                <b-col md="8">
                 <b-row>
                   <b-col md="8">
                      <b-form-group label="Mensaje:">
                        <b-form-textarea rows="3"  v-model="shopping.message" max-rows="3"></b-form-textarea>
                        <small v-if="errors.message" class="form-text text-danger">Ingrese un mensaje</small>
                      </b-form-group>
                    </b-col>
                 </b-row>
                </b-col>
                <b-col md="4">
                  <b-form-group  label-cols-sm="7" label="Ope. Gravadas :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_shopping.taxed_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="7" label="Ope. Exonerada :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_shopping.exonerated_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="Ope. Inafecta :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_shopping.unaffected_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="7" label="Descuentos :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_shopping.discount"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="7" label="IGV (18%) :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_shopping.igv"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="7" label="Total :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_shopping.total"></b-form-input>
                  </b-form-group>
                </b-col>

    

                <b-col md="4"></b-col>
                <b-col md="2"><b-button type="button" class="form-control text-white" variant="warning" @click="PDF" >Imprmir </b-button></b-col>
                
                <b-col md="2"><b-button type="submit" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button></b-col>


              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts :type_discount="shopping.type_discount" />
    <!-- Modal Clients -->
    <ModalProviders />
    <!-- Modal Clients -->
    <ModalExchangeRate/>
    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="113" @success="modalProducts" />
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
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
import CodeToName from "@/assets/js/CodeToName";
// components
import ModalProviders from '@/views/components/ModalProvider'
import ModalProducts from './components/ModalProduct'
import mShoppingDetail from './components/ShoppingDetail'
import LoadingComponent from './../pages/Loading'
import ModalExchangeRate from '@/views/components/ModalExchangeRate'

export default {
  name: "ShoppingEdit",
  props: ["id_purchase_order"],
  components:{
      vSelect,
      ModalProducts,
      mShoppingDetail,
      ModalProviders,
      LoadingComponent,
      ModalExchangeRate,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      isLoading:false,
      module: 'PurchaseOrder',
      role: 3,

      shopping: {
        id_purchase_order:'',
        id_provider:'',
        id_user:'',
        id_warehouse:'',
        id_seller:'',
        linkages:[],
        email:'',
        operation_type:'02',
        invoice_type:'01',
        code:'',
        number:'',
        message:'',
        reference:'',
        broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        arrival_date:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'PEN',
        type_discount:'2',
        exchange_rate: '1.00',
        way_to_pay: '01-008',
        payment_type:'01',
        payment_method:'008',
        payment_deadline:'',
        affection_for_detraction: '0',
        unit_value: '0',
        observation:'',
        expenses:(0).toFixed(2),
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

      warehouse:[],
      warehouse_all:[],

      type_discount:[
        {value:'1',text:'Importe'},
        {value:'2',text:'Descuento'},

      ],

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
        {value: "NV", text : "Nota de Venta"},
        {value: "00", text : "Otros"},
      ],

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],

      way_to_pay:[
        {value:"01-008",text:'Contado - Efectivo'},
        {value:"01-009",text:'Contado - Efectivo en los demás casos'},
        {value:"01-001",text:'Contado - Depósito en cuenta'},
        {value:"01-002",text:'Contado - Giro'},
        {value:"01-003",text:'Contado - Transferencia de fondos'},
        {value:"01-004",text:'Contado - Orden de pago'},
        {value:"01-005",text:'Contado - Tarjeta de Débito'},
        {value:"03-7",text:'Crédito - 7 dias'},
        {value:"03-15",text:'Crédito - 15 dias'},
        {value:"03-30",text:'Crédito - 30 dias'},
        {value:"03-45",text:'Crédito - 45 dias'},
        {value:"03-60",text:'Crédito - 60 dias'},
        {value:"03-75",text:'Crédito - 75 dias'},
        {value:"03-90",text:'Crédito - 90 dias'},
      ],

      affection_for_detraction: [
        { value: '',text:'Seleccione una opción'},
        { value: '1',text:'SI'},
        { value: '0',text:'NO'},
      ],

      users:[],
      unit_value: [
        { value: '0',text:'Sin IGV'},
        { value: '1',text:'Con IGV'},
        
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
        id_warehouse:false,
        way_to_pay:false,
        affection_for_detraction:false,
      },
      validate: false,
    };
  },
  mounted() {
    EventBus.$on('RefreshGetExchangeRateByDate', () => {
      this.GetExchangeRateByDate();
    });

    this.mLoadResetShoppingDetail();
    this.ListUsers();
    this.ViewShopping();
 
  },
  methods: {
    ListWarehouse,
    ViewShopping,
    SearchProvider,
    modalProducts,
    modalProviders,
    modalExachangeRate,
    NumberPadStart,
    UpperCase,
    EditShopping,
    Validate,
    CodeInvoice,

    ChangeUnitValue,
    ChangeExpensesValue, 
    
    Export,
    GetExchangeRateByDate,
    ListUsers,

    EditCoin,
    ViewProvider,

    PDF,

    ...mapActions('PurchaseOrder',['mLoadUnitValue','mLoadExpensesValue']),
    ...mapActions('PurchaseOrder',['mLoadResetShoppingDetail']),
    ...mapActions('PurchaseOrder',['mLoadAddShoppingDetail']),
    ...mapActions('PurchaseOrder',['mLoadTotalsShoppingDetail']),
    ...mapActions('PurchaseOrder',['mLoadEditCoin']),
  },

  computed: {
    ...mapState('PurchaseOrder',['shopping_detail','total_shopping']),
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

function PDF() {
    let url = this.url_base + "purchase-order-pdf/"+this.shopping.id_purchase_order;
    window.open(url,'_blank');
}

function ViewProvider() {
  let me = this;
  if (this.provider == null) {
    this.shopping.email = '';
    me.users = [];
    me.users.push({value: '', text: '-- Seleccione un vendedor --'});
    me.shopping.id_seller = '';
    return false;
  }
  let id_provider = this.provider.id;
  let url = me.url_base + "provider/view/" + id_provider;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: me.token,
      module: me.module,
      role: me.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.shopping.email = response.data.result.email;
        me.users = [];
        me.users.push({value: '', text: '-- Seleccione un vendedor --'});
        for (let index = 0; index < response.data.result.sellers.length; index++) {
          const element = response.data.result.sellers[index];
          me.users.push({value: element.id_provider_seller, text: element.name +" - "+element.document_number});
        }
      }
    })
}

function EditCoin() {
    this.mLoadEditCoin(this.shopping.coin);
}

function ListUsers() {
  let me = this;
  let url = this.url_base + "provider-seller/list-by-provider/"+this.shopping.id_provider;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
  })
    .then(function (response) {
      me.users = [];
      me.users.push({value: '', text: '-- Seleccione un vendedor --'});
      for (let index = 0; index < response.data.result.length; index++) {
        const element = response.data.result[index];
        me.users.push({value: element.id_provider_seller, text: element.name});
      }
    })
}

function ChangeUnitValue() {
  this.mLoadUnitValue(this.shopping.unit_value);
}
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
function ChangeExpensesValue() {
  this.mLoadExpensesValue(this.shopping.expenses);
  this.shopping.expenses = parseFloat(this.shopping.expenses).toFixed(2);
  this.mLoadTotalsShoppingDetail();
}

function modalExachangeRate() {
  let data = {
    date : this.shopping.broadcast_date
  }
  EventBus.$emit('ModalExchangeRateShow',data);
}

function Export() {
  let id_purchase_order = je.decrypt(this.id_purchase_order);
  let url = this.url_base + "shopping-excel/"+id_purchase_order;
  window.open(url,'_blank');
}

function ListWarehouse() {
   
  let me = this;
  let url = this.url_base + "active-warehouses-all";
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
      me.warehouse.push({value: '', text: '-- Seleccione un almacen --'});
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.warehouse.push({value: element.id_warehouse, text: element.name});
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

function ViewShopping() {

  let id_purchase_order = je.decrypt(this.id_purchase_order);
  let me = this;
  let url = this.url_base + "purchase-orders/view/" + id_purchase_order;
  me.isLoading = true;
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

          if (response.data.result.shopping.payment_type == "01") {
            me.shopping.way_to_pay = response.data.result.shopping.payment_type +"-"+response.data.result.shopping.payment_method;
          }
          if (response.data.result.shopping.payment_type == "03") {
            me.shopping.way_to_pay = response.data.result.shopping.payment_type +"-"+response.data.result.shopping.payment_deadline;
          }

          me.shopping.id_purchase_order = response.data.result.shopping.id_purchase_order;
          me.shopping.id_provider = response.data.result.shopping.id_provider;
          me.shopping.id_seller = response.data.result.shopping.id_seller;
          me.shopping.id_user = response.data.result.shopping.id_user;
          me.shopping.email = response.data.result.shopping.email;
          me.shopping.message = response.data.result.shopping.message;
          me.shopping.code = response.data.result.shopping.code;
          me.shopping.broadcast_date = response.data.result.shopping.broadcast_date;
          me.shopping.coin = response.data.result.shopping.coin;
          me.shopping.type_discount = response.data.result.shopping.type_discount;
          me.shopping.unit_value = response.data.result.shopping.unit_value;
          me.shopping.payment_type = response.data.result.shopping.payment_type;
          me.shopping.payment_method = response.data.result.shopping.payment_method;
          me.shopping.payment_deadline = response.data.result.shopping.payment_deadline;
          me.shopping.observation = response.data.result.shopping.observation;
          me.shopping.taxed_operation = response.data.result.shopping.taxed_operation;
          me.shopping.exonerated_operation = response.data.result.shopping.exonerated_operation;
          me.shopping.unaffected_operation = response.data.result.shopping.unaffected_operation;
          me.shopping.discount = response.data.result.shopping.discount;
          me.shopping.subtotal = response.data.result.shopping.subtotal;
          me.shopping.igv = response.data.result.shopping.igv;
          me.shopping.total = response.data.result.shopping.total;
          me.shopping.state = response.data.result.shopping.state;
          me.provider = {id: response.data.result.shopping.id_provider, name: response.data.result.shopping.name+" - "+ response.data.result.shopping.document_number};
          me.mLoadUnitValue(me.shopping.unit_value);

          me.ListUsers();
          //agregar detalle
          let details = response.data.result.detail; 
          for (let index = 0; index < details.length; index++) {
            
              let detail = {
                id_input_detail : details[index].id_input_detail,
                id_product : details[index].id_product,
                code : details[index].code,
                name : details[index].name,
                presentation : details[index].presentation,
                unit_measure : details[index].unit_measure,
                igv : details[index].igv,
                quantity : details[index].quantity,
                percentage_discount : parseFloat(details[index].percentage_discount).toFixed(2),
                package : parseFloat(details[index].package).toFixed(0),
                unit_value : parseFloat(details[index].unit_value).toFixed(5),
                unit_discount : parseFloat(details[index].unit_discount).toFixed(5),
                net_unit_value : parseFloat(details[index].net_unit_value).toFixed(5),
                unit_igv : parseFloat(details[index].unit_igv).toFixed(5),
                unit_price : parseFloat(details[index].unit_price).toFixed(5),
                total_value : parseFloat(details[index].total_value).toFixed(5),
                total_discount : parseFloat(details[index].total_discount).toFixed(5),
                net_total_value : parseFloat(details[index].net_total_value).toFixed(5),
                total_igv : parseFloat(details[index].total_igv).toFixed(5),
                total_price : parseFloat(details[index].total_price).toFixed(5),
              }
      
              
              me.mLoadAddShoppingDetail(detail);

          }
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }

      me.isLoading = false;
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



function EditShopping() {

  let me = this;
  me.isLoading = true;
  let url = me.url_base + "purchase-orders/edit";
  me.shopping.id_provider = me.provider.id;
  me.shopping.taxed_operation = me.total_shopping.taxed_operation;
  me.shopping.exonerated_operation = me.total_shopping.exonerated_operation;
  me.shopping.unaffected_operation = me.total_shopping.unaffected_operation;
  me.shopping.discount = me.total_shopping.discount;
  me.shopping.subtotal = me.total_shopping.subtotal;
  me.shopping.igv = me.total_shopping.igv;
  me.shopping.total = me.total_shopping.total;
  me.shopping.number_to_letters = me.total_shopping.number_to_letters;
  me.shopping.shopping_detail = me.shopping_detail;

  let data = me.shopping;
  axios({
    method: "put",
    url: url,
    data: data,
    headers: {  "Content-Type": "application/json",  token: me.token, module: me.module,role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        Swal.fire({ icon: 'success', text: 'Se ha modificado la orden de compra',  timer: 2000, })
      } else {
        Swal.fire({  icon: 'error',  title: 'Oops...',  text: response.data.response,})
      }
      me.isLoading = false;
    })

}

function Validate() {

  this.errors.id_provider = this.shopping.id_provider.length  ? true : false;
  this.errors.id_seller = this.shopping.id_seller.length == 0 ? true : false;
  this.errors.broadcast_date = this.shopping.broadcast_date.length == 0 ? true : false;
  this.errors.shopping_detail = this.shopping_detail.length == 0 ? true : false;
  

  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_seller == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.shopping_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  
  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar la orden de compra?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.EditShopping();
    }
  })


}

function GetExchangeRateByDate() {
  let me = this;
  let url = this.url_base + "exchange-rate/get-by-date";
  let data = {
    coin: this.shopping.coin,
    date: this.shopping.broadcast_date,
  }
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module,role: this.role},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.shopping.exchange_rate = response.data.result.shopping;
      } else {
        me.shopping.exchange_rate = '';
        me.modalExachangeRate();
      }
    })
}

</script>
