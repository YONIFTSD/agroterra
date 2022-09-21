<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Cotización - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off">
            
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
                    <!-- <b-button variant="warning" class="form-control"  @click="modalCurrecyConverterShow">Conversor de Divisas</b-button> -->
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <!-- <b-button class="form-control" variant="success" @click="modalOrders">Pedidos</b-button> -->
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
                    <b-form-select disabled @change="GetNumberBySerie" v-model="sale.id_serie" :options="series"></b-form-select>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input disabled @change="NumberPadStart" class="text-right" type="text" ref="number"  v-model="sale.number"></b-form-input>
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
                    <label class="control-label">Forma de Pago:</label>
                    <b-form-select v-model="sale.way_to_pay" :options="way_to_pay"></b-form-select>
                  </b-form-group>
                </b-col>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: <span @click="modalClients" class="text-info link">Nuevo</span></label>
                    <v-select @input="EmailClient" placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>


                <b-col  md="6">
                  <b-form-group>
                    <b-form-checkbox class="mb-2" switch size="sm" v-model="sale.send_email"   name="check-button" >¿Deseas Enviar el Comprobante al Email del Cliente?</b-form-checkbox>
                    <b-form-input autocomplete="off" type="email" v-model="sale.email"></b-form-input>
                    <small v-if="errors.email" class="form-text text-danger">Ingrese un email</small>
                  </b-form-group>
                </b-col>

                
                <!-- Detalle venta -->
                <b-col md="12">
                    <SaleDetail :type_invoice="sale.type_invoice" :reason="sale.reason"/>
                    <small  v-if="errors.quotation_detail"  class="form-text text-danger">Ingrese Productos</small>
                </b-col>

                <b-col md="12" class="mt-2"> <hr> </b-col>
  
                <b-col md="6">
                    <b-form-group  label="Observación:">
                      <b-form-textarea v-model="sale.observation"></b-form-textarea>
                    </b-form-group>
                </b-col>
                <b-col md="4">
                </b-col>
                <b-col md="2">

                  <div class="table-responsive">
                    <table  class="table   table-hover table-lg mt-lg mb-0">
                      <tbody>
                        <tr>
                            <td width="40%" class="align-middle text-right text-total">SUBTOTAL:</td>
                            <td width="60%" class="align-middle text-right text-total">{{ total_quotation.subtotal }}</td>
                        </tr>
                        <tr>
                            <td class="align-middle text-right text-total">IGV ({{sale.igv_percentage}}%):</td>
                            <td class="align-middle text-right text-total">{{ total_quotation.igv }}</td>
                        </tr>
                        <tr>
                            <td class="align-middle text-right text-total">TOTAL:</td>
                            <td class="align-middle text-right text-total">{{ total_quotation.total }}</td>
                        </tr>
                        <tr>
                            <td colspan="2" class="align-middle text-center"><small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small></td>
                        </tr>
                      </tbody>
                    </table>
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
        
        <b-row class="row justify-content-md-center">
          <b-col class="text-center" md="12">
              <div class="w-100"><i  class="fas fa-question-circle fa-5x"></i></div>
              <p class="my-4 h3">Esta seguro de emitir la cotizacion?</p>
          </b-col>

          <b-col md="6"><b-button  ref="buttonconfirmsale" type="submit" variant="primary" class="form-control">Si, Estoy de Acuerdo !</b-button></b-col>
        </b-row>
      </b-form>
    </b-modal>

  

    <ModalProducts />
    <ModalClients />
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
import LoadingComponent from './../pages/Loading'

export default {
  name: "QuotationAdd",
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
      LoadingComponent,
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
      module: 'Quotation',
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
        type_invoice: "CT",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        broadcast_time: "",
        expiration_date: moment(new Date()).local().format("YYYY-MM-DD"),
        web_pay: 0,
        coin: "PEN",
        email: '',
        send_email:false,
    
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
        igv_percentage:'',
      },
     
      series: null,
      warehouses: [],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
      type_invoice:[
        // {value: "NP", text : "Nota de Pedido"},
        // {value: "PF", text : "Proforma"},
        {value: "CT", text : "Nota de Cotización"},
        // {value: "AT", text : "Asistencia Tecnica"},
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
        quotation_detail: false,
        total: false,
      },
      validate: false,

      ///cuotas 
      disabled_fees_collected: false,
    };
  },
  mounted() {
    this.GetInformationSale();
    this.mLoadResetQuotationDetail();
    this.ListWarehouses();
    this.$refs.search_barcode.focus();
    this.ListSeries();
  },
  methods: {
    ListSeries,
    GetNumberBySerie,
    SearchClients,
    ListWarehouses,
    EmailClient,

    SearchBarcode,

    modalProducts,
    modalClients,

    AddSale,
    Validate,
    DataPrint,
    Print,
    NumberPadStart,

    ChangeCoin,
    modalConfirmSale,

    GetInformationSale,

    ...mapActions('Quotation',['mLoadResetQuotationDetail','mLoadAddQuotationDetail','mLoadEditCoin','mLoadIgvPercentage']),
  },

  computed: {
    ...mapState('Quotation',['quotation_detail','total_quotation','linkages']),
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

function GetInformationSale() {
  
  let me = this;
  let url = this.url_base + "get-information-sale";
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.sale.igv_percentage = response.data.result.igv_percentage;
        me.mLoadIgvPercentage(response.data.result.igv_percentage);
      } 
    })
}

function ChangeCoin() {
  this.mLoadEditCoin(this.sale.coin);
}

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

function EmailClient() {
  if (this.client == null) {
    this.sale.email = '';
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
        me.sale.email = response.data.result.email;
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

function NumberPadStart() {
  var number = String(this.sale.number);
  number = number.padStart(8,"0");
  this.sale.number = number;
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


function AddSale() {
  let me = this;
  me.isLoading = true;
  let url = me.url_base + "quotations/add";
  me.sale.id_user = me.user.id_user;
  me.sale.id_establishment = me.id_establishment;
  me.sale.id_client = me.client.id;
  me.sale.taxed_operation = me.total_quotation.taxed_operation;
  me.sale.unaffected_operation = me.total_quotation.unaffected_operation;
  me.sale.exonerated_operation = me.total_quotation.exonerated_operation;
  me.sale.discount = me.total_quotation.discount;
  me.sale.subtotal = me.total_quotation.subtotal;
  me.sale.igv = me.total_quotation.igv;
  me.sale.total = me.total_quotation.total;
  me.sale.number_to_letters = me.total_quotation.number_to_letters;
  me.sale.linkages = me.linkages;
  me.sale.quotation_detail = me.quotation_detail;
  let data = me.sale;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: {"Content-Type": "application/json",token: me.token, module: me.module,role: me.role},
  })
    .then(function (response) {
      if (response.data.status == 201) {
        
        me.client = {id:1,full_name:'CLIENTES VARIOS - 00000000'};
        me.sale.type_operation = "01",
        me.sale.type_invoice = "CT";
        me.sale.serie = "";
        me.sale.number = "";
        me.sale.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.sale.broadcast_time = "";
        me.sale.coin = "PEN";
        me.sale.way_to_pay = "01-000";
        me.sale.payment_type = "01";
        me.sale.payment_method = "000";
        me.sale.observation = "";
        me.sale.taxed_operation = '0.00';
        me.sale.exonerated_operation = '0.00';
        me.sale.unaffected_operation = '0.00';
        me.sale.discount = '0.00';
        me.sale.subtotal = '0.00';
        me.sale.igv = '0.00';
        me.sale.total = '0.00';
        me.sale.state = '1';
        me.sale.number_to_letters = '';
        me.sale.email = '';
        me.mLoadResetQuotationDetail();
        me.ListSeries();
        EventBus.$emit('RefreshModalProducts');
        if (me.print_voucher == 1) {
          me.DataPrint(me,response.data.result.id_quotation);
        }
        me.$refs['modal-confirm-sale'].hide()
        Swal.fire({ icon: 'success', text: 'Se ha emitido correctamente la cotización', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.response, timer: 3000,})
        me.$refs['modal-confirm-sale'].hide()
      }
      me.isLoading = false;
    })
    .catch((error) => {
      console.log(error);
      me.isLoading = false;
      Swal.fire({ icon: 'error', text: 'A ocurrido un erroreee', timer: 3000,})
      me.$refs['modal-confirm-sale'].hide()
    });
}

function Validate() {
  
  // this.errors.id_serie = this.sale.id_serie.length == 0 ? true : false;
  this.errors.id_warehouse = this.sale.id_warehouse.length == 0 ? true : false;
  this.errors.broadcast_date = this.sale.broadcast_date.length == 0 ? true : false;
  this.errors.id_serie = this.sale.id_serie.length == 0 ? true : false;
  this.errors.number = this.sale.number.length == 0 ? true : false;
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.sale.coin.length == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay.length == 0 ? true : false;
  this.errors.quotation_detail = this.quotation_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_quotation.total) <= 0 ? true : false;
  
  // if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.quotation_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

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

  let url = this.url_base + "quotation-pdf/"+id_sale;
  window.open(url,'_blank');
  
  
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

</script>
