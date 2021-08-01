<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de Venta - Ver</strong>
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
                    <b-form-select disabled v-model="sale.coin" :options="coins"></b-form-select>
                    <small  v-if="errors.coin"  class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>
    
                <b-col md="6"></b-col>
                <b-col md="2">
                  <b-form-group>
                    <b-button disabled class="form-control btn btn-info" @click="modalProducts"><i class="fas fa-cart-plus"></i> Productos (F2)</b-button>
                  </b-form-group>
                </b-col>
             

               <b-col md="3">
                  <b-form-group label="Tipo de Comprobante :">
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
                  <b-form-group label="Forma de Pago :">
                    <b-form-select disabled v-model="sale.way_to_pay" :options="way_to_pay"></b-form-select>
                  </b-form-group>
                </b-col>

               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: </label>
                    <v-select disabled placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>

                <b-col md="6">
                  <b-form-group label="Dirección :">
                    <b-form-input  disabled type="text" ref="address"  v-model="sale.address"></b-form-input>
                  </b-form-group>
                </b-col>


                 

                 


                

                 <div class="col-md-12">
                      <div class="table-responsive mt-3">
                          <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                            <thead class="">
                              <tr>
                                <th width="5%" class="text-center">#</th>
                                <th width="8%" class="text-center">Codigo</th>
                                <th width="50%" class="text-center">Nombre</th>
                                <th width="5%" class="text-center">UM</th>
                                <th width="10%" class="text-center">Cantidad</th>
                                <th width="10%" class="text-center">P. Unit</th>
                                <th width="8%" class="text-center">P. Total</th>
                          
                              </tr>
                            </thead>
                            <tbody v-for="(item, it) in sale_detail" :key="item.id_product">
                              <tr>
                                  <td class="align-middle text-center">{{ it + 1 }}</td>
                                  <td class="align-middle text-left">{{ item.code }}</td>
                                  <td class="align-middle text-left">{{ item.name + " - " +item.presentation }}</td>
                                  <td class="align-middle text-center">{{ item.unit_measure }}</td>
                                  <td class="align-middle text-center">{{ item.quantity }}</td>
                                  <td class="align-middle text-right">{{ item.unit_price }}</td>
                                  <td class="align-middle text-right">{{ item.total_price }}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                

                <b-col md="12" class="mt-2"></b-col>

                <b-col md="8">
                  <b-form-group class="m-0" >
                    <b-form-input readonly v-model="sale.number_to_letters" ></b-form-input>
                  </b-form-group>
                  <b-row>
                    
                    <b-col md="6">
                        <div class="table-responsive mt-3">
                          <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                            <thead class="">
                              <tr>
                                <th width="25%" class="text-center">Fecha</th>
                                <th width="75%" class="text-center">Refenrencia</th>
                              </tr>
                            </thead>
                            <tbody v-for="(item, it) in sale.linkages" :key="it">
                              <tr>
                                  <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                                  <td class="align-middle text-center">{{ item.reference + " " + (sale.reason != "" ? " - "+CodeReasor(sale.type_invoice,sale.reason) : "")}}</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                    </b-col>
                    <b-col md="6">
                      <b-form-group label="Observación:">
                        <b-form-textarea disabled rows="1"  v-model="sale.observation" max-rows="2"></b-form-textarea>
                      </b-form-group>
                    </b-col>
                  </b-row>
                </b-col>

                <b-col md="4">
                  <b-form-group class="m-0" label-cols-lg="8" label="Subtotal:" label-align="right" >
                    <b-form-input readonly class="text-right" v-model="sale.subtotal"></b-form-input>
                  </b-form-group>

                  <b-form-group  class="m-0"  label-cols-lg="8" label="IGV (18%):"  label-align="right">
                    <b-form-input readonly class="text-right" v-model="sale.igv"></b-form-input>
                  </b-form-group>

                  <b-form-group  class="m-0" label-cols-lg="8" label="Total:" label-align="right">
                    <b-form-input readonly class="text-right" v-model="sale.total"></b-form-input>
                    <small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>

                </b-col>

                <b-col md="3"></b-col>
        
                <b-col md="3">
                  <b-button  type="button" @click="DataPrint(sale.id_sale)" class="form-control" variant="warning" >IMPRIMIR</b-button>
                </b-col>
                <b-col md="3">
                  <b-link class="btn form-control btn-primary" :to="{ path: '/venta/listar' }" append >REGRESAR</b-link>
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
import CodeToName from "@/assets/js/CodeToName";

// components
import ModalClients from './../components/ModalClient'
import ModalProducts from './components/ModalProduct'
import SaleDetail from './components/SaleDetail'

export default {
  name: "UsuarioAdd",
  props: ["id_sale"],
  components:{
      vSelect,  
      ModalProducts,
      SaleDetail,
      ModalClients,
  },
  data() {
    return {
      module: 'Sale',
      role: 5,
      sale: {
        id_sale: "",
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
        coin: "PEN",
        address: "",
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
      sale_detail:[],
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
        {value:'03-7',text:'Credito - 7 Dias'},
        {value:'03-15',text:'Credito - 15 Dias'},
        {value:'03-30',text:'Credito - 30 Dias'},
        {value:'03-45',text:'Credito - 45 Dias'},
        {value:'03-60',text:'Credito - 60 Dias'},
        {value:'03-75',text:'Credito - 75 Dias'},
        {value:'03-90',text:'Credito - 75 Dias'},
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
    this.ViewSale();
  },
  methods: {
    
    SearchClients,
    ListWarehouses,

    modalProducts,
    modalClients,
    CodeReasor,
    ViewSale,
    EditSale,
    Validate,

    DataPrint,
    Print,

    ...mapActions('Sale',['mLoadResetSaleDetail','mLoadAddSaleDetail']),
  },

  computed: {
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

function CodeReasor(type_invoice,code) {
  return CodeToName.NameReasonNCD(type_invoice,code);
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
        me.sale.type_operation = response.data.result.type_operation,
        me.sale.type_invoice = response.data.result.type_invoice;
        me.sale.linkages = response.data.result.linkages;
        me.sale.serie = response.data.result.serie;
        me.sale.number = response.data.result.number;
        me.sale.broadcast_date = response.data.result.broadcast_date;
        me.sale.broadcast_time = response.data.result.broadcast_time;
        me.sale.expiration_date = response.data.result.expiration_date;
        me.sale.coin = response.data.result.coin;
        me.sale.address = response.data.result.address;
        if (response.data.result.payment_type == "01") {
          me.sale.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_method;
        }else{
          me.sale.way_to_pay = response.data.result.payment_type+'-'+response.data.result.payment_deadline;
        }
        
        me.sale.payment_type = response.data.result.payment_type;
        me.sale.payment_method = response.data.result.payment_method;
        me.sale.payment_deadline = response.data.result.payment_deadline;
        me.sale.observation = response.data.result.observation;
        me.sale.modified_document_type = response.data.result.modified_document_type;
        me.sale.modified_serie = response.data.result.modified_serie;
        me.sale.modified_number = response.data.result.modified_number;
        me.sale.modified_emission_date = response.data.result.modified_emission_date;
        me.sale.reason = response.data.result.reason;
        me.sale.support = response.data.result.support;
        me.sale.sunat_message = response.data.result.sunat_message;
        me.sale.hash_cpe = response.data.result.hash_cpe;
        me.sale.hash_cdr = response.data.result.hash_cdr;
        me.sale.taxed_operation = response.data.result.taxed_operation;
        me.sale.exonerated_operation = response.data.result.exonerated_operation;
        me.sale.unaffected_operation = response.data.result.unaffected_operation;
        me.sale.discount = response.data.result.discount;
        me.sale.subtotal = response.data.result.subtotal;
        me.sale.igv = response.data.result.igv;
        me.sale.total = response.data.result.total;
        me.sale.state = response.data.result.state;
        me.sale.number_to_letters = response.data.result.number_to_letters;
       
        me.sale_detail = response.data.detail_result;
      
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
   
}


function EditSale(_this) {
  
  let me = _this;
  let url = me.url_base + "sale/edit";
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
        Swal.fire({ icon: 'success', text: 'Se ha modificado correctamente la venta', timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text:  response.data.response, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {
  
  
  this.errors.id_client = this.client == null ? true : false;
  this.errors.coin = this.sale.coin == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay == 0 ? true : false;
  this.errors.sale_detail = this.sale_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_sale.total) <= 0 ? true : false;
  

  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.sale_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar la venta?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditSale(me);
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
