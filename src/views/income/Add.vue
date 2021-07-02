<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Ingresos - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: <span @click="ShowModalProvider" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un proveedor" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Tipo de Comprobante :">
                    <b-form-select v-model="income.voucher_type" :options="invoices_type"></b-form-select>
                    <small v-if="errors.voucher_type" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" @change="UpperCase" v-model="income.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="income.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" readonly ref="broadcast_date" v-model="income.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="income.coin" :options="coins"></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger" >Selccione un tipo de moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="5">
                  <b-form-group label="Observación:">
                    <b-form-input type="text" v-model="income.observation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Importe:">
                    <b-form-input type="number" class="text-right" step="any" v-model="income.total"></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger" >Ingrese un monto</small>
                  </b-form-group>
                </b-col>


        

                <b-col md="3"></b-col>
                <b-col md="6">
                  <b-button type="submit" class="form-control btn-primary" >GUARDAR</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>


    <ModalProviders />
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
import ModalProviders from '@/views/components/ModalProvider'

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalProviders,
  },
  data() {
    return {
      module: 'Income',
      role: 2,
      income: {
          id_user:'',
          id_establishment:'',
          id_provider:'',
          voucher_type:'01',
          serie:'',
          number:'',
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          coin:'PEN',
          observation:'',
          total:(0).toFixed(2),
          state:1,
      },

      providers: [],
      provider:null,

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
        {value: "CLP", text : "Pesos Chilenos"},
      ],

      //errors
      errors: {
        id_provider: false,
        voucher_type: false,
        serie: false,
        number: false,
        broadcast_date: false,
        coin: false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
  
  },
  methods: {
    SearchProvider,
    ShowModalProvider,
    NumberPadStart,
    UpperCase,

    AddIncome,
    Validate,
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

function NumberPadStart() {
  var number = String(this.income.number);
  number = number.padStart(8,"0");
  this.income.number = number;
}
function UpperCase() {
    this.income.serie = this.income.serie.toUpperCase();
}

function ShowModalProvider() {
  EventBus.$emit('ModalProvidersShow');
}

function AddIncome(me) {

  me.income.id_establishment = me.id_establishment;
  me.income.id_user = me.user.id_user;
  me.income.id_provider = me.provider.id;
  let url = me.url_base + "income/add";
  let data = me.income;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module,role: 2, },
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.income.id_user = '';
          me.income.id_provider = '';
          me.income.voucher_type = '01';
          me.income.serie = '';
          me.income.number = '';
          me.income.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
          me.income.coin = 'PEN';
          me.income.observation = '';
          me.income.total = (0).toFixed(2);
          me.income.state = 1;
        Swal.fire("Sistema", "Se ha registrado el ingreso", "success");
      } else if(response.data.status == 400) {
        Swal.fire("Sistema", "El comprobante ya fue registrado previamente", "warning");
      }else{
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function Validate() {

  this.errors.id_provider = this.provider == null || this.provider == {}  ? true : false;
  this.errors.voucher_type = this.income.voucher_type.length == 0 ? true : false;
  this.errors.serie = this.income.serie.length != 4 ? true : false;
  this.errors.number = this.income.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.income.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.income.coin.length == 0 ? true : false;
  this.errors.total = this.income.total.length == 0 ? true : false;
  

  if (this.errors.id_provider) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.errors.voucher_type) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.errors.serie) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.errors.broadcast_date) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.errors.coin) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }
  if (this.errors.total) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate_add = false; }


  let me = this;
  Swal.fire({
    title: "Esta seguro de registrar el ingreso ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.AddIncome(me);
    }
  });
}
</script>
