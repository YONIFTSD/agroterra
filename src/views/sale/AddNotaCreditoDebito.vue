<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Nota de Crédito y Débito - Agregar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
       
                <b-col md="2">
                  <b-form-group>
                    <b-form-select disabled v-model="sale.id_warehouse" :options="warehouses"></b-form-select>
                    <small  v-if="errors.id_warehouse"  class="form-text text-danger">Seleccione un almacen</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="">
                    <b-form-select v-model="sale.coin" :options="coins"></b-form-select>
                    <small  v-if="errors.coin"  class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="6"></b-col>
                <b-col md="2">
                  <b-form-group>
                    <b-button :disabled="sale.type_invoice == '07'" class="form-control btn btn-info" @click="modalProducts">Agregar Productos</b-button>
                  </b-form-group>
                </b-col>
             

               <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select @change="ListSeries(),ChangeTypeInvoice()" v-model="sale.type_invoice" :options="type_invoice"></b-form-select>
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
                    <b-form-input disabled class="text-center" type="date" ref="broadcast_date" v-model="sale.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Forma de Pago :">
                    <b-form-select v-model="sale.way_to_pay" :options="way_to_pay"></b-form-select>
                  </b-form-group>
                </b-col>

               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: </label>
                    <v-select disabled placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Motivo :">
                     <b-form-select v-model="sale.reason" :options="reason"></b-form-select>
                    <small v-if="errors.reason" class="form-text text-danger">Ingrese un motivo</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Sustento :">
                    <b-form-input type="text"   v-model="sale.support"></b-form-input>
                    <small v-if="errors.support" class="form-text text-danger">Ingrese un sustento</small>
                  </b-form-group>
                </b-col>

                 

                 


                


                <!-- Detalle venta -->
                <b-col md="12">
                    <SaleDetail :type_invoice="sale.type_invoice" :reason="sale.reason" />
                    <small  v-if="errors.sale_detail"  class="form-text text-danger">Ingrese Productos</small>
                </b-col>
                
                
                <!-- Detalle venta -->

                <b-col md="12" class="mt-2"></b-col>

                <b-col md="8">
                  <b-form-group class="m-0" >
                    <b-form-input readonly v-model="total_sale.number_to_letters" ></b-form-input>
                  </b-form-group>
                  <b-row>
                    
                    <b-col md="6">
                        <div class="table-responsive mt-3">
                          <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                            <thead>
                              <tr>
                                <th width="25%" class="text-center">Fecha</th>
                                <th width="75%" class="text-center">Referencia</th>
                              </tr>
                            </thead>
                            <tbody v-for="(item, it) in linkages" :key="it">
                              <tr>
                                  <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                                  <td class="align-middle text-center">{{ item.reference }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </b-col>
                    <b-col md="6" class="pt-1">
                      <b-form-group label="Observación:">
                        <b-form-textarea rows="1"  v-model="sale.observation" max-rows="2"></b-form-textarea>
                      </b-form-group>
                    </b-col>
                  </b-row>
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

                <b-col md="4"></b-col>
                <b-col md="2">
                  <b-button  type="button" @click="DataPrint(sale.id_sale)" class="form-control" variant="warning" >IMPRIMIR</b-button>
                </b-col>
                <b-col md="2">
                  <b-button  type="submit" class="form-control" variant="primary" >GUARDAR</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    <!-- Modal Products -->
    <ModalProducts />
    <!-- Modal Clients -->
    <ModalClients />
    <!-- Loading -->
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
import CodeToName from "@/assets/js/CodeToName";

// components
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import SaleDetail from './components/SaleDetail'
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  props: ["id_sale"],
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
      LoadingComponent,
  },
  data() {
    return {
      isLoading:false,
      module: 'Sale',
      role: 2,
      sale: {
        id_sale: "",
        id_client: "",
        id_serie: "",
        id_warehouse: '',
        linkages:[],
        type_operation: "01",
        type_invoice: "07",
        serie: "",
        number: "",
        broadcast_date: moment(new Date()).local().format("YYYY-MM-DD"),
        broadcast_time: "",
        expiration_date: moment(new Date()).local().format("YYYY-MM-DD"),
        web_pay: 0,
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
        reason: "01",
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
      reason:[
        {value:'01',text:'Anulación de la operación'},
        {value:'02',text:'Anulación por error en el ruc'},
        {value:'06',text:'Devolución total'},
        {value:'07',text:'Devolucion por item'},
      ],
      series: null,
      warehouses: [],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
      type_invoice:[
        {value: "07", text : "Nota de Crédito"},
        {value: "08", text : "Nota de Débito"},
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
        {value:'03-7',text:'Credito - 7 Dias'},
        {value:'03-15',text:'Credito - 15 Dias'},
        {value:'03-30',text:'Credito - 30 Dias'},
        {value:'03-45',text:'Credito - 45 Dias'},
        {value:'03-60',text:'Credito - 60 Dias'},
        {value:'03-75',text:'Credito - 75 Dias'},
        {value:'03-90',text:'Credito - 75 Dias'},
      ],
      type_invoice_sale:'',
      serie_sale:'',

      modal_fees_collected:false,
      bnt_fees_collected: false,
      fees_collected: [],
      fee_collected: {
        date:moment(new Date()).local().format("YYYY-MM-DD"),
        total: (0).toFixed(2),
        min_date:moment(new Date()).local().format("YYYY-MM-DD"),
        max_date:moment(new Date()).local().format("YYYY-MM-DD"),
      },
      payments:[],

      //errors
      errors: {
        id_serie: false,
        id_client: false,
        id_warehouse: false,
        way_to_pay: false,
        sale_detail: false,
        reason: false,
        support: false,
        total: false,
        error_serie:false,
      },
      validate: false,


    };
  },
  mounted() {
    this.mLoadResetSaleDetail();
    this.mLoadResetLinkages();
    this.ListWarehouses();
    this.ListSeries();
    this.ViewSale();
  },
  methods: {
    
    SearchClients,
    ListWarehouses,
    ListSeries,
    GetNumberBySerie,
    ChangeTypeInvoice,
    CodeInvoice,

    modalProducts,
    modalClients,

    ViewSale,
    AddSale,
    Validate,

    DataPrint,
    Print,
    ...mapActions('Sale',['mLoadResetSaleDetail','mLoadResetLinkages','mLoadAddSaleDetail','mLoadAddLinkages']),
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

function ChangeTypeInvoice() {
  if (this.sale.type_invoice == "07") {
    this.mLoadResetSaleDetail();
    this.mLoadResetLinkages();
    this. reason = [
        {value:'01',text:'Anulación de la operación'},
        {value:'02',text:'Anulación por error en el ruc'},
        {value:'06',text:'Devolución total'},
        {value:'07',text:'Devolucion por item'},
    ];
    this.sale.reason = '01';
    this.ViewSale();
  }
  if (this.sale.type_invoice == "08") {
    this.mLoadResetSaleDetail();
    
    this. reason = [
        {value:'01',text:'Interes por mora'},
        {value:'02',text:'Aumento en el valor'},
        {value:'03',text:'Penalidades'},
    ];
    this.sale.reason = '01';
  
    
  }
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
        me.sale.serie = response.data.result.serie;
        me.sale.number = response.data.result.number;
        me.document_type = response.data.result.document_type;
      } else {
        me.sale.serie = '';
        me.sale.number = '';
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
function ViewSale() {
  let id_sale = je.decrypt(this.id_sale);
  let me = this;
  let url = me.url_base + "sale/view/"+id_sale;
  axios({
    method: "GET",
    url: url,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
      
        me.client = {id: response.data.result.id_client,full_name: response.data.result.name + ' - ' + response.data.result.document_number};

        me.sale.id_sale = response.data.result.id_sale,
        me.sale.id_warehouse = response.data.result.id_warehouse,
        me.sale.linkages = response.data.result.linkages;
        me.sale.type_operation = response.data.result.type_operation,
        me.type_invoice_sale = response.data.result.type_invoice;
        me.serie_sale = response.data.result.serie;
        // me.sale.type_invoice = response.data.result.type_invoice;
        // me.sale.serie = response.data.result.serie;
        // me.sale.number = response.data.result.number;
        // me.sale.broadcast_date = response.data.result.broadcast_date;
        // me.sale.broadcast_time = response.data.result.broadcast_time;
        // me.sale.expiration_date = response.data.result.expiration_date;
        // me.sale.web_pay = response.data.result.web_pay;
        me.sale.coin = response.data.result.coin;
        // if (response.data.result.payment_type == "01") {
        //   me.sale.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_method;
        // }else{
        //   me.sale.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_deadline;
        // }
        // me.sale.payment_type = response.data.result.payment_type;
        // me.sale.payment_method = response.data.result.payment_method;
        // me.sale.payment_deadline = response.data.result.payment_deadline;
        // me.sale.observation = response.data.result.observation;
        // me.sale.modified_document_type = response.data.result.modified_document_type;
        // me.sale.modified_serie = response.data.result.modified_serie;
        // me.sale.modified_number = response.data.result.modified_number;
        // me.sale.modified_emission_date = response.data.result.modified_emission_date;
        // me.sale.reason = response.data.result.reason;
        // me.sale.support = response.data.result.support;
        // me.sale.sunat_message = response.data.result.sunat_message;
        // me.sale.hash_cpe = response.data.result.hash_cpe;
        // me.sale.hash_cdr = response.data.result.hash_cdr;
        me.sale.taxed_operation = response.data.result.taxed_operation;
        me.sale.exonerated_operation = response.data.result.exonerated_operation;
        me.sale.unaffected_operation = response.data.result.unaffected_operation;
        me.sale.discount = response.data.result.discount;
        me.sale.subtotal = response.data.result.subtotal;
        me.sale.igv = response.data.result.igv;
        me.sale.total = response.data.result.total;
        // me.sale.state = response.data.result.state;
        me.sale.number_to_letters = response.data.result.number_to_letters;

        
        let order = {
          module:'Sale',
          id_module:response.data.result.id_sale,
          concept:'Nota Crédito - Débito',
          broadcast_date:response.data.result.broadcast_date,
          reference: me.CodeInvoice(response.data.result.type_invoice) +  " " +response.data.result.serie + " - "+ response.data.result.number,
        };
        me.mLoadAddLinkages(order);


        let detail_result = response.data.detail_result;
        for (let index = 0; index < detail_result.length; index++) {
          const element = detail_result[index];
            let detail = {
              id_product: element.id_product,
              code: element.code,
              name: element.name,
              presentation: element.presentation,
              unit_measure: element.unit_measure,
              igv: element.igv,
              existence_type: element.existence_type,
              quantity: parseFloat(element.quantity),
              unit_price: parseFloat(element.unit_price).toFixed(2),
              total_price: parseFloat(element.total_price).toFixed(2),
            }
            
            me.mLoadAddSaleDetail(detail);
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
   
}


function AddSale(me,print) {
  
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
  me.sale.fees_collected = me.fees_collected;


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
        me.sale.type_invoice = "07";
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
  
        if (print == "Yes") {
          me.DataPrint(me,response.data.result.id_sale);
        }
        Swal.fire({ icon: 'success', text: 'Se ha emitido correctamente la venta', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.response, timer: 3000,})
      }
      me.isLoading = false;
    })
    .catch((error) => {
      me.isLoading = false;
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  
   
  this.errors.id_serie = this.sale.id_serie.length == 0 ? true : false;
  this.errors.id_warehouse = this.sale.id_warehouse.length == 0 ? true : false;
  this.errors.broadcast_date = this.sale.broadcast_date.length == 0 ? true : false;
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.sale.coin.length == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay.length == 0 ? true : false;
  this.errors.reason = this.sale.reason.length == 0 ? true : false;
  this.errors.support = this.sale.support.length == 0 ? true : false;
  this.errors.sale_detail = this.sale_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_sale.total) <= 0 ? true : false;

  let serie = this.serie_sale;
  let serie_sale = this.sale.serie;;
  if (serie.indexOf("F") !== -1){
    if (serie_sale.indexOf("F") !== -1){
    }else{
      this.validate = true; Swal.fire({ icon: 'warning', text: 'La serie seleccionada no coincide con el comprobante adjuntado', timer: 2000,}); return false;
    }
  }

  if (serie.indexOf("B") !== -1){
    if (serie_sale.indexOf("B") !== -1){
    }else{
      this.validate = true; Swal.fire({ icon: 'warning', text: 'La serie seleccionada no coincide con el comprobante adjuntado', timer: 2000,}); return false;
    }
  }

  
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.reason == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.support == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.sale_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;
  Swal.fire({
  title: 'Esta seguro de emitir la venta?',
  icon: 'warning',
  showDenyButton: true,
  showCancelButton: true,
  confirmButtonText: `Guardar e Imprimir`,
  denyButtonText: `Guardar`,
  denyButtonColor: '#000',
}).then((result) => {
  if (result.isConfirmed) {
    AddSale(me,'Yes');
  } else if (result.isDenied) {
    AddSale(me,'No');
  }
})



}

function DataPrint(id_sale) {
  let me = this;
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
