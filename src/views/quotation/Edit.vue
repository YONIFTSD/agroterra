<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Cotizaciones - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>
       
                <b-col md="2">
                  <b-form-group>
                    <b-form-select v-model="sale.id_warehouse" :options="warehouses"></b-form-select>
                    <small  v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group>
                    <b-form-select @change="ChangeCoin" v-model="sale.coin" :options="coins"></b-form-select>
                    <small  v-if="errors.coin"  class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group>
                    <!-- <b-button variant="warning" class="form-control"  @click="modalCurrecyConverterShow">Conversor de Divisas</b-button> -->
                  </b-form-group>
                </b-col>

                <b-col md="4"></b-col>
                <b-col md="2">
                  <b-form-group>
                    <b-button class="form-control" variant="primary" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                  </b-form-group>
                </b-col>
      
             

               <b-col md="3">
                  <b-form-group label="Comprobante :">
                    <b-form-select disabled v-model="sale.type_invoice" :options="type_invoice"></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input class="text-center" disabled type="text" ref="serie"  v-model="sale.serie"></b-form-input>
                    <small v-if="errors.id_serie"  class="form-text text-danger" >Seleccione una serie</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-center" disabled type="text" ref="number"  v-model="sale.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input disabled class="text-center" type="date" ref="broadcast_date" v-model="sale.broadcast_date"></b-form-input>
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

                <b-col   md="6">
                  <b-form-group label="Email :">
                    <b-form-input type="email" v-model="sale.email"></b-form-input>
                    <small v-if="errors.email" class="form-text text-danger">Ingrese un email</small>
                  </b-form-group>
                </b-col>

                <!-- Detalle venta -->
                <b-col md="12">
                    <SaleDetail :type_invoice="sale.type_invoice" :reason="sale.reason"/>
                    <small  v-if="errors.quotation_detail"  class="form-text text-danger">Ingrese Productos</small>
                </b-col>
                
                
                <!-- Detalle venta -->

                <b-col md="12" class="mt-2"></b-col>

                <b-col md="6">
                  <b-form-group label="Observación:">
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

         
              

                <b-col md="4"></b-col>
                <b-col md="2">
                  <b-button  type="button" @click="DataPrint(sale.id_quotation)" class="form-control" variant="warning" >IMPRIMIR</b-button>
                </b-col>
                <!-- <b-col md="2">
                  <b-button type="button" :disabled="sale.state == 6" @click="showModalSaleLow" class="form-control" variant="danger" >DAR DE BAJA</b-button>
                </b-col> -->
                <b-col md="2">
                  <b-button  type="submit" class="form-control" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    
    <ModalProducts />
    <ModalClients />
    <LoadingComponent :is-visible="isLoading"/>

    <Keypress key-event="keyup" :key-code="113" @success="modalProducts" />
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
  </div>
</template>

<style>
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
import CodeToName from "@/assets/js/CodeToName";

// components
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import SaleDetail from './components/SaleDetail'
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  props: ["id_quotation"],
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
      isLoading:false,
      module: 'Quotation',
      role: 3,
      sale: {
        id_quotation: "",
        id_client: "",
        id_serie: "",
        id_warehouse: '',
        linkages:[],
        type_operation: "01",
        type_invoice: "03",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        broadcast_time: "",
        expiration_date: moment(new Date()).local().format("YYYY-MM-DD"),
        web_pay: 0,
        coin: "PEN",
        email: "",
        way_to_pay: "01-000",
        payment_type: "01",
        payment_method: "008",
        payment_deadline: "0",
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
        fees_collected:[],
        igv_percentage:'',
      },
      sale_low: {
        id_quotation_low : '',
        id_quotation : '',
        id_user : '',
        code : '',
        serie : '',
        sequence : '',
        reference_date : '',
        low_date : '',
        reason : '',
        sunat_message : '',
        observation:'',
        state:1,
      },

      series: null,
      warehouses: [],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
      type_invoice:[
        {value: "CT", text : "Nota de Cotización"},
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
  
      payment_cash : [],
  
      //errors
      errors: {
        id_serie: false,
        id_client: false,
        id_warehouse: false,
        way_to_pay: false,
        quotation_detail: false,
        total: false,
      },
      validate: false,
      disabled_fees_collected: false,

      errors_low:{
          reason:false,
      },
      validate_low: false,
    };
  },
  mounted() {
    this.mLoadResetQuotationDetail();
    this.ListWarehouses();
    this.ViewQuotation();

  },
  methods: {
    
    SearchClients,
    ListWarehouses,
    EmailClient,

    modalProducts,
    modalClients,

    ViewQuotation,
    EditQuotation,
    Validate,

    DataPrint,
    Print,

    ChangeCoin,
    ...mapActions('Quotation',['mLoadResetQuotationDetail','mLoadAddQuotationDetail','mLoadEditCoin','mLoadIgvPercentage']),
  },

  computed: {
    ...mapState('Quotation',['quotation_detail','total_quotation']),
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

function EmailClient() {
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
  EventBus.$emit('ModalProductsShow',this.role,this.id_establishment);
}

function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function ViewQuotation() {
  let id_quotation = je.decrypt(this.id_quotation);
  let me = this;
  let url = me.url_base + "quotations/view/"+id_quotation;
  axios({
    method: "GET",
    url: url,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.sale.igv_percentage = response.data.result.quotation.igv_percentage;
        me.mLoadIgvPercentage(response.data.result.quotation.igv_percentage);
        me.client = {id: response.data.result.quotation.id_client,full_name: response.data.result.quotation.name + ' - ' + response.data.result.quotation.document_number};
        me.mLoadEditCoin(response.data.result.quotation.coin);
        me.sale.id_quotation = response.data.result.quotation.id_quotation,
        me.sale.id_warehouse = response.data.result.quotation.id_warehouse,
        me.sale.linkages = response.data.result.quotation.linkages;
        me.sale.type_operation = response.data.result.quotation.type_operation,
        me.sale.type_invoice = response.data.result.quotation.type_invoice;
        me.sale.serie = response.data.result.quotation.serie;
        me.sale.number = response.data.result.quotation.number;
        me.sale.broadcast_date = response.data.result.quotation.broadcast_date;
        me.sale.broadcast_time = response.data.result.quotation.broadcast_time;
        me.sale.coin = response.data.result.quotation.coin;
        me.sale.email = response.data.result.quotation.email;
        if (response.data.result.quotation.payment_type == "01") {
          me.sale.way_to_pay = response.data.result.quotation.payment_type+'-'+response.data.result.quotation.payment_method;
        }else{
          me.sale.way_to_pay = response.data.result.quotation.payment_type+'-'+response.data.result.quotation.payment_deadline;
        }
        me.sale.payment_type = response.data.result.quotation.payment_type;
        me.sale.payment_method = response.data.result.quotation.payment_method;
        me.sale.observation = response.data.result.quotation.observation;
        me.sale.taxed_operation = response.data.result.quotation.taxed_operation;
        me.sale.exonerated_operation = response.data.result.quotation.exonerated_operation;
        me.sale.unaffected_operation = response.data.result.quotation.unaffected_operation;
        me.sale.discount = response.data.result.quotation.discount;
        me.sale.subtotal = response.data.result.quotation.subtotal;
        me.sale.igv = response.data.result.quotation.igv;
        me.sale.total = response.data.result.quotation.total;
        me.sale.state = response.data.result.quotation.state;
        me.sale.number_to_letters = response.data.result.quotation.number_to_letters;
        let detail_result = response.data.result.quotation_detail;
        for (let index = 0; index < detail_result.length; index++) {
          const element = detail_result[index];
            let detail = {
              id_product: element.id_product,
              code: element.code,
              name: element.name,
              presentation: '',
              unit_measure: element.unit_measure,
              barcode: element.barcode,
              igv: element.igv,
              existence_type: element.existence_type,
              quantity: parseFloat(element.quantity).toFixed(2),
              unit_price: parseFloat(element.unit_price).toFixed(2),
              total_price: parseFloat(element.total_price).toFixed(2),
            }
            
            me.mLoadAddQuotationDetail(detail);
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
   
}


function EditQuotation() {
  
  let me = this;
  me.isLoading = true;
  let url = me.url_base + "quotations/edit";
  me.sale.id_user = me.user.id_user;
  me.sale.id_client = me.client.id;
  me.sale.taxed_operation = me.total_quotation.taxed_operation;
  me.sale.unaffected_operation = me.total_quotation.unaffected_operation;
  me.sale.exonerated_operation = me.total_quotation.exonerated_operation;
  me.sale.discount = me.total_quotation.discount;
  me.sale.subtotal = me.total_quotation.subtotal;
  me.sale.igv = me.total_quotation.igv;
  me.sale.total = me.total_quotation.total;
  me.sale.number_to_letters = me.total_quotation.number_to_letters;
  me.sale.quotation_detail = me.quotation_detail;
  
  let data = me.sale;
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
        EventBus.$emit('RefreshModalProducts');
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente la cotización', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text:  response.data.response, timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  
  this.errors.id_client = this.client == null ? true : false;
  this.errors.id_warehouse = this.sale.id_warehouse.length == 0 ? true : false;
  this.errors.coin = this.sale.coin.length == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay.length == 0 ? true : false;
  this.errors.quotation_detail = this.quotation_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_quotation.total) <= 0 ? true : false;
  

  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.quotation_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }


  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar la cotización?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.EditQuotation();
    }
  })



}

function DataPrint(id_quotation) {

    let url = this.url_base + "quotation-pdf/"+id_quotation;
    window.open(url,'_blank');
  
}

function  modalCurrecyConverterShow() {
  EventBus.$emit('ModalCurrecyConverterShow');
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
