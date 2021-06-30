<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalPurchaseExpenses" class="w-100" title="Productos">


      <b-row>
              <b-col sm="12" md="6">
                <b-form-group>
                  <label>Proveedor: </label>
                  <v-select @input="ListPurchaseExpenses" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="2">
                <b-form-group label="Desde :">
                  <b-form-input @change="ListPurchaseExpenses" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
                  <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
                </b-form-group>
              </b-col>

              <b-col sm="12" md="2">
                <b-form-group label="Hasta :">
                  <b-form-input @change="ListPurchaseExpenses" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
                  <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
                </b-form-group>
              </b-col>
              
              <b-col sm="6" md="2">
                <b-form-group label=".">
                  <b-input-group>
                  <b-form-input v-model="search" class="form-control"></b-form-input>
                  <b-input-group-append>
                    <b-button variant="primary" @click="ListPurchaseExpenses"><b-icon icon="search"></b-icon></b-button>
                  </b-input-group-append>
                </b-input-group>
                </b-form-group>
              </b-col>
            </b-row>

            <div class="table-responsive mt-3">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="5%" class="text-center">#</th>
                    <th width="8%" class="text-center">Fecha</th>
                    <th width="8%" class="text-center">Comprobante</th>
                    <th width="35%" class="text-center">Proveedor</th>
                    <th width="5%" class="text-center">Moneda</th>
                    <th width="7%" class="text-center">Tipo de Cambio</th>
                    <th width="7%" class="text-center">Subtotal</th>
                    <th width="7%" class="text-center">IGV</th>
                    <th width="7%" class="text-center">Total</th>
                    <th width="12%" class="text-center">Gasto en Soles</th>
                    <th width="5%" class="text-center"></th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date  }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice) + ' '+item.serie + '-'+item.number }}</td>
                    <td class="text-left"> {{ item.name + ' - '+item.document_number  }}</td>
                    <td class="text-center"> {{ item.coin  }}</td>
                    <td class="text-right"> {{ item.exchange_rate  }}</td>
                    <td class="text-right"> {{ item.subtotal  }}</td>
                    <td class="text-right"> {{ item.igv  }}</td>
                    <td class="text-right"> {{ item.total  }}</td>
                    <td class="text-center">
                    <input type="number" step="any" :value="AmountPEN(item.exchange_rate,item.total)" :ref="'mPETotal'+item.id_purchase_expenses" class="form-control text-right">
                  </td>
                    <td class="text-center">
                      <button type="button" @click="AddPurchaseExpenses(item.id_purchase_expenses)" class="btn btn-info">
                        <i class="fas fa-plus-square"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage"  v-on:input="ListPurchaseExpenses" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
              </b-col>
              <b-col md="4 text-center"><p>Pagina Actual: {{ currentPage }}</p></b-col>
            </b-row>

    </b-modal>
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
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
import CodeToName from "@/assets/js/CodeToName";
var moment = require("moment");

export default {
  name: "ModalsProduct",
  components:{
      vSelect,
  },
  data() {
    return {
        modalPurchaseExpenses: false,
        role: 0,
        module:'PurchaseExpenses',
        perPage: 15,
        currentPage: 1,
        rows: 0,
        data_table: [],
        

        id_provider:0,
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        from:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
        search:'',
        providers: [],
        provider:null,
        errors:{
          to:false,
          from:false,
        }
    };
  },
  mounted () {
    EventBus.$on('ModalPurchaseExpensesShow', (role) => {
      this.modalPurchaseExpenses = true;
      this.role = role;
      this.ListPurchaseExpenses();
    });
    
  },
  methods: {
      ListPurchaseExpenses,
      CodeInvoice,
      SearchProvider,
      AmountPEN,
      AddPurchaseExpenses,
      ...mapActions('Costing',['mLoadAddCostingExpenses']),
      
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


function AmountPEN(exchange_rate,total) {
  let total_pen = parseFloat(exchange_rate) * parseFloat(total);
  total_pen = total_pen.toFixed(2);
  return total_pen;
}

function SearchProvider(search, loading) {
  
    let me = this;
    let url = this.url_base + "search-providers/" + search;
    if (search !== "") {
      loading(true);
      axios({
        method: "GET",
        url: url,
      }).then(function (response) {
            me.providers = response.data.result;
            loading(false);
      })
    }
    
}


function CodeInvoice(code) {
  return CodeToName.CodeInvoice(code);
}
//listar usuario
function ListPurchaseExpenses() {
  this.errors.from = false;
  this.errors.to = false;

  let id_provider = this.provider == null ? 0 : this.provider.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "purchase-expenses/list/" + id_provider + "/" + this.from + "/" + this.to + "/" + this.id_establishment + "/" + search + "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {token: this.token,module: this.module,role: 1,},
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.total;
        me.data_table = response.data.result.data;
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}


function AddPurchaseExpenses(id_purchase_expenses) {
  
  let total = this.$refs['mPETotal'+id_purchase_expenses][0]['value'];

  let me = this;
  let url = this.url_base + "purchase-expenses/view/"+id_purchase_expenses;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module, role:this.role,},
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        
        let detail = {
          reason : 'Gastos',
          id_purchase_expenses : response.data.result.id_purchase_expenses,
          type_invoice : response.data.result.type_invoice,
          serie : response.data.result.serie,
          number : response.data.result.number,
          broadcast_date : response.data.result.broadcast_date,
          coin : response.data.result.coin,
          total : parseFloat(total).toFixed(2),
        }

        me.mLoadAddCostingExpenses(detail);
      } 
    })

    
}


</script>
