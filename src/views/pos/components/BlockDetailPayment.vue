<template>
  <div >
    <b-row class="bg-white">
      <b-col md="12">
        <b-form-group>
          <label class="text-dark">Cliente: <span @click="modalClients" class="badge badge-secondary">Nuevo</span></label>
          <v-select @input="ChangeClient" placeholder="Seleccione un cliente" class="w-100" :filterable="false" label="full_name" v-model="client" @search="SearchClients" :options="clients"></v-select>
          <small v-if="errors.id_client" class="form-text text-danger" >Selccione un cliente</small>

        </b-form-group>
      </b-col>

      <b-col md="12" class="block-product" :style="size_pos">
        <div class="table-responsive">
          <table class="table table-hover">
            <tbody  v-for="(item, it) in pos_detail" :key="it" >
              <tr>
                <td width="5%" class="text-center">{{ it + 1}}</td>
                <td width="57%" class="text-lefet">{{item.code}} | {{item.name }}</td>
                <td width="7%" class="text-center">{{item.quantity}}</td>
                <td width="13%" class="text-center">{{item.unit_price}}</td>
                <td width="13%" class="text-right">{{item.total_price}}</td>
                <td width="5%" class="text-center">
                  <button type="button" @click="DeleteDetail(it)" class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>  
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </b-col>
    </b-row>

    
 
    
          <b-row class="border-top pt-2 border-bottom ">
            <div class="table-responsive">
              <table  class="table   table-hover table-lg mt-lg mb-0">
                <tbody>
                  <tr>
                      <td width="40%" class="align-middle text-right text-total">SUBTOTAL: {{ sale.coin == "PEN" ? "S/":"$"}}</td>
                      <td width="60%" class="align-middle text-right text-total pr-1">{{ total_pos.subtotal }}</td>
                  </tr>
                  <tr>
                      <td class="align-middle text-right text-total">IGV: {{ sale.coin == "PEN" ? "S/":"$"}}</td>
                      <td class="align-middle text-right text-total pr-1">{{ total_pos.igv }}</td>
                  </tr>
                  <tr>
                      <td class="align-middle text-right text-total">TOTAL: {{ sale.coin == "PEN" ? "S/":"$"}}</td>
                      <td class="align-middle text-right text-total pr-1">{{ total_pos.total }}</td>
                  </tr>
                  <tr>
                      <td colspan="2" class="align-middle text-left">{{ total_pos.number_to_letters }}</td>
                  </tr>
                  <tr>
                      <td colspan="2" class="align-middle text-center"><small  v-if="errors.total"  class="form-text text-danger">Ingrese un monto</small></td>
                  </tr>
                </tbody>
              </table>
            </div>
    </b-row>

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
.block-product {
	width: 100%;
	overflow-y: scroll;
}

.text-total{
  font-size: 14px;
  font-weight: 500;
}
</style>>
<script>
import vSelect from "vue-select";
import 'vue-select/dist/vue-select.css';
import "vue-select/src/scss/vue-select.scss";
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";

export default {
  name: "ModalsProduct",
  components:{
    vSelect,
  },

  data() {
    return {
      isLoading: false,
      module: 'POS',
      size_pos: '--size-pos: 370px',
      role: 2,
      coin:'PEN',
      coins:[
        {value: "PEN", text : "Soles"},
        {value: "USD", text : "Dolares"},
      ],
      clients: [],
      client:{id:1,full_name:'CLIENTES VARIOS - 00000000'},
      errors:{
        id_warehouse:false,
        coin:false,
      }
      

    };
  },
  mounted () {
    this.client = this.mclient;
    this.ViewEstablishment();
  },
  methods: {
    SearchClients,
    modalClients,
    UpdateDetail,
    DeleteDetail,
    ChangeClient,
    ViewEstablishment,
  
    ...mapActions('SalePOS',['mLoadEditPOSDetail','mLoadDeletePOSDetail','mLoadEditClient']),
      
  },
  computed: {
      ...mapState('SalePOS',['pos_detail','total_pos','mclient','sale']),
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
function ViewEstablishment() {
  let me = this;
  let url = me.url_base + "establishment/view/" + this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: { token: me.token, module: me.module, role: me.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let size = parseFloat(response.data.result.size_pos);
        me.size_pos = 'height: '+size+'px';
      }
    })
  
}
function SearchClients(search, loading) {
  
   let me = this;
    let url = this.url_base + "search-clients/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.clients = response.data;
            loading(false);
      })
    }
}
function ChangeClient() {
  this.mLoadEditClient(this.client);
}
function modalClients() {
  EventBus.$emit('ModalClientsShow');
}

function UpdateDetail(index) {
  this.mLoadEditPOSDetail(index);
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha modificado el producto ' + this.pos_detail[index].name+" - "+this.pos_detail[index].presentation, type: 'warn'})
}

function DeleteDetail(index) {
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha eliminado el producto ' + this.pos_detail[index].name+" - "+this.pos_detail[index].presentation, type: 'warn'})
  this.mLoadDeletePOSDetail(index);
  EventBus.$emit('TotalPaymentCash');
}

</script>
