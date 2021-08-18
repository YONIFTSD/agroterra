<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modalCurrecyConverter" class="" title="Conversor de Divisas">

        <b-tabs content-class="mt-3">
          <b-tab title="Convertidor" active>
            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="60%" class="text-center">Moneda</th>
                    <th width="10%" class="text-center">Cambio</th>
                    <th width="15%" class="text-center">Monto</th>
                    <th width="15%" class="text-center">Resultado</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in currency_converter_active" :key="it">
                  <tr>
                    <td class="text-left">{{item.name}}</td>
                    <td class="text-center">{{item.exchange_rate}}</td>
                    <td class="text-center">
                      <b-form-input class="text-right" @change="CalculateCurrence(it)" v-model="item.amount" type="number" step="any"></b-form-input>
                    </td>
                    <td class="text-center">
                       <b-form-input class="text-right"  disabled v-model="item.total" type="number" step="any"></b-form-input>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </b-tab>
          <b-tab title="Nuevo">
               <b-form id="Form" @submit.prevent="Validate">
                  <b-row>
                

                    <b-col md="3">
                      <b-form-group label="Fecha :">
                        <b-form-input type="date" v-model="currency_converter.date"></b-form-input>
                        <small v-if="errors.date" class="form-text text-danger">Seleccione una fecha</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Dólares :">
                        <b-form-input class="text-right" type="number" step="any" v-model="currency_converter.usd"></b-form-input>
                        <small v-if="errors.usd" class="form-text text-danger">Ingrese un monto</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="3">
                      <b-form-group label="Pesos Chilenos :">
                        <b-form-input class="text-right" type="number" step="any" v-model="currency_converter.clp"></b-form-input>
                        <small v-if="errors.clp" class="form-text text-danger">Ingrese un monto</small>
                      </b-form-group>
                    </b-col>

                    <b-col md="2">
                      <b-form-group label="Estado :">
                        <b-form-select v-model="currency_converter.state" :options="states"></b-form-select>
                      </b-form-group>
                    </b-col>

                    <b-col md="1">
                      <b-form-group label=".">
                        <b-button type="submit" v-if="currency_converter.id_currency_converter == 0" class="form-control text-white" variant="primary"><i class="fas fa-save"></i></b-button>
                        <b-button type="submit" v-if="currency_converter.id_currency_converter != 0" class="form-control text-white" variant="primary"><i class="far fa-save"></i></b-button>
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
                      <b-input-group-append> <b-button variant="primary" @click="ListCurrencyConverter"> <b-icon icon="search"></b-icon></b-button> </b-input-group-append>
                    </b-input-group>
                  </b-col>
                </b-row>


                <div class="table-responsive mt-3 table-height">
                  <table class="table table-hover table-bordered">
                    <thead>
                      <tr>
                        <th width="5%" class="text-center">#</th>
                        <th width="25%" class="text-center">Fecha</th>
                        <th width="20%" class="text-center">USD</th>
                        <th width="20%" class="text-center">CLP</th>
                        <th width="20%" class="text-center">Estado</th>
                        <th width="10%" class="text-center">Acciones</th>
                      </tr>
                    </thead>
                    <tbody v-for="(item, it) in currency_converters" :key="it">
                      <tr>
                        <td class="text-center">{{ it + 1 }}</td>
                        <td class="text-center"> {{ item.date }}</td>
                        <td class="text-right"> {{ item.usd }}</td>
                        <td class="text-right"> {{ item.clp }} </td>
                        <td class="text-center">
                            <b-badge v-if="item.state == 1" variant="success">Activo</b-badge>
                            <b-badge v-if="item.state == 0" variant="warning">Inactivo</b-badge>
                        </td>
                        
                                
                        <td class="text-center">
                          <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('CurrencyConverterView')" @click="ViewCurrencyConverter(item.id_currency_converter)" >Ver</b-dropdown-item >
                            <b-dropdown-item v-if="Permission('CurrencyConverterDelete')"  @click="ConfirmDeleteCurrencyConverter(item.id_currency_converter)" >Eliminar</b-dropdown-item >
                          </b-dropdown>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>


                <b-row class="mt-4">
                  <b-col md="8">
                    <b-pagination v-model="currentPage"  v-on:input="ListCurrencyConverter" :total-rows="rows"  :per-page="perPage"  align="center"></b-pagination>
                  </b-col>
                  <b-col md="4 text-center"> <p>Pagina Actual: {{ currentPage }}</p></b-col>
                </b-row>

          </b-tab>
        </b-tabs>

         

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
        modalCurrecyConverter: false,
        module: 'CurrencyConverter',
        role: 1,
        search:'',
        perPage: 15,
        currentPage: 1,
        rows: 0,

        currency_converter_active : [],


        currency_converter: {
          id_currency_converter: 0,
          date: moment(new Date()).local().format("YYYY-MM-DD"),
          usd: parseFloat(0).toFixed(2),
          clp: parseFloat(0).toFixed(2),
          state: 1,
        },

        states : [
          {value:1, text:'Activo'},
          {value:0, text:'Inactivo'},
        ],
        currency_converters:[],

        exchange_rate_sunat:{
          day:'',
          shopping:'',
          sale:''
        },
      
        errors: {
          date: false,
          coin: false,
          usd: false,
          clp: false,
        },
        validate: false,
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalCurrecyConverterShow', () => {
      this.GetActiveCurrencyConverter();
      this.GetExchangeRate();
      this.ListCurrencyConverter();

      this.modalCurrecyConverter = true;
      this.currency_converter.date = moment(new Date()).local().format("YYYY-MM-DD");
      this.currency_converter.usd = parseFloat(0).toFixed(2),
      this.currency_converter.pen = parseFloat(0).toFixed(2),
      this.currency_converter.state = 1;
    });
    
  },
  methods: {
    ListCurrencyConverter,
    Validate,
    SaveCurrencyConverter,
    Permission,
    ViewCurrencyConverter,
    ConfirmDeleteCurrencyConverter,
    DeleteCurrencyConverter,
    GetActiveCurrencyConverter,
    GetExchangeRate,
    CalculateCurrence,
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


function ListCurrencyConverter() {

  let search = this.search == "" ? "all" : this.search;
  let me = this;
  let url = this.url_base + "currency-converter/list/"+ search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: { "Content-Type": "application/json", token: this.token, module: me.module, role: 1 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.currency_converters = response.data.result.data;
        
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function GetActiveCurrencyConverter() {

  let me = this;
  let url = me.url_base + "get-currency-converter-active";
  axios({
    method: "GET",
    url: url,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 3 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
        me.currency_converter_active = response.data.result;
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });

}

function SaveCurrencyConverter(me) {

  let url = '';
  if (me.currency_converter.id_currency_converter == 0) {
     url = me.url_base + "currency-converter/add";
  } else {
     url = me.url_base + "currency-converter/edit";
  }
  me.currency_converter.id_user = me.user.id_user;
  let data = me.currency_converter;

  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 1 },
  })
  .then(function (response) {
      if (response.data.status == 201) {
          me.currency_converter.id_user = 0;
          me.currency_converter.coin = 'USD';
          me.currency_converter.date = moment(new Date()).local().format("YYYY-MM-DD");
          me.currency_converter.usd = 0;
          me.currency_converter.clp = 0;
          me.currency_converter.state = 1;
          Swal.fire({ icon: 'success', text: 'Se ha registrado la divisa', timer: 3000,})
          me.ListCurrencyConverter();
          me.GetActiveCurrencyConverter();
      } else if (response.data.status == 200) {
         me.currency_converter.id_user = 0;
          me.currency_converter.coin = 'USD';
          me.currency_converter.date = moment(new Date()).local().format("YYYY-MM-DD");
          me.currency_converter.usd = 0;
          me.currency_converter.clp = 0;
          me.currency_converter.state = 1;
          Swal.fire({ icon: 'success', text: 'se ha modificado la divisa', timer: 3000,})
          me.ListCurrencyConverter();
          me.GetActiveCurrencyConverter();
      } else if (response.data.status == 401) {
         Swal.fire({ icon: 'error',text: "No cuenta con los permisos para realizar esta operación", timer: 3000,})
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

  this.errors.date = this.currency_converter.date == 0 ? true : false;
  this.errors.coin = this.currency_converter.coin == 0 ? true : false;
  this.errors.usd = this.currency_converter.usd == 0 ? true : false;
  this.errors.clp = this.currency_converter.clp == 0 ? true : false;

  if (this.errors.date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.usd == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.clp == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  if (this.validate) {
    return false;
  }

  let me = this;
  let title = '';
  if (this.currency_converter.id_currency_converter == 0) {
    title = 'Esta seguro de guardar la divisa ?';
  } else {
    title = 'Esta seguro de modificar la divisa ?';
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
      SaveCurrencyConverter(me);
    }
  })

  
}


function ViewCurrencyConverter(id_currency_converter) {
  let me = this;
  let url = me.url_base + "currency-converter/view/"+id_currency_converter;
  axios({
    method: "GET",
    url: url,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 3 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
          me.currency_converter.id_currency_converter = response.data.result.id_currency_converter;
          me.currency_converter.date = response.data.result.date;
          me.currency_converter.usd = response.data.result.usd;
          me.currency_converter.clp = response.data.result.clp;
          me.currency_converter.state = response.data.result.state;
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function ConfirmDeleteCurrencyConverter(id_currency_converter) {
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
      this.DeleteCurrencyConverter(id_currency_converter);
    }
  });
}


function DeleteCurrencyConverter(id_currency_converter) {
  let me = this;
  let url = me.url_base + "currency-converter/delete/"+id_currency_converter;
  axios({
    method: "delete",
    url: url,
    headers: { "Content-Type": "application/json", token: me.token, module: me.module, role: 4 },
  })
  .then(function (response) {
      if (response.data.status == 200) {
          for (var i = 0; i < me.currency_converters.length; i++) {
          if (me.currency_converters[i].id_currency_converter == id_currency_converter) {
              me.currency_converters.splice(i, 1);
              break;
            }
          }
          me.GetActiveCurrencyConverter();
          Swal.fire({ icon: 'success', text: 'Se ha eliminado el tipo de cambio', timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
  })
  .catch((error) => {
    Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
  });
}

function CalculateCurrence(index) {
  if (this.currency_converter_active[index].from == "USD") {
    this.currency_converter_active[index].amount = this.currency_converter_active[index].amount.length == 0 ? 0 :this.currency_converter_active[index].amount;
    if (this.currency_converter_active[index].to == "PEN") {
      let total = parseFloat(this.currency_converter_active[index].exchange_rate) * parseFloat(this.currency_converter_active[index].amount);
      this.currency_converter_active[index].amount = parseFloat(this.currency_converter_active[index].amount).toFixed(2);
      this.currency_converter_active[index].total = total.toFixed(2);
    }
  }
  if (this.currency_converter_active[index].from == "PEN") {
    this.currency_converter_active[index].amount = this.currency_converter_active[index].amount.length == 0 ? 0 :this.currency_converter_active[index].amount;
    if (this.currency_converter_active[index].to == "USD") {
      let total = parseFloat(this.currency_converter_active[index].amount) / parseFloat(this.currency_converter_active[index].exchange_rate);
      this.currency_converter_active[index].amount = parseFloat(this.currency_converter_active[index].amount).toFixed(2);
      this.currency_converter_active[index].total = total.toFixed(2);
    }
  }
  if (this.currency_converter_active[index].from == "CLP") {
    this.currency_converter_active[index].amount = this.currency_converter_active[index].amount.length == 0 ? 0 :this.currency_converter_active[index].amount;
    if (this.currency_converter_active[index].to == "PEN") {
      let total = parseFloat(this.currency_converter_active[index].amount) / parseFloat(this.currency_converter_active[index].exchange_rate);
      this.currency_converter_active[index].amount = parseFloat(this.currency_converter_active[index].amount).toFixed(2);
      this.currency_converter_active[index].total = total.toFixed(2);
    }
  }
  if (this.currency_converter_active[index].from == "PEN") {
    this.currency_converter_active[index].amount = this.currency_converter_active[index].amount.length == 0 ? 0 :this.currency_converter_active[index].amount;
    if (this.currency_converter_active[index].to == "CLP") {
      let total = parseFloat(this.currency_converter_active[index].exchange_rate) * parseFloat(this.currency_converter_active[index].amount);
      this.currency_converter_active[index].amount = parseFloat(this.currency_converter_active[index].amount).toFixed(2);
      this.currency_converter_active[index].total = total.toFixed(2);
    }
  }
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
