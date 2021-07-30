<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Costeo - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <v-select disabled placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Tipo de Operación :">
                    <b-form-select disabled ref="operation_type" v-model="shopping.operation_type" :options="operations_type"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select disabled ref="coin" v-model="shopping.coin" :options="coins"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <label for="">Tipo de Cambio :</label>
                    <b-form-input disabled class="text-right" type="number" readonly ref="number" v-model="shopping.exchange_rate"></b-form-input>
                    <small v-if="errors.exchange_rate" class="form-text text-danger">Ingrese un tipo de cambio</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select disabled ref="invoice_type" v-model="shopping.invoice_type" :options="invoices_type"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Serie :">
                    <b-form-input disabled type="text" ref="serie" @change="UpperCase" v-model="shopping.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Numero :">
                    <b-form-input disabled class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="shopping.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input disabled type="date" ref="broadcast_date" v-model="shopping.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Método de Prorrateo :">
                    <b-form-select @change="ChangeProrationTypeValue" ref="proration_type" v-model="shopping.proration_type" :options="proration_type"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="9">
                  <b-form-group label="Observación:">
                    <b-form-input rows="1"  v-model="shopping.observation" max-rows="3"></b-form-input>
                  </b-form-group>
                </b-col>

                <!-- Detalle Entrada -->
                <mShoppingDetail/>
                <small v-if="errors.shopping_detail" class="col-md-12 form-text text-center text-danger">Agregue productos</small>
                <!-- Detalle Entrada -->
                <b-col md="12" class="mt-3"></b-col>

                <b-col md="6">
                   <b-row>
                     <b-col md="12">
                       <div class="table-responsive mt-3">
                        <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                          <thead >
                            <tr>
                              <th  width="20%" class="text-center">Motivo</th>
                              <th  width="37%" class="text-center">Comprobante</th>
                              <th  width="13%" class="text-center">Moneda</th>
                              <th  width="20%" class="text-center">Importe en Soles</th>
                              <th  width="10%" class="text-center">Acc.</th>
                            </tr>
                          </thead>
                          <tbody v-for="(item, it) in expenses" :key="it">
                            <tr>
                              <td class="text-center">{{ item.reason }}</td>
                              <td class="text-center">{{ CodeInvoice(item.type_invoice) + " " + item.serie + " " + item.number  }}</td>
                              <td class="text-center">{{ item.coin }}</td>
                              <td class="text-right">{{ item.total }}</td>
                              <td class="text-center">
                                <b-button :disabled="item.reason == 'Compra'" type="button" @click="DeleteCostingExpenses(it)" class="btn btn-danger btn-sm"><i class="fas fa-trash-alt"></i></b-button>  
                              </td>
                            </tr>
                          </tbody>
                        </table>
                       </div>
                     </b-col>
                   </b-row>
                </b-col>
                <b-col md="4">
                  <b-form-group  label-cols-sm="6" label="Gastos :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" readonly step="any" v-model="shopping.expenses"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="6" label="Ope. Gravadas :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="shopping.taxed_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="6" label="Ope. Exonerada :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="shopping.exonerated_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="6" label="Ope. Inafecta :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="shopping.unaffected_operation"></b-form-input>
                  </b-form-group>
                  <b-form-group  label-cols-sm="6" label="Descuentos :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="shopping.discount"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="6" label="IGV (18%) :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="shopping.igv"></b-form-input>
                  </b-form-group>
                  <b-form-group label-cols-sm="6" label="Total :" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="shopping.total"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group  label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.invoice_expenses"></b-form-input>
                  </b-form-group>
                  <b-form-group  label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.taxed_operation_final"></b-form-input>
                  </b-form-group>
                  <b-form-group label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.exonerated_operation_final"></b-form-input>
                  </b-form-group>
                  <b-form-group  label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.unaffected_operation_final"></b-form-input>
                  </b-form-group>
                  <b-form-group  label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.discount_final"></b-form-input>
                  </b-form-group>
                  <b-form-group label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.igv_final"></b-form-input>
                  </b-form-group>
                  <b-form-group label="" class="text-right m-0">
                    <b-form-input class="text-right" type="number" step="any" readonly v-model="total_costing.total_final"></b-form-input>
                    <small v-if="errors.total_final" class="form-text text-danger">Prorratee la compra</small>
                    
                  </b-form-group>
                </b-col>

                <b-col md="12" class="mt-3"></b-col>

                <b-col md="2"></b-col>
                <b-col md="2"><b-button type="button" @click="Proration" class="form-control text-white" variant="info" >PRORRATEAR</b-button></b-col>
                <b-col md="2"><b-button type="button" @click="modalPurchaseExpensesShow" class="form-control text-white" variant="success" >GASTOS</b-button></b-col>
                <b-col md="2"><b-button type="button" @click="modalCreditDebitNoteShow" variant="warning" class="form-control text-white"  >N. CRÉDITO/DÉBITO</b-button></b-col>
                <b-col md="2"><b-button type="submit" class="form-control text-white" variant="primary" >GUARDAR</b-button></b-col>

              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalPurchaseExpenses />
    <ModalCreditDebitNote />
    <!-- Modal Clients -->
    <ModalProviders />
    <!-- Modal Clients -->
    <ModalExchangeRate/>
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

// components
import ModalProviders from '@/views/components/ModalProvider'
import ModalPurchaseExpenses from './components/ModalPurchaseExpenses'
import ModalCreditDebitNote from './components/ModalCreditDebitNote'
import mShoppingDetail from './components/ShoppingDetail'
import LoadingComponent from './../pages/Loading'
import ModalExchangeRate from '@/views/components/ModalExchangeRate'
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "ShoppingEdit",
  props: ["id_shopping"],
  components:{
      vSelect,
      ModalPurchaseExpenses,
      mShoppingDetail,
      ModalProviders,
      LoadingComponent,
      ModalExchangeRate,
      ModalCreditDebitNote,
  },
  data() {
    return {
      isLoading:false,
      module: 'Costing',
      role: 3,

      shopping: {
        id_shopping:'',
        id_provider:'',
        id_user:'',
        id_warehouse:'',
        linkages:'',
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
        proration_type:'',
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

      proration_type: [
        { value: '',text:'Seleccione una opción'},
        { value: '1',text:'Costeo por Bulto'},
        { value: '2',text:'Peso Bruto'},
        { value: '3',text:'Unidades'},
        { value: '4',text:'Valor del producto'},
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
        total_final:false,
      },
      validate: false,
    };
  },
  mounted() {
    EventBus.$on('RefreshGetExchangeRateByDate', () => {
      this.GetExchangeRateByDate();
    });

    this.mLoadResetCostingDetail();
    this.mLoadResetCostingExpenses();
    this.ListWarehouse();
    this.ViewShopping();
    
 
  },
  methods: {
    ListWarehouse,
    ViewShopping,
    SearchProvider,
    modalPurchaseExpensesShow,
    modalCreditDebitNoteShow,
    modalProviders,
    modalExachangeRate,
    NumberPadStart,
    UpperCase,
    EditCosting,
    Validate,
    Proration,

    ChangeProrationTypeValue,
    ChangeInvoiceExpenses,
    CodeInvoice,
    DeleteCostingExpenses,

    GetExchangeRateByDate,

    ...mapActions('Shopping',['mLoadUnitValue','mLoadExpensesValue']),
    ...mapActions('Costing',['mLoadResetCostingDetail','mLoadAddCostingDetail','mLoadTotalsCostingDetail','mLoadResetCostingExpenses','mLoadDeleteCostingExpenses','mLoadAddCostingExpenses','mLoadProrationTypeValue']),

  },

  computed: {
    ...mapState('Costing',['costing_detail','total_costing','expenses','proration_type_costing']),
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

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ChangeProrationTypeValue() {
  this.mLoadProrationTypeValue(this.shopping.proration_type);
}

function ChangeInvoiceExpenses() {
  this.mLoadInvoiceExpensesValue(this.shopping.unit_value);
}


function modalExachangeRate() {
  EventBus.$emit('ModalExchangeRateShow');
}

function Proration() {
  this.mLoadTotalsCostingDetail();
}

function ListWarehouse() {
   
  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;
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

  let id_shopping = je.decrypt(this.id_shopping);
  let me = this;
  let url = this.url_base + "shopping/view/" + id_shopping;
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
          me.shopping.id_shopping = response.data.result.shopping.id_shopping;
          me.shopping.id_provider = response.data.result.shopping.id_provider;
          me.shopping.id_warehouse = response.data.result.shopping.id_warehouse;
          me.shopping.id_user = response.data.result.shopping.id_user;
          me.shopping.linkages = response.data.result.shopping.linkages;
          me.shopping.linkages_cost = response.data.result.shopping.linkages_cost;
          me.shopping.operation_type = response.data.result.shopping.operation_type;
          me.shopping.invoice_type = response.data.result.shopping.invoice_type;
          me.shopping.serie = response.data.result.shopping.serie;
          me.shopping.number = response.data.result.shopping.number;
          me.shopping.broadcast_date = response.data.result.shopping.broadcast_date;
          me.shopping.arrival_date = response.data.result.shopping.arrival_date;
          me.shopping.coin = response.data.result.shopping.coin;
          me.shopping.exchange_rate = response.data.result.shopping.exchange_rate;
          me.shopping.affection_for_detraction = response.data.result.shopping.affection_for_detraction;
          me.shopping.unit_value = response.data.result.shopping.unit_value;
          me.shopping.proration_type = response.data.result.shopping.proration_type;
          me.mLoadProrationTypeValue(me.shopping.proration_type);
          me.shopping.payment_type = response.data.result.shopping.payment_type;
          me.shopping.payment_method = response.data.result.shopping.payment_method;
          me.shopping.payment_deadline = response.data.result.shopping.payment_deadline;
          me.shopping.observation = response.data.result.shopping.observation;
          me.shopping.expenses = response.data.result.shopping.expenses;
          me.shopping.taxed_operation = response.data.result.shopping.taxed_operation;
          me.shopping.exonerated_operation = response.data.result.shopping.exonerated_operation;
          me.shopping.unaffected_operation = response.data.result.shopping.unaffected_operation;
          me.shopping.discount = response.data.result.shopping.discount;
          me.shopping.subtotal = response.data.result.shopping.subtotal;
          me.shopping.igv = response.data.result.shopping.igv;
          me.shopping.total = response.data.result.shopping.total;
          me.shopping.state = response.data.result.shopping.state;
          me.provider = {id: response.data.result.shopping.id_provider, name: response.data.result.shopping.name+" - "+ response.data.result.shopping.document_number};
          me.shopping.email = response.data.result.shopping.email;

            let expenses_final = parseFloat(me.shopping.expenses) * parseFloat(me.shopping.exchange_rate);
            if (expenses_final > 0) {
              let detail_cost = {
                reason : 'Compra',
                id_purchase_expenses : 0,
                type_invoice : response.data.result.shopping.invoice_type,
                serie : response.data.result.shopping.serie,
                number : response.data.result.shopping.number,
                broadcast_date : response.data.result.shopping.broadcast_date,
                coin : response.data.result.shopping.coin,
                total : expenses_final.toFixed(2),
              }
              me.mLoadAddCostingExpenses(detail_cost);
            }

            let linkages_cost = response.data.result.shopping.linkages_cost;
            for (let index = 0; index < linkages_cost.length; index++) {
              const element = linkages_cost[index];
              if (element.reason != 'Compra') {
                let detail_cost = {
                  reason : element.reason,
                  id_purchase_expenses : element.id_purchase_expenses,
                  type_invoice : element.type_invoice,
                  serie : element.serie,
                  number : element.number,
                  broadcast_date : element.broadcast_date,
                  coin : element.coin,
                  total : parseFloat(element.total),
                }
                me.mLoadAddCostingExpenses(detail_cost);
              }
            }

          //agregar detalle
          let details = response.data.result.detail; 
          for (let index = 0; index < details.length; index++) {
            
              let detail = {
                id_shopping_detail : details[index].id_shopping_detail,
                id_product : details[index].id_product,
                code : details[index].code,
                name : details[index].name,
                presentation : details[index].presentation,
                unit_measure : details[index].unit_measure,
                igv : details[index].igv,
                package : details[index].package,
                coin : details[index].coin,
                exchange_rate : details[index].exchange_rate,
                quantity : details[index].quantity,
                gross_weight : details[index].gross_weight,
                

                net_unit_value : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].net_unit_value)).toFixed(2),
                unit_igv : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].unit_igv)).toFixed(2),
                unit_price : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].unit_price)).toFixed(2),

                total_discount : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].total_discount)).toFixed(2),
                net_total_value : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].net_total_value)).toFixed(2),
                total_igv : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].total_igv)).toFixed(2),
                total_price : (parseFloat(details[index].exchange_rate) * parseFloat(details[index].total_price)).toFixed(2),


                unit_freight_value : parseFloat(details[index].unit_freight_value).toFixed(2),
                total_freight_value : parseFloat(details[index].total_freight_value).toFixed(2),

                unit_cost : parseFloat(details[index].unit_cost).toFixed(2),
                unit_cost_igv : parseFloat(details[index].unit_cost_igv).toFixed(2),
                unit_cost_final : parseFloat(details[index].unit_cost_final).toFixed(2),

                total_cost : parseFloat(details[index].total_cost).toFixed(2),
                total_cost_igv : parseFloat(details[index].total_cost_igv).toFixed(2),
                total_cost_final : parseFloat(details[index].total_cost_final).toFixed(2),
              }
            me.mLoadAddCostingDetail(detail);
              
          }
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
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

function modalPurchaseExpensesShow() {
  EventBus.$emit('ModalPurchaseExpensesShow',this.role);
}

function modalCreditDebitNoteShow() {
  let data = {
    role : this.role,
    provider : this.provider,
  }
  EventBus.$emit('ModalCreditDebitNoteShow',data);
}


function modalProviders() {
  EventBus.$emit('ModalProvidersShow');
}

function DeleteCostingExpenses(index) {
  this.mLoadDeleteCostingExpenses(index);
}

function NumberPadStart() {
  var number = String(this.shopping.number);
  number = number.padStart(8,"0");
  this.shopping.number = number;
}
function UpperCase() {
    this.shopping.serie = this.shopping.serie.toUpperCase();
}



function EditCosting(mthis) {

  let me = mthis;
  me.isLoading = true;
  let url = me.url_base + "shopping/costing";

  me.shopping.linkages_cost = me.expenses;
  me.shopping.id_provider = me.provider.id;
  me.shopping.amount_note = me.total_costing.amount_note;
  me.shopping.invoice_expenses = me.total_costing.invoice_expenses;
  me.shopping.taxed_operation_final = me.total_costing.taxed_operation_final;
  me.shopping.exonerated_operation_final = me.total_costing.exonerated_operation_final;
  me.shopping.unaffected_operation_final = me.total_costing.unaffected_operation_final;
  me.shopping.discount_final = me.total_costing.discount_final;
  me.shopping.subtotal_final = me.total_costing.subtotal_final;
  me.shopping.igv_final = me.total_costing.igv_final;
  me.shopping.total_final = me.total_costing.total_final;
  me.shopping.shopping_detail = me.costing_detail;
  me.shopping.state = 2;

  let data = me.shopping;
  axios({
    method: "put",
    url: url,
    data: data,
    headers: {  "Content-Type": "application/json",  token: me.token, module: me.module,role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.$router.push({
          name: "CostingList",
        });
        Swal.fire({ icon: 'success', text: 'Se ha costeado la compra',  timer: 2000, })
      } else {
        Swal.fire({  icon: 'error',  title: 'Oops...',  text: response.data.response,})
      }
      me.isLoading = false;
    })

}

function Validate() {

  this.errors.total_final = parseFloat(this.total_costing.total_final) == 0  ? true : false;

  
  let me = this;

  Swal.fire({
    title: 'Esta seguro de costear la compra?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditCosting(me);
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
