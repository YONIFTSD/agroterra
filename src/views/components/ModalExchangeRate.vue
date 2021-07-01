<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modalExchangeRate" class="" title="TIPO DE CAMBIO">
     
          <b-form id="Form" @submit.prevent="Validate">
              <b-row>
         
                <b-col md="2">
                  <b-form-group label="Moneda :">
                    <b-form-select v-model="exchange_rate.coin" :options="coin"></b-form-select>
                  </b-form-group>
                  <small v-if="errors.coin"  class="form-text text-danger" >Seleccione una moneda</small>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Fecha :">
                    <b-form-input type="date" v-model="exchange_rate.date"></b-form-input>
                    <small v-if="errors.date" class="form-text text-danger">Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Compra :">
                    <b-form-input class="text-right" type="number" step="any" v-model="exchange_rate.shopping"></b-form-input>
                    <small v-if="errors.shopping" class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <b-col md="3">
                  <b-form-group label="Venta :">
                    <b-form-input class="text-right" type="number" step="any" v-model="exchange_rate.sale"></b-form-input>
                    <small v-if="errors.sale" class="form-text text-danger">Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <b-col md="1">
                  <b-form-group label=".">
                    <b-button type="submit" v-if="exchange_rate.id_exchange_rate == 0" class="form-control text-white" variant="primary"><i class="fas fa-save"></i></b-button>
                    <b-button type="submit" v-if="exchange_rate.id_exchange_rate != 0" class="form-control text-white" variant="primary"><i class="far fa-save"></i></b-button>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-form>

            <b-row>
              <b-col md="9">
                <b-row>
                  <b-col md="12">
                    <small>  Tipo de Cambio Actual de Sunat :</small> <br>
                    <small for="">Dia {{exchange_rate_sunat.day}}, Compra : {{exchange_rate_sunat.shopping}}, Venta : {{exchange_rate_sunat.sale}}</small>
                  </b-col>
                </b-row>
              </b-col>
              <b-col md="3">
                <b-input-group>
                  <b-form-input v-model="search" class="form-control" ></b-form-input>
                  <b-input-group-append> <b-button variant="info" @click="ListExchangeRate"> <b-icon icon="search"></b-icon></b-button> </b-input-group-append>
                </b-input-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3 table-height">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="20%" class="text-center">Fecha</th>
                    <th width="15%" class="text-center">Moneda</th>
                    <th width="25%" class="text-center">Compra</th>
                    <th width="25%" class="text-center">Venta</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in exchange_rates" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.date }}</td>
                    <td class="text-center"> {{ item.coin  }}</td>
                    <td class="text-right"> {{ item.shopping }}</td>
                    <td class="text-right"> {{ item.sale }} </td>
                    <td class="text-center">
                      <b-dropdown bloque size="sm" text="Acciones" right>
                        <b-dropdown-item v-if="Permission('ExchangeRateView')" @click="ViewExchangeRate(item.id_exchange_rate)" >Ver</b-dropdown-item >
                        <b-dropdown-item v-if="Permission('ExchangeRateDelete')"  @click="ConfirmDeleteExchangeRate(item.id_exchange_rate)" >Eliminar</b-dropdown-item >
                      </b-dropdown>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>


            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage"  v-on:input="ListExchangeRate" :total-rows="rows"  :per-page="perPage"  align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center"> <p>Pagina Actual: {{ currentPage }}</p></b-col>
            </b-row>

    </b-modal>
  </div>
</template>

<style scoped>
.table-height{
  min-height: 100px;;
}
</style>

<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
var moment = require("moment");
import ApiQuery from "@/assets/js/APIQuery";

export default {
  name: "ProviderModal",
  components:{
    vSelect,
  },
  data() {
    return {
        modalExchangeRate: false,
        module: 'ExchangeRate',
        role: 1,
        search:'',
        perPage: 15,
        currentPage: 1,
        rows: 0,

        exchange_rate: {
          id_exchange_rate: 0,
          id_user: 0,
          coin: 'USD',
          date: moment(new Date()).local().format("YYYY-MM-DD"),
          shopping: 0,
          sale: 0,
          state: 1,
        },

        exchange_rates:[],

        coin:[
          {value: "PEN", text : "Soles"},
          {value: "USD", text : "Dolares"},
        ],

        exchange_rate_sunat:{
          day:'',
          shopping:'',
          sale:''
        },
      
        errors: {
          date: false,
          coin: false,
          shopping: false,
          sale: false,
        },
        validate: false,
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalExchangeRateShow', () => {
      this.modalExchangeRate = true;
      this.exchange_rate.id_user = 0;
      this.exchange_rate.coin = 'USD';
      this.exchange_rate.date = moment(new Date()).local().format("YYYY-MM-DD");
      this.exchange_rate.shopping = 0;
      this.exchange_rate.sale = 0;
      this.exchange_rate.state = 1;
    });
    this.GetExchangeRate();
    this.ListExchangeRate();
  },
  methods: {
    ListExchangeRate,
    Validate,
    SaveExchangeRate,
    Permission,
    ViewExchangeRate,
    ConfirmDeleteExchangeRate,
    DeleteExchangeRate,
    RefreshGetExchangeRateByDate,
    GetExchangeRate,
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


function GetExchangeRate() {
  let me = this;
  ApiQuery.ExchangeRate().then((data) => {
          if (data.status == 200) {
            me.exchange_rate_sunat.day = data.fecha;
            me.exchange_rate_sunat.shopping = data.compra;
            me.exchange_rate_sunat.sale = data.venta;
          }
  });
}


function ListExchangeRate() {

  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "exchange-rate/list/"+ search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { "Content-Type": "application/json", token: this.token, module: me.module, role: 1 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.exchange_rates = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function RefreshGetExchangeRateByDate() {
  EventBus.$emit('RefreshGetExchangeRateByDate');
}

function SaveExchangeRate(_this) {

  let me = _this;
  let url = '';
  if (me.exchange_rate.id_exchange_rate == 0) {
     url = me.url_base + "exchange-rate/add";
  } else {
     url = me.url_base + "exchange-rate/edit";
  }
  me.exchange_rate.id_user = me.user.id_user;
  let data = me.exchange_rate;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 1 },
  })
  .then(function (response) {
      if (response.data.status == 201) {

          me.exchange_rate.id_user = 0;
          me.exchange_rate.coin = 'USD';
          me.exchange_rate.date = moment(new Date()).local().format("YYYY-MM-DD");
          me.exchange_rate.shopping = 0;
          me.exchange_rate.sale = 0;
          me.exchange_rate.state = 1;
          Swal.fire({ icon: 'success', text: 'Se ha registrado el nuevo tipo de cambio', timer: 3000,})
          me.ListExchangeRate();
          me.RefreshGetExchangeRateByDate();
      } else if (response.data.status == 200) {
         me.exchange_rate.id_user = 0;
          me.exchange_rate.coin = 'USD';
          me.exchange_rate.date = moment(new Date()).local().format("YYYY-MM-DD");
          me.exchange_rate.shopping = 0;
          me.exchange_rate.sale = 0;
          me.exchange_rate.state = 1;
          Swal.fire({ icon: 'success', text: 'se ha modificado el tipo de cambio', timer: 3000,})
          me.ListExchangeRate();
          me.RefreshGetExchangeRateByDate();
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function Validate() {

   this.validate = false;

  this.errors.date = this.exchange_rate.date == 0 ? true : false;
  this.errors.coin = this.exchange_rate.coin == 0 ? true : false;
  this.errors.shopping = this.exchange_rate.shopping == 0 ? true : false;
  this.errors.sale = this.exchange_rate.sale == 0 ? true : false;

  if (this.errors.date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.shopping == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.sale == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  if (this.validate) {
    return false;
  }

  let me = this;
  let title = '';
  if (this.exchange_rate.id_exchange_rate == 0) {
    title = 'Esta seguro de guardar el tipo de cambio ?';
  } else {
    title = 'Esta seguro de modificar el tipo de cambio ?';
  }

  Swal.fire({
    title: title,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      SaveExchangeRate(me);
    }
  })

  
}


function ViewExchangeRate(id_exchange_rate) {
  let me = this;
  let url = me.url_base + "exchange-rate/view/"+id_exchange_rate;
  axios({
    method: "GET",
    url: url,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 3 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
          me.exchange_rate.id_exchange_rate = response.data.result.id_exchange_rate;
          me.exchange_rate.id_user = response.data.result.id_user;
          me.exchange_rate.coin = response.data.result.coin;
          me.exchange_rate.date = response.data.result.date;
          me.exchange_rate.shopping = response.data.result.shopping;
          me.exchange_rate.sale = response.data.result.sale;
          me.exchange_rate.state = response.data.result.state;
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function ConfirmDeleteExchangeRate(id_exchange_rate) {
    Swal.fire({
    title: "Esta seguro de eliminar el tipo de cambio ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.DeleteExchangeRate(id_exchange_rate);
    }
  });
}


function DeleteExchangeRate(id_exchange_rate) {
  let me = this;
  let url = me.url_base + "exchange-rate/delete/"+id_exchange_rate;
  axios({
    method: "delete",
    url: url,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 4 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
          for (var i = 0; i < me.exchange_rates.length; i++) {
          if (me.exchange_rates[i].id_exchange_rate == id_exchange_rate) {
              me.exchange_rates.splice(i, 1);
              break;
            }
          }
          me.RefreshGetExchangeRateByDate();
          Swal.fire({ icon: 'success', text: 'Se ha eliminado el tipo de cambio', timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function Permission(module_permission) {
  let user_permissions = window.localStorage.getItem("user_permissions");
  user_permissions = JSON.parse(JSON.parse(je.decrypt(user_permissions)));
  if (user_permissions.indexOf(module_permission) > -1) {
    return true;
  } else {
    return false;
  }
}
</script>
