<template>
  <div>
      <b-row>
        <b-col class="mt-1 mb-2" md="12">
          <b-input-group>
            <b-input-group-append>
              <b-form-select class="form-control"  @change="SearchProducts" v-model="search.id_warehouse" :options="warehouses" ></b-form-select>
            </b-input-group-append>
            <b-input-group-append>
              <b-form-select class="form-control"  @change="SearchProducts" v-model="search.search_category" :options="categories" ></b-form-select>
            </b-input-group-append>
            <b-form-input type="search"  @keyup="SearchProducts" v-model="search.search_product" placeholder="Buscar un producto"  class="form-control" ></b-form-input>
            <b-input-group-append>
              <b-form-input type="search" v-model="search.search_barcode" placeholder="Codigo de barras"  class="form-control" ></b-form-input>
            </b-input-group-append>
        </b-input-group>
        </b-col>
      </b-row>
      <b-row class="block-product" :style="size_pos">
        <b-col md="4" v-for="(item, it) in products" :key="it">
          <b-link class="text-decoration-none" @click="AddProduct(item.id_product)" >
            <b-card  :img-src="url_base + item.photo" img-alt="Card image" class=" text-dark" img-top>
              <b-row>
                <b-col class="text-center" md="12">
                  <small>{{item.code}} | {{item.name + " - " +item.presentation}}</small> 
                </b-col>
                <b-col class="text-left" md="6">
                  <strong class="text-info"> S/. {{ item.sale_price}}</strong>
                </b-col>
                <b-col class="text-right" md="6">
                <span class="text-primary">{{ item.stock }}</span>
                </b-col>
              </b-row>
            </b-card>
          </b-link>
        </b-col>

      </b-row>

      <b-row class="mt-1 text-dark">
        <b-col md="8">
          <b-pagination v-model="currentPage" v-on:input="SearchProducts" :total-rows="rows" :per-page="perPage" align="center"></b-pagination>
        </b-col>
        <b-col md="4 text-center">
          <p>Pagina Actual: {{ currentPage }}</p>
        </b-col>
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

.text-total{
  font-size: 14px;
  font-weight: 500;
}
/* .size-pos{
  min-height: var(--size-pos);
} */
.block-product {
	width: 100%;
	overflow-y: scroll;
}
</style>
<script>
const axios = require("axios").default;
const Swal = require("sweetalert2");
const je = require("json-encrypt");
import { mapState,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";
export default {
  name: "ModalsProduct",
  components:{
  
  },
  data() {
    return {
     
      module: 'POS',
      role: 2,
      size_pos: 'height: 370px',
      search:{
        search_category:'all',
        search_product:'',
        search_barcode:'',
        stock:0,
        id_warehouse:'',
      },
      categories:[],
      warehouses: [],

      perPage: 9,
      currentPage: 1,
      rows: 0,
      products:[],

    };
  },
  mounted () {
    EventBus.$on('UpdateSizeProduct', () => {
      this.ViewEstablishment();
    });
    this.ListWarehouses();
    this.ListCategories();
    this.ViewEstablishment();
  },
  methods: {
    ListWarehouses,
    ListCategories,
    SearchProducts,
    AddProduct,
    ChangeWarehouse,
    ViewEstablishment,
        ...mapActions('SalePOS',['mLoadAddPOSDetail','mLoadEditWarehouse']),
      
  },
  computed: {
    ...mapState('SalePOS',['pos_detail','total_pos']),
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
      let size = parseFloat(response.data.result.size_pos) + 60;
      me.size_pos = 'height: '+size+'px';
    }
  })
}
function ChangeWarehouse() {
  this.mLoadEditWarehouse(this.search.id_warehouse)
}

function ListWarehouses() {
  let me = this;
  let url = this.url_base + "active-warehouses/"+this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.warehouses.push({value : '', text: '-- Seleccione --'});
      if (response.data.status == 200) {
        let data = response.data.result;
        for (let index = 0; index < data.length; index++) {
          me.warehouses.push( { value : data[index].id_warehouse , text: data[index].name } );
          if (data[index].default == 1) {
            me.search.id_warehouse = data[index].id_warehouse;
            me.mLoadEditWarehouse(me.search.id_warehouse)
            break;
          }
        }
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });
}

function ListCategories() {
  let me = this;
  let url = this.url_base + "active-categories";

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      me.categories = [{value:'all',text:'--- Todos ---'}];
      if (response.data.status == 200) {
        for (let index = 0; index < response.data.result.length; index++) {
          const element = response.data.result[index];
           me.categories.push({value:element.id_category,text:element.name});
        }
       
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
}

function SearchProducts() {
  
  let me = this;
  if (this.search.id_warehouse.length == 0) {
    me.rows = 0;
    me.products = [];
    Swal.fire({ icon: 'error', text: 'Seleccione un almacen', timer: 3000,})
    return false
  }
  let search_product = this.search.search_product == "" ? "all" : this.search.search_product;
  let search_category = this.search.search_category == "" ? "all" : this.search.search_category;
  let url = this.url_base + "search-products-stock-pos/"+this.search.id_warehouse+"/"+ search_category+"/"+ 
  search_product + "/1"+ "?page=" + this.currentPage;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
    },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        me.rows = response.data.result.paginate.total;
        me.products = response.data.result.products;
      } else {
        me.rows = 0;
        me.products = [];
      }
    })
}

function AddProduct(id_product) {

    let me = this;
    let url = this.url_base + "product/view-cost/" + id_product +"/"+ this.id_establishment;

    axios({
      method: "GET",
      url: url,
      headers: { token: this.token, module: this.module,role: this.role,},
    })
    .then(function (response) {
      if (response.data.status == 200) {
      
        let detail = {
          id_product: response.data.result.id_product,
          code: response.data.result.code,
          name: response.data.result.name,
          presentation: response.data.result.presentation,
          unit_measure: response.data.result.unit_measure,
          igv: response.data.result.igv,
          existence_type: response.data.result.existence_type,
          quantity: 1,
          unit_price: response.data.result.sale_price,
          total_price: response.data.result.sale_price,
        }
        
        me.mLoadAddPOSDetail(detail);
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado el producto '+response.data.result.name + ' - '+response.data.result.presentation , type: 'success'});
      
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
  

}

</script>
