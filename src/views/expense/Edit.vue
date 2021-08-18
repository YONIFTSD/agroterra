<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Egresos - Editar</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>

                <b-col md="6">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <b-form-input type="text" :value="expense.name + ' - ' + expense.document_number" readonly></b-form-input>
                    <small v-if="errors.id_provider" class="form-text text-danger" >Selccione un proveedor</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Comprobante :">
                    <b-form-select v-model="expense.voucher_type" :options="invoices_type"></b-form-select>
                    <small v-if="errors.voucher_type" class="form-text text-danger" >Selccione un tipo de comprobante</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Serie :">
                    <b-form-input type="text" ref="serie" @change="UpperCase" v-model="expense.serie"></b-form-input>
                    <small v-if="errors.serie"  class="form-text text-danger" >Ingrese una serie de 4 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Numero :">
                    <b-form-input class="text-right" type="text" ref="number" @change="NumberPadStart" v-model="expense.number"></b-form-input>
                    <small v-if="errors.number" class="form-text text-danger">Ingrese un numero de 8 digitos</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha de Pago:">
                    <b-form-input type="date" class="text-center" ref="broadcast_date" v-model="expense.broadcast_date"></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emisión:">
                    <b-form-input type="date" class="text-center" ref="date" v-model="expense.date"></b-form-input>
                    <small v-if="errors.date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>
                
                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="expense.coin" :options="coins"></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger" >Selccione un tipo de moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Observación:">
                    <b-form-input type="text" v-model="expense.observation"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Importe:">
                    <b-form-input type="number" class="text-right" step="any" v-model="expense.total"></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger" >Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <b-col md="5"></b-col>
                <b-col md="2">
                  <b-button type="submit" class="form-control btn-primary"><i class="fas fa-save"></i> Guardar (F4)</b-button>
                </b-col>
              </b-row>
            </b-form>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
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
import ModalProviders from '@/views/components/ModalProvider'
import LoadingComponent from './../pages/Loading'
export default {
  name: "IncomeEdit",
  props: ["id_expense"],
  components:{
      Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Income',
      role: 3,
      expense: {
          id_expense:'',
          id_user:'',
          id_provider:'',
          voucher_type:'',
          serie:'',
          number:'',
          broadcast_date:'',
          date:'',
          coin:'¿',
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
    this.ViewExpense();
  },
  methods: {

    NumberPadStart,
    UpperCase,


    ViewExpense,
    EditExpense,
    Validate,
  },

  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};


function NumberPadStart() {
  var number = String(this.expense.number);
  number = number.padStart(8,"0");
  this.expense.number = number;
}
function UpperCase() {
    this.expense.serie = this.expense.serie.toUpperCase();
}

//ver usuario
function ViewExpense() {
  let id_expense = je.decrypt(this.id_expense);
  let me = this;
  let url = this.url_base + "expense/view/" + id_expense;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.expense.id_expense = response.data.result.id_expense;
        me.expense.id_provider = response.data.result.id_provider;
        me.expense.voucher_type = response.data.result.voucher_type;
        me.expense.serie = response.data.result.serie;
        me.expense.number = response.data.result.number;
        me.expense.broadcast_date = response.data.result.broadcast_date;
        me.expense.date = response.data.result.date;
        me.expense.coin = response.data.result.coin;
        me.expense.total = response.data.result.total;
        me.expense.observation = response.data.result.observation;
        me.expense.state = response.data.result.state;
        me.expense.name = response.data.result.name;
        me.expense.document_number = response.data.result.document_number;
        me.expense.email = response.data.result.email;
      }else{
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire("Sistema", "A Ocurrido un error", "error");
      me.isLoading = false;
    });
}

//editar usuario
function EditExpense(me) {
 
  let url = me.url_base + "expense/edit";
  let data = me.expense;
  me.isLoading = true;
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
        Swal.fire("Sistema", "Se ha modificado el ingreso correctamente", "success");
      } else if(response.data.status == 400) {
        Swal.fire("Sistema", "El comprobante ya fue registrado previamente", "warning");
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = true;
    });
}

//validacion de formulario
function Validate() {

  // this.errors.id_provider = this.provider == null || this.provider == {}  ? true : false;
  this.errors.voucher_type = this.expense.voucher_type.length == 0 ? true : false;
  this.errors.serie = this.expense.serie.length != 4 ? true : false;
  this.errors.number = this.expense.number.length != 8 ? true : false;
  this.errors.broadcast_date = this.expense.broadcast_date.length == 0 ? true : false;
  this.errors.date = this.expense.date.length == 0 ? true : false;
  this.errors.coin = this.expense.coin.length == 0 ? true : false;
  this.errors.total = this.expense.total.length == 0 ? true : false;
  

  // if (this.errors.id_provider == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.voucher_type == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.serie == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  
  let me = this;
  Swal.fire({
    title: "Esta seguro de modificar el egreso ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.EditExpense(me);
    }
  });

}
</script>
