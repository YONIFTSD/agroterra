<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Cuentas por Cobrar - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
              <b-row>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="modalClients" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select v-model="account_receivable.type_invoice" :options="type_invoice"></b-form-select>
                    <small v-if="errors.type_invoice" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" @change="UpperCase" v-model="account_receivable.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="account_receivable.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="account_receivable.broadcast_date" ></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha Vencimiento:">
                    <b-form-input type="date" ref="expiration_date" v-model="account_receivable.expiration_date" ></b-form-input>
                    <small v-if="errors.expiration_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="account_receivable.coin" :options="coins" ></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Observación:">
                    <b-form-input v-model="account_receivable.reason" ></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="total:">
                    <b-form-input type="number" @change="ChangeTotal" class="text-right" step="any" v-model="account_receivable.total" ></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <div class="col-md-12" v-if="detail.length > 0">
                  <div class="table-responsive mt-3">
                    <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                      <thead class="">
                        <tr>
                          <th width="3%" class="text-center">#</th>
                          <th width="8%" class="text-center">Codigo</th>
                          <th width="40%" class="text-center">Nombre</th>
                          <th width="10%" class="text-center">UM</th>
                          <th width="5%" class="text-center">C. Barras</th>
                          <th width="10%" class="text-center">Cantidad</th>
                          <th width="10%" class="text-center">P. Unit</th>
                          <th width="7%" class="text-center">P. Total</th>
                    
                        </tr>
                      </thead>
                      <tbody v-for="(item, it) in detail" :key="it">
                        <tr>
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-left">{{ item.code }}</td>
                            <td class="align-middle text-left">{{ item.name }}</td>
                            <td class="align-middle text-center">{{ NameUnitMeasure(item.unit_measure)  }}</td>
                            <td class="align-middle text-center">{{ item.barcode }}</td>
                            <td class="align-middle text-right">{{ item.quantity }}</td>
                            <td class="align-middle text-right">{{ item.unit_price }}</td>
                            <td class="align-middle text-right">{{ item.total_price }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <b-col md="12"> <br> </b-col>


        

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button type="submit" class="form-control" variant="primary" ><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalClients />
    <LoadingComponent :is-visible="isLoading"/>
    <Keypress key-event="keyup" :key-code="115" @success="Validate" />
  </div>
</template>

<script>

import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";


const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");

import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
// components
import ModalClients from './../components/ModalClient'
import LoadingComponent from './../pages/Loading'
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "UsuarioAdd",
  props: ["id_account_receivable"],
  components:{
      vSelect,
      ModalClients,
      Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'AccountReceivable',
      role: 3,
      account_receivable: {
          id_account_receivable:'',
          id_sale:'',
          id_client:'',
          id_establishment:'',
          id_user:'',
          type_invoice:'01',
          serie:'',
          number:'',
          coin:'PEN',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          expiration_date:moment(new Date()).local().format("YYYY-MM-DD"),
          reason:'',
          total: (0).toFixed(2),
          fee:'',
          balance:'',
          state:1,
      },

      clients: [],
      client:null,
      detail:[],

      type_invoice:[
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
        {value: "GC", text : "Guia de Crédito"},
        {value: "00", text : "Otros"},
      ],

      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],

      //errors
      errors: {
        id_client: false,
        type_invoice: false,
        serie: false,
        number: false,
        broadcast_date: false,
        expiration_date: false,
        coin: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
    this.ViewAccountReceivable();
  },
  methods: {
    ViewAccountReceivable,
    SearchClients,
    modalClients,
    NumberPadStart,
    UpperCase,
    ChangeTotal,

    EditAccountReceivable,
    Validate,
    NameUnitMeasure,
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

function NameUnitMeasure(code) {
  return CodeToName.NameUnitMeasure(code);
}

function ViewAccountReceivable() {

  let id_account_receivable = je.decrypt(this.id_account_receivable);
  let me = this;
  me.isLoading = true;
  let url = this.url_base + "account-receivable/view/" + id_account_receivable;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {

          me.client = {id: response.data.result.id_client, full_name : response.data.result.name+' - '+response.data.result.document_number };
          me.account_receivable.id_account_receivable = response.data.result.id_account_receivable;
          me.account_receivable.id_sale = response.data.result.id_sale;
          me.account_receivable.id_client = response.data.result.id_client;
          me.account_receivable.client = response.data.result.name+' - '+response.data.result.document_number;
          me.account_receivable.id_establishment = response.data.result.id_establishment;
          me.account_receivable.id_user = response.data.result.id_user;
          me.account_receivable.type_invoice = response.data.result.type_invoice;
          me.account_receivable.serie = response.data.result.serie;
          me.account_receivable.number = response.data.result.number;
          me.account_receivable.coin = response.data.result.coin;
          me.account_receivable.broadcast_date = response.data.result.broadcast_date;
          me.account_receivable.expiration_date = response.data.result.expiration_date;
          me.account_receivable.reason = response.data.result.reason;
          me.account_receivable.total = response.data.result.total;
          me.account_receivable.fee = response.data.result.fee;
          me.account_receivable.balance = response.data.result.balance;
          me.account_receivable.state = response.data.result.state;

          me.detail = response.data.detail;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function ChangeTotal() {
  this.account_receivable.total = parseFloat(this.account_receivable.total);
  this.account_receivable.total = this.account_receivable.total.toFixed(2);
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

function NumberPadStart() {
  var number = String(this.account_receivable.number);
  number = number.padStart(8,"0");
  this.account_receivable.number = number;
}
function UpperCase() {
  this.account_receivable.serie = this.account_receivable.serie.toUpperCase();
}

function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function EditAccountReceivable(me) {

  me.account_receivable.id_user = me.user.id_user;
  me.account_receivable.id_establishment = me.id_establishment;
  me.account_receivable.balance = me.account_receivable.total;
  me.account_receivable.id_sale = 0;
  me.account_receivable.id_client = me.client.id;
  let url = me.url_base + "account-receivable/edit";
  let data = me.account_receivable;

  axios({
    method: "PUT",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: me.role,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
          Swal.fire({ icon: 'success', text: 'Se ha modificado la cuenta por cobrar', timer: 3000,})
      } else if(response.data.status == 400) {
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

 
  this.errors.id_client = this.client == null ? true : false;
  this.errors.type_invoice = this.account_receivable.type_invoice.length == 0 ? true : false;
  this.errors.serie = this.account_receivable.serie.length != 4 ? true : false;
  this.errors.number = this.account_receivable.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.account_receivable.broadcast_date.length == 0 ? true : false;
  this.errors.expiration_date = this.account_receivable.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.account_receivable.coin.length == 0 ? true : false;
  this.errors.total = parseFloat(this.account_receivable.total) <= 0 ? true : false;
  

  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.voucher_type == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.expiration_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

 let me = this;

  Swal.fire({
    title: 'Esta seguro de modificar la cuenta por cobrar?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      EditAccountReceivable(me);
    }
  })


}
</script>
