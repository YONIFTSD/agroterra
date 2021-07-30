<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalShopping" class="w-100" title="Compras">


      <b-row>
        <b-col sm="12" md="6">
          <b-form-group>
            <label>Proveedor: </label>
            <v-select @input="ListShopping" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
          </b-form-group>
        </b-col>

        <b-col sm="12" md="2">
          <b-form-group label="Desde :">
            <b-form-input @change="ListShopping" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
            <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
          </b-form-group>
        </b-col>

        <b-col sm="12" md="2">
          <b-form-group label="Hasta :">
            <b-form-input @change="ListShopping" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
            <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
          </b-form-group>
        </b-col>
        
        <b-col sm="6" md="2">
          <b-form-group label=".">
            <b-input-group>
            <b-form-input v-model="search" class="form-control"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="ListShopping"><b-icon icon="search"></b-icon></b-button>
            </b-input-group-append>
          </b-input-group>
          </b-form-group>
        </b-col>

      </b-row>

      <div class="table-responsive mt-3 height-table">
              <table class="table table-hover table-bordered">
                <thead>
                  <tr>
                    <th width="3%" class="text-center">#</th>
                    <th width="10%" class="text-center">Fecha</th>
                    <th width="15%" class="text-center">Comprobante</th>
                    <th width="60%" class="text-center">Razón Social</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="it">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.name + ' - '+item.document_number }}</td>
                    <td class="text-center">
                      <button type="button" @click="AddLinkages(item.id_shopping)" class="btn btn-info">
                        <i class="fas fa-plus-square"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage"  v-on:input="ListShopping"  :total-rows="rows"  :per-page="perPage" align="center" ></b-pagination>
              </b-col>
              <b-col md="4 text-center">
                <p>Pagina Actual: {{ currentPage }}</p>
              </b-col>
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
        modalShopping:false,
        module: 'Shopping',
        role: 0,
        perPage: 15,
        currentPage: 1,
        rows: 0,
        search: "",
        data_table: [],

        id_provider:0,
        to:moment(new Date()).local().format("YYYY-MM-DD"),
        from:moment().subtract(30, 'days').local().format("YYYY-MM-DD"),
        search: "",
        providers: [],
        provider:null,
        errors:{
          to:false,
          from:false,
        }
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalShoppingShow', (role) => {
      this.modalShopping = true;
      this.role = role;
      this.ListShopping();
    });
    
  },
  methods: {
      SearchProvider,
      CodeInvoice,
      ListShopping,
      AddLinkages,
      
      ...mapActions('CreditDebitNote',['mLoadAddLinkages']),
      ...mapActions('CreditDebitNote',['mLoadAddCreditDebitDetail']),
      ...mapActions('CreditDebitNote',['mLoadTotalCreditDebitDetail']),
      
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

function ListShopping() {
  
  this.errors.from = false;
  this.errors.to = false;

  let id_provider = this.provider == null ? 0 : this.provider.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "shopping/list/" + id_provider + "/" + this.from + "/" + this.to + "/"+this.id_establishment + "/" + search + "?page=" + this.currentPage;


  axios({
    method: "GET",
    url: url,
    headers: { token: this.token,module: this.module,role: 1,},
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

function AddLinkages(id_shopping) {
  
  let me = this;
  let url = this.url_base + "shopping/view/"+id_shopping;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role:this.role,},
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        
        let linkage = {
          module: 'Shopping',
          id_module : response.data.result.shopping.id_shopping,
          reference : me.CodeInvoice(response.data.result.shopping.invoice_type)+' '+response.data.result.shopping.serie+'-'+response.data.result.shopping.number,
          broadcast_date : response.data.result.shopping.broadcast_date,
        }
        
        me.mLoadAddLinkages(linkage);

        let shopping = {
          id_shopping:  response.data.result.shopping.id_shopping,
          id_provider:  response.data.result.shopping.id_provider,
          provider:  response.data.result.shopping.name + " - "+ response.data.result.shopping.document_number,
          coin:  response.data.result.shopping.coin,
          exchange_rate:  response.data.result.shopping.exchange_rate,

        }
        EventBus.$emit('InfoShopping',shopping);
        

        let shopping_detail = response.data.result.detail;
        for (let index = 0; index < shopping_detail.length; index++) {
          const element = shopping_detail[index];
          let detail = {
            id_product : element.id_product,
            code : element.code,
            name : element.name + "- " +element.presentation,
            igv : element.igv,
            quantity : element.quantity,
            unit_value: element.net_unit_value,
            total_value: element.net_total_value,
            unit_igv: element.unit_igv,
            total_igv: element.total_igv,
            unit_price: element.unit_price,
            total_price: element.total_price,
          }
          me.mLoadAddCreditDebitDetail(detail);

        }
        
      } else {
        
      }
    })

    
}


</script>
