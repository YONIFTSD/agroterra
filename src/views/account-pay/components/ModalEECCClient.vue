<template>
  <div>
    <b-modal size="lg" hide-footer v-model="modalEECC" class="w-100" title="Cuentas por cobrar por cliente">
     
      <b-col md="12">
        <div class="table-responsive mt-3">
          <table class="table table-hover table-bordered">
            <thead>
              <tr>
                <th width="5%" class="text-center">#</th>
                <th width="65%" class="text-center">Cliente</th>
                <th width="15%" class="text-center">Deuda en <br> Soles</th>
                <th width="15%" class="text-center">Deuda en <br> Dolares</th>
              </tr>
            </thead>
            <tbody v-for="(item, it) in accoun_receivable_pending" :key="it">
              <tr>
                <td class="text-center">{{ it + 1 }}</td>
                <td class="text-left">{{ item.client }}</td>
                <td class="text-right">{{ item.balance_pen }}</td>
                <td class="text-right">{{ item.balance_usd }}</td>
        
          
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>

      <b-row class="mt-4">
        <b-col md="8">
          <b-pagination v-model="currentPage_pending" v-on:input="ListAccountReceivablePending" :total-rows="rows_pending" :per-page="perPage_pending" align="center"></b-pagination>
        </b-col>
        <b-col md="4 text-center">
          <p>Pagina Actual: {{ currentPage_pending }}</p>
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
import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");
export default {
  name: "ModalsProduct",
  data() {
    return {
        modalEECC:false,
        module:'AccountReceivable',
        role:3,

        isLoading:false,
  
        perPage_pending: 15,
        currentPage_pending: 1,
        rows_pending: 0,
        search_pending: "",
        accoun_receivable_pending: [],
        clients_pending: [],
        client_pending:null,
  
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalEECCShow', () => {
      this.modalEECC = true;
      this.ListAccountReceivablePending();
    });
    
  },
  methods: {
      ListAccountReceivablePending,
  },
  computed: {
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
    id_establishment: function () {
      let establishment = window.localStorage.getItem("id_establishment");
      establishment = JSON.parse(je.decrypt(establishment));
      return establishment;
    }
  },
};

function ListAccountReceivablePending() {
  let me = this;
  let url = this.url_base + "account-receivable/list-eecc/"+ this.id_establishment +"?page=" + this.currentPage_pending;
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows_pending = response.data.result.data.total;
        me.accoun_receivable_pending = response.data.result.result;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}
</script>
