<template>
  <div>
    <CRow>
      <CCol col>
        <CCard>
          <CCardHeader>
            <strong> Modulo de POS - Nuevo</strong>
          </CCardHeader>
          <CCardBody>
            
            <b-row  v-if="type_process == 1">
               <b-col class="bg-light border" md="7">
                 <BlockProduct />
               </b-col>
               <b-col class="bg-white " md="5">
                 <BlockDetailPOS/>
               </b-col>
            </b-row>

            <b-row v-if="type_process == 2">
               <b-col class="bg-light border" md="6">
                 <BlockDetailPayment />
               </b-col>
               <b-col class="bg-white " md="6">
                 <BlockPayment />
               </b-col>
            </b-row>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>

    


    <ModalClients />
    <ModalCurrencyConverter />
    <LoadingComponent :is-visible="isLoading"/>
    <!-- <Keypress key-event="keyup" :key-code="113" @success="modalProducts" />
    <Keypress key-event="keyup" :key-code="115" @success="Validate" /> -->
  </div>
</template>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

.text-total{
  font-size: 14px;
  font-weight: 500;
}
</style>>

</style>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";

const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
var moment = require("moment");
import EventBus from '@/assets/js/EventBus';
import { mapState,mapActions } from "vuex";

// components
import ModalClients from './../components/ModalClient'
import LoadingComponent from './../pages/Loading'
import ModalCurrencyConverter from './../components/ModalCurrencyConverter'
import BlockProduct from './components/BlockProduct'
import BlockDetailPOS from './components/BlockDetailPOS'

import BlockDetailPayment from './components/BlockDetailPayment'
import BlockPayment from './components/BlockPayment'
export default {
  name: "UsuarioAdd",
  components:{
      vSelect,  
      ModalClients,
      BlockProduct,
      BlockDetailPOS,
      BlockDetailPayment,
      BlockPayment,
      LoadingComponent,
      ModalCurrencyConverter,
      Keypress: () => import('vue-keypress'),
  },
  data() {
    return {
      quantity_vouchers:[
        {value:0, text:'No imprimir'},
        {value:1, text:'Imp. 1 Comprobante'},
        {value:2, text:'Imp. 2 Comprobantes'},
      ],
      print_voucher: 1,
      isLoading: false,
      module: 'POS',
      role: 2,
      
      type_process :1,

    
    };
  },
  mounted() {
    EventBus.$on('ChangeTypeProcess', (type_process) => {
      this.type_process = type_process;
    });
    this.GetInformationSale();
    this.mLoadResetPOSDetail();
  },
  methods: {
    GetInformationSale,
    ...mapActions('SalePOS',['mLoadResetPOSDetail','mLoadIgvPercentage']),
  },

  computed: {
    ...mapState("SalePOS",["pos_detail","mclient"]),
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    user: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user;
    },
    type_print: function () {
      let business = window.localStorage.getItem("business");
      business = JSON.parse(JSON.parse(je.decrypt(business)));
      return business.type_print;
    },
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};


function GetInformationSale() {
  
  let me = this;
  let url = this.url_base + "get-information-sale";
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        // me.igv_percentage = response.data.result.igv_percentage;
        me.mLoadIgvPercentage(response.data.result.igv_percentage);
      } 
    })
}




</script>
