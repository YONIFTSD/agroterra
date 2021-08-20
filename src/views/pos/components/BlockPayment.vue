<template>
  <div class="container bg-light">
    <b-form  class=" text-dark" id="Form" @submit.prevent="Validate">
      <b-row >
        <b-col md="12">
          <br>
        </b-col>
        <b-col md="8" class="text-center">
           <b-input-group>
           
            <b-input-group-append>
              <b-button type="button" @click="SelectTypeInvoice('03')" class="form-control" :variant="sale.type_invoice == '03' ? 'success':'primary'">Boleta</b-button>
            </b-input-group-append>
             <b-input-group-append>
              <b-button type="button" @click="SelectTypeInvoice('01')" class="form-control" :variant="sale.type_invoice == '01' ? 'success':'primary'">Factura</b-button>
            </b-input-group-append>
            <b-input-group-append>
              <b-button type="button" @click="SelectTypeInvoice('NV')" class="form-control" :variant="sale.type_invoice == 'NV' ? 'success':'primary'">Nota de Venta</b-button>
            </b-input-group-append>
            <b-form-select v-model="sale.id_serie" :options="series"></b-form-select>
          </b-input-group>
        </b-col>
 
        <b-col md="4">
          <b-form-group>
              <b-button @click="Back" type="button" class="form-control" variant="danger">Regresar</b-button>
          </b-form-group>
        </b-col>
      </b-row>


      <b-row class="justify-content-md-center">
        <b-col class="bg-white text-dark" col md="8">
          <div class="w-100 text-center"><span>Monto a cobrar</span></div>
          <div class="w-100 text-center"><strong class="text-total-payment">{{ sale.coin == "PEN" ? "S/":"$"}} {{total_pos.total}}</strong></div>

          <div class="w-100 size-pos" :style="size_pos"><br>
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
            <b-link  @click="AddPaymentCash"><i class="fas fa-plus"></i> Agregar pago</b-link>
          </div>
          </div>
          
        </b-col>
      </b-row>
      <b-row>
        <b-col md="12" class="">
          <b-form-group>
              <b-button @click="Validate" type="button" class="form-control" variant="primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
          </b-form-group>
        </b-col>
      </b-row>
    </b-form>

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

    <LoadingComponent :is-visible="isLoading"/>
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
.size-pos{
  min-height: var(--size-pos);
}

.text-total{
  font-size: 14px;
  font-weight: 500;
}
.text-total-payment{
  font-size: 40px;
  font-weight: 600;
}
</style>>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
var moment = require("moment");
import LoadingComponent from './../../pages/Loading'
export default {
  name: "ModalsProduct",
  components:{
    vSelect,
    LoadingComponent,
    Keypress: () => import('vue-keypress'),
  },
  data() {
    return {

      isLoading: false,
      module: 'POS',
      role: 2,
      coin:'PEN',
      size_pos: '--size-pos: 370px',
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      clients: [],
      client: {id:1,full_name:'CLIENTES VARIOS - 00000000'},
      type_invoice:[
        {value: "01", text : "Factura"},
        {value: "03", text : "Boleta de Venta"},
        {value: "NV", text : "Nota de Venta"},
      ],
      quantity_vouchers:[
        {value:0, text:'No imprimir'},
        {value:1, text:'Imp. 1 Comprobante'},
        {value:2, text:'Imp. 2 Comprobantes'},
        {value:3, text:'Imp. 3 Comprobantes'},
      ],
      print_voucher: 1,
      document_type:'',
      series: null,
      way_to_pay:[
        {value:"01-000", text :'Contado'},
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


      errors: {
        id_serie: false,
        id_client: false,
        way_to_pay: false,
        address: false,
        pos_detail: false,
        total: false,
      },
      

    };
  },
  mounted () {
     EventBus.$on('TotalPaymentCash', () => {
      let total = this.total_pos.total;
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
   this.ViewEstablishment();
   this.ListSeries();
   this.AddPaymentCash();
  },
  methods: {
    SearchClients,
    modalClients,
    SelectTypeInvoice,
    
    ListSeries,
    GetNumberBySerie,
    AddSale,
    Validate,
    Print,
    DataPrint,
    modalConfirmSale,

    AddPaymentCash,
    DeletePaymentCash,
    Back,
    ViewEstablishment,
    
    ...mapActions('SalePOS',['mLoadResetPOSDetail']),
  },
  computed: {
      ...mapState('SalePOS',['sale','total_pos','mclient','pos_detail']),
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
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};
function ViewEstablishment() {
  let me = this;
  let url = me.url_base + "establishment/view/" + this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let size = parseFloat(response.data.result.size_pos);
        me.size_pos = '--size-pos: '+size+'px';
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

function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function SelectTypeInvoice(type_invoice) {
  this.sale.type_invoice = type_invoice;
  this.ListSeries(); 
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
          me.series.push( { value : data[index].id_serie , text: data[index].serie+"-"+data[index].number } );
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


function AddSale() {
  let me = this;
  me.isLoading = true;
  let url = me.url_base + "sale/add";
  me.sale.id_user = me.user.id_user;
  me.sale.id_establishment = me.id_establishment;
  me.sale.id_client = me.mclient.id;
  me.sale.taxed_operation = me.total_pos.taxed_operation;
  me.sale.unaffected_operation = me.total_pos.unaffected_operation;
  me.sale.exonerated_operation = me.total_pos.exonerated_operation;
  me.sale.discount = me.total_pos.discount;
  me.sale.subtotal = me.total_pos.subtotal;
  me.sale.igv = me.total_pos.igv;
  me.sale.total = me.total_pos.total;
  me.sale.number_to_letters = me.total_pos.number_to_letters;
  me.sale.sale_detail = me.pos_detail;
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
        me.mLoadResetPOSDetail();
        me.payment_cash = [];
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
        EventBus.$emit('ChangeTypeProcess',1);
        
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
  this.errors.id_client = this.mclient == null ? true : false;
  this.errors.coin = this.sale.coin.length == 0 ? true : false;
  this.errors.way_to_pay = this.sale.way_to_pay.length == 0 ? true : false;
  this.errors.pos_detail = this.pos_detail.length == 0 ? true : false;
  this.errors.total = parseFloat(this.total_pos.total) <= 0 ? true : false;
  
  if (this.errors.id_serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_warehouse == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.way_to_pay == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.pos_detail == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
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
    let balance_payment_cash = parseFloat(this.total_pos.total) - parseFloat(total);
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
      let balance_fee_collection = parseFloat(this.total_pos.total) - parseFloat(total);
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

function Back() {
    EventBus.$emit('ChangeTypeProcess',1);
}
</script>
