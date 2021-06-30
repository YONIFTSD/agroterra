<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modal_cpe_sunat" class="w-100" title="CPE SUNAT">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar Pedido :">
            <b-form-input type="text"></b-form-input>
          </b-form-group>
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
        modal_cpe_sunat:false,
        module:'Sale',
        role:0,
        search_order:'',
        orders: [],
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalOrderShow', (role) => {
      this.modal_cpe_sunat = true;
      this.role = role;
      this.SearchOrders();
      // this.ListWarehouse();
    });
    
  },
  methods: {
      SearchOrders,
      AddOrder,
      ...mapActions('Sale',['mLoadAddSaleDetail','mLoadAddLinkages']),
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

function AddOrder(id_order) {

    let me = this;
    let url = this.url_base + "order/view/" + id_order;

    axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module,role: this.role},
    })
    .then(function (response) {
      if (response.data.status == 200) {
        ///agregar pedido
        let order = {
          module:'Order',
          id_module:response.data.result.order.id_order,
          concept:'Pedido',
          date:response.data.result.order.date,
          reference: 'NP - ' + response.data.result.order.number_of_order,
        };
        me.mLoadAddLinkages(order);

        let invoice_information = {
          client : {id: response.data.result.order.id_client,full_name: response.data.result.order.client_name + ' - '+ response.data.result.order.client_document_number},
          type_invoice : response.data.result.order.type_invoice,
        }

        EventBus.$emit('InvoiceInformation', invoice_information);
        
        ///agregar detalle pedido
        let order_detail = response.data.result.order_detail;
        for (let index = 0; index < order_detail.length; index++) {
          const element = order_detail[index];
          let detail = {
            id_product: element.id_product,
            code: element.code,
            name: element.name,
            unit_measure: element.unit_measure,
            igv: element.igv,
            existence_type: element.existence_type,
            quantity: parseFloat(element.quantity),
            unit_price: parseFloat(element.unit_price).toFixed(2),
            total_price: parseFloat(element.total_price).toFixed(2),
          }
          
          me.mLoadAddSaleDetail(detail);

        }
        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })

   
}
//Buscar productos
function SearchOrders() {
  let me = this;
  let search = this.search_order == "" ? "all" : this.search_order;
  let url = this.url_base + "order/search-order/"+ search;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module,role: this.role},
  })
  .then(function (response) {
      if (response.data.status == 200) {
        me.orders = response.data.result;
      }
  })
}

</script>
