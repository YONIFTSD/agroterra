<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Canje de Venta - Nuevo</strong>
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
                  <b-form-group label="">
                    <b-form-select @change="ChangeCoin" v-model="sale.coin" :options="coins"></b-form-select>
                    <small  v-if="errors.coin"  class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>
    
                <b-col md="4"></b-col>
              
                <b-col md="2">
                  <b-form-group>
                    <b-form-input @keyup="SearchBarcode" ref="search_barcode" v-model="search_barcode" placeholder="Código de barras" type="text"></b-form-input>
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
                    <b-form-input disabled class="text-center" type="date" ref="broadcast_date" v-model="sale.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                

                 <b-col md="3">
                  <b-form-group>
                    <label class="control-label">Forma de Pago: <span v-if="bnt_fees_collected" class="badge badge-primary link" @click="ModalFeedCollected">Cuotas</span></label>
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
                
                
                <!-- Detalle venta -->

                <b-col md="12" class="mt-2"></b-col>
                
                <b-col md="3">
                  <div class="table-responsive">
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

                <b-col md="3">
                 
                  <b-form-group label="Observación:">
                    <b-form-textarea size="sm" v-model="sale.observation"></b-form-textarea>
                  </b-form-group>
                  
                </b-col>
                <b-col md="3">
                  <b-row>
                      <div class="table-responsive">
                        <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                          <tbody >
                            <tr>
                                <td class="">
                                  <b-form-checkbox value="1" unchecked-value="0" @change="mLoadTotalSaleDetail" v-model="total_sale.check_detraction" switch size="sm" name="check-button" >¿Tiene Detracción?</b-form-checkbox>
                                </td>
                            </tr>
                            <tr>
                                <td class="">
                                  <b-form-checkbox value="1" unchecked-value="0" @change="mLoadTotalSaleDetail" v-model="total_sale.check_retention" switch size="sm" name="check-button" >¿Tiene retención de igv?</b-form-checkbox>
                                </td>
                            </tr>
                            <!-- <tr>
                                <td class="">
                                  <b-form-checkbox value="1" unchecked-value="0" @change="mLoadTotalSaleDetail" v-model="total_sale.check_discount" switch size="sm" name="check-button" >¿Tiene Descuento Global?</b-form-checkbox>
                                </td>
                            </tr> -->
                          </tbody>
                        </table>
                      </div>
           
     
                    
                  </b-row>
                </b-col>

                <b-col md="3">
                  <div class="table-responsive">
                    <table  class="table   table-hover table-lg mt-lg mb-0">
                      <tbody>
                        <tr v-if="total_sale.check_detraction == '1'">
                            <td width="50%" class="align-middle text-right text-total">Detracción :</td>
                            <td width="50%" class="align-middle text-right text-total">
                              <div class="input-group">
                                <b-form-input size="sm" @change="mLoadTotalSaleDetail" type="number" step="any" class="text-right" v-model="total_sale.percentage_detraction"></b-form-input>
                                <b-form-input readonly size="sm" type="number" step="any" class="text-right" v-model="total_sale.detraction"></b-form-input>
                              </div>
                            </td>
                        </tr>
                        <tr v-if="total_sale.check_retention == '1'">
                            <td width="50%" class="align-middle text-right text-total">Retencion (3%):</td>
                            <td width="50%" class="align-middle text-right text-total">
                              <b-form-input readonly size="sm" type="number" step="any" class="text-right" v-model="total_sale.retention"></b-form-input>
                            </td>
                        </tr>
                        <tr>
                            <td width="50%" class="align-middle text-right text-total">Subtotal:</td>
                            <td width="50%" class="align-middle text-right text-total">
                              <b-form-input readonly size="sm" type="number" step="any" class="text-right" v-model="total_sale.subtotal"></b-form-input>
                            </td>
                        </tr>
                        <tr v-if="total_sale.check_discount == '1'">
                            <td class="align-middle text-right text-total">Descuento:</td>
                            <td class="align-middle text-right text-total">
                              <b-form-input size="sm" type="number" step="any" class="text-right" v-model="total_sale.discount"></b-form-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle text-right text-total">IGV ({{sale.igv_percentage}}%):</td>
                            <td class="align-middle text-right text-total">
                              <b-form-input readonly size="sm" type="number" step="any" class="text-right" v-model="total_sale.igv"></b-form-input>
                            </td>
                        </tr>
                        <tr>
                            <td class="align-middle text-right text-total">Total:</td>
                            <td class="align-middle text-right text-total">
                              <b-form-input readonly size="sm" type="number" step="any" class="text-right" v-model="total_sale.total"></b-form-input>
                            </td>
                        </tr>
                        <tr>
                            <td colspan="2" class="align-middle text-center"><small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
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


    <ModalProducts />
    <ModalClients />
    <ModalOrders/>
    <LoadingComponent :is-visible="isLoading"/>
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
import ModalOrders from './components/ModalOrder'
import LoadingComponent from './../pages/Loading'

export default {
  name: "UsuarioAdd",
  props: ["id_sale"],
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
      ModalOrders,
      LoadingComponent,
  },
  data() {
    return {
      quantity_vouchers:[
        {value:0, text:'No imprimir'},
        {value:1, text:'Imp. 1 Comprobante'},
        {value:2, text:'Imp. 2 Comprobantes'},
        {value:3, text:'Imp. 2 Comprobantes'},
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
        code_sap: "",
        order_sap: "",
        service: "",
        modified_document_type: "",
        modified_serie: "",
        modified_number: "",
        modified_emission_date: "",
        check_contingency:"0",
        check_retention:"0",
        check_discount:"0",
        reason: "",
        support: "",
        sunat_message: "",
        hash_cpe: "",
        hash_cdr: "",
        code_sap: '',
        order_sap: '',
        service: '',
        check_detraction:"0",
        check_contingency: "0",
        check_retention: "0",
        check_discount: "0",
        taxed_operation: '0.00',
        exonerated_operation: '0.00',
        unaffected_operation: '0.00',
        retention: '0.00',
        discount: '0.00',
        subtotal: '0.00',
        igv: '0.00',
        total: '0.00',
        net_total: '0.00',
        state: '1',
        number_to_letters: '',
        igv_percentage:'',
      },

      series: null,
      warehouses: [],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
      type_invoice:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
      ],
      
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      way_to_pay:[
        {value:"01-000", text: 'Contado'},

      ],

  
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
    };
  },
  mounted() {
    EventBus.$on('InvoiceInformation', (data) => {
      this.client = data.client;
      this.sale.type_invoice = data.type_invoice;
      this.ListSeries();
    });
    this.mLoadResetSaleDetail();
    this.mLoadResetLinkages();
    this.ListWarehouses();
    this.ListSeries();
    this.ViewSale();
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

    BntFeesCollected,
    ModalFeedCollected,
    AddFeedCollected,
    DeleteFeedCollected,

    modalConfirmSale,

    ChangeCoin,
    ViewSale,
    CodeInvoice,
    DeleteLinkeage,
    ...mapActions('Sale',['mLoadResetSaleDetail','mLoadResetLinkages','mLoadDeleteLinkages','mLoadAddSaleDetail',
    'mLoadEditCoin','mLoadAddLinkages','mLoadTotalSaleDetail','mLoadIgvPercentage']),
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

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ViewSale() {
  
  let me = this;
  let id_sale = je.decrypt(this.id_sale);
  let url = me.url_base + "sale/view/"+id_sale;

  axios({
    method: "GET",
    url: url,
    headers: {"Content-Type": "application/json", token: me.token, module: me.module,role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let order = {
          module:'Trade',
          id_module:response.data.result.id_sale,
          concept:'Canje',
          broadcast_date:response.data.result.broadcast_date,
          reference: me.CodeInvoice(response.data.result.type_invoice) + " "+response.data.result.serie+"-"+response.data.result.number,
        };
        me.mLoadAddLinkages(order);

        me.sale.igv_percentage = response.data.result.igv_percentage;
        me.mLoadIgvPercentage(response.data.result.igv_percentage);
        
        me.client = {id: response.data.result.id_client,full_name: response.data.result.name + ' - ' + response.data.result.document_number};
        me.sale.id_sale = response.data.result.id_sale,
        me.sale.id_warehouse = response.data.result.id_warehouse,
        me.sale.type_operation = response.data.result.type_operation,
        // me.sale.type_invoice = response.data.result.type_invoice;
        // me.sale.linkages = response.data.result.linkages;
        // me.sale.serie = response.data.result.serie;
        // me.sale.number = response.data.result.number;
        // me.sale.broadcast_date = response.data.result.broadcast_date;
        // me.sale.broadcast_time = response.data.result.broadcast_time;
        // me.sale.expiration_date = response.data.result.expiration_date;
        me.sale.coin = response.data.result.coin;
        me.sale.address = response.data.result.address;
        // if (response.data.result.payment_type == "01") {
        //   me.sale.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_method;
        //   me.disabled_fees_collected = false;
        // }else{
        //   me.sale.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_deadline;
        //   me.disabled_fees_collected = true;
        // }
        
        // me.sale.payment_type = response.data.result.payment_type;
        // me.sale.payment_method = response.data.result.payment_method;
        // me.sale.payment_deadline = response.data.result.payment_deadline;
        me.sale.observation = response.data.result.observation;
        me.sale.license_plate = response.data.result.license_plate;
        // me.sale.modified_document_type = response.data.result.modified_document_type;
        // me.sale.modified_serie = response.data.result.modified_serie;
        // me.sale.modified_number = response.data.result.modified_number;
        // me.sale.modified_emission_date = response.data.result.modified_emission_date;
        // me.sale.reason = response.data.result.reason;
        // me.sale.support = response.data.result.support;
        // me.sale.sunat_message = response.data.result.sunat_message;
        // me.sale.hash_cpe = response.data.result.hash_cpe;
        // me.sale.hash_cdr = response.data.result.hash_cdr;
        // me.sale.taxed_operation = response.data.result.taxed_operation;
        // me.sale.exonerated_operation = response.data.result.exonerated_operation;
        // me.sale.unaffected_operation = response.data.result.unaffected_operation;
        // me.sale.discount = response.data.result.discount;
        // me.sale.subtotal = response.data.result.subtotal;
        // me.sale.igv = response.data.result.igv;
        // me.sale.total = response.data.result.total;
        // me.sale.state = response.data.result.state;
        // me.sale.number_to_letters = response.data.result.number_to_letters;
       
        let detail_result = response.data.detail_result;
        for (let index = 0; index < detail_result.length; index++) {
          const element = detail_result[index];
            let detail = {
              id_product: element.id_product,
              code: element.code,
              name: element.name,
              presentation: '',
              unit_measure: element.unit_measure,
              igv: element.igv,
              existence_type: element.existence_type,
              quantity: parseFloat(element.quantity).toFixed(2),
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
  let url = me.url_base + "redeemed-sale/add";
   me.sale.id_user = me.user.id_user;
  me.sale.id_establishment = me.id_establishment;
  me.sale.id_client = me.client.id;
  me.sale.check_contingency = me.total_sale.check_contingency;
  me.sale.check_detraction = me.total_sale.check_detraction;
  me.sale.check_retention = me.total_sale.check_retention;
  me.sale.check_discount = me.total_sale.check_discount;
  me.sale.taxed_operation = me.total_sale.taxed_operation;
  me.sale.unaffected_operation = me.total_sale.unaffected_operation;
  me.sale.exonerated_operation = me.total_sale.exonerated_operation;
  me.sale.percentage_detraction = me.total_sale.percentage_detraction;
  me.sale.retention = me.total_sale.retention;
  me.sale.detraction = me.total_sale.detraction;
  me.sale.discount = me.total_sale.discount;
  me.sale.subtotal = me.total_sale.subtotal;
  me.sale.igv = me.total_sale.igv;
  me.sale.total = me.total_sale.total;
  me.sale.net_total = me.total_sale.net_total;
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
        me.sale.way_to_pay = "01-000";
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
  
        if (me.print_voucher == 1) {
          me.DataPrint(me,response.data.result.id_redeemed_sale);
        }
        if (me.print_voucher == 2) {
          me.DataPrint(me,response.data.result.id_redeemed_sale);
          me.DataPrint(me,response.data.result.id_redeemed_sale);
        }
        if (me.print_voucher == 3) {
          me.DataPrint(me,response.data.result.id_redeemed_sale);
          me.DataPrint(me,response.data.result.id_redeemed_sale);
          me.DataPrint(me,response.data.result.id_redeemed_sale);
        }

        me.$refs['modal-confirm-sale'].hide()
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
  if (this.sale.type_invoice == '01') {
      this.errors.address = this.sale.address.length == 0 ? true : false;
  }
  this.errors.coin = this.sale.coin.length == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay.length == 0 ? true : false;
  this.errors.sale_detail = this.sale_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_sale.total) <= 0 ? true : false;
  
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.address == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.sale_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  
  if (this.type_print == 1) {
    this.quantity_vouchers = [
      {value:0, text:'No imprimir'},
      {value:1, text:'Imp. 1 Comprobante'},
      {value:2, text:'Imp. 2 Comprobantes'},
      {value:2, text:'Imp. 3 Comprobantes'},
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

function DataPrint(me,id_redeemed_sale) {
  if (this.type_print == 1) {
    let url = me.url_base + "redeemed-sale/data-print/"+id_redeemed_sale;
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
    let url = this.url_base + "voucher-redeemed-sale/"+id_redeemed_sale;
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
  let days = 0;
  if (payment_type[0] == "03") {
    this.bnt_fees_collected = true;
  }else{
    this.bnt_fees_collected = false;
    this.fees_collected = [];
  }
}

function ModalFeedCollected() {
  this.modal_fees_collected = true;
  let payment_type = this.sale.way_to_pay.split('-');
  let days = payment_type[1];
  let balance = 0;
  for (let index = 0; index < this.fees_collected.length; index++) {
    const element = this.fees_collected[index];
    balance += parseFloat(element.total);
  }
  this.fee_collected.total = parseFloat(this.total_sale.total) - parseFloat(balance); 
  this.fee_collected.total = this.fee_collected.total.toFixed(2);
  this.fee_collected.max_date = moment(this.fee_collected.min_date, "YYYY-MM-DD").add('days',parseInt(days)).local().format("YYYY-MM-DD");
  
}

function AddFeedCollected() {
  let balance = 0;
  for (let index = 0; index < this.fees_collected.length; index++) {
    const element = this.fees_collected[index];
    balance += parseFloat(element.total);
  }
  balance = parseFloat(this.total_sale.total) - parseFloat(balance); 

  if (this.fee_collected.date.length == 0 || this.fee_collected.total.length == 0 || balance < parseFloat(this.fee_collected.total))  {
    return false;
  }
  
  this.fees_collected.push({date:this.fee_collected.date, total: parseFloat(this.fee_collected.total).toFixed(2)});

  balance = 0;
  for (let index = 0; index < this.fees_collected.length; index++) {
    const element = this.fees_collected[index];
    balance += parseFloat(element.total);
  }
  this.fee_collected.total = parseFloat(this.total_sale.total) - parseFloat(balance); 
  this.fee_collected.total = this.fee_collected.total.toFixed(2);

  
}

function DeleteFeedCollected(index) {
  for (var i = 0; i < this.fees_collected.length; i++) {
    if (i == index) {
      this.fees_collected.splice(i, 1); break;
    }
  }
  let balance = 0;
  for (let index = 0; index < this.fees_collected.length; index++) {
    const element = this.fees_collected[index];
    balance += parseFloat(element.total);
  }
  this.fee_collected.total = parseFloat(this.total_sale.total) - parseFloat(balance); 
  this.fee_collected.total = this.fee_collected.total.toFixed(2);
  
}


</script>
