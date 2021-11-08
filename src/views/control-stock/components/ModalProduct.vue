<template>
  <div>
    <b-modal size="xl" hide-footer v-model="modalProducts" class="w-100" title="Productos">
      <b-row>
        <b-col md="9">
          <b-form-group label="Buscar producto :">
            <b-form-input type="text" ref="search_product"  v-model="search_product" @keyup="SearchProducts"></b-form-input>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Codigo de Barras :">
            <b-form-input type="text" ref="barcode" autofocus  v-model="barcode" @keyup="GetProductByBarcode"></b-form-input>
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
                  <td class="text-left">{{ item.name +" - "+item.presentation }}</td>
                  <td class="text-left">{{ item.category_name }}</td>
                  <td class="text-center">
                    <input type="number" step="any" value="1.00" :ref="'mIDCantidad'+item.id_product" class="form-control">
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
import { mapState,mapMutations,mapActions } from "vuex";
import EventBus from "@/assets/js/EventBus";


export default {
  name: "ModalsProduct",
  data() {
    return {
        modalProducts:false,
        module:'ControlStock',
        role:0,
        search_product:'',
        barcode:'',
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
      GetProductByBarcode,
      
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
  let data = {
    id_product: id_product,
    quantity: parseFloat(quantity),
  }
  EventBus.$emit('ControlStockAddProduct',data);
  this.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado el stock del producto', type: 'success'});
  
}


function GetProductByBarcode() {
  if (this.barcode.length == 0) {
    return false;
  }
  let me  = this;
  let url = this.url_base + "get-product-by-barcode/"+this.barcode;
this.barcode = '';
  axios({
    method: "GET",
    url: url,
    headers: { token: this.token, module: this.module, role:this.role, },
  })
    .then(function (response) {
      if (response.data.status == 200) {
        let data = {
          id_product: response.data.result.id_product,
          quantity: parseFloat(1),
        }
        EventBus.$emit('ControlStockAddProduct',data);
        me.barcode = '';
        me.$notify({ group: 'alert', title: 'Sistema', text:'Se ha agregado el stock del producto', type: 'success'});
      }
    })
}

//Buscar productos
function SearchProducts() {
  let me = this;
  let search = this.search_product == "" ? "all" : this.search_product;
  let url = this.url_base + "search-products";
  let data = {
    search : search
  };
  axios({
    method: "POST",
    url: url,
    data:data,
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
