<template>
  <div>
    <b-modal size="xl" class="modal-size" hide-footer v-model="modal_products_delivered" title="VENTAS POR ENTREGAR">
      <b-row>
      

        <b-col sm="12" md="8"></b-col>
        <b-col sm="12" md="4">
          <b-input-group>
            <b-form-input type="search" placeholder="Buscar" v-model="search" class="form-control"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="ListProductsDelivered">
                <b-icon icon="search"></b-icon
              ></b-button>
            </b-input-group-append>
          </b-input-group>
        </b-col>

        <b-col md="12">
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
                  <tr >
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date  }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                    <td class="text-left"> {{ item.client_name + ' - '+item.client_document_number  }}</td>
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
                      <b-button type="button" @click="ConfirmSaleDelivered(item.id_sale)" variant="primary" size="sm"><i class="fas fa-exchange-alt"></i></b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
          </div>
        </b-col>

        <b-col md="8">
          <b-pagination v-model="currentPage" v-on:input="ListProductsDelivered"  :total-rows="rows"  :per-page="perPage"  align="center"></b-pagination>
        </b-col>
        <b-col md="4 text-center">
          <p>Pagina Actual: {{ currentPage }}</p>
        </b-col>
           


      </b-row>
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
import { mapState } from "vuex";
import EventBus from "@/assets/js/EventBus";
var moment = require("moment");
import CodeToName from "@/assets/js/CodeToName";
import LoadingComponent from './../pages/Loading'
export default {
  name: "ModalClient",
    components:{
      LoadingComponent,
  },
  data() {
    return {
      isLoading: false,
      modal_products_delivered: false,
      perPage: 10,
      currentPage: 1,
      rows: 0,
      search:'',
      sales: [],
    };
  },
  created (){
  
  },
  mounted () {
    EventBus.$on('ModalProductsDeliveredShow', () => {
      this.modal_products_delivered = true;
      this.ListProductsDelivered();
    });
  },
  methods: {
    ListProductsDelivered,
    CodeInvoice,
    ConfirmSaleDelivered,
    SaleDelivered,
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    id_establishment: function () {
      let id_establishment = window.localStorage.getItem("id_establishment");
      id_establishment = JSON.parse(je.decrypt(id_establishment));
      return id_establishment;
    },
  },
};
function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}

function ListProductsDelivered() {
      this.isLoading = true;
      let search = this.search == "" ? "all" : this.search;
      let url = this.url_base + "home/list-products-delivered/"+this.id_establishment+"/"+search+"?page=" + this.currentPage;
      let me = this;
      axios({
          method: "GET",
          url: url,
      }).then(function (response) {
          if (response.data.status == 200) {
            me.rows = response.data.result.total;
            me.sales = response.data.result.data;
          }
          me.isLoading = false; 
      })
      this.isLoading = false;
}

function ConfirmSaleDelivered(id_sale) {
  Swal.fire({
    title: "Esta seguro de entregar los productos ?",
    text: "No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, Estoy de acuerdo!",
  }).then((result) => {
    if (result.value) {
      this.SaleDelivered(id_sale);
    }
  });
}

function SaleDelivered(id_sale) {
  this.isLoading = true;
  let url = this.url_base + "home/sale-delivered/"+id_sale;
  let me = this;
  axios({
      method: "GET",
      url: url,
  }).then(function (response) {
      if (response.data.status == 200) {
        for (let index = 0; index < me.sales.length; index++) {
          if (me.sales[index].id_sale == id_sale) {
            me.sales.splice(index, 1);
            break;
          }
        }
        Swal.fire({ icon: 'success', text:'El venta fue entregada exitosamente', timer: 3000,})
      }else{
        Swal.fire({ icon: 'error', text: response.data.message, timer: 3000,})
      }
      me.isLoading = false; 
  })
  // this.isLoading = false;
}

</script>
