<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Compras - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="modalProviders" class="text-info link">Nuevo</span></label>
                    <v-select :disabled="linkages.length > 0" placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
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
                    <b-button class="form-control btn" :disabled="linkages.length > 0" variant="primary" @click="modalProducts" >Agregar Productos</b-button>
                   </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
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
                  <b-form-group label="Fecha Emisión:">
                    <b-form-input type="date" @change="GetExchangeRateByDate" ref="broadcast_date" v-model="shopping.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Forma de Pago :">
                    <b-form-select ref="way_to_pay" v-model="shopping.way_to_pay" :options="way_to_pay"></b-form-select>
                    <small v-if="errors.way_to_pay" class="form-text text-danger">Seleccione una forma de pago</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" @change="GetExchangeRateByDate"  v-model="shopping.coin" :options="coins"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label for="">Tipo de Cambio : <b-badge @click="modalExachangeRate" variant="info">Nuevo</b-badge></label>
                    <b-form-input class="text-right" type="number" readonly ref="number" v-model="shopping.exchange_rate"></b-form-input>
                    <small v-if="errors.exchange_rate" class="form-text text-danger">Ingrese un tipo de cambio</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Afecto a Detración:">
                    <b-form-select ref="affection_for_detraction" v-model="shopping.affection_for_detraction" :options="affection_for_detraction"></b-form-select>
                    <small v-if="errors.affection_for_detraction" class="form-text text-danger">Seleccione una opción</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Almacen :">
                    <b-form-select ref="id_warehouse" :disabled="linkages.length > 0" v-model="shopping.id_warehouse" :options="warehouse"></b-form-select>
                    <small v-if="errors.id_warehouse" class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Valor Unitario:">
                    <b-form-select ref="unit_value" @change="ChangeUnitValue" v-model="shopping.unit_value" :options="unit_value"></b-form-select>
                  </b-form-group>
                </b-col>


                <b-col md="10">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="shopping.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

                <!-- Detalle Entrada -->
                 <b-col md="12">
                    <mShoppingDetail/>
                    <small v-if="errors.shopping_detail" class="col-md-12 form-text text-center text-danger">Agregue productos</small>
                 </b-col>
                
                <!-- Detalle Entrada -->
                <b-col md="12" class="mt-3"></b-col>

                <b-col md="8">
                  <b-row>
                     <b-col md="8">
                       <div class="table-responsive mt-3">
                        <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                          <thead >
                            <tr>
                              <th  width="20%" class="text-center">Motivo</th>
                              <th  width="70%" class="text-center">Comprobante</th>
                              <th  width="10%" class="text-center">Acc.</th>
                            </tr>
                          </thead>
                          <tbody v-for="(item, it) in linkages" :key="it">
                            <tr>
                              <td class="text-center">{{ item.reason }}</td>
                              <td class="text-center">{{ CodeInvoice(item.type_invoice) + " " + item.serie + " " + item.number  }}</td>
                    
                              <td class="text-center">
                                <button type="button" @click="mLoadDeleteLinkages(it)" class="btn btn-danger">
                                  <i class="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                       </div>
                     </b-col>
                   </b-row>
                </b-col>
                <b-col md="4">
                  <b-form-group  label-cols-sm="7" label="Gastos + IGV :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" @change="ChangeExpensesValue" v-model="shopping.expenses"></b-form-input>
                  </b-form-group>
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

    

                <b-col md="3"></b-col>
                <b-col md="3"><b-button type="button" class="form-control text-white" @click="modalInputShow" variant="info" >ENTRADAS</b-button></b-col>
                <b-col md="3"><b-button type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button></b-col>

              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <!-- Modal provider -->
    <ModalProviders />
    <!-- Modal ExchanceRate -->
    <ModalExchangeRate/>
    <!-- Modal input -->
    <ModalInputs/>
    <LoadingComponent :is-visible="isLoading"/>
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
import ModalExchangeRate from '@/views/components/ModalExchangeRate'
import ModalProducts from './components/ModalProduct'
import mShoppingDetail from './components/ShoppingDetail'
import ModalInputs from './components/ModalInput'
import LoadingComponent from './../pages/Loading'
export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalProducts,
      mShoppingDetail,
      ModalProviders,
      LoadingComponent,
      ModalExchangeRate,
      ModalInputs,
  },
  data() {
    return {
      isLoading:false,
      module: 'Shopping',
      role: 2,

      shopping: {
        id_shopping:'',
        id_provider:'',
        id_user:'',
        id_warehouse:'',
        linkages:[],
        operation_type:'02',
        invoice_type:'01',
        serie:'',
        number:'',
        broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
        arrival_date:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'PEN',
        exchange_rate: '1.00',
        way_to_pay: '01-008',
        payment_type:'01',
        payment_method:'008',
        payment_deadline:'',
        affection_for_detraction: '',
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
    EventBus.$on('CompletePurchase', (linkage) => {
      console.log(linkage);
      this.provider = linkage.provider;
      this.shopping.id_warehouse = linkage.id_warehouse;
    });
    
   
    this.mLoadResetShoppingDetail();
    this.ListWarehouse();
    this.GetExchangeRateByDate();
  },
  methods: {
    ListWarehouse,
    SearchProvider,
    modalProducts,
    modalProviders,
    modalInputShow,
    modalExachangeRate,
    NumberPadStart,
    UpperCase,
    AddShopping,
    Validate,
    CodeInvoice,
    ChangeUnitValue,
    ChangeExpensesValue, 
    
    

    GetExchangeRateByDate,
    ...mapActions('Shopping',['mLoadResetShoppingDetail','mLoadUnitValue','mLoadExpensesValue','mLoadTotalsShoppingDetail','mLoadDeleteLinkages']),
    
  },

  computed: {
    ...mapState('Shopping',['shopping_detail','total_shopping','munit_value','linkages']),
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

function modalExachangeRate() {
  EventBus.$emit('ModalExchangeRateShow');
}

function modalInputShow() {
  EventBus.$emit('ModalInputShow',this.role);
}



function NumberPadStart() {
  var number = String(this.shopping.number);
  number = number.padStart(8,"0");
  this.shopping.number = number;
}
function UpperCase() {
    this.shopping.serie = this.shopping.serie.toUpperCase();
}

function ListWarehouse() {
   
  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
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

function AddShopping(mthis) {

  let me = mthis;
  me.isLoading = true;
  let url = me.url_base + "shopping/add";

  me.shopping.linkages = me.linkages;
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
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 201) {

            me.provider = null;
            me.shopping.id_provider = '';
            me.shopping.id_user = '';
            me.shopping.id_warehouse = '';
            me.shopping.linkages = '';
            me.shopping.operation_type = '02';
            me.shopping.invoice_type = '01';
            me.shopping.serie = '';
            me.shopping.number = '';
            me.shopping.number = '';
            me.shopping.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
            me.shopping.arrival_date = moment(new Date()).local().format("YYYY-MM-DD");
            me.shopping.coin = 'PEN';
            me.shopping.exchange_rate =  '1.00';
            me.shopping.way_to_pay =  '01-008';
            me.shopping.payment_type = '01';
            me.shopping.payment_method = '008';
            me.shopping.payment_deadline = '';
            me.shopping.affection_for_detraction = '';
            me.shopping.unit_value = '0';
            me.shopping.observation = '';
            me.shopping.expenses =  (0).toFixed(2);
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
            me.ChangeUnitValue();
            me.ChangeExpensesValue();

          Swal.fire({ icon: 'success', text: 'Se ha registrado la nueva compra',timer: 2000,})
      } else {
        Swal.fire({ icon: 'error',  title: 'Oops...', text: response.data.response,})
      }
      me.isLoading = false;

    })
    .catch((error) => {
      Swal.fire({ icon: 'error', title: 'Oops...',text: 'A ocurrido un error', })
      me.isLoading = false;
    });
}

function Validate() {

  this.errors.id_provider = this.provider == null || this.provider == {}  ? true : false;
  this.errors.serie = this.shopping.serie.length != 4 ? true : false;
  this.errors.number = this.shopping.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.shopping.broadcast_date.length == 0 ? true : false;
  this.errors.arrival_date = this.shopping.arrival_date.length == 0 ? true : false;
  this.errors.id_warehouse = this.shopping.id_warehouse.length == 0 ? true : false;
  this.errors.way_to_pay = this.shopping.way_to_pay.length == 0 ? true : false;
  this.errors.affection_for_detraction = this.shopping.affection_for_detraction.length == 0 ? true : false;
  this.errors.exchange_rate = this.shopping.exchange_rate.length == 0 ? true : false;
  this.errors.shopping_detail = this.shopping_detail.length == 0 ? true : false;


  if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.affection_for_detraction == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.arrival_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.exchange_rate == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.shopping_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  
  let me = this;

  Swal.fire({
    title: 'Esta seguro de guardar la compra?',
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
