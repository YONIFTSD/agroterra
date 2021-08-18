<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo Registro de Cobros - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            <b-form id="Form" @submit.prevent="Validate">
              <b-row>
               
                
                <b-col md="6">
                  <b-form-group>
                    <label>Cliente: <span @click="modalClients" class="text-info link">Nuevo</span></label>
                    <v-select placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
                    <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Medio de Pago :">
                    <b-form-select v-model="charge.payment_method" :options="payment_method"></b-form-select>
                    <small v-if="errors.payment_method" class="form-text text-danger" >Seleccione un metodo</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Documento :">
                    <b-form-input v-model="charge.document"></b-form-input>
                    <small v-if="errors.document" class="form-text text-danger" >Ingrese un documento</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Fecha Emision:">
                    <b-form-input type="date" ref="broadcast_date" v-model="charge.broadcast_date" ></b-form-input>
                    <small v-if="errors.broadcast_date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="4">
                  <b-form-group label="Banco :">
                    <b-form-select  v-model="charge.bank" :options="bank"></b-form-select>
                    <small v-if="errors.bank" class="form-text text-danger">Ingrese un banco</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Nro Operación :">
                    <b-form-input type="text"  v-model="charge.number_op"></b-form-input>
                    <small v-if="errors.number_op"  class="form-text text-danger" >Ingrese una nro de operación</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-select ref="coin" v-model="charge.coin" :options="coins" ></b-form-select>
                    <small v-if="errors.coin" class="form-text text-danger">Seleccione una moneda</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="T. Cambio:">
                    <b-form-input type="number" class="text-right" step="any" v-model="charge.exchange_rate" ></b-form-input>
                    <small v-if="errors.exchange_rate" class="form-text text-danger">Seleccione un tipo de cambio</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="total:">
                    <b-form-input type="number" class="text-right" step="any" v-model="charge.total" ></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Caja:">
                    <b-form-select type="number" v-model="charge.cash" :options="cashs" ></b-form-select>
                  </b-form-group>
                </b-col>

                <b-col md="10">
                  <b-form-group label="Observación:">
                    <b-form-input v-model="charge.observation" ></b-form-input>
                  </b-form-group>
                </b-col>

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

export default {
  name: "UsuarioAdd",
  components:{
      vSelect,
      ModalClients,
      Keypress: () => import('vue-keypress'),
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      module: 'Charge',
      role: 2,
      charge: {
          id_charge:'',
          id_client:'',
          id_user:'',
          id_sale:0,
          id_establishment:0,
          broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
          payment_method:'008',
          document:'',
          coin:'PEN',
          exchange_rate:'1.00',
          bank:'',
          cash:'0',
          number_op:'',
          observation:'',
          total: (0).toFixed(2),
          applied:(0).toFixed(2),
          balance:(0).toFixed(2),
          state:1,
      },
      payment_method: [
          {value :"001", text :'DEPÓSITO EN CUENTA'},
          {value :"003", text :'TRANSFERENCIA DE FONDOS'},
          {value :"004", text :'ORDEN DE PAGO'},
          {value :"005", text :'TARJETA DE DÉBITO'},
          {value :"006", text :'TARJETA DE CRÉDITO'},
          {value :"007", text :'CHEQUES CON LA CLÁUSULA DE "NO NEGOCIABLE"'},
          {value :"008", text :'EFECTIVO'},
          {value :"009", text :'EFECTIVO, EN LOS DEMÁS CASOS'},
          {value :"101", text :'TRANSFERENCIAS - COMERCIO EXTERIOR'},
          {value :"102", text :'CHEQUES BANCARIOS  - COMERCIO EXTERIOR'},
      ],
      clients: [],
      client:null,
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      bank:[
        {value :'', text:'Ninguno'},
        {value :'001', text:'BANCO CENTRAL DE RESERVA DEL PERU'},
        {value :'002', text:'BANCO DE CREDITO DEL PERU'},
        {value :'003', text:'BANCO INTERNACIONAL DEL PERU'},
        {value :'005', text:'BANCO LATINO'},
        {value :'007', text:'BANCO CITIBANK N.A.'},
        {value :'008', text:'BANCO STANDARD CHARTERED'},
        {value :'009', text:'BCO.SCOTIABANK PERU SAA (ANTES WIESE SUDAMERIS)'},
        {value :'011', text:'BANCO CONTINENTAL'},
        {value :'018', text:'BANCO DE LA NACION'},
        {value :'023', text:'BANCO COMERCIO'},
        {value :'026', text:'BANCO NORBANK'},
        {value :'037', text:'BANCO DEL PROGRESO'},
        {value :'038', text:'BANCO INTERAMERICANO DE FINANZAS'},
        {value :'041', text:'BANCO SUDAMERICANO'},
        {value :'043', text:'BANCO DEL TRABAJO'},
        {value :'044', text:'BANCO SOLVENTA'},
        {value :'045', text:'BANCO SERBANCO'},
        {value :'046', text:'BANK BOSTON N.A. SUCURSAL DEL PERU'},
        {value :'047', text:'ORION CORPORACION DE CREDITO'},
        {value :'048', text:'BANCO NUEVO PAIS'},
        {value :'049', text:'MIBANCO'},
        {value :'050', text:'BANQUE NATIONALE DE PARIS - ANDES S.A.'},
        {value :'053', text:'BANCO HSBC'},
        {value :'056', text:'BANCO SANTANDER PERU S.A.'},
        {value :'071', text:'CORPORACION FINANCIERA DE DESARROLLO - COFIDE'},
        {value :'083', text:'SOLUCION - FINANCIERA DE CREDITO DEL PERU'},
        {value :'086', text:'FINANDAEWOO S.A.'},
        {value :'087', text:'FINANCIERA C.M.R.'},
        {value :'088', text:'VOLVO FINANCE PERU'},
        {value :'089', text:'FINANCIERA CORDILLERA S.A.'},
        {value :'091', text:'GENERALI PERU CIA. SEGUROS'},
        {value :'092', text:'LA VITALICIA'},
        {value :'093', text:'REASEGURADORA PERUANA'},
        {value :'094', text:'SEGUROS LA FENIX PERUANA'},
        {value :'095', text:'SECREX  CIA. SEGUROS'},
        {value :'099', text:'OTROS'},
      ],
      cashs:[
        {value:0,text:'No'},
        {value:1,text:'Si'},
      ],
      //errors
      errors: {
        id_client: false,
        payment_method: false,
        bank: false,
        number_op: false,
        broadcast_date: false,
        coin: false,
        exchange_rate:false,
        total: false,
      },
      validate: false,
    };
  },
  mounted() {
 
  },
  methods: {
    SearchClients,
    modalClients,
    AddCharge,
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


function AddCharge(me) {

  me.charge.id_user = me.user.id_user;
  me.charge.id_establishment = me.id_establishment;
  me.charge.id_client = me.client.id;
  let url = me.url_base + "charge/add";
  let data = me.charge;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json",token: me.token, module: me.module, role: 2,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
          me.charge.id_charge = '';
          me.charge.id_client = '';
          me.charge.id_user = '';
          me.charge.broadcast_date = moment(new Date()).local().format("YYYY-MM-DD");
          me.charge.payment_method = '008';
          me.charge.document = '';
          me.charge.coin = 'PEN';
          me.charge.exchange_rate = '1.00';
          me.charge.id_cash = '';
          me.charge.bank = '';
          me.charge.number_op = '';
          me.charge.observation = '';
          me.charge.total =  (0).toFixed(2);
          me.charge.applied = (0).toFixed(2);
          me.charge.balance = (0).toFixed(2);
          me.charge.state = 1;
          me.client = null;
          Swal.fire({ icon: 'success', text: 'Se ha registrado el cobro', timer: 3000,})
      } else if(response.data.status == 400) {
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }

      me.isLoading = false;
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      me.isLoading = false;
    });
}

function Validate() {

 
  this.errors.id_client = this.client == null ? true : false;
  this.errors.payment_method = this.charge.payment_method.length == 0 ? true : false;
  if (this.charge.payment_method != "008") {
    this.errors.number_op = this.charge.number_op.length  == 0 ? true : false;
    this.errors.bank = this.charge.bank.length == 0 ? true : false;
  }
  this.errors.broadcast_date = this.charge.broadcast_date.length == 0 ? true : false;
  this.errors.coin = this.charge.coin.length == 0 ? true : false;
  this.errors.exchange_rate = this.charge.exchange_rate.length == 0 ? true : false;
  this.errors.total = parseFloat(this.charge.total) <= 0 ? true : false;
  
  if (this.errors.id_client == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.payment_method == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.number_op == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.bank == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.broadcast_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.exchange_rate == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

 let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar el cobro ?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      AddCharge(me);
    }
  })


}
</script>
