<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Productos">
      <b-row>
        <b-col md="2">
          <b-form-group label="Categoria :">
            <b-form-select v-model="id_category" :options="categories" @change="SearchProducts"></b-form-select>
          </b-form-group>
        </b-col>
        <b-col md="8">
          <b-form-group >
            <b-form-checkbox class="mb-2" switch size="sm" @change="SearchProducts" v-model="type_search" name="check-button" >Buscar por producto/composición:</b-form-checkbox>
            <b-form-input  type="text"  ref="email" autofocus v-model="search_product" @keyup="SearchProducts"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="2">
          <b-form-group label=".">
              <b-form-checkbox @change="SearchProducts" v-model="stock" value="1" unchecked-value="0">
                solo con stock
              </b-form-checkbox>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered table-information-detail">
              <thead>
                <tr>
                  <th width="3%"  rowspan="2" class="text-center align-middle">#</th>
                  <th width="8%"  rowspan="2" class="text-center align-middle">Código</th>
                  <th width="37%"  rowspan="2" class="text-center align-middle">Nombre</th>
                  <th width="13%"  :colspan="warehouses.length" class="text-center align-middle">{{establishment.name }}</th>
                  <th width="13%"  rowspan="2" class="text-center align-middle">U. M.</th>
                  <th width="8%"  rowspan="2" class="text-center align-middle">Cantidad</th>
                  <th width="8%"  rowspan="2" class="text-center align-middle">P. Minimo</th>
                  <th width="10%"  rowspan="2" class="text-center align-middle">P. Unit.</th>
                  <th width="5%"  rowspan="2" class="text-center align-middle">Acc.</th>
                </tr>
                <tr>
                  <th class="text-center" v-for="item in warehouses" :key="item.id_warehouse">{{item.name}}</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in products" :key="it">
                <tr :class="BackgroundColor(item.internal_product,item.commissionable)">
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-left">{{ item.code }}</td>
                  <td class="text-left">
                    {{ item.name + (item.presentation.length == 0 ? "":" - "+item.presentation)   }} <br>
                    <small>{{ item.composition }}</small>


                  </td>
                  <td class="text-center" v-for="stock in item.stock" :key="stock.id_warehouse+stock.quantity">
                  {{ stock.quantity }}
                  </td>
                  <td class="text-center">{{ NameUnitMeasure(item.unit_measure) }}</td>
                  <td class="text-center">
                    <input type="number" step="any" value="1.00" :ref="'mSDCantidad'+item.id_product" class="form-control text-right">
                  </td>
                  <td class="text-right">{{ item.minimal_price }}</td>
                  <td class="text-center">
                    <input type="number" step="any" :value="item.sale_price" :ref="'mSDPUnit'+item.id_product" class="form-control text-right">
                  </td>
                  <td class="text-center">
                      <b-button type="button" @click="AddProduct(item.id_product)" variant="primary">
                        <i class="fas fa-plus-square"></i>
                      </b-button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="w-100">
            <span class="text-success">P. Comisionables</span> | <span class="text-warning">P. Internos</span>
          </div>
        </b-col>
      </b-row>
    </b-modal>
  </div>
</template>
<style scoped>
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
  -webkit-appearance: none; 
  margin: 0; 
}

input[type=number] { -moz-appearance:textfield; }
</style>


<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
// import Notifications from 'vue-notification/dist/ssr.js';
import CodeToName from "@/assets/js/CodeToName";

export default {
  name: "ModalsProduct",
  data() {
    return {
        modalProducts:false,
        module:'Sale',
        role:0,
        id_establishment:0,
        type_search:false,
        search_product:'',
        stock:0,
        categories:[],
        id_category:'',
        products: [],
        establishment:{},
        warehouses:[]
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductsShow', (role,id_establishment) => {
      this.id_establishment = id_establishment;
      this.modalProducts = true;
      this.role = role;
      this.ViewEstablishment();
      this.ListWarehouse();
    });
    EventBus.$on('RefreshModalProducts', () => {
      this.SearchProducts();
    });
    this.ListCategories();
  },
  methods: {
      SearchProducts,
      AddProduct,
      ViewEstablishment,
      ListWarehouse,
      BackgroundColor,
      NameUnitMeasure,
      ListCategories,

        ...mapActions('Sale',['mLoadAddSaleDetail']),
      
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
    // id_establishment: function () {
    //   let establishment = window.localStorage.getItem("id_establishment");
    //   establishment = JSON.parse(je.decrypt(establishment));
    //   return establishment;
    // }
  },
};

function NameUnitMeasure(code) {
  return CodeToName.NameUnitMeasure(code);
}

function BackgroundColor(internal_product,commissionable) {
  if (commissionable == 1) {
    return 'bg-success';
  }
  if (internal_product == 1) {
    return 'bg-warning';
  }
  return '';
}

function ListCategories() {
  let me = this;
  let url = this.url_base + "active-categories";
  axios({
    method: "GET",
    url: url,
    headers: {token: this.token,module: this.module,role: this.role},
  })
    .then(function (response) {
      me.categories = [{value:'',text:'Todos'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
          me.categories.push({value:element.id_category,text:element.name})
        }
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ViewEstablishment() {
  
  let me = this;
  let url = this.url_base + "establishment/view/" + this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.establishment = response.data.result;
      } else {
        // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ListWarehouse() {
  
  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;
  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role: this.role,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.warehouses = response.data.result;
      } else {
        // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire("422", "A Ocurrido un error" + error, "error");
    });
}

function AddProduct(id_product) {
  
    let quantity = this.$refs['mSDCantidad'+id_product][0]['value'];
    let unit_price = this.$refs['mSDPUnit'+id_product][0]['value'];
    let me = this;
    let url = this.url_base + "product/view-cost/" + id_product +"/"+ this.id_establishment;

    axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module,role: this.role,},
    })
    .then(function (response) {
      if (response.data.status == 200) {
        me.search_product = "";
        let total_price = parseFloat(unit_price) * parseFloat(quantity);
        let detail = {
          id_product: response.data.result.id_product,
          code: response.data.result.code,
          name: response.data.result.name,
          presentation: response.data.result.presentation,
          barcode: response.data.result.barcode,
          unit_measure: response.data.result.unit_measure,
          igv: response.data.result.igv,
          existence_type: response.data.result.existence_type,
          quantity: parseFloat(quantity).toFixed(2),
          unit_price: parseFloat(unit_price).toFixed(2),
          total_price: total_price.toFixed(2),
        }
        
        me.mLoadAddSaleDetail(detail);
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado el producto '+detail.name + ' - '+detail.presentation , type: 'success'});
        EventBus.$emit('TotalPaymentCash');
        EventBus.$emit('ChangeFeesCollectedModal');
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}
//Buscar productos
function SearchProducts() {
  
  let me = this;
  let search = this.search_product == "" ? "all" : this.search_product;
  let url = this.url_base + "search-products-stock-v2";
  let data = {
    id_category: this.id_category,
    id_establishment : this.id_establishment,
    type_search: this.type_search ? "composition":"product",
    search : search,
    stock: this.stock
  };
  axios({
    method: "POST",
    data: data,
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.products = response.data.result;
      } else {
        me.products = [];
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      
    });
}

</script>
