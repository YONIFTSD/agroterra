<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modal_account_pay" class="w-100" title="Cuentas por Cobrar">
      <b-row>
        <b-col md="12">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%"  class="text-center align-middle">#</th>
                  <th width="10%"  class="text-center align-middle">Fecha <br> Emisión</th>
                  <th width="10%"  class="text-center align-middle">Fecha <br> Venc.</th>
                  <th width="20%"  class="text-center align-middle">Comprobante</th>
                  <th width="8%"  class="text-center align-middle">Moneda</th>
                  <th width="10%"  class="text-center align-middle">Total</th>
                  <th width="10%"  class="text-center align-middle">Saldo</th>
                  <th width="15%"  class="text-center align-middle">Importe</th>
                  <th width="8%"  class="text-center align-middle">Acciones</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in account_pays" :key="it">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-center">{{ item.broadcast_date }}</td>
                  <td class="text-center">{{ item.expiration_date }}</td>
                  <td class="text-center">{{ item.type_invoice + ' - '+ item.serie + ' - '+ item.number }}</td>
                  <td class="text-center">{{ item.coin }}</td>
                  <td class="text-right">{{ item.total }}</td>
                  <td class="text-right">{{ item.balance }}</td>
                  <td class="text-center">
                    <input type="number" step="any" :value="item.balance" :ref="'mAmount'+item.id_account_pay" class="form-control text-right">
                  </td>
                  <td class="text-center">
                      <button type="button" @click="AddAccountPay(item.id_account_pay)" class="btn btn-info">
                        <i class="fas fa-plus-square"></i>
                      </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>
<style>


</style>


<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
// import Notifications from 'vue-notification/dist/ssr.js';


export default {
  name: "ModalsProduct",
  data() {
    return {
        modal_account_pay:false,
        module:'ExchangeDocument',
        role:0,
        id_provider: '',
        coin: '',
        account_pays: [],
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalAccountPayShow', (data) => {
      this.modal_account_pay = true;
      this.id_provider = data.id_provider;
      this.coin = data.coin;
      this.role = data.role;
      this.ListAccountPay();
    });

  },
  methods: {
      ListAccountPay,
      AddAccountPay,
      ...mapActions('ExchangeDocument',['mLoadAddAccountPay']),
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function AddAccountPay(id_account_pay) {
  
    let total = this.$refs['mAmount'+id_account_pay][0]['value'];
    let me = this;
    let url = this.url_base + "account-pay/view/" + id_account_pay;
    axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module,role: this.role,},
    })
    .then(function (response) {
      if (response.data.status == 200) {
        if (parseFloat(total) <= parseFloat(response.data.result.balance)) {
          let account = {
            id_account_pay: response.data.result.id_account_pay,
            broadcast_date: response.data.result.broadcast_date,
            expiration_date: response.data.result.expiration_date,
            type_invoice: response.data.result.type_invoice,
            serie: response.data.result.serie,
            number: response.data.result.number,
            coin: response.data.result.coin,
            total: parseFloat(total).toFixed(2),
          }
          me.mLoadAddAccountPay(account);
        }else{
            Swal.fire({ icon: 'error', text: 'El monto ingresado excede al saldo', timer: 3000,})
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
      // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });

   
}

//Buscar productos
function ListAccountPay() {
  let me = this;
  let url = this.url_base + "account-pay/list-by-provider/"+this.id_establishment +"/"+this.id_provider+"/"+this.coin;
  axios({
    method: "GET",
    url: url,
    headers: {token: me.token, module: me.module, role: me.role,},
    
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.account_pays = response.data.result;
      } else {
        me.account_pays = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}
</script>
