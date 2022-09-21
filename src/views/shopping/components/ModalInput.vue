<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalInput" class="w-100" title="Entradas">


      <b-row>
        <b-col sm="12" md="6">
          <b-form-group>
            <label>Proveedor: </label>
            <v-select @input="ListInput" placeholder="Todos" class="w-100" :filterable="false" label="name" v-model="provider" @search="SearchProvider" :options="providers"></v-select>
          </b-form-group>
        </b-col>

        <b-col sm="12" md="2">
          <b-form-group label="Desde :">
            <b-form-input @change="ListInput" class="text-center" :max="to" type="date"  ref="to" v-model="from"></b-form-input>
            <small v-if="errors.from" class="form-text text-danger" >Selccione una fecha</small>
          </b-form-group>
        </b-col>

        <b-col sm="12" md="2">
          <b-form-group label="Hasta :">
            <b-form-input @change="ListInput" class="text-center" :min="from" type="date"  ref="from" v-model="to"></b-form-input>
            <small v-if="errors.to" class="form-text text-danger" >Selccione una fecha</small>
          </b-form-group>
        </b-col>
        
        <b-col sm="6" md="2">
          <b-form-group label=".">
            <b-input-group>
            <b-form-input v-model="search" class="form-control"></b-form-input>
            <b-input-group-append>
              <b-button variant="primary" @click="ListInput"><b-icon icon="search"></b-icon></b-button>
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
                    <th width="8%" class="text-center">Fecha</th>
                    <th width="12%" class="text-center">Comprobante</th>
                    <th width="45%" class="text-center">Razón Social</th>
                    <th width="20%" class="text-center">Establecimiento</th>
                    <th width="10%" class="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody v-for="(item, it) in data_table" :key="item.id_input">
                  <tr>
                    <td class="text-center">{{ it + 1 }}</td>
                    <td class="text-center"> {{ item.broadcast_date }}</td>
                    <td class="text-center"> {{ CodeInvoice(item.type_invoice)+ ' '+item.serie+'-'+item.number }}</td>
                    <td class="text-left"> {{ item.provider_name + ' - '+item.provider_document_number }}</td>
                    <td class="text-left"> {{ item.establishment_name + ' | '+item.warehouse_name }}</td>
                    <td class="text-center">
                      <b-button type="button" @click="ViewInput(item.id_input)" variant="info">
                        <i class="fas fa-eye"></i>
                      </b-button>
                      <b-button type="button" @click="AddLinkages(item.id_input)" variant="primary">
                        <i class="fas fa-plus-square"></i>
                      </b-button>
                      
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <b-row class="mt-4">
              <b-col md="8">
                <b-pagination v-model="currentPage"  v-on:input="ListInput"  :total-rows="rows"  :per-page="perPage" align="center" ></b-pagination>
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
        modalInput:false,
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
    EventBus.$on('ModalInputShow', (role) => {
      this.modalInput = true;
      this.role = role;
      this.ListInput();
    });
    
  },
  methods: {
      SearchProvider,
      CodeInvoice,
      ListInput,
      AddLinkages,
      ViewInput,
      
      ...mapActions('Shopping',['mLoadAddLinkages']),
      ...mapActions('Shopping',['mLoadAddShoppingDetail']),
      ...mapActions('Shopping',['mLoadTotalsShoppingDetail']),
      
  },
  computed: {
      ...mapState('Shopping',['linkages']),
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


function ViewInput(id_input) {

  let route = this.$router.resolve({
    name: "InputView",
    params: { id_input: je.encrypt(id_input) },
  });

  window.open(route.href,'_blank');
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

function ListInput() {
  
  this.errors.from = false;
  this.errors.to = false;

  let id_provider = this.provider == null ? 0 : this.provider.id;
  if (this.from.length == 0) {this.errors.from = true; return false;}
  if (this.to.length == 0) {this.errors.to = true; return false;}
  let search = this.search == "" ? "all" : this.search;

  let me = this;
  let url = this.url_base + "input/list-pending-shopping/" + id_provider + "/" + this.from + "/" + this.to + "/"+this.id_establishment + "/" + search + "?page=" + this.currentPage;


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

function AddLinkages(id_input) {
  
  let me = this;
  let url = this.url_base + "input/view/"+id_input;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role:this.role,},
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        let linkages = me.linkages;
        let validation = false;
        for (let index = 0; index < linkages.length; index++) {
          const element = linkages[index];
          if (element.id_linkage == response.data.result.input.id_input && element.reason == 'Entrada') {
            validation = true;
          }
        }
        if (!validation) {
          let linkage = {
            reason: 'Entrada',
            id_linkage : response.data.result.input.id_input,
            type_invoice : response.data.result.input.type_invoice,
            serie : response.data.result.input.serie,
            number : response.data.result.input.number,
          }
          
          me.mLoadAddLinkages(linkage);

          let input = {
            provider: {id: response.data.result.input.id_provider, name: response.data.result.input.provider_name + " - "+ response.data.result.input.provider_document_number},
            id_warehouse: response.data.result.input.id_warehouse
          }
          EventBus.$emit('CompletePurchase',input);
          
          let input_detail = response.data.result.input_detail;
          for (let index = 0; index < input_detail.length; index++) {
            const element = input_detail[index];
            let detail = {
              id_input_detail : element.id_input_detail,
              id_product : element.id_product,
              code : element.code,
              name : element.name,
              presentation : element.presentation,
              unit_measure : element.unit_measure,
              igv : element.igv,
              quantity : parseFloat(element.balance).toFixed(2),
              percentage_discount: (0).toFixed(2),
              package: parseFloat(element.package).toFixed(0),

              unit_value: (0).toFixed(2),
              unit_discount: (0).toFixed(2),
              net_unit_value: (0).toFixed(2),
              unit_igv: (0).toFixed(2),
              unit_price: (0).toFixed(2),

              total_value: (0).toFixed(2),
              total_discount: (0).toFixed(2),
              net_total_value: (0).toFixed(2),
              total_igv: (0).toFixed(2),
              total_price: (0).toFixed(2),
            }
            me.mLoadAddShoppingDetail(detail);

          }
        }
        
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado la entrada', type: 'success'});

      } else {
        
      }
    })

    
}


</script>
