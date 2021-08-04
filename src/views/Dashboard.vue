<template>
  <div>







    <b-row>
      <b-col md="10">
        <b-row>
          <b-col md="3">
            <b-row></b-row>
            <b-link class="text-decoration-none"  :to="{ path: '/cliente/listar' }" append>
            <b-card no-body class="text-center bg-primary height-card">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Clientes <br> Registrados</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.clients}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
          <b-col md="3">
            <b-link class="text-decoration-none"  :to="{ path: '/producto/listar' }" append>
            <b-card no-body class="text-center bg-primary height-card">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Productos <br> Registrados</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.products}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
          <b-col md="3">
            <b-link class="text-decoration-none"  @click="modalProductsDeliveredShow">
            <b-card no-body class="text-center bg-primary height-card">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Productos por <br> Entregar</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.products_delivered}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
          <b-col md="3">
            <b-link class="text-decoration-none"  @click="modalObserverVouchersShow">
            <b-card no-body class="text-center bg-primary height-card">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Cantidad de <br> Comprobantes <br> Observados</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.voucher_observer}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>


          <b-col md="12" class="bg-white" >
              <div class="small">
                <ChartSales  />
              </div>
          </b-col>
        </b-row>
      </b-col>

      <b-col md="2">
        <b-row>
          <b-col md="12" class="mb-1">
            <div class="w-100 text-center">Accesos Directos</div>
          </b-col>
          <b-col md="12">
            <b-link class="text-decoration-none" :disabled="!Permission('SaleAdd')" :to="{ path: '/venta/nuevo' }" append>
            <CWidgetIcon header="Nueva" text="Venta" color="gradient-primary">
              <img src="@/assets/icons/ventas.png" class="" />
            </CWidgetIcon>
            </b-link>
          </b-col>
          <b-col md="12">
            <b-link class="text-decoration-none" :disabled="!Permission('CashAdd')" :to="{ path: '/caja/nuevo' }" append>
            <CWidgetIcon header="Nueva" text="Caja" color="gradient-success">
              <img src="@/assets/icons/caja.png" class="" />
            </CWidgetIcon>
            </b-link>
          </b-col>
          <b-col md="12">
            <b-link class="text-decoration-none" @click="modalCPEShow" >
            <CWidgetIcon header="CPE" text="Sunat" color="gradient-info">
              <img src="@/assets/icons/cpe.png" class="" />
            </CWidgetIcon>
            </b-link>
          </b-col>
        </b-row>
      </b-col>
    </b-row>



    <ModalCPESunat />
    <ModalObserverVouchers />
    <ModalProductsDelivered />
  </div>
</template>
<style scoped>
  .height-card {
    height: 4.5rem;
  }
</style>
<script>

const axios = require("axios").default;
const je = require("json-encrypt");
import { mapState } from "vuex";

import EventBus from '@/assets/js/EventBus';
import ModalCPESunat from './components/ModalCPESunat'
import ModalObserverVouchers from './components/ModalObserverVouchers'
import ModalProductsDelivered from './components/ModalProductsDelivered'
import ChartSales from './components/ChartSales'

export default {
  name: 'Dashboard',

  components: {
   ModalCPESunat,
   ModalObserverVouchers,
   ModalProductsDelivered,
  ChartSales,
  },
  data () {
    return {
      number_home :{
        products_delivered:0,
        voucher_observer:0,
        products:0,
        clients:0,
      },
      name :'',
     
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
        me.number_home.products = response.data.products;
        me.number_home.clients = response.data.clients;
        me.name = 'Rosmery'
        EventBus.$emit('DataChartSale',response.data.data_chart);
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
