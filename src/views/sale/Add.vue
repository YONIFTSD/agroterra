<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Venta - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form">
            
              <b-row>
                <b-col md="2">
                  <b-form-group>
                    <b-form-select v-model="sale.id_warehouse" :options="warehouses"></b-form-select>
                    <small  v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="">
                    <b-form-select @change="ChangeCoin" v-model="sale.coin" :options="coins"></b-form-select>
                    <small  v-if="errors.coin"  class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>
    
                <b-col md="2">
                  <b-form-group>
                    <b-button variant="warning" class="form-control"  @click="modalCurrecyConverterShow">Conversor de Divisas</b-button>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <b-button class="form-control" variant="success" @click="modalOrders">Pedidos</b-button>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <b-form-input @change="SearchBarcode" ref="search_barcode" v-model="search_barcode" placeholder="Código de barras" type="text"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <b-button class="form-control" variant="primary" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                  </b-form-group>
                </b-col>
             

               <b-col md="3">
                  <b-form-group label="Comprobante :">
                    <b-form-select @change="ListSeries" v-model="sale.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-select @change="GetNumberBySerie" v-model="sale.id_serie" :options="series"></b-form-select>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" readonly type="text" ref="number"  v-model="sale.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input :readonly="document_type == 1" class="text-center" type="date" ref="broadcast_date" v-model="sale.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                 <b-col md="3">
                  <b-form-group>
                    <label class="control-label">Forma de Pago: <span v-if="disabled_fees_collected" class="badge badge-primary link" @click="ModalFeedCollected">Cuotas</span></label>
                    <b-form-select @change="BntFeesCollected" v-model="sale.way_to_pay" :options="way_to_pay"></b-form-select>
                  </b-form-group>
                </b-col>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: <span @click="modalClients" class="text-info link">Nuevo</span></label>
                    <v-select @input="AddressClient" placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>

                <b-col  v-if="type_business == 1 || type_business == 2" md="6">
                  <b-form-group label="Dirección :">
                    <b-form-input type="text" ref="address"  v-model="sale.address"></b-form-input>
                    <small v-if="errors.address" class="form-text text-danger">Ingrese una dirección</small>
                  </b-form-group>
                </b-col>

                <b-col  v-if="type_business == 3" md="4">
                  <b-form-group label="Dirección :">
                    <b-form-input type="text" ref="address"  v-model="sale.address"></b-form-input>
                    <small v-if="errors.address" class="form-text text-danger">Ingrese una dirección</small>
                  </b-form-group>
                </b-col>

                <b-col  v-if="type_business == 3" md="2">
                  <b-form-group label="Placa:">
                    <b-form-input type="text" v-model="sale.license_plate"></b-form-input>
                  </b-form-group>
                </b-col>
                
                <!-- Detalle venta -->
                <b-col md="12">
                    <SaleDetail :type_invoice="sale.type_invoice" :reason="sale.reason"/>
                    <small  v-if="errors.sale_detail"  class="form-text text-danger">Ingrese Productos</small>
                </b-col>

                <b-col md="12" class="mt-2"> <hr> </b-col>
  
                <b-col md="6">
                  <b-form-group class="m-0" >
                    <b-form-input readonly v-model="total_sale.number_to_letters" ></b-form-input>
                  </b-form-group>
                  <b-row>
                    
                    <b-col md="7">
                        <div class="table-responsive mt-3">
                          <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                            <thead>
                              <tr>
                                <th width="25%" class="text-center">Fecha</th>
                                <th width="65%" class="text-center">Refenrencia</th>
                                <th width="10%" class="text-center">Acc.</th>
                              </tr>
                            </thead>
                            <tbody v-for="(item, it) in linkages" :key="it">
                              <tr>
                                  <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                                  <td class="align-middle text-center">{{ item.reference }}</td>
                                  <td class="align-middle text-center">
                                    <button type="button" @click="DeleteLinkeage(it)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
                                  </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </b-col>
                    <b-col md="5" class="mt-2">
                      <b-form-group  label="Observación:">
                        <b-form-textarea v-model="sale.observation"></b-form-textarea>
                      </b-form-group>
                      
                    </b-col>
                  </b-row>
                  
                
                </b-col>

                <b-col md="2">

                  <div class="table-responsive">
                    <table  class="table   table-hover table-lg mt-lg mb-0">
                      <tbody>
                        <tr>
                            <td width="40%" class="align-middle text-right text-total">SUBTOTAL:</td>
                            <td width="60%" class="align-middle text-right text-total">{{ total_sale.subtotal }}</td>
                        </tr>
                        <tr>
                            <td class="align-middle text-right text-total">IGV:</td>
                            <td class="align-middle text-right text-total">{{ total_sale.igv }}</td>
                        </tr>
                        <tr>
                            <td class="align-middle text-right text-total">TOTAL:</td>
                            <td class="align-middle text-right text-total">{{ total_sale.total }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="align-middle text-center"><small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </b-col>

                <b-col md="4">
                  <div class="table-responsive">
                    <table  class="table  table-lg mt-lg mb-0">
                      <thead>
                        <tr>
                            <td width="65%" class="align-middle text-center">M. Pago:</td>
                            <td width="30%" class="align-middle text-center">Monto</td>
                            <td width="5%" class="align-middle text-center"></td>
                        </tr>
                      </thead>
                      <thead>
                        <tr v-for="(item, it) in payment_cash" :key="it" >
                            <td class="align-middle">
                                <b-form-select v-model="item.payment_method" :options="payment_method"></b-form-select>
                            </td>
                            <td class="align-middle">
                              <b-form-input class="text-right" type="number" step="any" v-model="item.total"></b-form-input>
                            </td>
                            <td class="align-middle text-center">
                              <b-button @click="DeletePaymentCash(it)" type="button" class="p-1" variant="danger"><i class="fas fa-trash"></i></b-button>
                            </td>
                        </tr>
                      </thead>
                    </table>
                  </div>

                  <div class="w-100">
                    <b-link v-if="!disabled_fees_collected" @click="AddPaymentCash"><i class="fas fa-plus"></i> Agregar pago</b-link>
                  </div>

                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button  type="button" @click="Validate" class="form-control text-white" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>

            

              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    

    <b-modal hide-title hide-footer ref="modal-confirm-sale">
      <b-form @submit.prevent="AddSale">
        
        <b-row>
          <b-col class="text-center" md="12">
              <div class="w-100"><i  class="fas fa-question-circle fa-5x"></i></div>
              <p class="my-4 h3">Esta seguro de emitir la venta?</p>
          </b-col>
          <b-col md="6"> <b-form-select autofocus class="text-form-control" :options="quantity_vouchers" v-model="print_voucher"></b-form-select></b-col>
          <b-col md="6"><b-button  ref="buttonconfirmsale" type="submit" variant="primary" class="form-control">Si, Estoy de Acuerdo !</b-button></b-col>
        </b-row>
      </b-form>
    </b-modal>

  

    <ModalProducts />
    <ModalClients />
    <ModalOrders />
    <ModalCurrencyConverter />
    <ModalFeesCollected :fees_collected="sale.fees_collected" :way_to_pay="sale.way_to_pay" :broadcast_date="sale.broadcast_date"/>
    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="113" @success="modalProducts" />
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
  </div>
</template>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.text-total{
  font-size: 14px;
  font-weight: 500;
}


</style>

</style>
<script>
// importando paquetes
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");
import EventBus from '@/assets/js/EventBus';
import { mapState,mapActions } from "vuex";

// importando components
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import SaleDetail from './components/SaleDetail'
import ModalOrders from './components/ModalOrder'
import ModalFeesCollected from './components/ModalFeesCollected'
import LoadingComponent from './../pages/Loading'
import ModalCurrencyConverter from './../components/ModalCurrencyConverter'

export default {
  name: "SaleAdd",
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
      ModalOrders,
      ModalFeesCollected,
      LoadingComponent,
      ModalCurrencyConverter,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      quantity_vouchers:[
        {value:0, text:'No imprimir'},
        {value:1, text:'Imp. 1 Comprobante'},
        {value:2, text:'Imp. 2 Comprobantes'},
        {value:3, text:'Imp. 3 Comprobantes'},
      ],
      print_voucher: 1,
      isLoading: false,
      module: 'Sale',
      role: 2,
      search_barcode:'',
      document_type:'',
      sale: {
        id_sale: "",
        id_client: "",
        id_serie: "",
        id_warehouse: "",
        type_operation: "01",
        linkages: [],
        type_invoice: "03",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        broadcast_time: "",
        expiration_date: moment(new Date()).local().format("YYYY-MM-DD"),
        web_pay: 0,
        coin: "PEN",
        address: '',
    
        way_to_pay: "01-000",
        payment_type: "01",
        payment_method: "008",
        payment_deadline: "0",
        fees_collected:[],
        observation: "",
        license_plate: "",
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
        {value:"01-000", text :'Contado'},
        {value:'03-7',text:'Credito - 7 Dias'},
        {value:'03-15',text:'Credito - 15 Dias'},
        {value:'03-30',text:'Credito - 30 Dias'},
        {value:'03-45',text:'Credito - 45 Dias'},
        {value:'03-60',text:'Credito - 60 Dias'},
        {value:'03-75',text:'Credito - 75 Dias'},
        {value:'03-90',text:'Credito - 75 Dias'},
      ],

       payment_method: [
          {value :"001", text :'DEPÓSITO EN CUENTA'},
          {value :"003", text :'TRANSFERENCIA DE FONDOS'},
          {value :"004", text :'ORDEN DE PAGO'},
          {value :"005", text :'TARJETA DE DÉBITO'},
          {value :"006", text :'TARJETA DE CRÉDITO'},
          {value :"007", text :'CHEQUES CON LA CLÁUSULA DE "NO NEGOCIABLE"'},
          {value :"008", text :'EFECTIVO'},
          {value :"101", text :'TRANSFERENCIAS - COMERCIO EXTERIOR'},
          {value :"102", text :'CHEQUES BANCARIOS  - COMERCIO EXTERIOR'},
          {value :"000", text :'PAGO POR WEB'},
      ],

      cashs:[],
      payment_cash : [],
      //errors
      errors: {
        id_serie: false,
        id_client: false,
        way_to_pay: false,
        address: false,
        sale_detail: false,
        total: false,
      },
      validate: false,

      ///cuotas 
      disabled_fees_collected: false,
    };
  },
  mounted() {
    
    
    EventBus.$on('InvoiceInformation', (data) => {
      this.client = data.client;
      this.sale.type_invoice = data.type_invoice;
      this.ListSeries();
    });

    EventBus.$on('TotalPaymentCash', () => {
      let total = this.total_sale.total;
      let payment_method = this.sale.way_to_pay.split("-");
      if (payment_method[0] == "01") {
        if (this.payment_cash.length == 0) {
          this.payment_cash.push(
            {id_charge:'', payment_method:'008', document:'', total: parseFloat(total).toFixed(2)}
          )
        }else{
          let total_payment = parseFloat(total) / parseFloat(this.payment_cash.length);
          for (let index = 0; index < this.payment_cash.length; index++) {
            this.payment_cash[index].total = parseFloat(total_payment).toFixed(2);
          }
        
        }
      }else{
        this.payment_cash = [];
      }
      
    });

    EventBus.$on('ChangeFeesCollected', (data) => {
      this.sale.fees_collected = data;
    });


    this.mLoadResetSaleDetail();
    this.mLoadResetLinkages();
    this.ListWarehouses();
    this.ListSeries();
    this.$refs.search_barcode.focus();
  },
  methods: {
    
    SearchClients,
    ListWarehouses,
    ListSeries,
    GetNumberBySerie,
    AddressClient,

    SearchBarcode,

    modalProducts,
    modalClients,
    modalOrders,

    AddSale,
    Validate,
    DataPrint,
    Print,

    modalConfirmSale,
    BntFeesCollected,
    ModalFeedCollected,
    DeleteLinkeage,

    AddPaymentCash,
    DeletePaymentCash,

    ChangeCoin,

    modalCurrecyConverterShow,
    ...mapActions('Sale',['mLoadResetSaleDetail','mLoadResetLinkages','mLoadDeleteLinkages','mLoadAddSaleDetail','mLoadEditCoin']),
  },

  computed: {
    ...mapState('Sale',['sale_detail','total_sale','linkages']),
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
    type_print: function () {
      let business = window.localStorage.getItem("business");
      business = JSON.parse(JSON.parse(je.decrypt(business)));
      return business.type_print;
    },
    type_business: function () {
      let type_business = window.localStorage.getItem("type_business");
      type_business = JSON.parse(JSON.parse(je.decrypt(type_business)));
      return type_business.type_business;
    },
    
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function ChangeCoin() {
  this.mLoadEditCoin(this.sale.coin);
}

function AddPaymentCash() {
  let payment_method = this.sale.way_to_pay.split("-");
  if (payment_method[0] == "01") {
    this.payment_cash.push(
      {id_charge:'', payment_method:'008', document:'', total: (0).toFixed(2)}
    )
    EventBus.$emit('TotalPaymentCash');
  }
}

function  DeletePaymentCash(index) {
  this.payment_cash.splice(index, 1);
  EventBus.$emit('TotalPaymentCash');
}

function  modalCurrecyConverterShow() {
  EventBus.$emit('ModalCurrecyConverterShow');
}

function AddressClient() {
  if (this.client == null) {
    this.sale.address = '';
    return false;
  }
  let me = this;
  let url = this.url_base + "client/view/"+this.client.id;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.sale.address = response.data.result.address;
      } 
    })
}


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

function SearchBarcode() {
  
    let barcode = this.search_barcode;
    if (barcode.length == 0) {
      return false;
    }
    this.search_barcode = "";
    let me = this;
    let url = this.url_base + "product/view-cost-barcode/" + barcode +"/"+ this.id_establishment;

    axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module,role: this.role,},
    })
    .then(function (response) {
      if (response.data.status == 200) {
        let unit_price = parseFloat(response.data.result.sale_price);
        let total_price = unit_price * parseFloat(1);
        let detail = {
          id_product: response.data.result.id_product,
          code: response.data.result.code,
          name: response.data.result.name,
          presentation: response.data.result.presentation,
          barcode: response.data.result.barcode,
          unit_measure: response.data.result.unit_measure,
          igv: response.data.result.igv,
          existence_type: response.data.result.existence_type,
          quantity: 1,
          unit_price: unit_price.toFixed(2),
          total_price: total_price.toFixed(2),
        }
        me.mLoadAddSaleDetail(detail);
        me.search_barcode = '';

        const search_barcode = me.$refs.search_barcode;
        search_barcode.focus();

        EventBus.$emit('TotalPaymentCash');
        EventBus.$emit('ChangeFeesCollectedModal');
        
      }else{
        me.search_barcode = '';
        const search_barcode = me.$refs.search_barcode;
        search_barcode.focus();
      }
    })
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
        if (response.data.result.length == 0)  {
          me.sale.id_serie = '';
          me.sale.number = '';
        }else{
          me.GetNumberBySerie();
        }
        
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
        me.document_type = response.data.result.document_type;
        me.sale.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
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
          if (data[index].default == 1) {
            me.sale.id_warehouse = data[index].id_warehouse;
          }
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
  EventBus.$emit('ModalProductsShow',this.role,this.id_establishment);
}

function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function modalOrders() {
  EventBus.$emit('ModalOrderShow',this.role);
}

function DeleteLinkeage(index) {
  this.mLoadDeleteLinkages(index);
}

function AddSale() {
  let me = this;
  me.isLoading = true;
  let url = me.url_base + "sale/add";
  me.sale.id_user = me.user.id_user;
  me.sale.id_establishment = me.id_establishment;
  me.sale.id_client = me.client.id;
  me.sale.taxed_operation = me.total_sale.taxed_operation;
  me.sale.unaffected_operation = me.total_sale.unaffected_operation;
  me.sale.exonerated_operation = me.total_sale.exonerated_operation;
  me.sale.discount = me.total_sale.discount;
  me.sale.subtotal = me.total_sale.subtotal;
  me.sale.igv = me.total_sale.igv;
  me.sale.total = me.total_sale.total;
  me.sale.number_to_letters = me.total_sale.number_to_letters;
  me.sale.linkages = me.linkages;
  me.sale.sale_detail = me.sale_detail;
  me.sale.payment_cash = me.payment_cash;

  
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
        me.fees_collected = [];
        me.ListSeries();
        me.mLoadResetSaleDetail();
        me.mLoadResetLinkages();
        EventBus.$emit('RefreshModalProducts');
        me.payment_cash = [];
        me.disabled_fees_collected = false;
        if (me.print_voucher == 1) {
          me.DataPrint(me,response.data.result.id_sale);
        }
        if (me.print_voucher == 2) {
          me.DataPrint(me,response.data.result.id_sale);
          me.DataPrint(me,response.data.result.id_sale);
        }
        if (me.print_voucher == 3) {
          me.DataPrint(me,response.data.result.id_sale);
          me.DataPrint(me,response.data.result.id_sale);
          me.DataPrint(me,response.data.result.id_sale);
        }
        me.$refs['modal-confirm-sale'].hide()
        Swal.fire({ icon: 'success', text: 'Se ha emitido correctamente la venta', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.response, timer: 3000,})
        me.$refs['modal-confirm-sale'].hide()
      }
      me.isLoading = false;
    })
    .catch((error) => {
      me.isLoading = false;
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.$refs['modal-confirm-sale'].hide()
    });
}

function Validate() {
  
  this.errors.id_serie = this.sale.id_serie.length == 0 ? true : false;
  this.errors.id_warehouse = this.sale.id_warehouse.length == 0 ? true : false;
  this.errors.broadcast_date = this.sale.broadcast_date.length == 0 ? true : false;
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.sale.coin.length == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay.length == 0 ? true : false;
  this.errors.sale_detail = this.sale_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_sale.total) <= 0 ? true : false;
  
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.sale_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  
  let total = 0;
  let payment_method = this.sale.way_to_pay.split("-");
  if (payment_method[0] == "01") {
    this.sale.fees_collected = [];
    for (let index = 0; index < this.payment_cash.length; index++) {
      const element = this.payment_cash[index];
      if (element.payment_method == "") {
        this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que los pagos cuenten con un metodo de pago', timer: 2000,}); return false;
      }
      if (element.total.length == 0) {
        this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que el total de los pagos sean mayores a 0', timer: 2000,}); return false;
      }
      if (parseFloat(element.total) <= 0) {
        this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que el total de los pagos sean mayores a 0', timer: 2000,}); return false;
      }
      total += parseFloat(element.total);
    }
    let balance_payment_cash = parseFloat(this.total_sale.total) - parseFloat(total);
    if (balance_payment_cash < 0 || balance_payment_cash > 0.15) {
      this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que los pagos coincidan con el total del comprobante', timer: 4000,}); 
      return false;
    }
  }else{
    this.payment_cash = [];
    if (this.sale.fees_collected.length > 0) {
      for (let index = 0; index < this.sale.fees_collected.length; index++) {
        const element = this.sale.fees_collected[index];
        if (element.date == "") {
          this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que las cuotas cuenten con un fecha', timer: 2000,}); return false;
        }
        if (element.total.length == 0) {
          this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que el total de las cuotas sean mayores a 0', timer: 2000,}); return false;
        }
        if (parseFloat(element.total) <= 0) {
          this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que el total de las cuotas  sean mayores a 0', timer: 2000,}); return false;
        }
        total += parseFloat(element.total);
      }
      let balance_fee_collection = parseFloat(this.total_sale.total) - parseFloat(total);
      console.log(balance_fee_collection)
      if (balance_fee_collection < 0 || balance_fee_collection > 0.15) {
        this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que las cuotas coincidan con el total del comprobante', timer: 4000,}); 
        return false;
      }
    }
    
  }
  
 



  if (this.type_print == 1) {
    this.quantity_vouchers = [
      {value:0, text:'No imprimir'},
      {value:1, text:'Imp. 1 Comprobante'},
      {value:2, text:'Imp. 2 Comprobantes'},
      {value:3, text:'Imp. 3 Comprobantes'},
    ];
  }
  if (this.type_print == 2) {
    this.quantity_vouchers = [
      {value:0, text:'No imprimir'},
      {value:1, text:'Imp. 1 Comprobante'},
    ];
  }
  

  this.modalConfirmSale();
}

function modalConfirmSale() {
  this.$refs['modal-confirm-sale'].show();
}

function DataPrint(me,id_sale) {
  if (this.type_print == 1) {
    let url = me.url_base + "sale/data-print/"+id_sale;
    let data = me.sale;
    axios({
      method: "GET",
      url: url,
      data: data,
      headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: me.role, },
    })
    .then(function (response) {
      if (response.data.status == 200) {
        me.Print(response.data.result);
      } 

    })
  }
  if (this.type_print == 2) {
    let url = this.url_base + "voucher-sale/"+id_sale;
    window.open(url,'_blank');
  }
  
}

function Print(info) {
  let url = 'http://localhost/print/consumirapi.php';
  var data = new FormData(); 
  data.append("info",JSON.stringify(info)); 

  axios({
    method: "POST",
    url: url,
    data:data,
    headers: {
      "Content-Type": "application/json",
      "Accept":"*/*",
    },
  })
    .then(function (response) {
     
    })
    .catch((error) => {
      console.log(error);
    });
}

// CUOTAS DE PAGO
function BntFeesCollected() {
  let payment_type = this.sale.way_to_pay.split('-');
  if (payment_type[0] == "03") {
    this.disabled_fees_collected = true;
  }else{
    this.disabled_fees_collected = false;
    this.sale.fees_collected = [];
    
  }

  EventBus.$emit('TotalPaymentCash');
}

function ModalFeedCollected() {
  EventBus.$emit('ModalFeesCollectedShow');
}





</script>
