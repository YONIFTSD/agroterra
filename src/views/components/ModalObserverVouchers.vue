<template>
  <div>
    <b-modal size="xl" class="modal-size" hide-footer v-model="modal_observer_vouchers" title="COMPROBANTES OBSERVADOS">
     
      <b-tabs content-class="mt-3">
        <b-tab title="Ventas" active>
          <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="9%" class="text-center">Fecha</th>
                    <th width="15%" class="text-center">Comprobante</th>
                    <th width="35%" class="text-center">Cliente</th>
                    <th width="5%" class="text-center">Moneda</th>
                    <th width="8%" class="text-center">Total</th>
                    <th width="8%" class="text-center">Estado</th>
                    <th width="8%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in sales" :key="it">
                  <tr v-b-popover.hover.top="item.sunat_message" :title="'CPE SUNAT ' + CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number">
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date  }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                    <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                    <td class="text-right"> {{ item.coin  }}</td>
                    <td class="text-right"> {{ item.total  }}</td>
                    <td class="text-center">
                          <b-badge v-if="item.state == 0" variant="danger">XML</b-badge>
                          <b-badge v-if="item.state == 1" variant="warning">Girado</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Canjeado</b-badge>
                          <b-badge v-if="item.state == 3" variant="info">Emitido</b-badge>
                          <b-badge v-if="item.state == 4" variant="success">Aceptado</b-badge>
                          <b-badge v-if="item.state == 5" variant="danger">Rechazado</b-badge>
                          <b-badge v-if="item.state == 6" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-button type="button" @click="SendXMLSale(item.id_sale)" variant="primary" size="sm"><i class="fas fa-file-import"></i></b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-1">
              <b-col md="8">
                <b-pagination v-model="currentPage_sale" v-on:input="ListObservedSale"  :total-rows="rows_sale"  :per-page="perPage_sale"  align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage_sale }}</p>
              </b-col>
            </b-row>
        </b-tab>
        <b-tab title="Ventas Canjeadas">
          <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="9%" class="text-center">Fecha</th>
                    <th width="15%" class="text-center">Comprobante</th>
                    <th width="35%" class="text-center">Cliente</th>
                    <th width="5%" class="text-center">Moneda</th>
                    <th width="8%" class="text-center">Total</th>
                    <th width="8%" class="text-center">Estado</th>
                    <th width="8%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in redeemed_sales" :key="it">
                  <tr v-b-popover.hover.top="item.sunat_message" :title="'CPE SUNAT ' + CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number">
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date  }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                    <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                    <td class="text-right"> {{ item.coin  }}</td>
                    <td class="text-right"> {{ item.total  }}</td>
                    <td class="text-center">
                          <b-badge v-if="item.state == 0" variant="danger">XML</b-badge>
                          <b-badge v-if="item.state == 1" variant="warning">Girado</b-badge>
                          <b-badge v-if="item.state == 2" variant="success">Canjeado</b-badge>
                          <b-badge v-if="item.state == 3" variant="info">Emitido</b-badge>
                          <b-badge v-if="item.state == 4" variant="success">Aceptado</b-badge>
                          <b-badge v-if="item.state == 5" variant="danger">Rechazado</b-badge>
                          <b-badge v-if="item.state == 6" variant="danger">Anulado</b-badge>
                    </td>
                    <td class="text-center">
                      <b-button type="button" @click="SendXMLRedeemedSale(item.id_redeemed_sale)" variant="primary" size="sm"><i class="fas fa-file-import"></i></b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-1">
              <b-col md="8">
                <b-pagination v-model="currentPage_redeemed_sale" v-on:input="ListObservedRedeemedSale"  :total-rows="rows_redeemed_sale"  :per-page="perPage_redeemed_sale"  align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage_redeemed_sale }}</p>
              </b-col>
            </b-row>
        </b-tab>
        <b-tab title="Ventas - Bajas">
              <div class="table-responsive mt-3 height-table">
                <table class="table table-hover table-bordered">
                  <thead>
                    <tr>
                      <th width="5%" class="text-center">#</th>
                      <th width="9%" class="text-center">Fecha</th>
                      <th width="10%" class="text-center">Comprobante</th>
                      <th width="35%" class="text-center">Cliente</th>
                      <th width="20%" class="text-center">Doc. de Refencia</th>
                      <th width="8%" class="text-center">Estado</th>
                      <th width="8%" class="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody v-for="(item, it) in sales_low" :key="it">
                    <tr v-b-popover.hover.top="item.sunat_message" :title="'CPE SUNAT ' + item.code + ' '+item.serie + '-'+item.sequence">
                      <td class="text-center">{{ it + 1 }}</td>
                      <td class="text-center"> {{ item.low_date  }}</td>
                      <td class="text-center"> {{ item.code + " "+item.serie+"-"+item.sequence  }}</td>
                      <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                      <td class="text-left"> {{ CodeInvoice(item.sale_type_invoice) + ' '+item.sale_serie + '-'+item.sale_number }}</td>
                      <td class="text-center">
                            <b-badge v-if="item.state == 1" variant="danger">XML</b-badge>
                            <b-badge v-if="item.state == 2" variant="info">Emitido</b-badge>
                            <b-badge v-if="item.state == 3" variant="success">Aceptado</b-badge>
                            <b-badge v-if="item.state == 4" variant="danger">Rechazado</b-badge>
                      </td>
                      <td class="text-center">
                        <b-button type="button" @click="SendXMLSaleLow(item.id_sale_low)" variant="primary" size="sm"><i class="fas fa-file-import"></i></b-button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

            <b-row class="mt-1">
              <b-col md="8">
                <b-pagination v-model="currentPage_sale_low" v-on:input="ListObservedSaleLow"  :total-rows="rows_sale_low"  :per-page="perPage_sale_low"  align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage_sale_low }}</p>
              </b-col>
            </b-row>
        </b-tab>
      </b-tabs>

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
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
import ApiQuery from "@/assets/js/APIQuery";
import LoadingComponent from './../pages/Loading'
export default {
  name: "ModalClient",
  components:{
    vSelect,
    LoadingComponent,
  },
  data() {
    return {
      modal_observer_vouchers: false,
      isLoading:false,
      perPage_sale: 10,
      currentPage_sale: 1,
      rows_sale: 0,
      sales: [],

      perPage_redeemed_sale: 10,
      currentPage_redeemed_sale: 1,
      rows_redeemed_sale: 0,
      redeemed_sales: [],

      perPage_sale_low: 10,
      currentPage_sale_low: 1,
      rows_sale_low: 0,
      sales_low: [],

      

      cpe:{
        message:'',
        state:'',
      }

 
    };
  },
  created (){
 
  },
  mounted () {
    EventBus.$on('ModalObserverVouchersShow', () => {
      this.isLoading = true;
      this.modal_observer_vouchers = true;
      this.ListObservedSale();
      this.ListObservedRedeemedSale();
      this.ListObservedSaleLow();

    });
  },
  methods: {
    ListObservedSale,
    ListObservedRedeemedSale,
    ListObservedSaleLow,
     CodeInvoice,
     SendXMLSale,
     SendXMLRedeemedSale,
     SendXMLSaleLow
     
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    }
  },
};

function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ListObservedSale() {
      let url = this.url_base + "home/list-observed-sale?page=" + this.currentPage_sale;;
      let me = this;
      axios({
          method: "GET",
          url: url,
      }).then(function (response) {
            if (response.data.status == 200) {
            me.rows_sale = response.data.result.total;
            me.sales = response.data.result.data;
          } 
      })
}
function ListObservedRedeemedSale() {
      let url = this.url_base + "home/list-observed-redeemed-sale?page=" + this.currentPage_sale;;
      let me = this;
      axios({
          method: "GET",
          url: url,
      }).then(function (response) {
            if (response.data.status == 200) {
            me.rows_redeemed_sale = response.data.result.total;
            me.redeemed_sales = response.data.result.data;
          } 
      })
}

function ListObservedSaleLow() {
      let url = this.url_base + "home/list-observed-sale-low?page=" + this.currentPage_sale_low;;
      let me = this;
      axios({
          method: "GET",
          url: url,
      }).then(function (response) {
            if (response.data.status == 200) {
            me.rows_sale_low = response.data.result.total;
            me.sales_low = response.data.result.data;
          } 
      })
      this.isLoading = false;
}

function SendXMLSale(id_sale) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "home/send-xml-sale/" + id_sale;
  axios({
    method: "get",
    url: url,
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.sales.length; i++) {
          if (me.sales[i].id_sale == id_sale) {
            me.sales[i].state = response.data.result.state;
            break;
          }
        }
        if (response.data.result.state == 4) {
          for (var i = 0; i < me.sales.length; i++) {
            if (me.sales[i].id_sale == id_sale) {
              me.sales.splice(i, 1);
              break;
            }
          }
          Swal.fire({ icon: 'success', text: 'El comprobante, ha sido aceptado', timer: 3000,})
        }else if(response.data.result.state == 5){
          Swal.fire({ icon: 'error', text:'El comprobante, fue rechazado', timer: 3000,})
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}


function SendXMLRedeemedSale(id_redeemed_sale) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "home/send-xml-redeemed-sale/" + id_redeemed_sale;
  axios({
    method: "get",
    url: url,
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.redeemed_sales.length; i++) {
          if (me.redeemed_sales[i].id_sale == id_sale) {
            me.redeemed_sales[i].state = response.data.result.state;
            break;
          }
        }
        if (response.data.result.state == 4) {
          for (var i = 0; i < me.redeemed_sales.length; i++) {
            if (me.redeemed_sales[i].id_sale == id_sale) {
              me.redeemed_sales.splice(i, 1);
              break;
            }
          }
          Swal.fire({ icon: 'success', text: 'El comprobante, ha sido aceptado', timer: 3000,})
        }else if(response.data.result.state == 5){
          Swal.fire({ icon: 'error', text:'El comprobante, fue rechazado', timer: 3000,})
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}

function SendXMLSaleLow(id_sale_low) {
  this.isLoading = true;
  let me = this;
  let url = this.url_base + "home/send-xml-sale-low/" + id_sale_low;
  axios({
    method: "get",
    url: url,
  })
    .then(function (response) {
      if (response.data.status == 200) {
        for (var i = 0; i < me.sales_low.length; i++) {
          if (me.sales_low[i].id_sale_low == id_sale_low) {
            me.sales_low[i].state = response.data.result.state;
            break;
          }
        }
        if (response.data.result.state == 3) {
          for (var i = 0; i < me.sales_low.length; i++) {
            if (me.sales_low[i].id_sale_low == id_sale_low) {
              me.sales_low.splice(i, 1);
              break;
            }
          }
          Swal.fire({ icon: 'success', text: 'El comprobante, ha sido aceptado', timer: 3000,})
        }else if(response.data.result.state == 4){
          Swal.fire({ icon: 'error', text: response.data.result.sunat_message, timer: 3000,})
        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
      me.isLoading = false;
    })
}
</script>
