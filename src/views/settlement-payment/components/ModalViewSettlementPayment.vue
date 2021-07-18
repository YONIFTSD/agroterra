<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modal_settlement_payment" class="w-100" title="DETALLE DE CANJE DE DOCUMENTOS">
      <b-form id="Form">
              <b-row>

                <b-col md="10">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <b-form-input type="text" :value="settlement_payment.provider" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-input type="text" v-model="settlement_payment.coin" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <div class="col-md-12">
                  <div class="table-responsive">
                    <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                      <thead class="">
                        <tr>
                          <th width="5%" class="text-center">#</th>
                          <th width="20%" class="text-center">Fecha Emisión</th>
                          <th width="20%" class="text-center">Fecha Venc.</th>
                          <th width="25%" class="text-center">Documento</th>
                          <th width="10%" class="text-center">Moneda</th>
                          <th width="10%" class="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, it) in settlement_payment.account_pay" :key="it">
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                            <td class="align-middle text-center">{{ item.expiration_date }}</td>
                            <td class="align-middle text-center">{{ item.document }}</td>
                            <td class="align-middle text-center">{{ item.coin }}</td>
                            <td class="align-middle text-right">{{ item.total }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                </div>

                <div class="col-md-12 mt-3">
                  <div class="table-responsive">
                    <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                      <thead class="">
                        <tr>
                          <th width="5%" class="text-center">#</th>
                          <th width="15%" class="text-center">Fecha Emision</th>
                          <th width="15%" class="text-center">Documento</th>
                          <th width="10%" class="text-center">Moneda</th>
                          <th width="10%" class="text-center">Importe</th>
                          <th width="10%" class="text-center">T. C.</th>
                          <th width="10%" class="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, it) in settlement_payment.payments" :key="it">
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                            <td class="align-middle text-center">{{ item.document }}</td>
                            <td class="align-middle text-center">{{ item.coin }}</td>
                            <td class="align-middle text-right">{{ item.amount }}</td>
                            <td class="align-middle text-right">{{ item.exchange_rate }}</td>
                            <td class="align-middle text-right">{{ item.amount_final }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </b-row>
            </b-form>

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
import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");

export default {
  name: "ModalsProduct",
  data() {
    return {
        modal_settlement_payment:false,
        module: 'ExchangeDocument',
        id_settlement_payment :'',
        role: 5,
        settlement_payment: {
            id_settlement_payment:'',
            id_provider:'',
            id_user:'',
            id_establishment:'',
            broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
            references:'',
            coin:'PEN',
            total: (0).toFixed(2),
            state:1,
            account_pay : [],
            payments : [],
        },
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalViewSettlementPaymentShow', (id_settlement_payment) => {
      this.modal_settlement_payment = true;
      this.id_settlement_payment = id_settlement_payment;
      this.ViewSettlementPayment();
    });

  },
  methods: {
      ViewSettlementPayment,
      CodeInvoice,
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

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
//ver usuario
function ViewSettlementPayment() {
  let me = this;
  let url = this.url_base + "settlement-payment/view/" + this.id_settlement_payment;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.settlement_payment.id_settlement_payment = response.data.result.settlement_payment.id_settlement_payment;
          me.settlement_payment.id_provider = response.data.result.settlement_payment.id_provider;
          me.settlement_payment.id_user = response.data.result.settlement_payment.id_user;
          me.settlement_payment.provider = response.data.result.settlement_payment.name+' - '+response.data.result.settlement_payment.document_number;
          me.settlement_payment.broadcast_date = response.data.result.settlement_payment.broadcast_date;
          me.settlement_payment.references = response.data.result.settlement_payment.references;
          me.settlement_payment.coin = response.data.result.settlement_payment.coin;
          me.settlement_payment.total = response.data.result.settlement_payment.total;
          me.settlement_payment.number = response.data.result.settlement_payment.number;
          me.settlement_payment.state = response.data.result.settlement_payment.state;

          me.settlement_payment.payments = response.data.result.payments;
          me.settlement_payment.account_pay = response.data.result.account_pay;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

</script>
