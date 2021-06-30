<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Productos">
      <b-row>
        <b-col md="12">
          <b-form-group label="Buscar producto :">
            <b-form-input
              type="text"
              ref="search_product"
              v-model="search_product"
              @keyup="SearchProducts"
            ></b-form-input>
            
          </b-form-group>
        </b-col>
        <b-col md="12">
          <div class="table-responsive mt-3">
            <table class="table table-hover table-bordered">
              <thead>
                <tr>
                  <th width="5%"  class="text-center align-middle">#</th>
                  <th width="8%"  class="text-center align-middle">Código</th>
                  <th width="55%"  class="text-center align-middle">Nombre</th>
                  <th width="10%"  class="text-center align-middle">Categoria</th>
                  <th width="10%"  class="text-center align-middle">Cantidad</th>
                  <th width="10%"  class="text-center align-middle">Acciones</th>

                </tr>
              </thead>
              <tbody v-for="(item, it) in products" :key="item.id_product">
                <tr>
                  <td class="text-center">{{ it + 1 }}</td>
                  <td class="text-left">{{ item.code }}</td>
                  <td class="text-left">{{ item.name }}</td>
                  <td class="text-left">{{ item.category_name }}</td>
                  <td class="text-center">
                    <input type="number" value="1" :ref="'mIDCantidad'+item.id_product" class="form-control">
                  </td>
                  <td class="text-center">
                      <button type="button" @click="AddProduct(item.id_product)" class="btn btn-info">
                        <i class="fas fa-camera"></i>
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
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";


export default {
  name: "ModalsProduct",
  data() {
    return {
        modalProducts:false,
        module:'Shopping',
        role:0,
        search_product:'',
        products: [],
    };
  },
  created (){
    
  },
  mounted () {
    EventBus.$on('ModalProductsShow', (role) => {
      this.modalProducts = true;
      this.role = role;
    });
    
  },
  methods: {
      SearchProducts,
      AddProduct,
      ...mapActions('Shopping',['mLoadAddShoppingDetail']),
      ...mapActions('Shopping',['mLoadTotalsShoppingDetail']),
      
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

function AddProduct(id_product) {
  
  let quantity = this.$refs['mIDCantidad'+id_product][0]['value'];
  let me = this;
  let url = this.url_base + "product/view/"+id_product;

  axios({
    method: "GET",
    url: url,
    headers: {
      token: this.token,
      module: this.module,
      role:this.role,
    },
  })
    .then(function (response) {
      
      if (response.data.status == 200) {
        
        let detail = {
          id_product : response.data.result.id_product,
          code : response.data.result.code,
          name : response.data.result.name,
          unit_measure : response.data.result.unit_measure,
          igv : response.data.result.igv,
          quantity : quantity,
          unit_price : (0).toFixed(2),
          total_price : (0).toFixed(2),
        }

        me.mLoadAddShoppingDetail(detail);
      } else {
        
      }
    })

    
}

//Buscar productos
function SearchProducts() {
  let me = this;
  let search = this.search_product == "" ? "all" : this.search_product;
  let url = this.url_base + "search-products/"+search;

  axios({
    method: "GET",
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
