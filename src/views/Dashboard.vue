<template>
  <div>

    <b-row>
      <b-col md="12">
        <b-row>
          <b-col md="2">
            <b-link class="text-decoration-none" @click="modalTransformsShow" append>
            <b-card no-body :class="'text-center ' + (number_home.transfers > 0 ? 'bg-warning':'bg-primary')+ ' height-card'">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Transferencias <br>Pendientes</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.transfers}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
      
          <b-col md="2">
            <b-row></b-row>
            <b-link class="text-decoration-none" @click="modalRequirementsShow" append>
            <b-card no-body :class="'text-center ' + (number_home.requirements > 0 ? 'bg-warning':'bg-primary')+ ' height-card'">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Requerimientos <br>Pendientes</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.requirements}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
          <b-col md="2">
            <b-link class="text-decoration-none" @click="modalOrders" append>
            <b-card no-body :class="'text-center ' + (number_home.orders > 0 ? 'bg-success':'bg-primary')+ ' height-card'">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Nuevos <br>Pedidos</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.orders}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
          <b-col md="2">
            <b-link class="text-decoration-none"  @click="modalProductsDeliveredShow">
            <b-card no-body :class="'text-center ' + (number_home.products_delivered > 0 ? 'bg-danger':'bg-primary')+ ' height-card'">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Productos en<br> Negativos</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.products_delivered}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>
          <b-col md="2">
            <b-link class="text-decoration-none"  @click="modalObserverVouchersShow">
            <b-card no-body :class="'text-center ' + (number_home.voucher_observer > 0 ? 'bg-danger':'bg-primary')+ ' height-card'">
              <b-row class="no-gutters h-100">
                <b-col md="8" class="text-light align-self-center text-center">
                  <span>Compr. <br> Observados</span>
                </b-col>
                <b-col md="4" class="text-light align-self-center text-center">
                  <span class="align-middle h3">{{number_home.voucher_observer}}</span>
                </b-col>
              </b-row>
            </b-card>
            </b-link>
          </b-col>


          
        </b-row>
      </b-col>
          <b-col md="10" class="bg-white" >
            <div class="w-100">
              <div class="w-100 text-center text-dark">Reporte de Venta Semana - Soles</div>
              <ChartSalesPEN/>
            </div>
            <hr>
            <!-- <div class="w-100 mt-2">
              <div class="w-100 text-center text-dark">Reporte de Venta Semana - Dólares</div>
              <ChartSalesUSD />
            </div> -->
            
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



     <b-modal size="lg" hide-footer v-model="modal_expiration" class="w-100" title="CORTE DE SERVICIO">
          <div class="table-responsive mt-3 mb-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="10%" class="text-center">#</th>
                    <th width="65%" class="text-center">Descripción</th>
                    <th width="15%" class="text-center">F. Venc.</th>
                    <th width="10%" class="text-center">Total</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in service_expiration" :key="it">
                  <tr>
                    <td class="text-center">{{ item.order }}</td>
                    <td class="text-left"> {{ item.description }}</td>
                    <td class="text-center"> {{ item.expiration_date }}</td>
                    
                    <td class="text-right"> {{ item.total }}</td>
 
                  </tr>
                </tbody>
              </table>
            </div>
 
    </b-modal>


    <!-- <b-modal size="lg">
          <line-chart :options="options" :chart-data="datacollection_usd"></line-chart>
    </b-modal> -->


    <ModalCPESunat />
    <ModalObserverVouchers />
    <ModalProductsDelivered />
    <ModalRequirements />
    <ModalTransfers />
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
import ModalRequirements from './components/ModalRequirements'
import ModalTransfers from './components/ModalTransfers'
import ChartSalesPEN from './components/ChartSalesPEN'
import ChartSalesUSD from './components/ChartSalesUSD'

import LineChart from './components/LineChart.js'
export default {
  name: 'Dashboard',

  components: {
   ModalCPESunat,
   ModalObserverVouchers,
   ModalProductsDelivered,
   ModalRequirements,
   ModalTransfers,
  ChartSalesPEN,
  ChartSalesUSD,
  LineChart,
  },
  data () {
    return {
      number_home :{
        products_delivered:0,
        voucher_observer:0,
        products:0,
        clients:0,
        requirements:0,
        transfers:0,
        orders:0,
      },
      name :'',

      datacollection_pen:{ labels: [], datasets: []},
      datacollection_usd:{ labels: [], datasets: []},
      options: {
        responsive: true,
        maintainAspectRatio: false
      },
      service_expiration : [],
      modal_expiration: false,
    }
  },
   mounted () {
    EventBus.$on('RefreshNumberHome', () => {
      this.NumberHome();
    });
    this.NumberHome();
    // this.fillData()
  },
  methods: {
    modalCPEShow,
    modalObserverVouchersShow,
    modalProductsDeliveredShow,
    modalRequirementsShow,
    modalTransformsShow,
    Permission,
    NumberHome,
    modalOrders,

    ServiceExpiration,
    fillData () {
        this.datacollection_pen = {
          labels: [this.getRandomInt(), this.getRandomInt()],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }, {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }
          ]
        }

        this.datacollection_usd = {
          labels: [this.getRandomInt(), this.getRandomInt()],
          datasets: [
            {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }, {
              label: 'Data One',
              backgroundColor: '#f87979',
              data: [this.getRandomInt(), this.getRandomInt()]
            }
          ]
        }
        
      },
      getRandomInt () {
        return Math.floor(Math.random() * (50 - 5 + 1)) + 5
      }
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
function modalRequirementsShow() {
  EventBus.$emit('ModalRequirementsShow');
}
function modalTransformsShow() {
  EventBus.$emit('ModalTransfersShow');
}
function modalOrders() {
  this.$router.push({
    name: "OrderList",
  });
  
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
        me.number_home.products_delivered = parseFloat(response.data.products_delivered);
        me.number_home.voucher_observer = parseFloat(response.data.voucher_observer);
        me.number_home.products = parseFloat(response.data.products);
        me.number_home.clients = parseFloat(response.data.clients);
        me.number_home.requirements = parseFloat(response.data.requirements);
        me.number_home.transfers = parseFloat(response.data.transfers);
        me.number_home.orders = parseFloat(response.data.orders);
        me.modal_expiration = response.data.expiration;
        me.service_expiration = response.data.service_expiration;

        let datasets_pen = [];
        for (let index = 0; index < response.data.data_chart.datasets_chart_pen.length; index++) {
          const element = response.data.data_chart.datasets_chart_pen[index];
          datasets_pen.push({
              label: element.name,
              backgroundColor: '#f87979',
              data: element.data_chart,
            });
        }

        me.datacollection_pen = {
          labels: response.data.data_chart.labels,
          datasets: datasets_pen
        }


        let datasets_usd = [];
        for (let index = 0; index < response.data.data_chart.datasets_chart_usd.length; index++) {
          const element = response.data.data_chart.datasets_chart_usd[index];
          datasets_usd.push({
              label: element.name,
              backgroundColor: '#000000',
              data: element.data_chart,
            });
        }
        me.datacollection_usd = {
          labels: response.data.data_chart.labels,
          datasets: datasets_usd
        }

        EventBus.$emit('DataChartSalePEN', response.data.data_chart);
        EventBus.$emit('DataChartSaleUSD', response.data.data_chart);
      }
  })
}

function ServiceExpiration() {

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
