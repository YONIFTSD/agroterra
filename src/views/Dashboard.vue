<template>
  <div>

    <CRow>
       <CCol col="12" sm="6" lg="2">
        <b-link class="text-decoration-none" :disabled="!Permission('SaleAdd')" :to="{ path: '/venta/nuevo' }" append>
        <CWidgetIcon header="Nueva" text="Venta" color="gradient-primary">
          <img src="@/assets/icons/ventas.png" class="" />
        </CWidgetIcon>
        </b-link>
      </CCol>

      <CCol col="12" sm="6" lg="2">
        <b-link class="text-decoration-none" :disabled="!Permission('CashAdd')" :to="{ path: '/caja/nuevo' }" append>
        <CWidgetIcon header="Nueva" text="Caja" color="gradient-success">
          <img src="@/assets/icons/caja.png" class="" />
        </CWidgetIcon>
        </b-link>
      </CCol>

      <CCol col="12" sm="6" lg="2">
        <b-link class="text-decoration-none" @click="modalProductsDeliveredShow">
        <CWidgetIcon header="Ventas " text="Ventas " color="gradient-dark">
          <img src="@/assets/icons/entregar.png" class="" />
        </CWidgetIcon>
        </b-link>
      </CCol>

       <CCol col="12" sm="6" lg="2" >
        <b-link class="text-decoration-none bg-danger" @click="modalObserverVouchersShow">
        <CWidgetIcon header="Compr. Obs." text="Compr. Obs." color="gradient-warning">
          <img src="@/assets/icons/facturas.png" class="" />
        </CWidgetIcon>
        </b-link>
      </CCol>

      <CCol col="12" sm="6" lg="2">
        <b-link class="text-decoration-none" @click="modalCPEShow" >
        <CWidgetIcon header="CPE" text="Sunat" color="gradient-info">
          <img src="@/assets/icons/cpe.png" class="" />
        </CWidgetIcon>
        </b-link>
      </CCol>

    </CRow>

    <ModalCPESunat />
    <ModalObserverVouchers />
    <ModalProductsDelivered />
  </div>
</template>

<script>

const axios = require("axios").default;
const je = require("json-encrypt");
import { mapState } from "vuex";

import EventBus from '@/assets/js/EventBus';
import ModalCPESunat from './components/ModalCPESunat'
import ModalObserverVouchers from './components/ModalObserverVouchers'
import ModalProductsDelivered from './components/ModalProductsDelivered'




export default {
  name: 'Dashboard',
  components: {
   ModalCPESunat,
   ModalObserverVouchers,
   ModalProductsDelivered
  },
  data () {
    return {
      number_home :{
        products_delivered:0,
        voucher_observer:0,
      }
    }
  },
   mounted () {
    EventBus.$on('RefreshNumberHome', () => {
      this.NumberHome();
    });
    this.NumberHome();
  },
  methods: {
   modalCPEShow,
   modalObserverVouchersShow,
   modalProductsDeliveredShow,
   Permission,
   NumberHome,
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
}

function modalCPEShow() {
  EventBus.$emit('ModalCPESunatShow');
}
function modalObserverVouchersShow() {
  EventBus.$emit('ModalObserverVouchersShow');
}
function modalProductsDeliveredShow() {
  EventBus.$emit('ModalProductsDeliveredShow');
}

function NumberHome() {
  let me = this;
  let url = this.url_base + "home/total-home/"+this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module,role: this.role},
  })
  .then(function (response) {
      if (response.data.status == 200) {
        me.number_home.products_delivered = response.data.products_delivered;
        me.number_home.voucher_observer = response.data.voucher_observer;
      }
  })
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
