<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Productos">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar producto :">
            <b-form-input autofocus type="search" ref="search_product" v-model="search_product" @keyup="SearchProducts"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%"  rowspan="2" class="text-center align-middle">#</th>
                  <th width="8%"  rowspan="2" class="text-center align-middle">Código</th>
                  <th width="55%"  rowspan="2" class="text-center align-middle">Nombre</th>
                  <th width="10%"  :colspan="warehouses.length" class="text-center align-middle">{{establishment.name }}</th>
                  <th width="10%"  rowspan="2" class="text-center align-middle">Cantidad</th>
                  <th width="10%"  rowspan="2" class="text-center align-middle">Acciones</th>
                </tr>
                <tr>
                  <th class="text-center" v-for="item in warehouses" :key="item.id_warehouse">{{item.name}}</th>
                </tr>
              </thead>
              <tbody v-for="(item, it) in products" :key="item.id_product">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-left">{{ item.code }}</td>
                  <td class="text-left">{{ item.name +  " - " + item.presentation }}</td>
                  <td class="text-center" v-for="stock in item.stock" :key="stock.id_warehouse+stock.quantity">
                  {{ stock.quantity }}
                  </td>
                  <td class="text-center">
                    <input type="number" value="1" :ref="'mODCantidad'+item.id_product" class="form-control">
                  </td>
                  <td class="text-center">
                      <button type="button" @click="AddProduct(item.id_product)" class="btn btn-info">
                        <i class="fas fa-plus-square"></i>
                      </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
// import Notifications from 'vue-notification/dist/ssr.js';


export default {
  name: "ModalsProduct",
  data() {
    return {
        modalProducts:false,
        module:'Output',
        role:0,
        search_product:'',
        products: [],
        establishment:{},
        id_establishment:'',
        warehouses:[]
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductsShow', (role,id_establishment) => {
      this.modalProducts = true;
      this.role = role;
      this.id_establishment = id_establishment;
      this.ViewEstablishment();
      this.ListWarehouse();
    });
    
  },
  methods: {
      SearchProducts,
      AddProduct,
      ViewEstablishment,
      ListWarehouse,

        ...mapActions('Requirement',['mLoadAddRequirementDetail']),
      
  },
  computed: {
    ...mapState(["url_base"]),
    token: function () {
      let user = window.localStorage.getItem("user");
      user = JSON.parse(JSON.parse(je.decrypt(user)));
      return user.api_token;
    },
  },
};

function ViewEstablishment() {
  
  let me = this;
  let url = this.url_base + "establishment/view/" + this.id_establishment;

  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role: this.role,},
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
    headers: { token: this.token, module: this.module, role: this.role,},
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
  
    let quantity = this.$refs['mODCantidad'+id_product][0]['value'];
    let me = this;
    let url = this.url_base + "product/view/" + id_product;

    axios({
      method: "GET",
      url: url,
      headers: {token: this.token, module: this.module,role: this.role, },
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
          quantity: quantity,
        }
        
        me.mLoadAddRequirementDetail(detail);

        
      } else {
        Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
      }
    })
    .catch((error) => {
      console.log(error);
      // Swal.fire({ icon: 'error', text: 'A ocurrido un error', timer: 3000,})
    });

   
}
//Buscar productos
function SearchProducts() {
  let me = this;
  let search = this.search_product == "" ? "all" : this.search_product;
 let url = this.url_base + "search-products-stock";
  let data = {
    id_establishment : this.id_establishment,
    search : search,
    stock: "all"
  };
  axios({
    method: "POST",
    url: url,
    data: data,
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
