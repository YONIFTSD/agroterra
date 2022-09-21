<template>
  <div>
    <b-modal size="xl" class="modal-size" hide-footer v-model="modal_products_delivered" title="PRODUCTOS EN NEGATIVO">
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
                    <th width="10%" class="text-center">Código</th>
                    <th width="55%" class="text-center">Nombre</th>
                    <th width="20%" class="text-center">Almacen</th>
                    <th width="10%" class="text-center">Stock</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in sales" :key="it">
                  <tr >
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.code  }}</td>
                    <td class="text-left"> {{ item.name + (item.presentation.length == 0 ? '': ' - '+item.presentation)  }}</td>
                    <td class="text-left"> {{ item.warehouse_name  }}</td>
                    <td class="text-right"> {{ item.quantity  }}</td>
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
