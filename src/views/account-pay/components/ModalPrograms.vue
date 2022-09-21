<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalPrograms" class="w-100" title="Programaciones">
     
      <b-form id="Form" autocomplete="off" @submit.prevent="Validate">
            <b-row>

                <b-col sm="12" md="2">
                  <b-form-group label="F. Vencimiento">
                    <b-form-input disabled class="text-center" type="date" v-model="program.expiration_date_account_pay"></b-form-input>
                  </b-form-group>
                </b-col>


                <b-col sm="12" md="2">
                  <b-form-group label="Saldo">
                    <b-form-input disabled class="text-right" v-model="program.balance"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Dias">
                    <b-form-input @change="ChangeDate" type="number" v-model="program.days"></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="F. Pago">
                    <b-form-input class="text-center" type="date" v-model="program.expiration_date"></b-form-input>
                    <small v-if="errors.expiration_date" class="form-text text-danger" >Seleccione una fecha</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label="Total">
                    <b-form-input @change="ChangeTotal" class="text-right"  type="number" step="any" v-model="program.total"></b-form-input>
                    <small v-if="errors.total" class="form-text text-danger" >Ingrese un monto</small>
                  </b-form-group>
                </b-col>

                <b-col sm="12" md="2">
                  <b-form-group label=".">
                    <b-button class="form-control" type="submit" variant="primary">GUARDAR</b-button>
                  </b-form-group>
                </b-col>


            </b-row>
          </b-form>


            <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th class="text-center" colspan="19">PROGRAMACIONES</th>
                  </tr>
                  <tr>
                    <th width="10%" class="text-center">F. Vcto</th>
                    <th width="10%" class="text-center">Moneda</th>
                    <th width="60%" class="text-center">Monto</th>
                    <th width="10%" class="text-center">Estado</th>
                    <th width="10%" class="text-center">Acc.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, it) in data_table" :key="it">
                    <td class="text-center">{{item.expiration_date}}</td>
                    <td class="text-center">{{item.coin}}</td>
                    <td class="text-right">{{item.total}}</td>
                    <td class="text-center">
                      <b-badge v-if="item.state == 1" variant="warning">Pendiente</b-badge>
                      <b-badge v-if="item.state == 2" variant="success">Cancelado</b-badge>
                    </td>
                    <td class="text-center">
                        <b-dropdown bloque size="sm" text="Acciones" right>
                            <b-dropdown-item v-if="Permission('AccountPayList') && item.state == 1" @click="ConfirmPay(item.id_account_pay_program)">Pagar</b-dropdown-item>
                            <b-dropdown-item v-if="Permission('AccountPayList')" @click="ConfirmDelete(item.id_account_pay_program)" >Eliminar</b-dropdown-item >
                        </b-dropdown>
                    </td>
                  </tr>

                  <tr>
                    <td class="text-right" colspan="2">Total</td>
                    <td class="text-right">{{total}}</td>
                    <td class="text-right"></td>
                    <td class="text-right"></td>
                  </tr>

                  
                </tbody>
               
              </table>
            </div>

      
    </b-modal>

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
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
import LoadingComponent from './../../pages/Loading'
var moment = require("moment");
export default {
  name: "ModalsProduct",
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      
      modalPrograms:false,
      isLoading: false,
      module: 'AccountPay',
      role:1,
      id_account_pay: '',
      program:{
        id_account_pay:'',
        id_account_pay_program:'',
        balance:'',
        expiration_date_account_pay:'',
        days:'1',
        expiration_date:moment(new Date()).local().format("YYYY-MM-DD"),
        coin:'',
        total:'0.00',
        state:'1',
      },

      total:'0.00',

      data_table: [],
      errors:{
        expiration_date:false,
        total:false,
      }

  
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProgramsShow', (id_account_pay) => {
      this.modalPrograms = true;
      this.id_account_pay = id_account_pay;
      this.ViewAccountPay();
      this.ListPrograms();
    });
    
  },
  methods: {
      // Report,
      ViewAccountPay,
      Validate,
      AddProgram,
      ChangeDate,
      ChangeTotal,
      ListPrograms,

      ConfirmPay,
      Pay,
      ConfirmDelete,
      Delete,

      Permission,
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

function ViewAccountPay() {
  let me = this;
  me.isLoading = true;
  let url = this.url_base + "account-pay/view/" + me.id_account_pay;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.program.id_account_pay = response.data.result.id_account_pay;
          me.program.balance = response.data.result.balance;
          me.program.coin = response.data.result.coin;
          me.program.expiration_date_account_pay = response.data.result.expiration_date;

          me.ChangeDate();
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

function ChangeDate() {
  this.program.days = this.program.days.length == 0 ? 1 :this.program.days;
  let days = parseFloat(this.program.days);
  this.program.expiration_date = moment(this.program.expiration_date_account_pay, "YYYY-MM-DD").add('days',parseInt(days)).local().format("YYYY-MM-DD");
}

function ChangeTotal() {
  this.program.total = this.program.total.length == 0 ? 0:this.program.total;
  this.program.total = parseFloat(this.program.total).toFixed(2);
}

function Validate() {

  this.errors.expiration_date = this.program.expiration_date.length == 0 ? true : false;
  this.errors.coin = this.program.coin.length == 0 ? true : false;
  this.errors.total = parseFloat(this.program.total) <= 0 ? true : false;
  
  if (this.errors.expiration_date == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.coin == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }
  if (this.errors.total == true) { this.validate = true; Swal.fire({ icon: 'warning', text: 'Verifique que campos necesarios esten llenados', timer: 2000,}); return false;}else{ this.validate = false; }

  let me = this;

  Swal.fire({
    title: 'Esta seguro de registrar la programación?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si, Estoy de Acuerdo!'
  }).then((result) => {
    if (result.isConfirmed) {
      me.AddProgram();
    }
  })
}

function AddProgram() {
  let me = this;
  let url = this.url_base + "account-pay-program/add";
  let data = me.program;
  me.isLoading = true;
  axios({
    method: "POST",
    url: url,
    data: data,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 201) {
       
        me.program.days = '1';
        me.program.expiration_date = moment(new Date()).local().format("YYYY-MM-DD");
        me.program.total = '0.00';
        me.program.state = '1';

        me.ChangeDate();
        me.ListPrograms();

        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
      me.isLoading = false;
    })
}

function ListPrograms() {
  let me = this;
  let url = this.url_base + "account-pay-program/list/"+ this.id_account_pay;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.total = 0;
        me.data_table = response.data.result;
        for (let index = 0; index < me.data_table.length; index++) {
          const element = me.data_table[index];
          me.total += parseFloat(element.total);
        }
        me.total = parseFloat(me.total).toFixed(2);
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ConfirmPay(id_account_pay_program) {
  Swal.fire({
    title: "Esta seguro de pagar la programación?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.Pay(id_account_pay_program);
    }
  });
}

function Pay(id_account_pay_program) {
  let me = this;
  let url = this.url_base + "account-pay-program/pay/" + id_account_pay_program;
  axios({
    method: "get",
    url: url,
    headers: {token: this.token, module: this.module,role: 4,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        const index = me.data_table.map(item => item.id_account_pay_program).indexOf(response.data.result.id_account_pay_program);
        me.data_table[index].state = response.data.result.state;
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      } else {
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ConfirmDelete(id_account_pay_program) {
  Swal.fire({
    title: "Esta seguro de pagar la programación?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.Delete(id_account_pay_program);
    }
  });
}

function Delete(id_account_pay_program) {
  let me = this;
  let url = this.url_base + "account-pay-program/delete/" + id_account_pay_program;
  axios({
    method: "delete",
    url: url,
    headers: {token: this.token, module: this.module,role: 4,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        const index = me.data_table.map(item => item.id_account_pay_program).indexOf(response.data.result.id_account_pay_program);
        me.data_table.splice(index, 1);
        Swal.fire({ icon: 'success', text: response.data.message, timer: 3000,})
      } else {
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
