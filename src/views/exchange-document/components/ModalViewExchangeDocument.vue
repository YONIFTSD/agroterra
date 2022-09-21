<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modal_exchange_document" class="w-100" title="DETALLE DE CANJE DE DOCUMENTOS">
      <b-form id="Form" autocomplete="off">
              <b-row>

                <b-col md="10">
                  <b-form-group>
                    <label>Proveedor: </label>
                    <b-form-input type="text" :value="exchange_document.provider" disabled></b-form-input>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Moneda:">
                    <b-form-input type="text" v-model="exchange_document.coin" disabled></b-form-input>
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
                          <th width="25%" class="text-center">Comprobante</th>
                          <th width="10%" class="text-center">Moneda</th>
                          <th width="10%" class="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, it) in exchange_document.account_pay" :key="it">
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                            <td class="align-middle text-center">{{ item.expiration_date }}</td>
                            <td class="align-middle text-center">{{ CodeInvoice(item.type_invoice) + " "+ item.serie+ " - "+ item.number }}</td>
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
                          <th width="15%" class="text-center">Fecha Venc.</th>
                          <th width="15%" class="text-center">N° de Letra</th>
                          <th width="10%" class="text-center">Moneda</th>
                          <th width="10%" class="text-center">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="(item, it) in exchange_document.bill_exchange" :key="it">
                            <td class="align-middle text-center">{{ it + 1 }}</td>
                            <td class="align-middle text-center">{{ item.letter_number }}</td>
                            <td class="align-middle text-center">{{ item.broadcast_date }}</td>
                            <td class="align-middle text-center">{{ item.expiration_date }}</td>
                            <td class="align-middle text-center">{{ item.coin }}</td>
                            <td class="align-middle text-right">{{ item.total }}</td>
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
        modal_exchange_document:false,
        module: 'ExchangeDocument',
        id_exchange_document :'',
        role: 5,
        exchange_document: {
            id_exchange_document:'',
            id_provider:'',
            id_establishment:'',
            id_user:'',
            broadcast_date:'',
            references:'',
            coin:'',
            total:'',
            state:1,
            bill_exchange:[],
            account_pay:[],
        },
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalViewExchangeDocumentShow', (id_exchange_document) => {
      this.modal_exchange_document = true;
      this.id_exchange_document = id_exchange_document;
      this.ViewExchangeDocument();
    });

  },
  methods: {
      ViewExchangeDocument,
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
function ViewExchangeDocument() {
  let me = this;
  let url = this.url_base + "exchange-document/view/" + this.id_exchange_document;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,  module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
          me.exchange_document.id_exchange_document = response.data.result.exchange_document.id_exchange_document;
          me.exchange_document.id_provider = response.data.result.exchange_document.id_provider;
          me.exchange_document.id_user = response.data.result.exchange_document.id_user;
          me.exchange_document.provider = response.data.result.exchange_document.name+' - '+response.data.result.exchange_document.document_number;
          me.exchange_document.broadcast_date = response.data.result.exchange_document.broadcast_date;
          me.exchange_document.references = response.data.result.exchange_document.references;
          me.exchange_document.coin = response.data.result.exchange_document.coin;
          me.exchange_document.total = response.data.result.exchange_document.total;
          me.exchange_document.number = response.data.result.exchange_document.number;
          me.exchange_document.state = response.data.result.exchange_document.state;

          me.exchange_document.bill_exchange = response.data.result.bill_exchange;
          me.exchange_document.account_pay = response.data.result.account_pay;
      } else {
        Swal.fire("Sistema", "A Ocurrido un error", "error");
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

</script>
