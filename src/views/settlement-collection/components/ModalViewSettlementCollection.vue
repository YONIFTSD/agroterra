<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modal_settlement_collection" class="w-100" title="DETALLE LIQUIDACION DE COBRO">
      <b-form id="Form" autocomplete="off">
              <b-row>

                <b-col md="10">
                  <b-form-group>
                    <label>Cliente: </label>
                    <b-form-input type="text" :value="settlement_collection.client" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-input type="text" v-model="settlement_collection.coin" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <div class="col-md-12">
                  <div class="table-responsive">
                    <table  class="table  table-bordered table-hover table-lg mt-lg mb-0">
                      <thead class="">
                        <tr>
                          <th class="text-center" colspan="6">Cuentas por cobrar</th>
                        </tr>
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
                        <tr v-for="(item, it) in settlement_collection.account_receivable" :key="it">
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
                          <th class="text-center" colspan="7">Registro de Cobros</th>
                        </tr>
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
                        <tr v-for="(item, it) in settlement_collection.charges" :key="it">
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

    <LoadingComponent :is-visible="isLoading"/>
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
import LoadingComponent from './../../pages/Loading'

export default {
  name: "ModalsProduct",
  components:{
      LoadingComponent,
  },
  data() {
    return {
        isLoading: false,
        modal_settlement_collection:false,
        module: 'SettlementCollection',
        id_settlement_collection :'',
        role: 5,
        settlement_collection: {
            id_settlement_collection:'',
            id_provider:'',
            id_user:'',
            id_establishment:'',
            broadcast_date:moment(new Date()).local().format("YYYY-MM-DD"),
            references:'',
            coin:'PEN',
            total: (0).toFixed(2),
            state:1,
            account_receivable : [],
            charges : [],
        },
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalViewSettlementCollectionShow', (id_settlement_collection) => {
      this.modal_settlement_collection = true;
      this.id_settlement_collection = id_settlement_collection;
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
  let url = this.url_base + "settlement-collection/view/" + this.id_settlement_collection;
  me.isLoading = true;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.settlement_collection.id_settlement_collection = response.data.result.settlement_collection.id_settlement_collection;
          me.settlement_collection.id_client = response.data.result.settlement_collection.id_client;
          me.settlement_collection.id_user = response.data.result.settlement_collection.id_user;
          me.settlement_collection.client = response.data.result.settlement_collection.name+' - '+response.data.result.settlement_collection.document_number;
          me.settlement_collection.broadcast_date = response.data.result.settlement_collection.broadcast_date;
          me.settlement_collection.references = response.data.result.settlement_collection.references;
          me.settlement_collection.coin = response.data.result.settlement_collection.coin;
          me.settlement_collection.total = response.data.result.settlement_collection.total;
          me.settlement_collection.number = response.data.result.settlement_collection.number;
          me.settlement_collection.state = response.data.result.settlement_collection.state;

          me.settlement_collection.charges = response.data.result.charges;
          me.settlement_collection.account_receivable = response.data.result.account_receivable;
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

</script>
